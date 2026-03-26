---
id: overview
title: Vali-CountDown Overview
sidebar_label: Overview
---

# Vali-CountDown

`IValiCountDown` provides deadline tracking, countdown calculation, elapsed time measurement, and progress reporting. All methods accept an optional reference time parameter, allowing you to test against any point in time rather than always using `DateTime.Now`.

## Installation

```bash
dotnet add package Vali-CountDown
```

## Registration

```csharp
builder.Services.AddValiCountDown();
// or via the meta-package:
builder.Services.AddValiTempo();
```

## IValiCountDown API

### IsExpired

Return `true` if the deadline has already passed:

```csharp
bool expired = countdown.IsExpired(deadline);
bool expiredAt = countdown.IsExpired(deadline, reference: DateTime.Now);
```

**Signature:** `bool IsExpired(DateTime deadline)` / `bool IsExpired(DateTime deadline, DateTime reference)`

### TimeUntil

Return the amount of time remaining until the deadline in the specified unit. Returns `0` if already expired:

```csharp
decimal remaining = countdown.TimeUntil(deadline, TimeUnit.Hours);
// → e.g. 47.5

decimal remainingRounded = countdown.TimeUntil(deadline, TimeUnit.Days, decimalPlaces: 1);
// → e.g. 2.0
```

**Signature:** `decimal TimeUntil(DateTime deadline, TimeUnit unit, int? decimalPlaces = null)`

### TimeElapsed

Return the amount of time that has elapsed since the given point, in the specified unit:

```csharp
decimal elapsed = countdown.TimeElapsed(startDate, TimeUnit.Hours);
// → How many hours since startDate
```

**Signature:** `decimal TimeElapsed(DateTime from, TimeUnit unit, int? decimalPlaces = null)`

> **Note:** When `from` is in the future, returns 0. Use `IsStarted()` to check whether elapsed time is meaningful.

### Progress

Return the fractional progress (0.0–1.0) between start and end. Returns `0` before start; `1` at or after end:

```csharp
decimal progress = countdown.Progress(startDate, deadline);
// → 0.0 at start, 1.0 at deadline
```

**Signature:** `decimal Progress(DateTime start, DateTime end)` / `decimal Progress(DateTime start, DateTime end, DateTime reference)`

### ProgressPercent

Return the progress as a percentage (0–100):

```csharp
decimal pct = countdown.ProgressPercent(startDate, deadline);
// → 0.0 to 100.0
```

**Signature:** `decimal ProgressPercent(DateTime start, DateTime end)`

### Breakdown

Decompose the remaining time into component units. Returns all zeros if the deadline has expired:

```csharp
var parts = countdown.Breakdown(deadline);
// → Dictionary with Days, Hours, Minutes, Seconds, Milliseconds keys

Console.WriteLine($"{parts[TimeUnit.Days]}d {parts[TimeUnit.Hours]}h {parts[TimeUnit.Minutes]}m");
```

**Signature:** `Dictionary<TimeUnit, decimal> Breakdown(DateTime deadline)`

### Format

Format the time remaining until the deadline as a human-readable string (e.g., `"5d 3h 20m"`). Returns `"Expired"` if the deadline has already passed. Only non-zero components are included.

When between 0 and 1 second remain, returns `"< 1s"`.

```csharp
string formatted = countdown.Format(deadline);
// → "2d 3h 20m"

string withSeconds = countdown.Format(deadline, includeSeconds: true);
// → "2d 3h 20m 15s"
```

**Signature:** `string Format(DateTime deadline, bool includeSeconds = false)`

### IsWithin

Return `true` if the deadline is within a given amount (expressed in the specified unit) from now. Returns `false` if the deadline has already expired:

```csharp
bool urgent = countdown.IsWithin(deadline, 24, TimeUnit.Hours);
// → true if deadline is within the next 24 hours

bool soonWarning = countdown.IsWithin(deadline, 7, TimeUnit.Days);
```

**Signature:** `bool IsWithin(DateTime deadline, decimal amount, TimeUnit unit)`

### IsStarted

Return `true` if `from` is in the past or present (i.e., elapsed time is meaningful):

```csharp
bool started = countdown.IsStarted(projectStart);
// → true when DateTime.Now >= projectStart
```

**Signature:** `bool IsStarted(DateTime from)`

## Complete Example

```csharp
public class TaskDashboard(IValiCountDown countdown)
{
    public void DisplayTaskStatus(string taskName, DateTime created, DateTime deadline)
    {
        bool isExpired = countdown.IsExpired(deadline);

        if (isExpired)
        {
            decimal overdue = countdown.TimeElapsed(deadline, TimeUnit.Hours, decimalPlaces: 1);
            Console.WriteLine($"[OVERDUE] {taskName} — overdue by {overdue:F1} hours");
            return;
        }

        decimal progressPct = countdown.ProgressPercent(created, deadline);
        bool    isUrgent    = countdown.IsWithin(deadline, 48, TimeUnit.Hours);

        var parts = countdown.Breakdown(deadline);

        Console.WriteLine($"Task:       {taskName}");
        Console.WriteLine($"Progress:   {progressPct:F1}%");
        Console.WriteLine($"Remaining:  {parts[TimeUnit.Days]}d {parts[TimeUnit.Hours]}h {parts[TimeUnit.Minutes]}m");
        Console.WriteLine($"Formatted:  {countdown.Format(deadline)}");

        if (isUrgent)
            Console.WriteLine("  *** URGENT: less than 48 hours ***");
    }
}
```
