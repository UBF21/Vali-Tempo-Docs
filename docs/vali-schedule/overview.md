---
id: overview
title: Vali-Schedule Overview
sidebar_label: Overview
---

# Vali-Schedule

`IValiSchedule` is a fluent builder for recurring schedules. It supports daily, weekly, monthly, and yearly recurrence patterns with start date, end conditions, and custom predicates.

## Installation

```bash
dotnet add package Vali-Schedule
```

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
| `Yearly` | Repeats every N years on a specified month and day |

### RecurrenceEnd

Defines when the schedule stops:

| Value | Description |
|---|---|
| `Never` | The schedule repeats indefinitely |
| `AfterOccurrences` | Stops after a fixed number of occurrences |
| `OnDate` | Stops on or after a specific end date |

## IValiSchedule — Fluent Builder API

### Every

Set the interval and recurrence type:

```csharp
schedule.Every(1, RecurrenceType.Daily)    // every day
schedule.Every(2, RecurrenceType.Weekly)   // every 2 weeks
schedule.Every(1, RecurrenceType.Monthly)  // every month
schedule.Every(1, RecurrenceType.Yearly)   // every year
```

**Signature:** `IValiSchedule Every(int interval, RecurrenceType type)`

### On

For weekly schedules: specify which days of the week to include:

```csharp
schedule.Every(1, RecurrenceType.Weekly)
        .On(DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday)
```

**Signature:** `IValiSchedule On(params DayOfWeek[] days)`

### At

Set the time of day for occurrences:

```csharp
schedule.Every(1, RecurrenceType.Daily)
        .At(9, 0) // 9:00 AM
```

**Signature:** `IValiSchedule At(int hour, int minute = 0, int second = 0)`

### StartingFrom

Set the start date (default is `DateTime.Today`):

```csharp
schedule.Every(1, RecurrenceType.Weekly)
        .StartingFrom(new DateTime(2025, 4, 1))
```

**Signature:** `IValiSchedule StartingFrom(DateTime startDate)`

### EndsAfter

Stop the schedule after a fixed number of occurrences:

```csharp
schedule.Every(1, RecurrenceType.Daily)
        .EndsAfter(10) // 10 occurrences then stop
```

**Signature:** `IValiSchedule EndsAfter(int occurrences)`

### EndsOn

Stop the schedule on or after a specific date:

```csharp
schedule.Every(1, RecurrenceType.Monthly)
        .EndsOn(new DateTime(2026, 12, 31))
```

**Signature:** `IValiSchedule EndsOn(DateTime endDate)`

### OnDayOfMonth

For monthly schedules: specify which day of the month:

```csharp
schedule.Every(1, RecurrenceType.Monthly)
        .OnDayOfMonth(15) // 15th of every month
```

**Signature:** `IValiSchedule OnDayOfMonth(int day)`

### WithCustomPredicate

Add a custom filter — only occurrences where the predicate returns `true` are included:

```csharp
schedule.Every(1, RecurrenceType.Daily)
        .WithCustomPredicate(date => date.DayOfWeek != DayOfWeek.Friday)
// Skips Fridays
```

**Signature:** `IValiSchedule WithCustomPredicate(Func<DateTime, bool> predicate)`

### Build

Finalize the builder and return a read-only `Schedule` object:

```csharp
var sched = schedule
    .Every(1, RecurrenceType.Weekly)
    .On(DayOfWeek.Monday)
    .At(9, 0)
    .StartingFrom(new DateTime(2025, 1, 6))
    .Build();
```

**Signature:** `Schedule Build()`

## Query Methods

Once you have a `Schedule`, use these methods to query occurrences:

### NextOccurrence

Return the next occurrence after a given date:

```csharp
DateTime? next = sched.NextOccurrence(DateTime.Now);
// → null if schedule has ended
```

**Signature:** `DateTime? NextOccurrence(DateTime after)`

### PreviousOccurrence

Return the most recent occurrence before a given date:

```csharp
DateTime? prev = sched.PreviousOccurrence(DateTime.Now);
```

**Signature:** `DateTime? PreviousOccurrence(DateTime before)`

### OccursOn

Return `true` if the schedule has an occurrence on the given date (ignoring time):

```csharp
bool occurs = sched.OccursOn(new DateTime(2025, 4, 7));
```

**Signature:** `bool OccursOn(DateTime date)`

### Occurrences

Enumerate the next N occurrences from a given date:

```csharp
IEnumerable<DateTime> next5 = sched.Occurrences(5, DateTime.Now);

foreach (var occ in next5)
    Console.WriteLine(occ.ToString("g"));
```

**Signature:** `IEnumerable<DateTime> Occurrences(int count, DateTime from)`

### OccurrencesInRange

Enumerate all occurrences within a date range:

```csharp
var range = new DateRange(new DateTime(2025, 4, 1), new DateTime(2025, 6, 30));
IEnumerable<DateTime> q2Meetings = sched.OccurrencesInRange(range);
```

**Signature:** `IEnumerable<DateTime> OccurrencesInRange(DateRange range)`

## Complete Examples

### Weekly standup

```csharp
public class StandupScheduler(IValiSchedule schedule)
{
    public Schedule BuildStandup(DateTime startDate)
    {
        return schedule
            .Every(1, RecurrenceType.Weekly)
            .On(DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday,
                DayOfWeek.Thursday, DayOfWeek.Friday)
            .At(9, 30)
            .StartingFrom(startDate)
            .Build();
    }

    public void PrintNextStandups(Schedule sched, int count = 5)
    {
        Console.WriteLine($"Next {count} standups:");
        foreach (var occ in sched.Occurrences(count, DateTime.Now))
            Console.WriteLine($"  {occ:ddd, MMM dd HH:mm}");
    }
}
```

### Monthly payroll run

```csharp
public class PayrollScheduler(IValiSchedule schedule)
{
    public Schedule BuildPayroll(int dayOfMonth = 25)
    {
        return schedule
            .Every(1, RecurrenceType.Monthly)
            .OnDayOfMonth(dayOfMonth)
            .At(8, 0)
            .StartingFrom(new DateTime(2025, 1, 1))
            // Skip months where the 25th falls on weekend
            .WithCustomPredicate(d =>
                d.DayOfWeek != DayOfWeek.Saturday &&
                d.DayOfWeek != DayOfWeek.Sunday)
            .Build();
    }
}
```

### Yearly reminder with end condition

```csharp
var reminder = schedule
    .Every(1, RecurrenceType.Yearly)
    .At(10, 0)
    .StartingFrom(new DateTime(2025, 3, 23))
    .EndsAfter(5) // 5 years only
    .Build();

DateTime? nextReminder = reminder.NextOccurrence(DateTime.Now);
Console.WriteLine($"Next annual reminder: {nextReminder:MMM dd, yyyy}");
```
