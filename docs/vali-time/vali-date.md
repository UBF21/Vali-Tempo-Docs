---
id: vali-date
title: ValiDate
sidebar_label: ValiDate
---

# ValiDate

`IValiDate` provides fluent date arithmetic, comparison, and introspection methods. It is registered alongside `IValiTime` when you call `AddValiTime()` or `AddValiTempo()`.

## IValiDate API

### Diff

Calculate the difference between two dates in a given time unit, with decimal precision:

```csharp
decimal days = date.Diff(DateTime.Today, new DateTime(2025, 12, 31), TimeUnit.Days);
// → e.g. 282.0

decimal months = date.Diff(new DateTime(2024, 1, 1), new DateTime(2025, 6, 15), TimeUnit.Months);
// → ~17.45
```

**Signature:** `decimal Diff(DateTime from, DateTime to, TimeUnit unit, int? decimalPlaces = null)`

### Add

Add a decimal amount of a given unit to a date:

```csharp
DateTime result = date.Add(DateTime.Today, 2.5m, TimeUnit.Hours);
DateTime future = date.Add(DateTime.Today, 3m, TimeUnit.Months);
DateTime later  = date.Add(DateTime.Today, 1.5m, TimeUnit.Years);
```

**Signature:** `DateTime Add(DateTime dt, decimal amount, TimeUnit unit)`

### Subtract

Subtract a decimal amount of a given unit from a date:

```csharp
DateTime pastWeek = date.Subtract(DateTime.Today, 1m, TimeUnit.Weeks);
DateTime lastYear = date.Subtract(DateTime.Today, 365m, TimeUnit.Days);
```

**Signature:** `DateTime Subtract(DateTime dt, decimal amount, TimeUnit unit)`

### StartOf

Get the start of a period (day, week, month, quarter, year):

```csharp
DateTime startOfMonth = date.StartOf(DateTime.Today, DatePart.Month);
// → First day of current month, time 00:00:00

DateTime startOfYear = date.StartOf(DateTime.Today, DatePart.Year);
// → January 1st of current year

DateTime startOfWeek = date.StartOf(DateTime.Today, DatePart.DayOfWeek);
// → Monday (or Sunday) of current week
```

**Signature:** `DateTime StartOf(DateTime date, DatePart part, WeekStart? weekStart = null)`

### EndOf

Get the end of a period (inclusive — last tick of that period):

```csharp
DateTime endOfMonth = date.EndOf(DateTime.Today, DatePart.Month);
// → Last day of current month, time 23:59:59.9999999

DateTime endOfYear = date.EndOf(DateTime.Today, DatePart.Year);
// → December 31st, 23:59:59.9999999
```

**Signature:** `DateTime EndOf(DateTime date, DatePart part, WeekStart? weekStart = null)`

### IsBefore

Check if a date is strictly before another:

```csharp
bool result = date.IsBefore(new DateTime(2024, 1, 1), new DateTime(2025, 1, 1));
// → true
```

**Signature:** `bool IsBefore(DateTime dt, DateTime other)`

### IsAfter

Check if a date is strictly after another:

```csharp
bool result = date.IsAfter(DateTime.Today, new DateTime(2020, 1, 1));
// → true
```

**Signature:** `bool IsAfter(DateTime dt, DateTime other)`

### IsSameDay

Check if two dates fall on the same calendar day:

```csharp
bool same = date.IsSameDay(new DateTime(2025, 3, 15, 8, 0, 0), new DateTime(2025, 3, 15, 20, 0, 0));
// → true (same day, different time)
```

**Signature:** `bool IsSameDay(DateTime a, DateTime b)`

### IsSamePeriod

Check if two dates fall in the same calendar period:

```csharp
bool sameMonth = date.IsSamePeriod(new DateTime(2025, 3, 5), new DateTime(2025, 3, 28), DatePart.Month);
// → true

bool sameYear = date.IsSamePeriod(new DateTime(2025, 1, 1), new DateTime(2025, 12, 31), DatePart.Year);
// → true
```

**Signature:** `bool IsSamePeriod(DateTime a, DateTime b, DatePart part, WeekStart? weekStart = null)`

### IsWeekend

Return `true` if the date falls on Saturday or Sunday:

