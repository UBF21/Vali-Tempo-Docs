---
id: overview
title: Vali-Holiday Overview
sidebar_label: Overview
---

# Vali-Holiday

`IValiHoliday` provides country-specific holiday data for 35+ countries, including Easter-based movable holidays. It uses a provider pattern — you register `IHolidayProvider` implementations for the countries you need, then query holiday information by country code.

## Installation

```bash
dotnet add package Vali-Holiday
```

## Registration

```csharp
builder.Services.AddValiHoliday();
// or via the meta-package:
builder.Services.AddValiTempo();
```

## HolidayInfo Class

`HolidayInfo` describes a single holiday:

| Property | Type | Description |
|---|---|---|
| `Name` | `string` | Official holiday name |
| `LocalName` | `string` | Name in the country's primary language |
| `Date` | `DateTime` | Calendar date of the holiday |
| `Country` | `string` | ISO 3166-1 alpha-2 country code |
| `Type` | `HolidayType` | Classification of the holiday |
| `IsObserved` | `bool` | True if this is an observed substitute date |
| `IsFixed` | `bool` | True if the date is the same every year |

## HolidayType Enum

| Value | Description |
|---|---|
| `Public` | National public holiday |
| `Bank` | Bank holiday (financial institutions closed) |
| `School` | School holiday |
| `Optional` | Optional/regional holiday |
| `Observance` | Observance (not necessarily a day off) |

## IValiHoliday API

### Register

Register an `IHolidayProvider` for one or more countries:

```csharp
// Register all 35+ countries at once
foreach (var provider in HolidayProviderFactory.CreateAll())
    holiday.Register(provider);

// Register only Latin American countries
foreach (var provider in HolidayProviderFactory.CreateLatinAmerica())
    holiday.Register(provider);

// Register a single country
holiday.Register(new PeruHolidayProvider());
```

**Signature:** `void Register(IHolidayProvider provider)`

### For

Get all holidays for a country in a given year:

```csharp
IEnumerable<HolidayInfo> holidays = holiday.For("PE", 2025);
foreach (var h in holidays.OrderBy(h => h.Date))
    Console.WriteLine($"{h.Date:MMM dd} — {h.Name}");
```

**Signature:** `IEnumerable<HolidayInfo> For(string country, int year)`

### Supports

Return `true` if a holiday provider is registered for the given country code:

```csharp
bool supported = holiday.Supports("PE"); // → true if Peru provider registered
```

**Signature:** `bool Supports(string country)`

### SupportedCountries

Return all country codes that have registered providers:

```csharp
IEnumerable<string> countries = holiday.SupportedCountries();
// → ["PE", "US", "ES", "MX", ...]
```

**Signature:** `IEnumerable<string> SupportedCountries()`

### IsHoliday

Return `true` if a given date is a public holiday in the specified country:

```csharp
bool isHoliday = holiday.IsHoliday("PE", new DateTime(2025, 7, 28));
// → true (Peruvian Independence Day)

bool isHoliday2 = holiday.IsHoliday("US", new DateTime(2025, 12, 25));
// → true (Christmas)
```

**Signature:** `bool IsHoliday(string country, DateTime date)`

### GetHolidays

Get all holidays for a specific year and country (alias for `For`):

```csharp
IEnumerable<HolidayInfo> list = holiday.GetHolidays("MX", 2025);
```

**Signature:** `IEnumerable<HolidayInfo> GetHolidays(string country, int year)`

### GetNextHolidayWithYear

Return the next upcoming holiday for a country on or after a given date:

```csharp
HolidayInfo? next = holiday.GetNextHolidayWithYear("PE", DateTime.Today);
if (next is not null)
    Console.WriteLine($"Next holiday: {next.Name} on {next.Date:MMM dd}");
```

**Signature:** `HolidayInfo? GetNextHolidayWithYear(string country, DateTime from)`

> **Deprecated overload:** `GetNextHoliday()` is marked `[Obsolete]`. Use `GetNextHolidayWithYear()` instead. The deprecated overload returns only `HolidayInfo` without the resolved year, making movable holidays ambiguous.

### GetPreviousHolidayWithYear

Return the most recent holiday for a country before a given date:

```csharp
HolidayInfo? prev = holiday.GetPreviousHolidayWithYear("US", DateTime.Today);
```

**Signature:** `HolidayInfo? GetPreviousHolidayWithYear(string country, DateTime before)`

> **Deprecated overload:** `GetPreviousHoliday()` is marked `[Obsolete]`. Use `GetPreviousHolidayWithYear()` instead. The deprecated overload returns only `HolidayInfo` without the resolved year, making movable holidays ambiguous.

### IsLongWeekend

Return `true` if the date is part of a long weekend (a holiday adjacent to a weekend):

```csharp
// E.g., if a Monday holiday creates a 3-day weekend
bool longWknd = holiday.IsLongWeekend("US", new DateTime(2025, 5, 26)); // Memorial Day
// → true (Monday + weekend = long weekend)
```

**Signature:** `bool IsLongWeekend(string country, DateTime date)`

### HolidaysThisMonth

Return all holidays in a given month for a country:

```csharp
IEnumerable<HolidayInfo> thisMonth = holiday.HolidaysThisMonth(2025, 7, "PE");
```

**Signature:** `IEnumerable<HolidayInfo> HolidaysThisMonth(int year, int month, string countryCode)`

> **Note:** `month` must be in the range [1, 12]; passing a value outside this range throws `ArgumentOutOfRangeException`.

## Country-Specific Notes

### Argentina

Easter Sunday (`ar_easter`) is typed as `HolidayType.Observance` in the Argentina provider. Observance-type holidays are excluded from `IsHoliday()` national checks, so Easter Sunday will not return `true` for Argentina when calling `IsHoliday("AR", easterDate)`.

### Chile

Indigenous Peoples Day is a movable holiday based on the astronomical solstice cycle. It falls on **June 20** in leap years near the solstice cycle, and **June 21** otherwise.

### Honduras

The Honduras provider includes **Sep 17 (Día del Maestro)** as a fixed civic holiday and **Easter Sunday** as a movable holiday.

## Complete Example

```csharp
public class HolidayCalendarService(IValiHoliday holiday)
{
    public void Initialize()
    {
        // Register all Latin American providers
        foreach (var provider in HolidayProviderFactory.CreateLatinAmerica())
            holiday.Register(provider);

        // Add US and Canada
        foreach (var provider in HolidayProviderFactory.CreateEurope())
            holiday.Register(provider);
    }

    public void PrintYearHolidays(string country, int year)
    {
        if (!holiday.Supports(country))
        {
            Console.WriteLine($"No provider registered for '{country}'");
            return;
        }

        var holidays = holiday.GetHolidays(country, year)
            .OrderBy(h => h.Date);

        Console.WriteLine($"Public holidays in {country} for {year}:");
        foreach (var h in holidays)
            Console.WriteLine($"  {h.Date:ddd, MMM dd} — {h.Name} ({h.Type})");
    }

    public bool IsGoodDayForPayment(string country, DateTime date)
    {
        return !holiday.IsHoliday(country, date)
            && date.DayOfWeek != DayOfWeek.Saturday
            && date.DayOfWeek != DayOfWeek.Sunday;
    }
}
```
