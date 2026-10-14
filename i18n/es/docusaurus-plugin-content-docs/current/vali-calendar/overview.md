---
id: overview
title: Descripción general de Vali-Calendar
sidebar_label: Descripción general
description: Vali-Calendar proporciona operaciones de calendario laboral para .NET — calcula días hábiles, omite fines de semana y feriados, y navega por meses calendario.
keywords: [Vali-Calendar, días hábiles, día laboral, .NET, NuGet, C#, operaciones de calendario]
---

# Vali-Calendar

`IValiCalendar` es un motor de calendario con conciencia de días laborables que admite un `IHolidayProvider` intercambiable. Puede calcular días laborables entre fechas, agregar días hábiles, detectar límites de mes/semana y enumerar los días de un mes.

## Instalación

```bash
dotnet add package Vali-Calendar
```

Targets compilados: `net8.0` · `net9.0` · `net10.0`. Compatible con .NET 6 y .NET 7 mediante compatibilidad retroactiva de NuGet.

## Registro

```csharp
builder.Services.AddValiCalendar();
// o mediante el meta-paquete:
builder.Services.AddValiTempo();
```

Para excluir feriados de la lógica de días laborables, registra con un `IHolidayProvider` (un proveedor único, ya acotado a un país — ver [Integración de feriados](#integración-de-feriados) más abajo):

```csharp
builder.Services.AddValiCalendar(myHolidayProvider);
```

## Struct CalendarWeek

`CalendarWeek` representa una semana calendario ISO 8601:

| Propiedad | Tipo | Descripción |
|---|---|---|
| `Year` | `int` | Año al que pertenece la semana |
| `WeekNumber` | `int` | Número de semana ISO (1–53) |
| `Start` | `DateTime` | Primer día de la semana |
| `End` | `DateTime` | Último día de la semana |
| `Days` | `IEnumerable<DateTime>` | Los 7 días de la semana |

## API de IValiCalendar

### WeekOf

Obtiene el `CalendarWeek` que contiene una fecha dada:

```csharp
CalendarWeek week = calendar.WeekOf(new DateTime(2025, 3, 15));
Console.WriteLine(week.WeekNumber); // → número de semana ISO
Console.WriteLine(week.Start);      // → primer día de esa semana
Console.WriteLine(week.End);        // → último día de esa semana
```

**Firma:** `CalendarWeek WeekOf(DateTime date, WeekStart? weekStart = null)`

`weekStart` sobrescribe el valor por defecto de la instancia (`WeekStart.Monday` o `WeekStart.Sunday`) solo para esta llamada.

### CurrentWeek

Obtiene el `CalendarWeek` para la fecha actual:

```csharp
CalendarWeek thisWeek = calendar.CurrentWeek();
```

**Firma:** `CalendarWeek CurrentWeek(WeekStart? weekStart = null)`

### WeeksInMonth

Obtiene todas las semanas calendario que se superponen con un mes dado:

```csharp
IEnumerable<CalendarWeek> weeks = calendar.WeeksInMonth(2025, 3);
// → Todas las semanas que se superponen con marzo de 2025
```

**Firma:** `IEnumerable<CalendarWeek> WeeksInMonth(int year, int month, WeekStart? weekStart = null)`

### WeekCountInMonth

Devuelve el número de semanas calendario (parciales o completas) en un mes dado:

```csharp
int count = calendar.WeekCountInMonth(2025, 3);
// → 5 (marzo de 2025 abarca 5 semanas)
```

**Firma:** `int WeekCountInMonth(int year, int month, WeekStart? weekStart = null)`

### IsFirstDayOfMonth

Devuelve `true` si la fecha es el primer día de su mes calendario:

```csharp
bool first = calendar.IsFirstDayOfMonth(new DateTime(2025, 5, 1));
// → true
```

**Firma:** `bool IsFirstDayOfMonth(DateTime date)`

### IsLastDayOfMonth

Devuelve `true` si la fecha es el último día de su mes calendario:

```csharp
bool last = calendar.IsLastDayOfMonth(new DateTime(2025, 1, 31));
// → true
```

**Firma:** `bool IsLastDayOfMonth(DateTime date)`

### DaysInMonth

Devuelve el número de días en el mes de la fecha dada:

```csharp
int days = calendar.DaysInMonth(new DateTime(2024, 2, 10));
// → 29 (año bisiesto)
```

**Firma:** `int DaysInMonth(DateTime date)`

### DaysOfMonth

Enumera todos los días calendario de un mes dado:

```csharp
IEnumerable<DateTime> days = calendar.DaysOfMonth(2025, 3);
foreach (var day in days)
    Console.WriteLine(day.ToString("dd ddd"));
```

**Firma:** `IEnumerable<DateTime> DaysOfMonth(int year, int month)`

### IsWorkday

Devuelve `true` si la fecha es un día laborable — un día de semana (lunes a viernes) que no es un feriado cuando la instancia tiene un `IHolidayProvider` configurado:

```csharp
bool isWork = calendar.IsWorkday(new DateTime(2025, 12, 25));
// → false si la instancia tiene un proveedor de feriados que marca el 25 de dic. como feriado,
//   de lo contrario true/false según el día de la semana
```

**Firma:** `bool IsWorkday(DateTime date)`

El proveedor de feriados no se pasa en cada llamada — se vincula una sola vez, en la construcción (ver [Integración de feriados](#integración-de-feriados)). Por lo tanto, una instancia de `ValiCalendar` está acotada a un único proveedor de feriados (un país) a la vez.

### WorkdaysBetween

Cuenta el número de días laborables entre dos fechas, **incluyendo ambos extremos**:

```csharp
int workdays = calendar.WorkdaysBetween(
    new DateTime(2025, 3, 3),  // Lunes
    new DateTime(2025, 3, 14)); // Viernes
// → 10 (dos semanas de lun–vie)
```

**Firma:** `int WorkdaysBetween(DateTime from, DateTime to)`

Lanza `ArgumentException` si `from` es posterior a `to`, y `InvalidOperationException` si el rango excede el límite interno de escaneo de 10 años.

### AddWorkdays

Añade un número de días hábiles a una fecha, omitiendo fines de semana (y feriados cuando hay un proveedor configurado). Los valores negativos retroceden:

```csharp
DateTime result = calendar.AddWorkdays(new DateTime(2025, 3, 28), 5);
// → Avanza 5 días laborables, omitiendo fines de semana (y feriados si está configurado)
```

**Firma:** `DateTime AddWorkdays(DateTime date, int workdays)`

### WorkdaysInMonth

Devuelve la cantidad de días laborables en un mes dado:

```csharp
int count = calendar.WorkdaysInMonth(2025, 3);
// → 21 (marzo de 2025)
```

**Firma:** `int WorkdaysInMonth(int year, int month)`

### WorkdaysInYear

Devuelve la cantidad total de días laborables en un año dado:

```csharp
int count = calendar.WorkdaysInYear(2025);
// → 261
```

**Firma:** `int WorkdaysInYear(int year)`

### NextWorkday

Devuelve el siguiente día laborable en o después de la fecha dada. Si la fecha ya es un día laborable, se devuelve sin cambios:

```csharp
DateTime next = calendar.NextWorkday(new DateTime(2025, 3, 28)); // Viernes
// → 2025-03-28 (ya es un día laborable)
```

**Firma:** `DateTime NextWorkday(DateTime date)`

### PreviousWorkday

Devuelve el día laborable más reciente en o antes de la fecha dada. Si la fecha ya es un día laborable, se devuelve sin cambios:

```csharp
DateTime prev = calendar.PreviousWorkday(new DateTime(2025, 3, 31)); // Lunes
// → 2025-03-31 (ya es un día laborable)
```

**Firma:** `DateTime PreviousWorkday(DateTime date)`

### HasHolidayProvider

Devuelve `true` si esta instancia tiene un `IHolidayProvider` configurado. Es una propiedad de solo lectura, no un método:

```csharp
bool has = calendar.HasHolidayProvider;
```

**Firma:** `bool HasHolidayProvider { get; }`

### HolidaysInMonth

Devuelve todos los feriados en un mes dado, usando el proveedor de feriados configurado:

```csharp
IEnumerable<HolidayInfo> holidays = calendar.HolidaysInMonth(2025, 12);
```

**Firma:** `IEnumerable<HolidayInfo> HolidaysInMonth(int year, int month)`

Lanza `InvalidOperationException` si no se pasó un `IHolidayProvider` al constructor.

### HolidaysInYear

Devuelve todos los feriados en un año dado, usando el proveedor de feriados configurado:

```csharp
IEnumerable<HolidayInfo> holidays = calendar.HolidaysInYear(2025);
```

**Firma:** `IEnumerable<HolidayInfo> HolidaysInYear(int year)`

Lanza `InvalidOperationException` si no se pasó un `IHolidayProvider` al constructor.

### IsLeapYear

Devuelve `true` si el año dado es bisiesto:

```csharp
bool leap = calendar.IsLeapYear(2024);
// → true
```

**Firma:** `bool IsLeapYear(int year)`

### DaysInYear

Devuelve el número de días en el año dado (365 o 366):

```csharp
int days = calendar.DaysInYear(2024);
// → 366
```

**Firma:** `int DaysInYear(int year)`

## Integración de feriados

`ValiCalendar` recibe un `IHolidayProvider` opcional en su constructor — un proveedor acotado a **un único país** (por ejemplo, uno obtenido de [Vali-Holiday](../vali-holiday/overview.md) mediante `IValiHoliday.For(countryCode)`), no la fachada multi-país `IValiHoliday` en sí:

```csharp
using Vali_Calendar.Core;
using Vali_Holiday.Core;

IValiHoliday holidayFacade = HolidayProviderFactory.CreateLatinAmerica();
IHolidayProvider peruProvider = holidayFacade.For("PE");

var calendar = new ValiCalendar(WeekStart.Monday, peruProvider);
```

Cada instancia de `ValiCalendar` está vinculada a un único proveedor de feriados. Si necesitas lógica de días laborables para varios países, crea una instancia de `ValiCalendar` por país.

## Ejemplo completo

```csharp
using Vali_Calendar.Core;
using Vali_Holiday.Core;

public class HRCalendarFactory(IValiHoliday holiday)
{
    // Una instancia de ValiCalendar por país — el proveedor de feriados se vincula en la construcción
    public IValiCalendar ForCountry(string countryCode)
        => new ValiCalendar(WeekStart.Monday, holiday.For(countryCode));
}

public class HRCalendarReports
{
    public void PrintMonthSummary(IValiCalendar calendar, int year, int month)
    {
        Console.WriteLine($"Días en el mes:      {calendar.DaysInMonth(new DateTime(year, month, 1))}");
        Console.WriteLine($"Días hábiles en mes: {calendar.WorkdaysInMonth(year, month)}");
        Console.WriteLine($"Semanas en el mes:   {calendar.WeekCountInMonth(year, month)}");

        Console.WriteLine("Feriados este mes:");
        foreach (var h in calendar.HolidaysInMonth(year, month))
            Console.WriteLine($"  {h.Month:D2}-{h.Day:D2} — {h.Name}");
    }

    public DateTime ComputePaymentDate(IValiCalendar calendar, DateTime issueDate)
    {
        // Pago vence 5 días hábiles después de la fecha de factura
        return calendar.AddWorkdays(issueDate, 5);
    }
}
```
