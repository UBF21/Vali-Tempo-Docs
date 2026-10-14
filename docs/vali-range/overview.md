---
id: overview
title: Vali-Range Overview
sidebar_label: Overview
description: Vali-Range provides date range operations for .NET — check overlaps, containment, duration, and iterate over date ranges with precision.
keywords: [Vali-Range, date range, .NET, NuGet, overlap, C#, date interval]
---

# Vali-Range

`IValiRange` provides a comprehensive set of date range operations built on the `DateRange` struct. It supports creation, querying, set operations (union, intersection), enumeration, splitting, and calendar-aware workday iteration.

## Installation

```bash
dotnet add package Vali-Range
```

Compiled targets: `net8.0` · `net9.0` · `net10.0`. Compatible with .NET 6 and .NET 7 via NuGet backward compatibility.

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
Console.WriteLine(range.Duration(TimeUnit.Days)); // 89
```

**Members:**

| Member | Type | Description |
|---|---|---|
| `Start` | `DateTime` | Inclusive start date |
| `End` | `DateTime` | Inclusive end date |
| `IsValid` | `bool` | `true` when `Start <= End` |
| `Duration(TimeUnit)` | `decimal` | Length of the range expressed in the given unit |

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
DateRange last3Months = range.LastUnits(3, TimeUnit.Months);
```

**Signature:** `DateRange LastUnits(decimal amount, TimeUnit unit)`

`End` is the current instant (`DateTime.Now`); `Start` is `amount` units earlier.

> **Note:** `amount` must be greater than 0. Passing 0 or a negative value throws `ArgumentException`.

### NextUnits

Create a range covering the next N units from the current instant:

```csharp
DateRange next7Days   = range.NextUnits(7, TimeUnit.Days);
DateRange nextQuarter = range.NextUnits(3, TimeUnit.Months);
```

**Signature:** `DateRange NextUnits(decimal amount, TimeUnit unit)`

`Start` is the current instant (`DateTime.Now`); `End` is `amount` units later.

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

Check if a date falls within a range (inclusive on both ends):

```csharp
bool has = range.Contains(myRange, new DateTime(2025, 6, 15));
```

**Signature:** `bool Contains(DateRange range, DateTime date)`

### Overlaps

Check if two ranges overlap (share at least one point in time):

```csharp
bool overlapping = range.Overlaps(rangeA, rangeB);
```

**Signature:** `bool Overlaps(DateRange a, DateRange b)`

### IsContainedBy

Check if the first range is entirely within the second:

```csharp
bool inside = range.IsContainedBy(inner, outer);
```

**Signature:** `bool IsContainedBy(DateRange inner, DateRange outer)`

### Intersection

Return the overlapping portion of two ranges, or `null` if they don't overlap:

```csharp
DateRange? overlap = range.Intersection(rangeA, rangeB);
// → DateRange covering the shared days, or null when there is no overlap
```

**Signature:** `DateRange? Intersection(DateRange a, DateRange b)`

### Union

Merge two ranges into the smallest range that covers both (they do not need to overlap):

```csharp
DateRange merged = range.Union(rangeA, rangeB);
```

**Signature:** `DateRange Union(DateRange a, DateRange b)`

### Subtract

Return the set-theoretic difference `A \ B` — the portion(s) of `a` that remain after removing
every point also covered by `b`:

```csharp
IEnumerable<DateRange> remainder = range.Subtract(rangeA, rangeB);
```

**Signature:** `IEnumerable<DateRange> Subtract(DateRange a, DateRange b)`

Yields zero, one, or two non-overlapping ranges depending on how `b` overlaps `a`: zero when
`b` fully contains `a`, one when the overlap only touches one end of `a` (or there is no overlap
at all, in which case `a` is returned unchanged), or two when `b` falls strictly inside `a`.

### Expand

Extend a range by N units on both ends:

```csharp
DateRange expanded = range.Expand(myRange, 7, TimeUnit.Days);
// Adds 7 days on each side
```

**Signature:** `DateRange Expand(DateRange range, decimal amount, TimeUnit unit)`

### Shrink

Contract a range by N units from both ends:

```csharp
DateRange shrunk = range.Shrink(myRange, 1, TimeUnit.Weeks);
```

**Signature:** `DateRange Shrink(DateRange range, decimal amount, TimeUnit unit)`

Throws `ArgumentException` if the resulting range would be invalid (`Start > End`).

### Shift

Move a range forward or backward in time, keeping its length unchanged:

```csharp
DateRange shifted = range.Shift(myRange, 1, TimeUnit.Months); // forward
DateRange back    = range.Shift(myRange, -2, TimeUnit.Weeks);  // backward
```

**Signature:** `DateRange Shift(DateRange range, decimal amount, TimeUnit unit)`

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

        Console.WriteLine($"Duration: {project.Duration(TimeUnit.Days)} days");

        // Split into monthly sprints
        var sprints = range.SplitByMonth(project).ToList();
        Console.WriteLine($"Sprints: {sprints.Count}");

        // Find holiday gaps (if holiday service available)
        var workdays = range.EachWorkday(project).Count();
        Console.WriteLine($"Workdays: {workdays}");

        // Compute Q-by-Q breakdown
        foreach (var quarter in range.SplitByQuarter(project))
        {
            Console.WriteLine($"  {quarter.Start:MMM dd} – {quarter.End:MMM dd}: {quarter.Duration(TimeUnit.Days)} days");
        }
    }
}
```
