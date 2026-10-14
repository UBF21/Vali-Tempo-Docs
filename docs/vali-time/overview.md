---
id: overview
title: Vali-Time Overview
sidebar_label: Overview
description: Vali-Time provides time unit conversions, formatting, parsing, and arithmetic for .NET. Convert between milliseconds, seconds, minutes, hours, days, weeks, months and years.
keywords: [Vali-Time, time conversion, .NET, NuGet, TimeUnit, C#, time arithmetic]
---

# Vali-Time

`IValiTime` provides high-precision time unit conversions using `decimal` arithmetic — eliminating the floating-point drift common with `double`-based conversion.

## Installation

```bash
dotnet add package Vali-Time
```

Compiled targets: `net8.0`, `net9.0`, `net10.0`. Compatible with **.NET 6** and **.NET 7** via NuGet backward compatibility — no separate build needed.

## Registration

```csharp
builder.Services.AddValiTime();
// or via the meta-package:
builder.Services.AddValiTempo();
```

## Enums

### TimeUnit

Represents a unit of time measurement:

| Value | Description |
|---|---|
| `Milliseconds` | 1/1000 of a second |
| `Seconds` | Base SI unit of time |
| `Minutes` | 60 seconds |
| `Hours` | 60 minutes |
| `Days` | 24 hours |
| `Weeks` | 7 days |
| `Months` | Calendar month (30.4375 days average) |
| `Years` | Calendar year (365.25 days average) |

### DatePart

Used when extracting components from a `DateTime`:

| Value | Description |
|---|---|
| `Year` | The year component |
| `Month` | The month component (1–12) |
| `Day` | The day-of-month component |
| `Hour` | The hour component (0–23) |
| `Minute` | The minute component |
| `Second` | The second component |
| `DayOfWeek` | Day of the week (0=Sunday) |

### WeekStart

Defines which day starts the week, used in week-of-year calculations:

| Value | Description |
|---|---|
| `Sunday` | Week starts on Sunday (ISO US convention) |
| `Monday` | Week starts on Monday (ISO 8601 standard) |

## IValiTime API

### Convert

Convert a value from one time unit to another, with optional rounding:

```csharp
decimal seconds = time.Convert(2m, TimeUnit.Hours, TimeUnit.Seconds);
// → 7200

decimal hours = time.Convert(1.5m, TimeUnit.Days, TimeUnit.Hours, decimalPlaces: 2);
// → 36.00
```

**Signature:** `decimal Convert(decimal time, TimeUnit fromUnit, TimeUnit toUnit, int? decimalPlaces = null, MidpointRounding rounding = MidpointRounding.ToEven)`

### TryConvert

Safe conversion that returns `false` instead of throwing on invalid input:

```csharp
if (time.TryConvert(90m, TimeUnit.Minutes, TimeUnit.Hours, out decimal h))
    Console.WriteLine(h); // → 1.5
```

**Signature:** `bool TryConvert(decimal time, TimeUnit fromUnit, TimeUnit toUnit, out decimal result, int? decimalPlaces = null)`

### SumTimes

Add multiple values expressed in different units in a single call, and get the result in any unit:

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

**Signature:** `decimal SumTimes(TimeUnit resultUnit, List<(decimal time, TimeUnit unit)> times, int? decimalPlaces = null, MidpointRounding rounding = MidpointRounding.ToEven)`

### SubtractTimes

Subtract from the first value all subsequent values. The first element is the minuend:

```csharp
var values = new List<(decimal time, TimeUnit unit)>
{
    (2m,   TimeUnit.Hours),
    (30m,  TimeUnit.Minutes),
    (600m, TimeUnit.Seconds)
};

decimal result = time.SubtractTimes(TimeUnit.Minutes, values);
// → 80  (120 min - 30 min - 10 min)

// Allow a negative result instead of throwing
decimal negative = time.SubtractTimes(TimeUnit.Hours, values, allowNegative: true);
```

**Signature:** `decimal SubtractTimes(TimeUnit resultUnit, List<(decimal time, TimeUnit unit)> times, bool allowNegative = false, int? decimalPlaces = null, MidpointRounding rounding = MidpointRounding.ToEven)`

### FormatTime

Format a decimal time value into a human-readable, unit-aware string. Supports `CultureInfo`:

```csharp
string s1 = time.FormatTime(1.5m, TimeUnit.Hours);
// → "1.50 h"

string s2 = time.FormatTime(90m, TimeUnit.Minutes);
// → "90.00 min"

// German culture (comma as decimal separator)
var de = new System.Globalization.CultureInfo("de-DE");
string s3 = time.FormatTime(1234.5m, TimeUnit.Seconds, 2, de);
// → "1234,50 s"
```

**Signature:** `string FormatTime(decimal time, TimeUnit unit, int decimalPlaces = 2, CultureInfo? culture = null)`

### GetBestUnit

Given a duration in seconds, return the most human-readable unit along with the converted value:

```csharp
var (value, unit) = time.GetBestUnit(7200m);
Console.WriteLine(time.FormatTime(value, unit)); // → "2.00 h"

var (value2, unit2) = time.GetBestUnit(0.5m);
Console.WriteLine(time.FormatTime(value2, unit2)); // → "500.00 ms"
```

**Signature:** `(decimal time, TimeUnit unit) GetBestUnit(decimal seconds)`

### ParseTime / TryParseTime

Parse a human-readable duration string into total seconds (colon-separated or labelled tokens, e.g. `"1:30:00"`, `"2d 4h 30m 15s"`, `"500ms"`):

```csharp
decimal s1 = time.ParseTime("1:30:00"); // → 5400
decimal s2 = time.ParseTime("2d 4h 30m 15s"); // → 188415

if (time.TryParseTime("bad input", out decimal parsed))
    Console.WriteLine(parsed);
else
    Console.WriteLine("Could not parse"); // this branch runs
```

**Signature:** `decimal ParseTime(string input)` / `bool TryParseTime(string input, out decimal seconds)`

> Since **1.1.0**, the grammar behind `ParseTime`/`TryParseTime` is also exposed as a standalone, reusable utility — see [DurationStringParser](#durationstringparser) below.

### Breakdown

Decompose a total number of seconds into hours, minutes, seconds, and milliseconds:

```csharp
var parts = time.Breakdown(3665.678m);

Console.WriteLine(parts[TimeUnit.Hours]);        // → 1
Console.WriteLine(parts[TimeUnit.Minutes]);      // → 1
Console.WriteLine(parts[TimeUnit.Seconds]);      // → 5
Console.WriteLine(parts[TimeUnit.Milliseconds]); // → 678
```

**Signature:** `Dictionary<TimeUnit, decimal> Breakdown(decimal seconds)`

### ToTimeSpan

Convert a decimal value in a given unit to a `TimeSpan`:

```csharp
TimeSpan ts = time.ToTimeSpan(2.5m, TimeUnit.Hours);
// → TimeSpan of 2h 30m
```

**Signature:** `TimeSpan ToTimeSpan(decimal value, TimeUnit unit)`

### FromTimeSpan

Convert a `TimeSpan` to a decimal value in the specified unit:

```csharp
decimal minutes = time.FromTimeSpan(TimeSpan.FromHours(1.5), TimeUnit.Minutes);
// → 90
```

**Signature:** `decimal FromTimeSpan(TimeSpan span, TimeUnit unit)`

### Clamp

Clamp a value within a minimum and maximum (all in the same unit):

```csharp
decimal clamped = time.Clamp(150m, TimeUnit.Minutes, 0m, 120m);
// → 120 (clamped to max)

decimal clamped2 = time.Clamp(-5m, TimeUnit.Minutes, 0m, 120m);
// → 0 (clamped to min)
```

**Signature:** `decimal Clamp(decimal time, TimeUnit unit, decimal min, decimal max)`

### Compare

Compare two time values (which may be in different units). Returns `-1`, `0`, or `1`:

```csharp
int result = time.Compare(60m, TimeUnit.Minutes, 1m, TimeUnit.Hours);
// → 0 (equal)

int result2 = time.Compare(90m, TimeUnit.Seconds, 2m, TimeUnit.Minutes);
// → -1 (90s < 2min)
```

**Signature:** `int Compare(decimal time1, TimeUnit unit1, decimal time2, TimeUnit unit2)`

### MultiConvert

Convert a value from one unit to multiple target units at once:

```csharp
var results = time.MultiConvert(3600m, TimeUnit.Seconds,
    TimeUnit.Minutes, TimeUnit.Hours, TimeUnit.Days);
// → { Minutes: 60, Hours: 1, Days: 0.0416... }
```

**Signature:** `Dictionary<TimeUnit, decimal> MultiConvert(decimal time, TimeUnit fromUnit, params TimeUnit[] toUnits)`

### DurationStringParser

New in **1.1.0**. `Vali_Time.Utils.DurationStringParser` is the standalone, stateless parser extracted from `ParseTime`'s grammar — colon-separated (`"hh:mm:ss"`, `"mm:ss"`) and labelled tokens (`"2d 4h 30m 15s"`, `"500ms"`, `"90 minutes"`), returning total seconds. `IValiTime.ParseTime`/`TryParseTime` call into it internally, and it's reused as-is by `Vali-Duration`'s `IParsable<ValiDuration>` so both packages agree on exactly one grammar — it is a static utility, not registered in DI.

```csharp
using Vali_Time.Utils;

decimal seconds = DurationStringParser.Parse("1h 30m");
// → 5400

if (DurationStringParser.TryParse("not a duration", out decimal result))
    Console.WriteLine(result);
else
    Console.WriteLine("Could not parse"); // this branch runs
```

**Signature:** `static decimal Parse(string input)` / `static bool TryParse(string? input, out decimal seconds)`

### DateTimeExtensions

`Vali_Time.Extensions.DateTimeExtensions` consolidates `StartOfWeek`, `IsWeekend`, and `IsWeekday` (plus `EndOfWeek`, `StartOf`/`EndOf`Month/Year/Quarter, `IsSameDay`/`IsSameMonth`/`IsSameYear`, `WeekOfYear`, `QuarterOfYear`) as `DateTime` extension methods — the single source of truth other Vali-Tempo packages now call into, instead of duplicating this logic.

```csharp
using Vali_Time.Extensions;

var date = new DateTime(2025, 5, 20);

bool weekend = date.IsWeekend();            // → false
DateTime weekStart = date.StartOfWeek();    // → 2025-05-19 (Monday)
DateTime quarterEnd = date.EndOfQuarter();  // → 2025-06-30 23:59:59.999
```

### HumanizeCulture

New in **1.1.0**. `Vali_Time.Enums.HumanizeCulture` (`En` / `Es`) is a small, Vali-Time-owned enum consumed by `Vali-Age`'s `Humanize()` relative-time formatter — it has no behavior of its own in this package beyond being the shared culture selector.

## Complete Example

```csharp
public class WorklogService(IValiTime time)
{
    public void AnalyzeWorklog(List<(decimal time, TimeUnit unit)> taskDurations)
    {
        // Total in hours
        decimal totalHours = time.SumTimes(TimeUnit.Hours, taskDurations, decimalPlaces: 2);

        // Best display unit
        decimal totalSeconds = time.Convert(totalHours, TimeUnit.Hours, TimeUnit.Seconds);
        var (bestValue, bestUnit) = time.GetBestUnit(totalSeconds);
        string formatted = time.FormatTime(totalHours, TimeUnit.Hours, 1);

        // Break down into components
        var parts = time.Breakdown(totalSeconds);

        Console.WriteLine($"Total work: {formatted}");
        Console.WriteLine($"Hours: {parts[TimeUnit.Hours]}, Minutes: {parts[TimeUnit.Minutes]}");

        // Compare against 8-hour workday
        int cmp = time.Compare(totalHours, TimeUnit.Hours, 8m, TimeUnit.Hours);
        if (cmp < 0) Console.WriteLine("Undertime");
        else if (cmp > 0) Console.WriteLine("Overtime");
        else Console.WriteLine("Exact 8 hours");
    }
}
```
