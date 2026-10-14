---
id: overview
title: Descripción general de Vali-Holiday
sidebar_label: Descripción general
description: Vali-Holiday proporciona detección de feriados públicos para 38 países en .NET — verifica si una fecha es feriado (en uno o varios países), lista feriados por país y año, y resuelve fechas oficiales observadas/sustitutas.
keywords: [Vali-Holiday, feriados públicos, .NET, NuGet, C#, feriados por país, 38 países]
---

# Vali-Holiday

`IValiHoliday` proporciona datos de feriados específicos por país para 38 países, incluyendo feriados móviles basados en la Pascua. Usa un patrón de proveedor — registras implementaciones de `IHolidayProvider` para los países que necesitas y luego consultas información de feriados por código de país ISO 3166-1 alpha-2.

## Instalación

```bash
dotnet add package Vali-Holiday
```

Targets compilados: `net8.0` · `net9.0` · `net10.0`. Compatible con .NET 6 y .NET 7 vía compatibilidad retroactiva de NuGet.

## Registro

```csharp
builder.Services.AddValiHoliday();
// o mediante el meta-paquete:
builder.Services.AddValiTempo();
```

## Record HolidayInfo

`HolidayInfo` es un `sealed record` que describe un feriado individual:

| Propiedad | Tipo | Descripción |
|---|---|---|
| `Id` | `string` | Identificador único de la entrada (ej. `"pe_new_year"`) |
| `Month` | `int` | Componente de mes (1–12) |
| `Day` | `int` | Componente de día del mes (1–31) |
| `CountryCode` | `string` | Código de país ISO 3166-1 alpha-2 |
| `RegionCode` | `string?` | Código de región/estado ISO 3166-2, o `null` si el feriado es nacional |
| `Name` | `string` | Nombre del feriado en el idioma principal del país |
| `Names` | `IReadOnlyDictionary<string, string>` | Mapa de nombres multilingüe, con clave BCP 47 (`es`, `en`, `pt`, `fr`, `de`) |
| `Type` | `HolidayType` | Clasificación del feriado |
| `IsMovable` | `bool` | `true` cuando la fecha no es fija (ej. basada en la Pascua) |
| `Description` | `string?` | Contexto cultural/histórico opcional |
| `ObservedRule` | `ObservedRule` | Regla de corrimiento de fin de semana que aplica a este feriado, si existe |

Al ser un record, dos instancias de `HolidayInfo` con los mismos valores de propiedad son iguales — excepto `Names`, que se sigue comparando por referencia (los records no comparan colecciones en profundidad).

Métodos útiles:

```csharp
DateTime date = holidayInfo.ToDateTime(2025);
// lanza ArgumentOutOfRangeException si este feriado es 29 de feb y 2025 no es bisiesto

bool ok = holidayInfo.TryToDateTime(2025, out DateTime result);
// variante segura: devuelve false en vez de lanzar para el 29 de feb en un año no bisiesto
```

## Enumeración HolidayType

| Valor | Descripción |
|---|---|
| `National` | Feriado público nacional — todos tienen el día libre |
| `Religious` | Observancia religiosa reconocida como feriado público |
| `Civic` | Conmemoración cívica o patriótica |
| `Regional` | Solo aplicable a ciertas regiones o estados |
| `Observance` | Observado culturalmente pero no es un día no laborable obligatorio |
| `Optional` | Feriado bancario opcional |

## Enumeración ObservedRule

Identifica la regla oficial de corrimiento de fin de semana ("observado"/"sustituto") declarada en una entrada `HolidayInfo`, si existe. Se resuelve mediante `IHolidayProvider.GetObservedDate` / `IValiHoliday.GetObservedHoliday`.

| Valor | Descripción |
|---|---|
| `None` | No aplica ningún corrimiento oficial de día observado |
| `SaturdayToFriday_SundayToMonday` | Regla federal de EE. UU.: sábado → viernes anterior, domingo → lunes siguiente |
| `NextAvailableWeekday` | Regla "in lieu" del Reino Unido: fin de semana → siguiente día laborable disponible que no sea ya un día sustituto (maneja colisiones de Navidad/Boxing Day) |

A partir de 1.1.0, solo los proveedores de EE. UU. y Reino Unido declaran un `ObservedRule`. Ningún otro proveedor declara una regla en esta versión.

## API de IValiHoliday

### Register

Registra un `IHolidayProvider`, reemplazando cualquier registro existente para el mismo código de país. Devuelve `this` para encadenamiento fluido.

```csharp
// Registrar los 38 países incorporados a la vez
foreach (var provider in HolidayProviderFactory.GetAllProviders())
    holiday.Register(provider);

// Registrar solo países latinoamericanos
foreach (var provider in HolidayProviderFactory.GetLatinAmericaProviders())
    holiday.Register(provider);

// Registrar un solo país
holiday.Register(new PeruHolidayProvider());
```

**Firma:** `IValiHoliday Register(IHolidayProvider provider)`

### For / Supports / SupportedCountries

```csharp
IHolidayProvider provider = holiday.For("PE");       // lanza InvalidOperationException si no está registrado
bool supported = holiday.Supports("PE");             // → true si hay un proveedor de Perú registrado
IEnumerable<string> countries = holiday.SupportedCountries;
```

**Firmas:** `IHolidayProvider For(string countryCode)` · `bool Supports(string countryCode)` · `IEnumerable<string> SupportedCountries { get; }`

### IsHoliday

Devuelve `true` si una fecha es feriado público. Atención al orden de los parámetros: **primero la fecha, luego el código(s) de país**.

```csharp
bool isHoliday = holiday.IsHoliday(new DateTime(2025, 7, 28), "PE");
// → true (Día de la Independencia del Perú)

// Semántica ANY — true si la fecha es feriado en al menos uno de los países dados
bool anyHoliday = holiday.IsHoliday(new DateTime(2025, 12, 25), "US", "PE", "ES");
```

**Firmas:** `bool IsHoliday(DateTime date, string countryCode)` · `bool IsHoliday(DateTime date, params string[] countryCodes)`

### IsHolidayInAll

Semántica ALL — `true` solo si la fecha es feriado en **todos** los países especificados (verdad vacua si el arreglo está vacío).

```csharp
bool allHoliday = holiday.IsHolidayInAll(new DateTime(2025, 12, 25), "US", "PE", "ES");
```

**Firma:** `bool IsHolidayInAll(DateTime date, params string[] countryCodes)`

> Ambas sobrecargas multi-país lanzan `ArgumentNullException` (no `NullReferenceException`) cuando `countryCodes` es `null`.

### GetHolidays

```csharp
IEnumerable<HolidayInfo> holidays = holiday.GetHolidays(2025, "MX");

// En múltiples países (no se ordenan entre países)
IEnumerable<HolidayInfo> multi = holiday.GetHolidays(2025, "MX", "PE", "AR");
```

**Firmas:** `IEnumerable<HolidayInfo> GetHolidays(int year, string countryCode)` · `IEnumerable<HolidayInfo> GetHolidays(int year, params string[] countryCodes)`

### GetNextHolidayWithYear / GetPreviousHolidayWithYear

Devuelven el feriado junto con el año calendario resuelto, como una tupla — necesario para feriados móviles (basados en la Pascua), ya que el mismo `HolidayInfo` puede caer en fechas distintas según el año.

```csharp
(HolidayInfo Holiday, int Year)? next = holiday.GetNextHolidayWithYear(DateTime.Today, "PE");
if (next is not null)
    Console.WriteLine($"Próximo feriado: {next.Value.Holiday.Name} en {next.Value.Year}");

(HolidayInfo Holiday, int Year)? prev = holiday.GetPreviousHolidayWithYear(DateTime.Today, "US");
```

**Firmas:** `(HolidayInfo Holiday, int Year)? GetNextHolidayWithYear(DateTime date, string countryCode)` · `(HolidayInfo Holiday, int Year)? GetPreviousHolidayWithYear(DateTime date, string countryCode)`

> **Sobrecargas obsoletas:** `GetNextHoliday(DateTime, string)` y `GetPreviousHoliday(DateTime, string)` están marcadas `[Obsolete]` — devuelven solo `HolidayInfo` sin el año resuelto, lo cual es ambiguo para feriados móviles. Usa las variantes `WithYear`.

### IsLongWeekend

```csharp
// Memorial Day 2025 cae el lunes 26 de mayo
bool longWknd = holiday.IsLongWeekend(new DateTime(2025, 5, 26), "US");
// → true (lunes + fin de semana = fin de semana largo)
```

**Firma:** `bool IsLongWeekend(DateTime date, string countryCode)`

### HolidaysThisMonth

```csharp
IEnumerable<HolidayInfo> thisMonth = holiday.HolidaysThisMonth(2025, 7, "PE");
```

**Firma:** `IEnumerable<HolidayInfo> HolidaysThisMonth(int year, int month, string countryCode)`

> **Nota:** `month` debe estar en el rango [1, 12]; pasar un valor fuera de este rango lanza `ArgumentOutOfRangeException`.

### GetObservedHoliday

Devuelve el `HolidayInfo` cuya fecha oficial observada/sustituta coincide con la fecha dada, o `null` si no existe tal feriado (porque nada cae ahí, o porque el país/feriado no declara regla de corrimiento).

```csharp
// El 4 de julio de 2026 cae sábado en EE. UU. — se observa el viernes anterior
HolidayInfo? observed = holiday.GetObservedHoliday(new DateTime(2026, 7, 3), "US");
```

**Firma:** `HolidayInfo? GetObservedHoliday(DateTime date, string countryCode)`

## Notas específicas por país

### Argentina

El Domingo de Pascua (`ar_easter`) está tipificado como `HolidayType.Observance` en el proveedor de Argentina. Los feriados de tipo Observance se excluyen de la verificación rápida nacional de `IsHoliday()`, por lo que el Domingo de Pascua no devolverá `true` para Argentina al llamar a `IsHoliday(easterDate, "AR")`.

### Chile

El Día de los Pueblos Indígenas es un feriado móvil basado en el ciclo astronómico del solsticio. Cae el **20 de junio** en años bisiestos cercanos al ciclo del solsticio, y el **21 de junio** en los demás.

### Honduras

El proveedor de Honduras incluye el **17 de sep (Día del Maestro)** como feriado cívico fijo y el **Domingo de Pascua** como feriado móvil.

### EE. UU. / Reino Unido

Estos son, por ahora, los únicos proveedores que declaran un `ObservedRule` en sus feriados, habilitando las consultas con `GetObservedHoliday()`.

## Ejemplo completo

```csharp
public class HolidayCalendarService(IValiHoliday holiday)
{
    public void Initialize()
    {
        // Registrar todos los proveedores de América Latina
        foreach (var provider in HolidayProviderFactory.GetLatinAmericaProviders())
            holiday.Register(provider);

        // Agregar Europa
        foreach (var provider in HolidayProviderFactory.GetEuropeProviders())
            holiday.Register(provider);
    }

    public void PrintYearHolidays(string countryCode, int year)
    {
        if (!holiday.Supports(countryCode))
        {
            Console.WriteLine($"No hay proveedor registrado para '{countryCode}'");
            return;
        }

        var holidays = holiday.GetHolidays(year, countryCode);

        Console.WriteLine($"Feriados públicos en {countryCode} para {year}:");
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
