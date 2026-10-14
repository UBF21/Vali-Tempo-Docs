---
id: examples
title: Vali-Holiday — Examples
sidebar_label: Examples
---

# Examples

## IsHoliday

Verify whether a specific date is a public holiday in Peru. Note the signature is `IsHoliday(date, countryCode)` — date first.

```csharp
using Vali_Holiday.Core;
using Vali_Holiday.Providers.LatinAmerica;

var holiday = new ValiHoliday();
holiday.Register(new PeruHolidayProvider());

var date = new DateTime(2025, 7, 28);
bool isHoliday = holiday.IsHoliday(date, "PE");

Console.WriteLine($"{date:yyyy-MM-dd} is a holiday in Peru: {isHoliday}");
// → 2025-07-28 is a holiday in Peru: True  (Peruvian Independence Day)
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Holiday** NuGet package in the fiddle settings.
:::

---

## IsHoliday / IsHolidayInAll — multi-country (new in 1.1.0)

Check a date against several countries at once with ANY (`IsHoliday`) or ALL (`IsHolidayInAll`) semantics.

```csharp
using Vali_Holiday.Core;

var holiday = HolidayProviderFactory.CreateAll();

var christmas = new DateTime(2025, 12, 25);

// ANY: true if Christmas is a holiday in at least one of these countries
bool anyChristmas = holiday.IsHoliday(christmas, "US", "PE", "ES");
Console.WriteLine($"Christmas is a holiday in at least one country: {anyChristmas}");
// → True

// ALL: true only if Christmas is a holiday in every one of these countries
bool allChristmas = holiday.IsHolidayInAll(christmas, "US", "PE", "ES");
Console.WriteLine($"Christmas is a holiday in all three countries: {allChristmas}");
// → True
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Holiday** NuGet package in the fiddle settings.
:::

---

## GetObservedHoliday — weekend-shift resolution (new in 1.1.0)

Resolve the official "observed"/"substitute" date when a holiday falls on a weekend. Only the USA and United Kingdom providers declare an `ObservedRule` as of 1.1.0.

```csharp
using Vali_Holiday.Core;
using Vali_Holiday.Providers.NorthAmerica;

var holiday = new ValiHoliday();
holiday.Register(new UsaHolidayProvider());

// July 4, 2026 falls on a Saturday — US rule observes it the preceding Friday
var observedDate = new DateTime(2026, 7, 3);
HolidayInfo? observed = holiday.GetObservedHoliday(observedDate, "US");

Console.WriteLine(observed is not null
    ? $"{observedDate:yyyy-MM-dd} is the observed date for: {observed.Name}"
    : $"{observedDate:yyyy-MM-dd} is not an observed holiday date");
// → 2026-07-03 is the observed date for: Independence Day
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Holiday** NuGet package in the fiddle settings.
:::

---

## GetHolidays

List all public holidays for a country in a given year. Note the signature is `GetHolidays(year, countryCode)`.

```csharp
using Vali_Holiday.Core;
using Vali_Holiday.Providers.LatinAmerica;

var holiday = new ValiHoliday();
holiday.Register(new MexicoHolidayProvider());

var holidays = holiday.GetHolidays(2025, "MX");

Console.WriteLine("Public holidays in Mexico — 2025:");
foreach (var h in holidays)
    Console.WriteLine($"  {h.Month:D2}/{h.Day:D2} — {h.Name} ({h.Type})");
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Holiday** NuGet package in the fiddle settings.
:::

---

## IsLongWeekend

Check whether a date is part of a long weekend (a holiday adjacent to a weekend).

```csharp
using Vali_Holiday.Core;
using Vali_Holiday.Providers.NorthAmerica;

var holiday = new ValiHoliday();
holiday.Register(new UsaHolidayProvider());

// Memorial Day 2025 falls on Monday, May 26
var date = new DateTime(2025, 5, 26);
bool isLong = holiday.IsLongWeekend(date, "US");

Console.WriteLine($"{date:yyyy-MM-dd} is a long weekend in the US: {isLong}");
// → 2025-05-26 is a long weekend in the US: True
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Holiday** NuGet package in the fiddle settings.
:::

---

## HolidayProviderFactory.CreateLatinAmerica()

Register holiday providers for all 19 Latin American countries at once using the factory.

```csharp
using Vali_Holiday.Core;

// CreateLatinAmerica() returns a ValiHoliday instance pre-loaded with providers
var holiday = HolidayProviderFactory.CreateLatinAmerica();

var countries = holiday.SupportedCountries.OrderBy(c => c);
Console.WriteLine($"Registered {countries.Count()} Latin American countries:");
foreach (var code in countries)
    Console.WriteLine($"  {code}");

// Query a holiday across multiple countries on the same date (Christmas)
var christmas = new DateTime(2025, 12, 25);
foreach (var code in new[] { "PE", "MX", "AR", "CO", "CL" })
{
    bool isHoliday = holiday.IsHoliday(christmas, code);
    Console.WriteLine($"  {code}: Christmas is a holiday = {isHoliday}");
}
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Holiday** NuGet package in the fiddle settings.
:::
