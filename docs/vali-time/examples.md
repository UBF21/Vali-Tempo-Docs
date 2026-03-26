---
id: examples
title: Vali-Time — Examples
sidebar_label: Examples
---

# Vali-Time — Examples

```bash
dotnet add package Vali-Time
```

## Convert — Seconds to Hours

Convert a raw value from one time unit to another using decimal-precision arithmetic.

```csharp
using Vali_Time.Core;
using Vali_Time.Enums;

var vt = new ValiTime();

decimal hours = vt.Convert(7200m, TimeUnit.Seconds, TimeUnit.Hours);

Console.WriteLine($"{hours} hours"); // → 2 hours
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Time** NuGet package in the fiddle settings.
:::

---

## SumTimes — Add Durations from Multiple Tasks

Sum a list of task durations expressed in minutes and get the total in hours.

```csharp
using Vali_Time.Core;
using Vali_Time.Enums;

var vt = new ValiTime();

decimal[] taskMinutes = { 45m, 90m, 30m, 75m };

decimal totalHours = vt.SumTimes(taskMinutes, TimeUnit.Minutes, TimeUnit.Hours);

Console.WriteLine($"Total work: {totalHours} hours"); // → 4 hours
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Time** NuGet package in the fiddle settings.
:::

---

## ParseTime — Parse a Human-Readable Duration String

Parse a plain-text duration string into a typed value and unit, ready for further processing.

```csharp
using Vali_Time.Core;
using Vali_Time.Enums;

var vt = new ValiTime();

(decimal value, TimeUnit unit) = vt.ParseTime("1.5 hours");

decimal inMinutes = vt.Convert(value, unit, TimeUnit.Minutes);

Console.WriteLine($"Parsed: {value} {unit}");   // → Parsed: 1.5 Hours
Console.WriteLine($"In minutes: {inMinutes}");  // → In minutes: 90
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Time** NuGet package in the fiddle settings.
:::

---

## Breakdown — Decompose a Duration into Components

Decompose a total number of seconds into its constituent hours, minutes, and seconds.

```csharp
using Vali_Time.Core;
using Vali_Time.Enums;

var vt = new ValiTime();

var parts = vt.Breakdown(5461m, TimeUnit.Seconds);

Console.WriteLine($"Hours:   {parts[TimeUnit.Hours]}");    // → 1
Console.WriteLine($"Minutes: {parts[TimeUnit.Minutes]}");  // → 31
Console.WriteLine($"Seconds: {parts[TimeUnit.Seconds]}");  // → 1
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Time** NuGet package in the fiddle settings.
:::

---

## GetBestUnit — Detect the Most Readable Unit for a Duration

Given a duration in seconds, automatically determine the most human-readable unit and its converted value.

```csharp
using Vali_Time.Core;
using Vali_Time.Enums;

var vt = new ValiTime();

// 5400 seconds → 1.5 hours
var (value, unit) = vt.GetBestUnit(5400m);
string formatted = vt.FormatTime(value, unit, 1);

Console.WriteLine($"Best unit: {unit}");       // → Hours
Console.WriteLine($"Formatted: {formatted}");  // → 1.5 hours

// 75 seconds → 1.25 minutes
var (value2, unit2) = vt.GetBestUnit(75m);
Console.WriteLine($"Best unit: {unit2}");      // → Minutes
Console.WriteLine($"Value: {value2}");         // → 1.25
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Time** NuGet package in the fiddle settings.
:::
