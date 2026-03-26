---
id: examples
title: Vali-CountDown — Examples
sidebar_label: Examples
---

# Vali-CountDown — Examples

```bash
dotnet add package Vali-CountDown
```

## IsExpired + TimeUntil — Checking whether a deadline has passed

Use `IsExpired` to detect overdue deadlines and `TimeUntil` to get the remaining time in a chosen unit.

```csharp
using System;
using Vali_CountDown.Core;
using Vali_CountDown.Enums;

var countdown = new ValiCountdown();

// Reference point: June 15, 2025 at 12:00
var reference = new DateTime(2025, 6, 15, 12, 0, 0);

var pastDeadline   = new DateTime(2025, 6, 10, 9, 0, 0);  // already expired
var futureDeadline = new DateTime(2025, 6, 20, 17, 0, 0); // still open

bool isPastExpired   = countdown.IsExpired(pastDeadline,   reference);
bool isFutureExpired = countdown.IsExpired(futureDeadline, reference);

Console.WriteLine($"Past deadline expired   : {isPastExpired}");
Console.WriteLine($"Future deadline expired : {isFutureExpired}");

if (!isFutureExpired)
{
    decimal hoursLeft = countdown.TimeUntil(futureDeadline, TimeUnit.Hours,   decimalPlaces: 1);
    decimal daysLeft  = countdown.TimeUntil(futureDeadline, TimeUnit.Days,    decimalPlaces: 2);

    Console.WriteLine($"Hours remaining : {hoursLeft}");
    Console.WriteLine($"Days remaining  : {daysLeft}");
}
// Output:
// Past deadline expired   : True
// Future deadline expired : False
// Hours remaining : 125
// Days remaining  : 5.21
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-CountDown** NuGet package in the fiddle settings.
:::

---

## Progress / ProgressPercent — Tracking progress between start and deadline

`Progress` returns a fraction (0.0–1.0) and `ProgressPercent` returns 0–100, both representing how far along the countdown is.

```csharp
using System;
using Vali_CountDown.Core;

var countdown = new ValiCountdown();

var start    = new DateTime(2025, 6, 1,  0, 0, 0);
var deadline = new DateTime(2025, 6, 30, 0, 0, 0);

// Simulate three checkpoints
var checkpoints = new[]
{
    new DateTime(2025, 6, 1,  0, 0, 0),  // at start
    new DateTime(2025, 6, 15, 0, 0, 0),  // halfway
    new DateTime(2025, 6, 30, 0, 0, 0),  // at deadline
};

Console.WriteLine("Sprint progress");
Console.WriteLine("---------------");

foreach (var point in checkpoints)
{
    decimal fraction = countdown.Progress(start, deadline, point);
    decimal percent  = countdown.ProgressPercent(start, deadline, point);
    int     bar      = (int)(percent / 5);

    Console.WriteLine($"{point:MMM dd} | [{"#".PadRight(bar).PadRight(20, '-')}] {percent:F1}%");
}
// Output:
// Sprint progress
// ---------------
// Jun 01 | [--------------------] 0.0%
// Jun 15 | [##########----------] 48.3%
// Jun 30 | [####################] 100.0%
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-CountDown** NuGet package in the fiddle settings.
:::

---

## Format — Formatting remaining time as a human-readable string

`Format` produces a compact, readable countdown string (e.g. `"3d 4h 20m"`). It returns `"Expired"` when the deadline is in the past.

```csharp
using System;
using Vali_CountDown.Core;

var countdown = new ValiCountdown();

var reference = new DateTime(2025, 6, 15, 10, 0, 0);

var deadlines = new (string Name, DateTime Deadline)[]
{
    ("Code freeze",  new DateTime(2025, 6, 18, 14, 30, 0)),
    ("Beta release", new DateTime(2025, 6, 15,  9, 55, 0)), // expired
    ("Launch day",   new DateTime(2025, 7,  1,  0,  0, 0)),
};

Console.WriteLine("Upcoming deadlines");
Console.WriteLine("------------------");

foreach (var (name, deadline) in deadlines)
{
    string compact     = countdown.Format(deadline, reference, includeSeconds: false);
    string withSeconds = countdown.Format(deadline, reference, includeSeconds: true);

    Console.WriteLine($"{name,-14} | {compact,-15} | {withSeconds}");
}
// Output:
// Upcoming deadlines
// ------------------
// Code freeze    | 3d 4h 30m      | 3d 4h 30m 0s
// Beta release   | Expired        | Expired
// Launch day     | 15d 14h        | 15d 14h 0m 0s
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-CountDown** NuGet package in the fiddle settings.
:::

---

## IsStarted — Checking whether a countdown has already begun

`IsStarted` returns `true` when the given start date is in the past or present relative to now (or a reference date).

```csharp
using System;
using Vali_CountDown.Core;

var countdown = new ValiCountdown();

// Reference point: June 15, 2025
var reference = new DateTime(2025, 6, 15, 0, 0, 0);

var phases = new (string Phase, DateTime Start, DateTime Deadline)[]
{
    ("Planning",     new DateTime(2025, 5, 1),  new DateTime(2025, 5, 31)),
    ("Development",  new DateTime(2025, 6, 1),  new DateTime(2025, 6, 30)),
    ("QA Testing",   new DateTime(2025, 7, 1),  new DateTime(2025, 7, 14)),
    ("Deployment",   new DateTime(2025, 7, 15), new DateTime(2025, 7, 20)),
};

Console.WriteLine($"{"Phase",-14} | Started | Expired | Status");
Console.WriteLine(new string('-', 50));

foreach (var (phase, start, deadline) in phases)
{
    bool started = countdown.IsStarted(start, reference);
    bool expired = countdown.IsExpired(deadline, reference);

    string status = !started          ? "Upcoming"
                  : started && expired ? "Completed"
                  :                      "In progress";

    Console.WriteLine($"{phase,-14} | {started,-7} | {expired,-7} | {status}");
}
// Output:
// Phase          | Started | Expired | Status
// --------------------------------------------------
// Planning       | True    | True    | Completed
// Development    | True    | False   | In progress
// QA Testing     | False   | False   | Upcoming
// Deployment     | False   | False   | Upcoming
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-CountDown** NuGet package in the fiddle settings.
:::
