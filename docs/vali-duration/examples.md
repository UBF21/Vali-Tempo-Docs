---
id: examples
title: Vali-Duration — Examples
sidebar_label: Examples
---

# Vali-Duration — Examples

```bash
dotnet add package Vali-Duration
```

## FromTimeSpan + Format — Measuring elapsed time with Stopwatch

Capture the elapsed time of an operation using `Stopwatch`, wrap it in a `ValiDuration`, and format it as a human-readable string.

```csharp
using System;
using System.Diagnostics;
using Vali_Duration.Models;

var sw = Stopwatch.StartNew();

// Simulate work
long sum = 0;
for (int i = 0; i < 10_000_000; i++)
    sum += i;

sw.Stop();

ValiDuration elapsed = ValiDuration.FromTimeSpan(sw.Elapsed);

Console.WriteLine($"Raw milliseconds : {elapsed.TotalMilliseconds:F3} ms");
Console.WriteLine($"Formatted (0 dp) : {elapsed.Format()}");
Console.WriteLine($"Formatted (2 dp) : {elapsed.Format(2)}");
Console.WriteLine($"Sum result       : {sum}");
// Example output:
// Raw milliseconds : 18.472 ms
// Formatted (0 dp) : 18ms
// Formatted (2 dp) : 0.02 seconds
// Sum result       : 49999995000000
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Duration** NuGet package in the fiddle settings.
:::

---

## Arithmetic operators — Adding and subtracting ValiDuration values

Combine multiple durations using the `+` and `-` operators, and scale them with `*` and `/`.

```csharp
using System;
using Vali_Duration.Models;

var meeting    = ValiDuration.FromMinutes(45m);
var break_     = ValiDuration.FromMinutes(15m);
var deepWork   = ValiDuration.FromHours(2m);

ValiDuration totalWork   = meeting + deepWork;          // 2h 45m
ValiDuration netWork     = totalWork - break_;          // 2h 30m
ValiDuration doubleShift = netWork * 2m;                // 5h
ValiDuration halfShift   = netWork / 2m;                // 1h 15m

Console.WriteLine($"Meeting + Deep work : {totalWork.Format()}");
Console.WriteLine($"Minus break         : {netWork.Format()}");
Console.WriteLine($"Double shift        : {doubleShift.Format()}");
Console.WriteLine($"Half shift          : {halfShift.Format()}");
// Output:
// Meeting + Deep work : 2h 45m
// Minus break         : 2h 30m
// Double shift        : 5h
// Half shift          : 1h 15m
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Duration** NuGet package in the fiddle settings.
:::

---

## As(TimeUnit) — Converting to a specific unit

Use `As(TimeUnit)` to extract the duration expressed as a `decimal` in any supported unit.

```csharp
using System;
using Vali_Duration.Models;
using Vali_Duration.Enums;

var sprint = ValiDuration.FromDays(14m);

decimal inHours   = sprint.As(TimeUnit.Hours);
decimal inMinutes = sprint.As(TimeUnit.Minutes);
decimal inWeeks   = sprint.As(TimeUnit.Weeks);

Console.WriteLine($"Sprint duration");
Console.WriteLine($"  Days    : {sprint.TotalDays}");
Console.WriteLine($"  Hours   : {inHours}");
Console.WriteLine($"  Minutes : {inMinutes}");
Console.WriteLine($"  Weeks   : {inWeeks}");

// Billing example — hourly rate
decimal hourlyRate    = 95m;
decimal billableHours = sprint.As(TimeUnit.Hours);
decimal totalAmount   = billableHours * hourlyRate;

Console.WriteLine($"Billing @ ${hourlyRate}/h : ${totalAmount:F2}");
// Output:
// Sprint duration
//   Days    : 14
//   Hours   : 336
//   Minutes : 20160
//   Weeks   : 2
// Billing @ $95/h : $31920.00
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Duration** NuGet package in the fiddle settings.
:::

---

## Comparison operators — Comparing durations

All six comparison operators (`==`, `!=`, `<`, `<=`, `>`, `>=`) work directly on `ValiDuration` values.

```csharp
using System;
using Vali_Duration.Models;

var workday   = ValiDuration.FromHours(8m);
var shortDay  = ValiDuration.FromHours(6m);
var overtime  = ValiDuration.FromHours(10m);
var anotherWD = ValiDuration.FromMinutes(480m); // same as workday

Console.WriteLine($"shortDay  < workday   : {shortDay < workday}");
Console.WriteLine($"overtime  > workday   : {overtime > workday}");
Console.WriteLine($"workday  == anotherWD : {workday == anotherWD}");
Console.WriteLine($"shortDay != workday   : {shortDay != workday}");
Console.WriteLine($"overtime >= workday   : {overtime >= workday}");
Console.WriteLine($"shortDay <= workday   : {shortDay <= workday}");

var sessions = new[]
{
    ValiDuration.FromMinutes(90m),
    ValiDuration.FromHours(3m),
    ValiDuration.FromMinutes(45m),
};

foreach (var s in sessions)
{
    string label = s > workday   ? "OVERTIME"
                 : s == workday  ? "FULL DAY"
                 :                 "PARTIAL";
    Console.WriteLine($"  {s.Format()} => {label}");
}
// Output:
// shortDay  < workday   : True
// overtime  > workday   : True
// workday  == anotherWD : True
// shortDay != workday   : True
// overtime >= workday   : True
// shortDay <= workday   : True
//   1h 30m => PARTIAL
//   3h => PARTIAL
//   45m => PARTIAL
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Duration** NuGet package in the fiddle settings.
:::
