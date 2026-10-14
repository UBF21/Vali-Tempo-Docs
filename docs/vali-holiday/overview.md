---
id: overview
title: Vali-Holiday Overview
sidebar_label: Overview
description: Vali-Holiday provides public holiday detection for 38 countries in .NET — check if a date is a holiday (single or multi-country), list holidays by country and year, and resolve official observed/substitute dates.
keywords: [Vali-Holiday, public holidays, .NET, NuGet, C#, country holidays, 38 countries]
---

# Vali-Holiday

`IValiHoliday` provides country-specific holiday data for 38 countries, including Easter-based movable holidays. It uses a provider pattern — you register `IHolidayProvider` implementations for the countries you need, then query holiday information by ISO 3166-1 alpha-2 country code.

## Installation

```bash
dotnet add package Vali-Holiday
```

Compiled targets: `net8.0` · `net9.0` · `net10.0`. Compatible with .NET 6 and .NET 7 via NuGet backward compatibility.

## Registration

```csharp
builder.Services.AddValiHoliday();
// or via the meta-package:
builder.Services.AddValiTempo();
```

## HolidayInfo Record

`HolidayInfo` is a `sealed record` describing a single holiday entry:

| Property | Type | Description |
|---|---|---|
| `Id` | `string` | Unique identifier for the entry (e.g. `"pe_new_year"`) |
| `Month` | `int` | Month component (1–12) |
| `Day` | `int` | Day-of-month component (1–31) |
| `CountryCode` | `string` | ISO 3166-1 alpha-2 country code |
| `RegionCode` | `string?` | ISO 3166-2 region/state code, or `null` when the holiday is national |
| `Name` | `string` | Holiday name in the country's primary language |
| `Names` | `IReadOnlyDictionary<string, string>` | Multilingual name map, keyed by BCP 47 tag (`es`, `en`, `pt`, `fr`, `de`) |
| `Type` | `HolidayType` | Classification of the holiday |
| `IsMovable` | `bool` | `true` when the date is not fixed (e.g. Easter-based) |
| `Description` | `string?` | Optional cultural/historical context |
| `ObservedRule` | `ObservedRule` | Weekend-shift rule that applies to this holiday, if any |

Because it's a record, two `HolidayInfo` instances with equal property values are equal — except `Names`, which is still compared by reference (records don't deep-compare collections).

Useful methods:

```csharp
DateTime date = holidayInfo.ToDateTime(2025);
// throws ArgumentOutOfRangeException if this holiday is Feb 29 and 2025 is not a leap year

bool ok = holidayInfo.TryToDateTime(2025, out DateTime result);
// safe variant: returns false instead of throwing for Feb 29 in a non-leap year
```

## HolidayType Enum

| Value | Description |
|---|---|
| `National` | National public holiday — everyone has the day off |
| `Religious` | Religious observance recognized as a public holiday |
| `Civic` | Civic or patriotic commemoration |
| `Regional` | Only applicable to certain regions or states |
| `Observance` | Observed culturally but not a mandatory day off |
| `Optional` | Optional bank holiday |

## ObservedRule Enum

Identifies the official weekend-shift ("observed"/"substitute" day) rule declared on a `HolidayInfo` entry, if any. Resolved via `IHolidayProvider.GetObservedDate` / `IValiHoliday.GetObservedHoliday`.

| Value | Description |
|---|---|
| `None` | No official observed-day shift applies |
| `SaturdayToFriday_SundayToMonday` | US federal rule: Saturday → previous Friday, Sunday → following Monday |
| `NextAvailableWeekday` | UK "in lieu" rule: weekend → next available weekday not already a substitute day (handles Christmas/Boxing Day collisions) |

As of 1.1.0, only the USA and United Kingdom providers declare an `ObservedRule`. No other provider declares a rule in this release.

## IValiHoliday API

### Register

Register an `IHolidayProvider`, replacing any existing registration for the same country code. Returns `this` for fluent chaining.

```csharp
// Register all 38 built-in countries at once
foreach (var provider in HolidayProviderFactory.GetAllProviders())
    holiday.Register(provider);

// Register only Latin American countries
foreach (var provider in HolidayProviderFactory.GetLatinAmericaProviders())
    holiday.Register(provider);

// Register a single country
holiday.Register(new PeruHolidayProvider());
```

**Signature:** `IValiHoliday Register(IHolidayProvider provider)`

### For / Supports / SupportedCountries

```csharp
IHolidayProvider provider = holiday.For("PE");       // throws InvalidOperationException if not registered
bool supported = holiday.Supports("PE");             // → true if a Peru provider is registered
IEnumerable<string> countries = holiday.SupportedCountries;
```

**Signatures:** `IHolidayProvider For(string countryCode)` · `bool Supports(string countryCode)` · `IEnumerable<string> SupportedCountries { get; }`

### IsHoliday

Returns `true` if a date is a public holiday. Note the parameter order: **date first, then country code(s)**.

```csharp
bool isHoliday = holiday.IsHoliday(new DateTime(2025, 7, 28), "PE");
// → true (Peruvian Independence Day)

// ANY semantics — true if the date is a holiday in at least one of the given countries
bool anyHoliday = holiday.IsHoliday(new DateTime(2025, 12, 25), "US", "PE", "ES");
```

**Signatures:** `bool IsHoliday(DateTime date, string countryCode)` · `bool IsHoliday(DateTime date, params string[] countryCodes)`

