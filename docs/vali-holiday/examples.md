---
id: examples
title: Vali-Holiday — Examples
sidebar_label: Examples
---

# Examples

## IsHoliday

Verify whether a specific date is a public holiday in Peru.

```csharp
using Vali_Holiday.Core;
using Vali_Holiday.Providers;

var holiday = new ValiHoliday();
holiday.Register(new PeruHolidayProvider());

var date = new DateTime(2025, 7, 28);
bool isHoliday = holiday.IsHoliday("PE", date);

Console.WriteLine($"{date:yyyy-MM-dd} is a holiday in Peru: {isHoliday}");
// → 2025-07-28 is a holiday in Peru: True  (Peruvian Independence Day)
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Holiday** NuGet package in the fiddle settings.
:::

---

## GetHolidays

List all public holidays for a country in a given year.

```csharp
using Vali_Holiday.Core;
using Vali_Holiday.Providers;

var holiday = new ValiHoliday();
holiday.Register(new MexicoHolidayProvider());

var holidays = holiday.GetHolidays("MX", 2025)
    .OrderBy(h => h.Date);

Console.WriteLine("Public holidays in Mexico — 2025:");
foreach (var h in holidays)
    Console.WriteLine($"  {h.Date:ddd, MMM dd} — {h.Name} ({h.Type})");
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Holiday** NuGet package in the fiddle settings.
:::

---

## IsLongWeekend

Check whether a date is part of a long weekend (a holiday adjacent to a weekend).

```csharp
using Vali_Holiday.Core;
using Vali_Holiday.Providers;

var holiday = new ValiHoliday();
holiday.Register(new UsaHolidayProvider());

// Memorial Day 2025 falls on Monday, May 26
var date = new DateTime(2025, 5, 26);
bool isLong = holiday.IsLongWeekend("US", date);

Console.WriteLine($"{date:yyyy-MM-dd} is a long weekend in the US: {isLong}");
// → 2025-05-26 is a long weekend in the US: True
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Holiday** NuGet package in the fiddle settings.
:::

---

## HolidayProviderFactory.CreateLatinAmerica()

Register holiday providers for all Latin American countries at once using the factory.

```csharp
using Vali_Holiday.Core;
using Vali_Holiday.Providers;

var holiday = new ValiHoliday();

// Register all Latin American countries in one call
foreach (var provider in HolidayProviderFactory.CreateLatinAmerica())
    holiday.Register(provider);

var countries = holiday.SupportedCountries().OrderBy(c => c);
Console.WriteLine($"Registered {countries.Count()} Latin American countries:");
foreach (var code in countries)
    Console.WriteLine($"  {code}");

// Query a holiday across multiple countries on the same date (Christmas)
var christmas = new DateTime(2025, 12, 25);
foreach (var code in new[] { "PE", "MX", "AR", "CO", "CL" })
{
    bool isHoliday = holiday.IsHoliday(code, christmas);
    Console.WriteLine($"  {code}: Christmas is a holiday = {isHoliday}");
}
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Holiday** NuGet package in the fiddle settings.
:::
