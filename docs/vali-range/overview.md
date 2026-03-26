---
id: overview
title: Vali-Range Overview
sidebar_label: Overview
---

# Vali-Range

`IValiRange` provides a comprehensive set of date range operations built on the `DateRange` struct. It supports creation, querying, set operations (union, intersection), enumeration, splitting, and calendar-aware workday iteration.

## Installation

```bash
dotnet add package Vali-Range
```

## Registration

```csharp
builder.Services.AddValiRange();
// or via the meta-package:
builder.Services.AddValiTempo();
```

## DateRange Struct

`DateRange` is a value type representing a closed date interval `[Start, End]`.

```csharp
var range = new DateRange(new DateTime(2025, 1, 1), new DateTime(2025, 3, 31));
Console.WriteLine(range.Start); // 2025-01-01
Console.WriteLine(range.End);   // 2025-03-31
Console.WriteLine(range.Duration); // TimeSpan of 90 days
```

**Properties:**

| Property | Type | Description |
|---|---|---|
| `Start` | `DateTime` | Inclusive start date |
| `End` | `DateTime` | Inclusive end date |
| `Duration` | `TimeSpan` | `End - Start` |
| `TotalDays` | `int` | Number of calendar days |
| `IsEmpty` | `bool` | True when Start == End or range is invalid |

## IValiRange API

### Create

Create a `DateRange` from start and end dates:

```csharp
DateRange r = range.Create(new DateTime(2025, 1, 1), new DateTime(2025, 12, 31));
```

**Signature:** `DateRange Create(DateTime start, DateTime end)`

### LastUnits

Create a range covering the last N units before a reference date:

```csharp
DateRange last30Days = range.LastUnits(30, TimeUnit.Days);
DateRange last3Months = range.LastUnits(3, TimeUnit.Months, referenceDate: DateTime.Today);
```

**Signature:** `DateRange LastUnits(int count, TimeUnit unit, DateTime? referenceDate = null)`

> **Note:** `amount` must be greater than 0. Passing 0 or a negative value throws `ArgumentException`.

### NextUnits

Create a range covering the next N units after a reference date:

```csharp
DateRange next7Days   = range.NextUnits(7, TimeUnit.Days);
DateRange nextQuarter = range.NextUnits(1, TimeUnit.Months, count: 3);
```

**Signature:** `DateRange NextUnits(int count, TimeUnit unit, DateTime? referenceDate = null)`

> **Note:** `amount` must be greater than 0. Passing 0 or a negative value throws `ArgumentException`.

### ThisMonth / ThisWeek / ThisQuarter / ThisYear

Convenience factory methods for common ranges:

```csharp
DateRange month   = range.ThisMonth();
DateRange week    = range.ThisWeek();
DateRange quarter = range.ThisQuarter();
DateRange year    = range.ThisYear();
```

### Contains

Check if a date or another range is fully contained:

```csharp
bool has = range.Contains(myRange, new DateTime(2025, 6, 15));
bool sub = range.Contains(myRange, subRange);
```

**Signature:**
- `bool Contains(DateRange range, DateTime date)`
- `bool Contains(DateRange range, DateRange other)`

### Overlaps

Check if two ranges overlap (share at least one day):

```csharp
bool overlapping = range.Overlaps(rangeA, rangeB);
```

**Signature:** `bool Overlaps(DateRange a, DateRange b)`

### IsContainedBy

Check if the first range is entirely within the second:

```csharp
bool inside = range.IsContainedBy(inner, outer);
```

**Signature:** `bool IsContainedBy(DateRange range, DateRange container)`

### Intersection

