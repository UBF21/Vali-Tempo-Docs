---
id: overview
title: Vali-Schedule Overview
sidebar_label: Overview
description: Vali-Schedule provides cron-style and recurrence scheduling for .NET — compute next and previous occurrences for daily, weekly, monthly, and custom patterns, with weekend/holiday skipping and occurrence periods.
keywords: [Vali-Schedule, scheduling, recurrence, cron, .NET, NuGet, C#, next occurrence]
---

# Vali-Schedule

`IValiSchedule` is a fluent builder for recurring schedules. It supports daily, weekly, monthly, yearly, and custom recurrence patterns with start date, end conditions, custom predicates, and weekend/holiday skipping. For cron-expression-based schedules, see [Cron Expressions](./cron.md).

## Installation

```bash
dotnet add package Vali-Schedule
```

Compiled targets: `net8.0` · `net9.0` · `net10.0`. Compatible with .NET 6 and .NET 7 via NuGet backward compatibility.

## Registration

```csharp
builder.Services.AddValiSchedule();
// or via the meta-package:
builder.Services.AddValiTempo();
```

:::warning Thread safety
`IValiSchedule` is **not thread-safe** and should **not** be registered as a singleton. Register it as **scoped** or **transient**, or create new instances as needed. The builder pattern is stateful between calls.
:::

## Enums

### RecurrenceType

Defines how often the schedule repeats:

| Value | Description |
|---|---|
| `Daily` | Repeats every N days |
| `Weekly` | Repeats every N weeks on specified days |
| `Monthly` | Repeats every N months on a specified day |
| `Yearly` | Repeats every N years, anchored to the start date's month/day |
| `Custom` | Set implicitly by `WithCustomPredicate` — occurrence validity is fully delegated to the predicate |

### RecurrenceEnd

Defines when the schedule stops:

| Value | Description |
|---|---|
| `Never` | The schedule repeats indefinitely |
| `AfterOccurrences` | Stops after a fixed number of occurrences |
| `OnDate` | Stops on or after a specific end date |

### HolidaySkipStrategy

Defines how an occurrence that lands on an excluded date (weekend and/or holiday) is resolved. Used by `SkipWeekends()`/`SkipHolidays()`:

| Value | Description |
|---|---|
| `NextWorkday` (default) | Moves the occurrence forward, day by day, until a non-excluded date is found. Drops the occurrence if none is found within 366 days. |
| `PreviousWorkday` | Moves the occurrence backward, day by day, until a non-excluded date is found. Drops the occurrence if the search crosses the schedule's start date, or none is found within 366 days. |
| `Skip` | Drops the occurrence entirely — no replacement date is generated. Still consumes one slot of an `EndsAfter` budget. |

## IValiSchedule — Fluent Builder API

### Every

Sets the interval and, implicitly, the recurrence type:

```csharp
schedule.Every(1, TimeUnit.Days)    // every day
schedule.Every(2, TimeUnit.Weeks)   // every 2 weeks
schedule.Every(1, TimeUnit.Months)  // every month
schedule.Every(1, TimeUnit.Years)   // every year
```

**Signature:** `IValiSchedule Every(int interval, TimeUnit unit)`

Only `TimeUnit.Days`, `TimeUnit.Weeks`, `TimeUnit.Months`, and `TimeUnit.Years` are supported. Any other `TimeUnit` (e.g. `Hours`, `Minutes`) throws `ArgumentOutOfRangeException`, as does an `interval` less than 1.

### On

For weekly schedules: specify which days of the week to include:

```csharp
schedule.Every(1, TimeUnit.Weeks)
        .On(DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday)
```

**Signature:** `IValiSchedule On(params DayOfWeek[] days)`

### At

Sets the time of day for occurrences:

```csharp
schedule.Every(1, TimeUnit.Days)
        .At(new TimeOnly(9, 0)) // 9:00 AM
```

**Signature:** `IValiSchedule At(TimeOnly time)`

When never called, occurrences are returned at midnight (00:00:00).

### StartingFrom

Sets the start date (defaults to `DateTime.Today` at query time if never called):

```csharp
schedule.Every(1, TimeUnit.Weeks)
        .StartingFrom(new DateTime(2025, 4, 1))
```

**Signature:** `IValiSchedule StartingFrom(DateTime date)`

### EndsAfter

Stops the schedule after a fixed number of occurrences:

```csharp
schedule.Every(1, TimeUnit.Days)
        .EndsAfter(10) // 10 occurrences then stop
```

**Signature:** `IValiSchedule EndsAfter(int occurrences)`

Throws `ArgumentOutOfRangeException` when `occurrences` is less than 1.

### EndsOn

Stops the schedule on or after a specific date:

```csharp
schedule.Every(1, TimeUnit.Months)
        .EndsOn(new DateTime(2026, 12, 31))
```

**Signature:** `IValiSchedule EndsOn(DateTime date)`

### OnDayOfMonth

For monthly schedules: specify which day of the month:

```csharp
schedule.Every(1, TimeUnit.Months)
        .OnDayOfMonth(15) // 15th of every month
```

**Signature:** `IValiSchedule OnDayOfMonth(int day)`

Throws `ArgumentOutOfRangeException` when `day` is not between 1 and 31.

### WithCustomPredicate

Adds a custom filter — only occurrences where the predicate returns `true` are included. Setting this implicitly switches the recurrence type to `RecurrenceType.Custom`:

```csharp
schedule.WithCustomPredicate(date => date.DayOfWeek != DayOfWeek.Friday)
// Occurs on every date except Fridays
```

**Signature:** `IValiSchedule WithCustomPredicate(Func<DateTime, bool> predicate)`

### SkipWeekends

Excludes Saturday and Sunday from the generated occurrences. A weekend occurrence is moved forward to the next non-weekend, non-holiday day (`HolidaySkipStrategy.NextWorkday`):

```csharp
schedule.Every(1, TimeUnit.Days)
        .SkipWeekends()
```

**Signature:** `IValiSchedule SkipWeekends()`

### SkipHolidays

Excludes dates that are public holidays according to `provider`, resolving collisions per `strategy`. Combines with `SkipWeekends()` if both are configured — a candidate date is resolved against the union of excluded dates, not two independent passes:

```csharp
schedule.Every(1, TimeUnit.Days)
        .SkipWeekends()
        .SkipHolidays(new PeruHolidayProvider(), HolidaySkipStrategy.NextWorkday)
```

**Signature:** `IValiSchedule SkipHolidays(IHolidayProvider provider, HolidaySkipStrategy strategy = HolidaySkipStrategy.NextWorkday)`

Throws `ArgumentNullException` when `provider` is `null`. Requires the `Vali-Holiday` package for a concrete `IHolidayProvider` — see [Vali-Holiday](../vali-holiday/overview.md).

### Build

Validates the current configuration and returns the schedule, ready for use:

```csharp
var sched = schedule
    .Every(1, TimeUnit.Weeks)
    .On(DayOfWeek.Monday)
    .At(new TimeOnly(9, 0))
    .StartingFrom(new DateTime(2025, 1, 6))
    .Build();
```

**Signature:** `IValiSchedule Build()`

Throws `InvalidOperationException` when `RecurrenceType.Weekly` is set with no days configured, or when `RecurrenceType.Custom` is set (implicitly, via `WithCustomPredicate`) but no predicate was provided before calling `Build()`.

## Query Methods

Once the schedule is built, use these methods to query occurrences. All scan a 5-year (1825-day) window from the reference date.

### NextOccurrence

Returns the next occurrence on or after the given reference date:

```csharp
DateTime? next = sched.NextOccurrence(DateTime.Today);
// → null if the schedule has ended or no occurrence exists within the 5-year window
```

**Signature:** `DateTime? NextOccurrence(DateTime reference)`

### PreviousOccurrence

Returns the most recent occurrence strictly before the given reference date:

```csharp
DateTime? prev = sched.PreviousOccurrence(DateTime.Today);
```

**Signature:** `DateTime? PreviousOccurrence(DateTime reference)`

### OccursOn

Returns `true` if the schedule has an occurrence on the given date, regardless of time of day:

```csharp
bool occurs = sched.OccursOn(new DateTime(2025, 4, 7));
```

**Signature:** `bool OccursOn(DateTime date)`

### Occurrences

Enumerates up to `limit` occurrences starting on or after the given reference date (defaults to 10):

```csharp
IEnumerable<DateTime> next5 = sched.Occurrences(DateTime.Today, limit: 5);

foreach (var occ in next5)
    Console.WriteLine(occ.ToString("g"));
```

**Signature:** `IEnumerable<DateTime> Occurrences(DateTime reference, int limit = 10)`

### OccurrencesInRange

Enumerates all occurrences within the inclusive date range `[from, to]`:

```csharp
IEnumerable<DateTime> q2Meetings = sched.OccurrencesInRange(
    new DateTime(2025, 4, 1), new DateTime(2025, 6, 30));
```

**Signature:** `IEnumerable<DateTime> OccurrencesInRange(DateTime from, DateTime to)`

Throws `ArgumentException` when `from` is later than `to`.

### OccurrencePeriods

Pairs each occurrence in `[from, to]` with the schedule's next real occurrence to produce a sequence of closed `DateRange` periods. Each period is `[occurrence_i, occurrence_(i+1) − 1 tick]`. The closing occurrence may fall beyond `to` — a period is never truncated at the query boundary. If the last occurrence in range has no further real occurrence (the schedule ended), it produces no period:

```csharp
IEnumerable<DateRange> periods = sched.OccurrencePeriods(
    new DateTime(2025, 1, 1), new DateTime(2025, 3, 31));

foreach (var period in periods)
    Console.WriteLine($"{period.Start:yyyy-MM-dd} → {period.End:yyyy-MM-dd}");
```

**Signature:** `IEnumerable<DateRange> OccurrencePeriods(DateTime from, DateTime to)`

Throws `ArgumentException` when `from` is later than `to`. Requires the `Vali-Range` package for `DateRange` — see [Vali-Range](../vali-range/overview.md).

## Complete Examples

### Weekly standup

```csharp
public class StandupScheduler
{
    public IValiSchedule BuildStandup(DateTime startDate)
    {
        return new ValiSchedule()
            .Every(1, TimeUnit.Weeks)
            .On(DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday,
                DayOfWeek.Thursday, DayOfWeek.Friday)
            .At(new TimeOnly(9, 30))
            .StartingFrom(startDate)
            .Build();
    }

    public void PrintNextStandups(IValiSchedule sched, int count = 5)
    {
        Console.WriteLine($"Next {count} standups:");
        foreach (var occ in sched.Occurrences(DateTime.Today, count))
            Console.WriteLine($"  {occ:ddd, MMM dd HH:mm}");
    }
}
```

### Monthly payroll run, skipping weekends and holidays

```csharp
public IValiSchedule BuildPayroll(int dayOfMonth = 25)
{
    return new ValiSchedule()
        .Every(1, TimeUnit.Months)
        .OnDayOfMonth(dayOfMonth)
        .At(new TimeOnly(8, 0))
        .StartingFrom(new DateTime(2025, 1, 1))
        .SkipWeekends()
        .SkipHolidays(new PeruHolidayProvider())
        .Build();
}
```

### Yearly reminder with end condition

```csharp
var reminder = new ValiSchedule()
    .Every(1, TimeUnit.Years)
    .At(new TimeOnly(10, 0))
    .StartingFrom(new DateTime(2025, 3, 23))
    .EndsAfter(5) // 5 years only
    .Build();

DateTime? nextReminder = reminder.NextOccurrence(DateTime.Today);
Console.WriteLine($"Next annual reminder: {nextReminder:MMM dd, yyyy}");
```
