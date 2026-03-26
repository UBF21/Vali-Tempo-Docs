---
id: overview
title: Vali-Time Overview
sidebar_label: Overview
---

# Vali-Time

`IValiTime` provides high-precision time unit conversions using `decimal` arithmetic — eliminating the floating-point drift common with `double`-based conversion.

## Installation

```bash
dotnet add package Vali-Time
```

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

Convert a value from one time unit to another:

```csharp
decimal hours = time.Convert(90, TimeUnit.Minutes, TimeUnit.Hours);
// → 1.5

decimal ms = time.Convert(2.5m, TimeUnit.Seconds, TimeUnit.Milliseconds);
// → 2500
```

**Signature:** `decimal Convert(decimal value, TimeUnit from, TimeUnit to)`

### SumTimes

Sum multiple values (all in the same unit) and return the total in a target unit:

```csharp
decimal totalHours = time.SumTimes(
    new[] { 30m, 45m, 90m },
    TimeUnit.Minutes,
    TimeUnit.Hours
);
// → 2.75
```

**Signature:** `decimal SumTimes(IEnumerable<decimal> values, TimeUnit inputUnit, TimeUnit outputUnit)`

### SubtractTimes

Subtract one time value from another:

```csharp
decimal diff = time.SubtractTimes(120m, 45m, TimeUnit.Minutes, TimeUnit.Hours);
// → 1.25
```

**Signature:** `decimal SubtractTimes(decimal a, decimal b, TimeUnit inputUnit, TimeUnit outputUnit)`

### FormatTime

Format a decimal time value into a human-readable string with rounding:

```csharp
string s1 = time.FormatTime(1.5m, TimeUnit.Hours, 0);
// → "2 hours"

string s2 = time.FormatTime(90m, TimeUnit.Minutes, 1);
// → "1.5 hours"

string s3 = time.FormatTime(45m, TimeUnit.Seconds, 0);
// → "45 seconds"
```

**Signature:** `string FormatTime(decimal value, TimeUnit unit, int decimalPlaces)`

### GetBestUnit

Given a duration in seconds, return the most human-readable unit along with the converted value:

```csharp
var (value, unit) = time.GetBestUnit(3661);
// value: 1.0169..., unit: TimeUnit.Hours

var (value2, unit2) = time.GetBestUnit(90);
// value2: 1.5, unit2: TimeUnit.Minutes
```

**Signature:** `(decimal time, TimeUnit unit) GetBestUnit(decimal seconds)`

### ParseTime

Parse a human-readable string into a decimal value and unit:

```csharp
(decimal value, TimeUnit unit) = time.ParseTime("2.5 hours");
// value = 2.5, unit = TimeUnit.Hours

(decimal v2, TimeUnit u2) = time.ParseTime("90 minutes");
// v2 = 90, u2 = TimeUnit.Minutes
```

**Signature:** `(decimal value, TimeUnit unit) ParseTime(string input)`

### Breakdown

Decompose a total value into a dictionary of component units:

```csharp
var parts = time.Breakdown(3661m, TimeUnit.Seconds);
// → { Hours: 1, Minutes: 1, Seconds: 1 }

var parts2 = time.Breakdown(90m, TimeUnit.Minutes);
// → { Hours: 1, Minutes: 30 }
```

**Signature:** `Dictionary<TimeUnit, decimal> Breakdown(decimal value, TimeUnit sourceUnit)`

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

**Signature:** `decimal Clamp(decimal value, TimeUnit unit, decimal min, decimal max)`

### Compare

Compare two time values (which may be in different units). Returns `-1`, `0`, or `1`:

```csharp
int result = time.Compare(60m, TimeUnit.Minutes, 1m, TimeUnit.Hours);
// → 0 (equal)

int result2 = time.Compare(90m, TimeUnit.Seconds, 2m, TimeUnit.Minutes);
// → -1 (90s < 2min)
```

**Signature:** `int Compare(decimal a, TimeUnit aUnit, decimal b, TimeUnit bUnit)`

### MultiConvert

Convert a value from one unit to multiple target units at once:

```csharp
var results = time.MultiConvert(3600m, TimeUnit.Seconds,
    TimeUnit.Hours, TimeUnit.Minutes, TimeUnit.Days);
// → { Hours: 1, Minutes: 60, Days: 0.0416... }
```

**Signature:** `Dictionary<TimeUnit, decimal> MultiConvert(decimal value, TimeUnit from, params TimeUnit[] targets)`

## Complete Example

```csharp
public class WorklogService(IValiTime time)
{
    public void AnalyzeWorklog(decimal[] taskDurationsInMinutes)
    {
        // Total in hours
        decimal totalHours = time.SumTimes(taskDurationsInMinutes, TimeUnit.Minutes, TimeUnit.Hours);

        // Best display unit
        decimal totalSeconds = time.Convert(totalHours, TimeUnit.Hours, TimeUnit.Seconds);
        var (bestValue, bestUnit) = time.GetBestUnit(totalSeconds);
        string formatted = time.FormatTime(totalHours, TimeUnit.Hours, 1);

        // Break down into components
        var parts = time.Breakdown(totalHours, TimeUnit.Hours);

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
