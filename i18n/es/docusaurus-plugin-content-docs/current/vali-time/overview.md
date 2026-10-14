---
id: overview
title: Descripción general de Vali-Time
sidebar_label: Descripción general
description: Vali-Time proporciona conversiones de unidades de tiempo, formateo, análisis y aritmética para .NET. Convierte entre milisegundos, segundos, minutos, horas, días, semanas, meses y años.
keywords: [Vali-Time, conversión de tiempo, .NET, NuGet, TimeUnit, C#, aritmética de tiempo]
---

# Vali-Time

`IValiTime` proporciona conversiones de unidades de tiempo de alta precisión usando aritmética `decimal` — eliminando la deriva de punto flotante habitual en las conversiones basadas en `double`.

## Instalación

```bash
dotnet add package Vali-Time
```

Targets compilados: `net8.0`, `net9.0`, `net10.0`. Compatible con **.NET 6** y **.NET 7** mediante retrocompatibilidad de NuGet — no requiere un build separado.

## Registro

```csharp
builder.Services.AddValiTime();
// o mediante el meta-paquete:
builder.Services.AddValiTempo();
```

## Enumeraciones

### TimeUnit

Representa una unidad de medida de tiempo:

| Valor | Descripción |
|---|---|
| `Milliseconds` | 1/1000 de un segundo |
| `Seconds` | Unidad SI base de tiempo |
| `Minutes` | 60 segundos |
| `Hours` | 60 minutos |
| `Days` | 24 horas |
| `Weeks` | 7 días |
| `Months` | Mes calendario (promedio 30.4375 días) |
| `Years` | Año calendario (promedio 365.25 días) |

### DatePart

Se usa al extraer componentes de un `DateTime`:

| Valor | Descripción |
|---|---|
| `Year` | El componente año |
| `Month` | El componente mes (1–12) |
| `Day` | El componente día del mes |
| `Hour` | El componente hora (0–23) |
| `Minute` | El componente minuto |
| `Second` | El componente segundo |
| `DayOfWeek` | Día de la semana (0=Domingo) |

### WeekStart

Define qué día inicia la semana, usado en los cálculos de semana del año:

| Valor | Descripción |
|---|---|
| `Sunday` | La semana empieza el domingo (convención US) |
| `Monday` | La semana empieza el lunes (estándar ISO 8601) |

## API de IValiTime

### Convert

Convierte un valor de una unidad de tiempo a otra, con redondeo opcional:

```csharp
decimal seconds = time.Convert(2m, TimeUnit.Hours, TimeUnit.Seconds);
// → 7200

decimal hours = time.Convert(1.5m, TimeUnit.Days, TimeUnit.Hours, decimalPlaces: 2);
// → 36.00
```

**Firma:** `decimal Convert(decimal time, TimeUnit fromUnit, TimeUnit toUnit, int? decimalPlaces = null, MidpointRounding rounding = MidpointRounding.ToEven)`

### TryConvert

Conversión segura que devuelve `false` en lugar de lanzar una excepción con entrada inválida:

```csharp
if (time.TryConvert(90m, TimeUnit.Minutes, TimeUnit.Hours, out decimal h))
    Console.WriteLine(h); // → 1.5
```

**Firma:** `bool TryConvert(decimal time, TimeUnit fromUnit, TimeUnit toUnit, out decimal result, int? decimalPlaces = null)`

### SumTimes

Suma múltiples valores expresados en distintas unidades en una sola llamada, y obtén el resultado en cualquier unidad:

```csharp
var values = new List<(decimal time, TimeUnit unit)>
{
    (1m,  TimeUnit.Hours),
    (30m, TimeUnit.Minutes),
    (45m, TimeUnit.Seconds)
};

decimal totalSeconds = time.SumTimes(TimeUnit.Seconds, values);
// → 5445
```

**Firma:** `decimal SumTimes(TimeUnit resultUnit, List<(decimal time, TimeUnit unit)> times, int? decimalPlaces = null, MidpointRounding rounding = MidpointRounding.ToEven)`

### SubtractTimes

Resta del primer valor todos los valores subsiguientes. El primer elemento es el minuendo:

```csharp
var values = new List<(decimal time, TimeUnit unit)>
{
    (2m,   TimeUnit.Hours),
    (30m,  TimeUnit.Minutes),
    (600m, TimeUnit.Seconds)
};

decimal result = time.SubtractTimes(TimeUnit.Minutes, values);
// → 80  (120 min - 30 min - 10 min)

// Permitir resultado negativo en lugar de lanzar excepción
decimal negative = time.SubtractTimes(TimeUnit.Hours, values, allowNegative: true);
```

**Firma:** `decimal SubtractTimes(TimeUnit resultUnit, List<(decimal time, TimeUnit unit)> times, bool allowNegative = false, int? decimalPlaces = null, MidpointRounding rounding = MidpointRounding.ToEven)`

### FormatTime

Formatea un valor de tiempo decimal en una cadena legible para humanos con sufijo de unidad. Soporta `CultureInfo`:

```csharp
string s1 = time.FormatTime(1.5m, TimeUnit.Hours);
// → "1.50 h"

string s2 = time.FormatTime(90m, TimeUnit.Minutes);
// → "90.00 min"

// Cultura alemana (coma como separador decimal)
var de = new System.Globalization.CultureInfo("de-DE");
string s3 = time.FormatTime(1234.5m, TimeUnit.Seconds, 2, de);
// → "1234,50 s"
```

**Firma:** `string FormatTime(decimal time, TimeUnit unit, int decimalPlaces = 2, CultureInfo? culture = null)`

### GetBestUnit

Dado un tiempo en segundos, devuelve la unidad más legible para humanos junto con el valor convertido:

```csharp
var (value, unit) = time.GetBestUnit(7200m);
Console.WriteLine(time.FormatTime(value, unit)); // → "2.00 h"

var (value2, unit2) = time.GetBestUnit(0.5m);
Console.WriteLine(time.FormatTime(value2, unit2)); // → "500.00 ms"
```

**Firma:** `(decimal time, TimeUnit unit) GetBestUnit(decimal seconds)`

### ParseTime / TryParseTime

Analiza una cadena de duración legible para humanos y devuelve el total en segundos (separada por dos puntos o con tokens etiquetados, por ejemplo `"1:30:00"`, `"2d 4h 30m 15s"`, `"500ms"`):

```csharp
decimal s1 = time.ParseTime("1:30:00"); // → 5400
decimal s2 = time.ParseTime("2d 4h 30m 15s"); // → 188415

if (time.TryParseTime("bad input", out decimal parsed))
    Console.WriteLine(parsed);
else
    Console.WriteLine("Could not parse"); // esta rama se ejecuta
```

**Firma:** `decimal ParseTime(string input)` / `bool TryParseTime(string input, out decimal seconds)`

> Desde la **1.1.0**, la gramática detrás de `ParseTime`/`TryParseTime` también se expone como una utilidad reutilizable independiente — ver [DurationStringParser](#durationstringparser) más abajo.

### Breakdown

Descompone un número total de segundos en horas, minutos, segundos y milisegundos:

```csharp
var parts = time.Breakdown(3665.678m);

Console.WriteLine(parts[TimeUnit.Hours]);        // → 1
Console.WriteLine(parts[TimeUnit.Minutes]);      // → 1
Console.WriteLine(parts[TimeUnit.Seconds]);      // → 5
Console.WriteLine(parts[TimeUnit.Milliseconds]); // → 678
```

**Firma:** `Dictionary<TimeUnit, decimal> Breakdown(decimal seconds)`

### ToTimeSpan

Convierte un valor decimal en una unidad dada a un `TimeSpan`:

```csharp
TimeSpan ts = time.ToTimeSpan(2.5m, TimeUnit.Hours);
// → TimeSpan de 2h 30m
```

**Firma:** `TimeSpan ToTimeSpan(decimal value, TimeUnit unit)`

### FromTimeSpan

Convierte un `TimeSpan` a un valor decimal en la unidad especificada:

```csharp
decimal minutes = time.FromTimeSpan(TimeSpan.FromHours(1.5), TimeUnit.Minutes);
// → 90
```

**Firma:** `decimal FromTimeSpan(TimeSpan span, TimeUnit unit)`

### Clamp

Restringe un valor dentro de un mínimo y un máximo (todos en la misma unidad):

```csharp
decimal clamped = time.Clamp(150m, TimeUnit.Minutes, 0m, 120m);
// → 120 (restringido al máximo)

decimal clamped2 = time.Clamp(-5m, TimeUnit.Minutes, 0m, 120m);
// → 0 (restringido al mínimo)
```

**Firma:** `decimal Clamp(decimal time, TimeUnit unit, decimal min, decimal max)`

### Compare

Compara dos valores de tiempo (que pueden estar en unidades distintas). Devuelve `-1`, `0` o `1`:

```csharp
int result = time.Compare(60m, TimeUnit.Minutes, 1m, TimeUnit.Hours);
// → 0 (iguales)

int result2 = time.Compare(90m, TimeUnit.Seconds, 2m, TimeUnit.Minutes);
// → -1 (90s < 2min)
```

**Firma:** `int Compare(decimal time1, TimeUnit unit1, decimal time2, TimeUnit unit2)`

### MultiConvert

Convierte un valor de una unidad a múltiples unidades destino a la vez:

```csharp
var results = time.MultiConvert(3600m, TimeUnit.Seconds,
    TimeUnit.Minutes, TimeUnit.Hours, TimeUnit.Days);
// → { Minutes: 60, Hours: 1, Days: 0.0416... }
```

**Firma:** `Dictionary<TimeUnit, decimal> MultiConvert(decimal time, TimeUnit fromUnit, params TimeUnit[] toUnits)`

### DurationStringParser

Nuevo en la **1.1.0**. `Vali_Time.Utils.DurationStringParser` es el parser estático e independiente extraído de la gramática de `ParseTime` — tokens separados por dos puntos (`"hh:mm:ss"`, `"mm:ss"`) y tokens etiquetados (`"2d 4h 30m 15s"`, `"500ms"`, `"90 minutes"`), devolviendo el total en segundos. `IValiTime.ParseTime`/`TryParseTime` lo invocan internamente, y es reutilizado tal cual por `IParsable<ValiDuration>` de `Vali-Duration` para que ambos paquetes compartan exactamente una sola gramática — es una utilidad estática, no se registra en DI.

```csharp
using Vali_Time.Utils;

decimal seconds = DurationStringParser.Parse("1h 30m");
// → 5400

if (DurationStringParser.TryParse("not a duration", out decimal result))
    Console.WriteLine(result);
else
    Console.WriteLine("Could not parse"); // esta rama se ejecuta
```

**Firma:** `static decimal Parse(string input)` / `static bool TryParse(string? input, out decimal seconds)`

### DateTimeExtensions

`Vali_Time.Extensions.DateTimeExtensions` consolida `StartOfWeek`, `IsWeekend` e `IsWeekday` (además de `EndOfWeek`, `StartOf`/`EndOf`Month/Year/Quarter, `IsSameDay`/`IsSameMonth`/`IsSameYear`, `WeekOfYear`, `QuarterOfYear`) como métodos de extensión de `DateTime` — la única fuente de verdad que ahora usan otros paquetes de Vali-Tempo, en lugar de duplicar esta lógica.

```csharp
using Vali_Time.Extensions;

var date = new DateTime(2025, 5, 20);

bool weekend = date.IsWeekend();            // → false
DateTime weekStart = date.StartOfWeek();    // → 2025-05-19 (lunes)
DateTime quarterEnd = date.EndOfQuarter();  // → 2025-06-30 23:59:59.999
```

### HumanizeCulture

Nuevo en la **1.1.0**. `Vali_Time.Enums.HumanizeCulture` (`En` / `Es`) es un enum pequeño propiedad de Vali-Time, consumido por el formateador de tiempo relativo `Humanize()` de `Vali-Age` — no tiene comportamiento propio en este paquete más allá de ser el selector de cultura compartido.

## Ejemplo completo

```csharp
public class WorklogService(IValiTime time)
{
    public void AnalyzeWorklog(List<(decimal time, TimeUnit unit)> taskDurations)
    {
        // Total en horas
        decimal totalHours = time.SumTimes(TimeUnit.Hours, taskDurations, decimalPlaces: 2);

        // Mejor unidad de visualización
        decimal totalSeconds = time.Convert(totalHours, TimeUnit.Hours, TimeUnit.Seconds);
        var (bestValue, bestUnit) = time.GetBestUnit(totalSeconds);
        string formatted = time.FormatTime(totalHours, TimeUnit.Hours, 1);

        // Desglose en componentes
        var parts = time.Breakdown(totalSeconds);

        Console.WriteLine($"Total work: {formatted}");
        Console.WriteLine($"Hours: {parts[TimeUnit.Hours]}, Minutes: {parts[TimeUnit.Minutes]}");

        // Comparar con una jornada de 8 horas
        int cmp = time.Compare(totalHours, TimeUnit.Hours, 8m, TimeUnit.Hours);
        if (cmp < 0) Console.WriteLine("Undertime");
        else if (cmp > 0) Console.WriteLine("Overtime");
        else Console.WriteLine("Exact 8 hours");
    }
}
```