Return the overlapping portion of two ranges (or an empty range if they don't overlap):

```csharp
DateRange overlap = range.Intersection(rangeA, rangeB);
// → DateRange covering the shared days
```

**Signature:** `DateRange Intersection(DateRange a, DateRange b)`

### Union

Merge two ranges into the smallest range that covers both (they do not need to overlap):

```csharp
DateRange merged = range.Union(rangeA, rangeB);
```

**Signature:** `DateRange Union(DateRange a, DateRange b)`

### Expand

Extend a range by N units on one or both ends:

```csharp
DateRange expanded = range.Expand(myRange, 7, TimeUnit.Days);
// Adds 7 days on each side

DateRange expandedStart = range.Expand(myRange, 7, TimeUnit.Days, expandStart: true, expandEnd: false);
```

**Signature:** `DateRange Expand(DateRange range, int amount, TimeUnit unit, bool expandStart = true, bool expandEnd = true)`

### Shrink

Contract a range by N units from one or both ends:

```csharp
DateRange shrunk = range.Shrink(myRange, 1, TimeUnit.Weeks);
```

**Signature:** `DateRange Shrink(DateRange range, int amount, TimeUnit unit, bool shrinkStart = true, bool shrinkEnd = true)`

### Shift

Move a range forward or backward in time:

```csharp
DateRange shifted = range.Shift(myRange, 1, TimeUnit.Months); // forward
DateRange back    = range.Shift(myRange, -2, TimeUnit.Weeks);  // backward
```

**Signature:** `DateRange Shift(DateRange range, int amount, TimeUnit unit)`

### IsAdjacent

Check if two ranges are adjacent (end of one is the day before start of the other):

```csharp
bool adj = range.IsAdjacent(rangeA, rangeB);
```

**Signature:** `bool IsAdjacent(DateRange a, DateRange b)`

### Merge

Merge a collection of overlapping or adjacent ranges into minimal non-overlapping ranges:

```csharp
IEnumerable<DateRange> merged = range.Merge(listOfRanges);
```

**Signature:** `IEnumerable<DateRange> Merge(IEnumerable<DateRange> ranges)`

### Gaps

Return ranges representing gaps between a sorted list of ranges, bounded by a container range:

```csharp
var container = range.Create(new DateTime(2025, 1, 1), new DateTime(2025, 12, 31));
IEnumerable<DateRange> gaps = range.Gaps(listOfRanges, container);
// → Ranges for periods within the container not covered by any input range
```

**Signature:** `IEnumerable<DateRange> Gaps(IEnumerable<DateRange> ranges, DateRange container)`

The `container` parameter defines the bounding range within which gaps are calculated. Only uncovered periods that fall inside `container` are returned.

### EachDay / EachWeek / EachMonth

Enumerate dates within the range at a given step:

```csharp
foreach (DateTime day in range.EachDay(myRange))
    Console.WriteLine(day);

foreach (DateTime weekStart in range.EachWeek(myRange))
    Console.WriteLine(weekStart);

foreach (DateTime monthStart in range.EachMonth(myRange))
    Console.WriteLine(monthStart);
```

**Signatures:**
- `IEnumerable<DateTime> EachDay(DateRange range)`
- `IEnumerable<DateTime> EachWeek(DateRange range)`
- `IEnumerable<DateTime> EachMonth(DateRange range)`

### EachWorkday

Enumerate only workdays (Mon–Fri) within the range:

```csharp
foreach (DateTime workday in range.EachWorkday(myRange))
    Console.WriteLine(workday);
```

**Signature:** `IEnumerable<DateTime> EachWorkday(DateRange range)`

### SplitByDay / SplitByWeek / SplitByMonth / SplitByQuarter

Split a range into sub-ranges:

```csharp
IEnumerable<DateRange> days     = range.SplitByDay(myRange);
IEnumerable<DateRange> weeks    = range.SplitByWeek(myRange);
IEnumerable<DateRange> months   = range.SplitByMonth(myRange);
IEnumerable<DateRange> quarters = range.SplitByQuarter(myRange);
```

## Complete Example

```csharp
public class ProjectAnalyzer(IValiRange range)
{
    public void AnalyzeProject(DateTime projectStart, DateTime projectEnd)
    {
        var project = range.Create(projectStart, projectEnd);

        Console.WriteLine($"Duration: {project.TotalDays} days");

        // Split into monthly sprints
        var sprints = range.SplitByMonth(project).ToList();
        Console.WriteLine($"Sprints: {sprints.Count}");

        // Find holiday gaps (if holiday service available)
        var workdays = range.EachWorkday(project).Count();
        Console.WriteLine($"Workdays: {workdays}");

        // Compute Q-by-Q breakdown
        foreach (var quarter in range.SplitByQuarter(project))
        {
            Console.WriteLine($"  {quarter.Start:MMM dd} – {quarter.End:MMM dd}: {quarter.TotalDays} days");
        }
    }
}
```
