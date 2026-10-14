---
id: cron
title: Vali-Schedule — Cron Expressions
sidebar_label: Cron Expressions
description: CronSchedule parses standard 5-field cron expressions into an IValiSchedule implementation — minute-granularity recurrence with ranges, steps, lists, and month/day-of-week name aliases.
keywords: [Vali-Schedule, cron, cron expression, CronSchedule, .NET, NuGet, C#]
---

# Cron Expressions

`CronSchedule` (namespace `Vali_Schedule.Cron`) parses a standard, whitespace-separated **5-field cron expression** — minute, hour, day-of-month, month, day-of-week — into a ready-to-query `IValiSchedule`. It is a separate, independent implementation of `IValiSchedule` rather than a configuration of `ValiSchedule`, because a cron schedule can fire more than once per day (e.g. `"*/15 9-17 * * MON-FRI"` fires 33 times on a matching weekday), while `ValiSchedule` emits at most one occurrence per day at a single configured time.

Zero external dependencies — the parser and scanner are implemented entirely within `Vali-Schedule`.

## Installation

```bash
dotnet add package Vali-Schedule
```

Compiled targets: `net8.0` · `net9.0` · `net10.0`. Compatible with .NET 6 and .NET 7 via NuGet backward compatibility.

## Parsing an expression

```csharp
using Vali_Schedule.Cron;

CronSchedule schedule = CronSchedule.Parse("*/15 9-17 * * MON-FRI");
```

**Signature:** `static CronSchedule Parse(string cronExpression)`

Throws `ArgumentNullException` when `cronExpression` is null/whitespace, and `CronFormatException` when it does not have exactly 5 fields, or any field contains a token outside that field's supported syntax or value range.

### TryParse

For untrusted or user-supplied input, use `TryParse` to avoid a try/catch:

```csharp
if (CronSchedule.TryParse(userInput, out var schedule, out var error))
{
    // schedule is ready to query
}
else
{
    Console.WriteLine($"Invalid cron expression: {error}");
}
```

**Signature:** `static bool TryParse(string cronExpression, out CronSchedule? schedule, out string? error)`

`error` is a human-readable description of the first parse failure encountered.

## Field syntax

Each of the 5 fields accepts a comma-separated list of components. Each component is one of:

| Syntax | Meaning | Example |
|---|---|---|
| `*` | Every value in the field's range | `* * * * *` (every minute) |
| `N` | A single value | `0 9 * * *` (9:00 every day) |
| `N-M` | An inclusive range | `0 9-17 * * *` (9:00–17:00 every hour) |
| `*/step` | Every `step`-th value starting at the field's minimum | `*/15 * * * *` (every 15 minutes) |
| `N/step` | Every `step`-th value starting at `N`, through the field's maximum | `10/20 * * * *` (minutes 10, 30, 50) |
| `N-M/step` | Every `step`-th value within an explicit range | `0 9-17/2 * * *` (9:00, 11:00, 13:00, 15:00, 17:00) |
| `a,b,c` | A list — any component form, comma-separated | `0 8,12,18 * * *` |

### Field bounds and aliases

| Field | Range | Name aliases |
|---|---|---|
| Minute | 0–59 | — |
| Hour | 0–23 | — |
| Day-of-month | 1–31 | — |
| Month | 1–12 | `JAN`–`DEC` (case-insensitive) |
| Day-of-week | 0–6 (0 = Sunday) | `SUN`–`SAT` (case-insensitive); `7` is also accepted as an alias for Sunday |

A descending range (e.g. `17-9`) or a step that is not a positive integer throws `CronFormatException` identifying the offending field and token.

### Day-of-month / day-of-week OR rule

When **both** the day-of-month and day-of-week fields are restricted (neither is `*`), a date matches if it satisfies **either** field — the standard cron OR-combination rule. When only one of the two is restricted, only that field is required.

## Builder methods — supported vs. unsupported

`CronSchedule` implements `IValiSchedule`, but several builder methods don't make sense once the recurrence is already fully expressed in the cron string — calling them throws `NotSupportedException`:

| Method | Behavior on `CronSchedule` |
|---|---|
| `Every(int, TimeUnit)` | **Throws** `NotSupportedException` — express the interval in the cron string instead (e.g. `"*/15 * * * *"`). |
| `On(params DayOfWeek[])` | **Throws** `NotSupportedException` — days of week are already in the 5th field. |
| `At(TimeOnly)` | **Throws** `NotSupportedException` — time of day is already in the minute/hour fields, and cron can fire more than once per day. |
| `OnDayOfMonth(int)` | **Throws** `NotSupportedException` — day of month is already in the 3rd field. |
| `StartingFrom(DateTime)` | Supported. Sets the inclusive lower bound; defaults to today, same convention as `ValiSchedule`. |
| `EndsAfter(int)` | Supported. Throws `ArgumentOutOfRangeException` when `occurrences` is less than 1. |
| `EndsOn(DateTime)` | Supported. |
| `WithCustomPredicate(Func<DateTime, bool>)` | Supported, and additive — each call appends another predicate, all evaluated with logical AND on top of the cron match. Throws `ArgumentNullException` for a null predicate. |
| `Build()` | Supported — a no-op; the expression is already fully parsed and validated at `Parse()` time. Returns the current instance. |

### SkipWeekends / SkipHolidays — drop, not shift

Unlike `ValiSchedule.SkipWeekends()`, which shifts an excluded occurrence forward to the next workday, `CronSchedule.SkipWeekends()` and `SkipHolidays()` **drop** the excluded occurrence entirely (equivalent to `HolidaySkipStrategy.Skip`'s semantics — the `strategy` parameter on `SkipHolidays` is accepted for interface compatibility but has no other effect). A cron schedule can fire multiple times per day, so "shift to the next workday, same time" would relocate every one of that day's occurrences onto the following day, colliding with that day's own native occurrences.

```csharp
var sched = CronSchedule.Parse("0 9 * * MON-FRI")
    .SkipWeekends() // redundant here since MON-FRI already excludes weekends, but composes with SkipHolidays
    .SkipHolidays(new PeruHolidayProvider());
```

## DST / wall-clock caveat

`CronSchedule` operates purely on `DateTime` wall-clock values and has no timezone awareness. On a "spring forward" transition, an hour configured in the cron expression may not exist that day; on "fall back", it may be matched twice if evaluated against distinct `DateTimeKind`-ambiguous instants. Convert to UTC (or a fixed zone) before querying if DST-correct evaluation is required.

## Query methods

`CronSchedule` exposes the same `IValiSchedule` query surface as `ValiSchedule` — `NextOccurrence`, `PreviousOccurrence`, `OccursOn`, `Occurrences`, `OccurrencesInRange`, `OccurrencePeriods` — all bounded by `StartingFrom`/`EndsAfter`/`EndsOn`/`WithCustomPredicate` and scanning up to 5 years. See [Query Methods](./overview.md#query-methods) on the overview page for the shared contract; the notes below cover cron-specific behavior.

### OccursOn

Only the calendar fields (month, day-of-month, day-of-week) are evaluated — equivalent to "regardless of what minute/hour it fires at":

```csharp
bool firesToday = sched.OccursOn(DateTime.Today);
```

### OccurrencesInRange

Dates are compared by day — the time-of-day components of `from`/`to` narrow the first/last day considered, but every matching minute within the range's last day is still included.

## Complete example

```csharp
using System;
using Vali_Schedule.Cron;
using Vali_Holiday.Providers.LatinAmerica;

// Every 15 minutes, 9am-5pm, Monday through Friday, skipping Peruvian holidays
var sched = CronSchedule.Parse("*/15 9-17 * * MON-FRI")
    .SkipHolidays(new PeruHolidayProvider())
    .StartingFrom(new DateTime(2025, 6, 2)); // Monday

Console.WriteLine("Next 5 polling windows:");
foreach (var occ in sched.Occurrences(new DateTime(2025, 6, 2), 5))
    Console.WriteLine($"  {occ:ddd MMM dd yyyy HH:mm}");
// Output:
// Next 5 polling windows:
//   Mon Jun 02 2025 09:00
//   Mon Jun 02 2025 09:15
//   Mon Jun 02 2025 09:30
//   Mon Jun 02 2025 09:45
//   Mon Jun 02 2025 10:00
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Schedule** and **Vali-Holiday** NuGet packages in the fiddle settings.
:::