### IsHolidayInAll

ALL semantics — `true` only if the date is a holiday in **every** specified country (vacuous truth if the array is empty).

```csharp
bool allHoliday = holiday.IsHolidayInAll(new DateTime(2025, 12, 25), "US", "PE", "ES");
```

**Signature:** `bool IsHolidayInAll(DateTime date, params string[] countryCodes)`

> Both multi-country overloads throw `ArgumentNullException` (not `NullReferenceException`) when `countryCodes` is `null`.

### GetHolidays

```csharp
IEnumerable<HolidayInfo> holidays = holiday.GetHolidays(2025, "MX");

// Across multiple countries (not sorted across countries)
IEnumerable<HolidayInfo> multi = holiday.GetHolidays(2025, "MX", "PE", "AR");
```

**Signatures:** `IEnumerable<HolidayInfo> GetHolidays(int year, string countryCode)` · `IEnumerable<HolidayInfo> GetHolidays(int year, params string[] countryCodes)`

### GetNextHolidayWithYear / GetPreviousHolidayWithYear

Return the holiday together with the resolved calendar year, as a tuple — required for movable (Easter-based) holidays, since the same `HolidayInfo` can fall on different dates in different years.

```csharp
(HolidayInfo Holiday, int Year)? next = holiday.GetNextHolidayWithYear(DateTime.Today, "PE");
if (next is not null)
    Console.WriteLine($"Next holiday: {next.Value.Holiday.Name} in {next.Value.Year}");

(HolidayInfo Holiday, int Year)? prev = holiday.GetPreviousHolidayWithYear(DateTime.Today, "US");
```

**Signatures:** `(HolidayInfo Holiday, int Year)? GetNextHolidayWithYear(DateTime date, string countryCode)` · `(HolidayInfo Holiday, int Year)? GetPreviousHolidayWithYear(DateTime date, string countryCode)`

> **Deprecated overloads:** `GetNextHoliday(DateTime, string)` and `GetPreviousHoliday(DateTime, string)` are marked `[Obsolete]` — they return only `HolidayInfo` without the resolved year, which is ambiguous for movable holidays. Use the `WithYear` variants.

### IsLongWeekend

```csharp
// Memorial Day 2025 falls on Monday, May 26
bool longWknd = holiday.IsLongWeekend(new DateTime(2025, 5, 26), "US");
// → true (Monday + weekend = long weekend)
```

**Signature:** `bool IsLongWeekend(DateTime date, string countryCode)`

### HolidaysThisMonth

```csharp
IEnumerable<HolidayInfo> thisMonth = holiday.HolidaysThisMonth(2025, 7, "PE");
```

**Signature:** `IEnumerable<HolidayInfo> HolidaysThisMonth(int year, int month, string countryCode)`

> **Note:** `month` must be in the range [1, 12]; passing a value outside this range throws `ArgumentOutOfRangeException`.

### GetObservedHoliday

Returns the `HolidayInfo` whose official observed/substitute date equals the given date, or `null` if no such holiday exists (either nothing falls there, or the country/holiday declares no weekend-shift rule).

```csharp
// July 4, 2026 falls on a Saturday in the US — observed the preceding Friday
HolidayInfo? observed = holiday.GetObservedHoliday(new DateTime(2026, 7, 3), "US");
```

**Signature:** `HolidayInfo? GetObservedHoliday(DateTime date, string countryCode)`

## Country-Specific Notes

### Argentina

Easter Sunday (`ar_easter`) is typed as `HolidayType.Observance` in the Argentina provider. Observance-type holidays are excluded from the national `IsHoliday()` fast-path check, so Easter Sunday will not return `true` for Argentina when calling `IsHoliday(easterDate, "AR")`.

### Chile

Indigenous Peoples Day is a movable holiday based on the astronomical solstice cycle. It falls on **June 20** in leap years near the solstice cycle, and **June 21** otherwise.

### Honduras

The Honduras provider includes **Sep 17 (Día del Maestro)** as a fixed civic holiday and **Easter Sunday** as a movable holiday.

### USA / United Kingdom

These are currently the only providers that declare an `ObservedRule` on their holidays, enabling `GetObservedHoliday()` lookups.

## Complete Example

```csharp
public class HolidayCalendarService(IValiHoliday holiday)
{
    public void Initialize()
    {
        // Register all Latin American providers
        foreach (var provider in HolidayProviderFactory.GetLatinAmericaProviders())
            holiday.Register(provider);

        // Add Europe
        foreach (var provider in HolidayProviderFactory.GetEuropeProviders())
            holiday.Register(provider);
    }

    public void PrintYearHolidays(string countryCode, int year)
    {
        if (!holiday.Supports(countryCode))
        {
            Console.WriteLine($"No provider registered for '{countryCode}'");
            return;
        }

        var holidays = holiday.GetHolidays(year, countryCode);

        Console.WriteLine($"Public holidays in {countryCode} for {year}:");
        foreach (var h in holidays)
            Console.WriteLine($"  {h.Month:D2}/{h.Day:D2} — {h.Name} ({h.Type})");
    }

    public bool IsGoodDayForPayment(DateTime date, string countryCode)
    {
        return !holiday.IsHoliday(date, countryCode)
            && date.DayOfWeek != DayOfWeek.Saturday
            && date.DayOfWeek != DayOfWeek.Sunday;
    }
}
```
