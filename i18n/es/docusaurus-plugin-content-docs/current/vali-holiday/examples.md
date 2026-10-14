---
id: examples
title: Vali-Holiday — Ejemplos
sidebar_label: Ejemplos
---

# Ejemplos

## IsHoliday

Verifica si una fecha específica es un feriado público en Perú. Atención: la firma es `IsHoliday(date, countryCode)` — primero la fecha.

```csharp
using Vali_Holiday.Core;
using Vali_Holiday.Providers.LatinAmerica;

var holiday = new ValiHoliday();
holiday.Register(new PeruHolidayProvider());

var date = new DateTime(2025, 7, 28);
bool isHoliday = holiday.IsHoliday(date, "PE");

Console.WriteLine($"{date:yyyy-MM-dd} is a holiday in Peru: {isHoliday}");
// → 2025-07-28 is a holiday in Peru: True  (Día de la Independencia del Perú)
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Holiday** en la configuración del fiddle.
:::

---

## IsHoliday / IsHolidayInAll — multi-país (nuevo en 1.1.0)

Verifica una fecha contra varios países a la vez con semántica ANY (`IsHoliday`) o ALL (`IsHolidayInAll`).

```csharp
using Vali_Holiday.Core;

var holiday = HolidayProviderFactory.CreateAll();

var christmas = new DateTime(2025, 12, 25);

// ANY: true si la Navidad es feriado en al menos uno de estos países
bool anyChristmas = holiday.IsHoliday(christmas, "US", "PE", "ES");
Console.WriteLine($"Christmas is a holiday in at least one country: {anyChristmas}");
// → True

// ALL: true solo si la Navidad es feriado en los tres países
bool allChristmas = holiday.IsHolidayInAll(christmas, "US", "PE", "ES");
Console.WriteLine($"Christmas is a holiday in all three countries: {allChristmas}");
// → True
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Holiday** en la configuración del fiddle.
:::

---

## GetObservedHoliday — resolución de corrimiento de fin de semana (nuevo en 1.1.0)

Resuelve la fecha oficial "observada"/"sustituta" cuando un feriado cae en fin de semana. Solo los proveedores de EE. UU. y Reino Unido declaran un `ObservedRule` en la 1.1.0.

```csharp
using Vali_Holiday.Core;
using Vali_Holiday.Providers.NorthAmerica;

var holiday = new ValiHoliday();
holiday.Register(new UsaHolidayProvider());

// El 4 de julio de 2026 cae sábado — la regla de EE. UU. lo observa el viernes anterior
var observedDate = new DateTime(2026, 7, 3);
HolidayInfo? observed = holiday.GetObservedHoliday(observedDate, "US");

Console.WriteLine(observed is not null
    ? $"{observedDate:yyyy-MM-dd} is the observed date for: {observed.Name}"
    : $"{observedDate:yyyy-MM-dd} is not an observed holiday date");
// → 2026-07-03 is the observed date for: Independence Day
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Holiday** en la configuración del fiddle.
:::

---

## GetHolidays

Lista todos los feriados públicos de un país en un año dado. Atención: la firma es `GetHolidays(year, countryCode)`.

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

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Holiday** en la configuración del fiddle.
:::

---

## IsLongWeekend

Verifica si una fecha forma parte de un fin de semana largo (un feriado adyacente a un fin de semana).

```csharp
using Vali_Holiday.Core;
using Vali_Holiday.Providers.NorthAmerica;

var holiday = new ValiHoliday();
holiday.Register(new UsaHolidayProvider());

// El Memorial Day 2025 cae el lunes 26 de mayo
var date = new DateTime(2025, 5, 26);
bool isLong = holiday.IsLongWeekend(date, "US");

Console.WriteLine($"{date:yyyy-MM-dd} is a long weekend in the US: {isLong}");
// → 2025-05-26 is a long weekend in the US: True
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Holiday** en la configuración del fiddle.
:::

---

## HolidayProviderFactory.CreateLatinAmerica()

Registra proveedores de feriados para los 19 países latinoamericanos de una vez usando la fábrica.

```csharp
using Vali_Holiday.Core;

// CreateLatinAmerica() devuelve una instancia de ValiHoliday ya cargada con proveedores
var holiday = HolidayProviderFactory.CreateLatinAmerica();

var countries = holiday.SupportedCountries.OrderBy(c => c);
Console.WriteLine($"Registered {countries.Count()} Latin American countries:");
foreach (var code in countries)
    Console.WriteLine($"  {code}");

// Consultar un feriado en múltiples países en la misma fecha (Navidad)
var christmas = new DateTime(2025, 12, 25);
foreach (var code in new[] { "PE", "MX", "AR", "CO", "CL" })
{
    bool isHoliday = holiday.IsHoliday(christmas, code);
    Console.WriteLine($"  {code}: Christmas is a holiday = {isHoliday}");
}
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Holiday** en la configuración del fiddle.
:::
