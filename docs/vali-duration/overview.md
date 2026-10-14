---
id: overview
title: Vali-Duration Overview
sidebar_label: Overview
description: Vali-Duration provides human-readable duration formatting for .NET — convert TimeSpan and decimal durations into natural language strings.
keywords: [Vali-Duration, duration formatting, TimeSpan, .NET, NuGet, C#, human readable]
---

# Vali-Duration

`ValiDuration` is a high-precision decimal duration value type. It provides factory methods, arithmetic operators, unit conversion, formatting, and seamless interop with `TimeSpan`.

## Installation

```bash
dotnet add package Vali-Duration
```

## ValiDuration Struct

`ValiDuration` stores its value as `decimal` seconds internally, avoiding floating-point drift in arithmetic operations.

### Factory Methods

| Method | Description |
|---|---|
| `ValiDuration.FromMilliseconds(decimal)` | Create from milliseconds |
| `ValiDuration.FromSeconds(decimal)` | Create from seconds |
| `ValiDuration.FromMinutes(decimal)` | Create from minutes |
| `ValiDuration.FromHours(decimal)` | Create from hours |
| `ValiDuration.FromDays(decimal)` | Create from days |
| `ValiDuration.FromWeeks(decimal)` | Create from weeks (7-day) |
| `ValiDuration.FromMonths(decimal)` | Create from months (30.4375 days average) |
| `ValiDuration.FromYears(decimal)` | Create from years (365.25 days average) |
| `ValiDuration.FromTimeSpan(TimeSpan)` | Create from a `TimeSpan` |
| `ValiDuration.Zero` | A zero-length duration |

```csharp
var d1 = ValiDuration.FromHours(2.5m);
var d2 = ValiDuration.FromMinutes(90m);
var d3 = ValiDuration.FromTimeSpan(TimeSpan.FromDays(7));
var d4 = ValiDuration.Zero;
```

### Properties

| Property | Type | Description |
|---|---|---|
| `TotalMilliseconds` | `decimal` | Total value in milliseconds |
| `TotalSeconds` | `decimal` | Total value in seconds |
| `TotalMinutes` | `decimal` | Total value in minutes |
| `TotalHours` | `decimal` | Total value in hours |
| `TotalDays` | `decimal` | Total value in days |

```csharp
var d = ValiDuration.FromHours(2.5m);
Console.WriteLine(d.TotalMinutes);      // → 150
Console.WriteLine(d.TotalMilliseconds); // → 9_000_000
```

### Instance Methods

#### As

Convert the duration to a decimal value in the specified unit:

```csharp
var d = ValiDuration.FromDays(1.5m);
decimal hours = d.As(TimeUnit.Hours);   // → 36
decimal mins  = d.As(TimeUnit.Minutes); // → 2160
```

**Signature:** `decimal As(TimeUnit unit)`

#### Format

Format the duration as a human-readable string:

```csharp
var d = ValiDuration.FromMinutes(90m);
Console.WriteLine(d.Format());         // → "1.50 h"
Console.WriteLine(d.Format(1));        // → "1.5 h"
```

`Format` always picks a single best-fit unit (weeks, days, hours, minutes, seconds, or milliseconds) — it never combines units like `"1h 30m"`.

**Signature:** `string Format(int decimalPlaces = 2)`

#### ToTimeSpan

Convert to a `TimeSpan`. Note: `TimeSpan` uses `double` internally, so very large or very precise values may lose precision:

```csharp
var d  = ValiDuration.FromHours(2.5m);
TimeSpan ts = d.ToTimeSpan();
// → TimeSpan of 2h 30m
```

**Signature:** `TimeSpan ToTimeSpan()`

### Arithmetic Operators

`ValiDuration` supports all standard arithmetic operations:

```csharp
var a = ValiDuration.FromHours(1.5m);
var b = ValiDuration.FromMinutes(30m);

ValiDuration sum  = a + b;  // 2 hours
ValiDuration diff = a - b;  // 1 hour
ValiDuration scaled = a * 2m; // 3 hours
ValiDuration halved = a / 2m; // 45 minutes

bool equal   = a == b;
bool greater = a > b;
bool less    = a < b;
```

### Comparison Operators

All six comparison operators are supported (`==`, `!=`, `<`, `<=`, `>`, `>=`):

```csharp
var oneHour  = ValiDuration.FromHours(1m);
var twoHours = ValiDuration.FromHours(2m);

bool result = oneHour < twoHours; // → true
```

### Implicit Conversions

```csharp
// From TimeSpan
ValiDuration d = TimeSpan.FromHours(2); // implicit

// To TimeSpan
TimeSpan ts = ValiDuration.FromMinutes(90m); // implicit
```

### Parsing (IParsable\<ValiDuration\>)

`ValiDuration` implements `IParsable<ValiDuration>`, sharing its grammar with `Vali-Time`'s `IValiTime.ParseTime` via the public `DurationStringParser`. It accepts colon-separated clock notation (`"hh:mm:ss"`, `"mm:ss"`) or combinable unit-labelled tokens (`"2d 4h 30m 15s"`, `"1h 30m"`, `"500ms"`, `"90 minutes"`).

```csharp
ValiDuration a = ValiDuration.Parse("1h 30m");          // 1.5 hours
ValiDuration b = ValiDuration.Parse("45:30");           // mm:ss → 45m 30s
ValiDuration c = ValiDuration.Parse("2d 4h 30m 15s");   // combined tokens

bool ok   = ValiDuration.TryParse("2h", null, out ValiDuration result);           // true
bool fail = ValiDuration.TryParse("not-a-duration", null, out ValiDuration zero); // false, zero == ValiDuration.Zero
```

Recognised unit tokens: `ms`/`milliseconds`, `s`/`sec`/`seconds`, `m`/`min`/`minutes`, `h`/`hr`/`hours`, `d`/`days`, `w`/`weeks`, `mo`/`months`, `yr`/`years`. Parsing is always culture-invariant and case-insensitive.

**Signature:** `static ValiDuration Parse(string s, IFormatProvider? provider = null)` / `static bool TryParse(string? s, IFormatProvider? provider, out ValiDuration result)`

### IFormattable

`ValiDuration` also implements `IFormattable`. When the format string parses as a non-negative integer, it is used as the `decimalPlaces` argument to `Format(int)`; any other value (including `null` or `"G"`) falls back to the 2-decimal default:

```csharp
var d = ValiDuration.FromMinutes(90m); // 1.5 hours

string oneDecimal = d.ToString("1");  // → "1.5 h"
string defaultFmt = d.ToString();     // → "1.50 h"
string interp      = $"{d:1}";        // → "1.5 h"
```

**Signature:** `string ToString(string? format, IFormatProvider? formatProvider)`

## Complete Example

```csharp
public class BillingService
{
    public void CalculateBilling(TimeSpan[] sessionDurations, decimal hourlyRate)
    {
        // Convert all sessions to ValiDuration
        var durations = sessionDurations
            .Select(ValiDuration.FromTimeSpan)
            .ToArray();

        // Sum all sessions
        var total = durations.Aggregate(ValiDuration.Zero, (acc, d) => acc + d);

        Console.WriteLine($"Total time:    {total.Format(1)}");
        Console.WriteLine($"Total hours:   {total.TotalHours:F2}");

        // Calculate billing
        decimal billableHours = total.As(TimeUnit.Hours);
        decimal amount = billableHours * hourlyRate;

        Console.WriteLine($"Billable:      {billableHours:F2}h × ${hourlyRate}/h = ${amount:F2}");

        // Check if over 8-hour workday
        var workday = ValiDuration.FromHours(8m);
        if (total > workday)
        {
            ValiDuration overtime = total - workday;
            Console.WriteLine($"Overtime:      {overtime.Format(1)}");
        }
    }
}
```