```csharp
bool weekend = date.IsWeekend(new DateTime(2025, 3, 15)); // Saturday
// → true
```

**Signature:** `bool IsWeekend(DateTime dt)`

### IsWeekday

Return `true` if the date falls on Monday through Friday:

```csharp
bool weekday = date.IsWeekday(new DateTime(2025, 3, 17)); // Monday
// → true
```

**Signature:** `bool IsWeekday(DateTime dt)`

### IsLeapYear

Return `true` if the year of the given date is a leap year:

```csharp
bool leap = date.IsLeapYear(2024);
// → true

bool notLeap = date.IsLeapYear(2025);
// → false
```

**Signature:** `bool IsLeapYear(int year)`

### DaysInMonth

Return the number of days in the given month of the given year:

```csharp
int days = date.DaysInMonth(2024, 2); // Leap February
// → 29

int days2 = date.DaysInMonth(2025, 1);
// → 31
```

**Signature:** `int DaysInMonth(int year, int month)`

### WeekOfYear

Return the ISO 8601 week number for the given date:

```csharp
int week = date.WeekOfYear(new DateTime(2025, 1, 6));
// → 2

int week2 = date.WeekOfYear(new DateTime(2025, 12, 29), WeekStart.Monday);
// → 1 (ISO 8601 — first week of 2026)
```

**Signature:** `int WeekOfYear(DateTime dt, WeekStart? weekStart = null)`

### WeekYear

Return the ISO year that owns the calendar week containing the given date. Near ISO year boundaries this may differ from `date.Year`:

```csharp
// Dec 31, 2018 falls in ISO week 1 of 2019
int y = date.WeekYear(new DateTime(2018, 12, 31)); // 2019

// For WeekStart.Sunday the method always returns date.Year
int y2 = date.WeekYear(new DateTime(2018, 12, 31), WeekStart.Sunday); // 2018
```

**Signature:** `int WeekYear(DateTime date, WeekStart? weekStart = null)`

### DayOfYear

Return the one-based day number of the year (1–366):

```csharp
int day = date.DayOfYear(new DateTime(2025, 2, 1));
// → 32
```

**Signature:** `int DayOfYear(DateTime dt)`

### ProgressInYear

Return a value between 0.0 and 1.0 representing how far through the year the date is:

```csharp
decimal progress = date.ProgressInYear(new DateTime(2025, 7, 1));
// → ~0.496 (roughly halfway)
```

**Signature:** `decimal ProgressInYear(DateTime dt)`

### ProgressInMonth

Return a value between 0.0 and 1.0 representing how far through the month the date is:

```csharp
decimal progress = date.ProgressInMonth(new DateTime(2025, 3, 15));
// → ~0.484 (day 15 of 31)
```

**Signature:** `decimal ProgressInMonth(DateTime dt)`

## Complete Example

```csharp
public class DeadlineTracker(IValiDate date)
{
    public void AnalyzeDeadline(DateTime deadline)
    {
        var now = DateTime.Now;

        // Days and weeks remaining
        decimal daysLeft  = date.Diff(now, deadline, TimeUnit.Days);
        decimal weeksLeft = date.Diff(now, deadline, TimeUnit.Weeks);

        // Deadline characteristics
        bool isWeekend  = date.IsWeekend(deadline);
        int  weekNum    = date.WeekOfYear(deadline);
        int  dayOfYear  = date.DayOfYear(deadline);
        decimal yearProg = date.ProgressInYear(deadline);

        // Start/end of deadline's month
        DateTime monthStart = date.StartOf(deadline, DatePart.Month);
        DateTime monthEnd   = date.EndOf(deadline, DatePart.Month);

        Console.WriteLine($"Days remaining:   {daysLeft:F0}");
        Console.WriteLine($"Weeks remaining:  {weeksLeft:F1}");
        Console.WriteLine($"Falls on weekend: {isWeekend}");
        Console.WriteLine($"ISO week number:  {weekNum}");
        Console.WriteLine($"Day of year:      {dayOfYear}");
        Console.WriteLine($"Year progress:    {yearProg:P1}");
        Console.WriteLine($"Month span:       {monthStart:MMM dd} – {monthEnd:MMM dd}");
    }
}
```
