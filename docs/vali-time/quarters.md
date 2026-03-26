---
id: quarters
title: Quarter Operations
sidebar_label: Quarters
---

# Quarter Operations

`IValiDateQuarter` provides comprehensive quarter-of-year operations. It is included in the `Vali-Time` package and registered automatically when you call `AddValiTime()` or `AddValiTempo()`.

## IValiDateQuarter API

### QuarterOf

Return the quarter number (1–4) of the given date:

```csharp
int q = quarter.QuarterOf(new DateTime(2025, 5, 15));
// → 2 (April–June)

int q2 = quarter.QuarterOf(new DateTime(2025, 11, 1));
// → 4 (October–December)
```

**Signature:** `int QuarterOf(DateTime dt)`

### QuarterStart

Return the first day of the quarter that contains the given date:

```csharp
DateTime start = quarter.QuarterStart(new DateTime(2025, 8, 20));
// → 2025-07-01 (Q3 starts July 1)
```

**Signature:** `DateTime QuarterStart(DateTime dt)`

### QuarterEnd

Return the last day of the quarter that contains the given date:

```csharp
DateTime end = quarter.QuarterEnd(new DateTime(2025, 8, 20));
// → 2025-09-30 (Q3 ends September 30)
```

**Signature:** `DateTime QuarterEnd(DateTime dt)`

### QuarterName

Return the short name of the quarter (`"Q1"`, `"Q2"`, `"Q3"`, or `"Q4"`):

```csharp
string name = quarter.QuarterName(new DateTime(2025, 4, 1));
// → "Q2"
```

**Signature:** `string QuarterName(DateTime dt)`

### QuarterNameFull

Return the full descriptive name including year:

```csharp
string full = quarter.QuarterNameFull(new DateTime(2025, 4, 1));
// → "Q2 2025 (Apr – Jun)"
```

**Signature:** `string QuarterNameFull(DateTime dt)`

### DaysInQuarter

Return the total number of days in the quarter containing the given date:

```csharp
int days = quarter.DaysInQuarter(new DateTime(2024, 2, 1)); // Q1 of leap year
// → 91 (Jan 31 + Feb 29 + Mar 31)

int days2 = quarter.DaysInQuarter(new DateTime(2025, 4, 1)); // Q2
// → 91 (Apr 30 + May 31 + Jun 30)
```

**Signature:** `int DaysInQuarter(DateTime dt)`

### DaysElapsedInQuarter

Return the number of days elapsed since the start of the quarter (1-based):

```csharp
int elapsed = quarter.DaysElapsedInQuarter(new DateTime(2025, 4, 15));
// → 15 (April 15 is the 15th day of Q2)
```

**Signature:** `int DaysElapsedInQuarter(DateTime dt)`

### DaysRemainingInQuarter

Return the number of days remaining until the end of the quarter (inclusive of the last day):

```csharp
int remaining = quarter.DaysRemainingInQuarter(new DateTime(2025, 9, 28));
// → 3 (Sep 28, 29, 30 remaining)
```

**Signature:** `int DaysRemainingInQuarter(DateTime dt)`

### ProgressInQuarter

Return a value between 0.0 and 1.0 representing how far through the quarter the date is:

```csharp
decimal progress = quarter.ProgressInQuarter(new DateTime(2025, 7, 1));
// → 0.0 (first day of Q3)

decimal progress2 = quarter.ProgressInQuarter(new DateTime(2025, 9, 30));
// → ~1.0 (last day of Q3)
```

**Signature:** `decimal ProgressInQuarter(DateTime dt)`

### IsFirstDayOfQuarter

Return `true` if the date is the first calendar day of its quarter:

```csharp
bool first = quarter.IsFirstDayOfQuarter(new DateTime(2025, 10, 1));
// → true (Oct 1 starts Q4)

bool notFirst = quarter.IsFirstDayOfQuarter(new DateTime(2025, 10, 2));
// → false
```

**Signature:** `bool IsFirstDayOfQuarter(DateTime dt)`

### IsLastDayOfQuarter

Return `true` if the date is the last calendar day of its quarter:

```csharp
bool last = quarter.IsLastDayOfQuarter(new DateTime(2025, 6, 30));
// → true (Jun 30 ends Q2)
```

**Signature:** `bool IsLastDayOfQuarter(DateTime dt)`

### IsInSameQuarter

Return `true` if two dates fall in the same quarter of the same year:

```csharp
bool same = quarter.IsInSameQuarter(
    new DateTime(2025, 4, 1),
    new DateTime(2025, 6, 30));
// → true (both in Q2 2025)

bool notSame = quarter.IsInSameQuarter(
    new DateTime(2025, 3, 31),
    new DateTime(2025, 4, 1));
// → false (Q1 vs Q2)
```

**Signature:** `bool IsInSameQuarter(DateTime a, DateTime b)`

### WeeksInQuarter

Return the number of ISO weeks that overlap with the quarter:

```csharp
int weeks = quarter.WeeksInQuarter(new DateTime(2025, 1, 1));
// → ~13
```

**Signature:** `int WeeksInQuarter(DateTime dt)`

### DayOfQuarter

Return the ordinal day position within the quarter (1-based):

```csharp
int day = quarter.DayOfQuarter(new DateTime(2025, 4, 5));
// → 5 (5th day of Q2)
```

**Signature:** `int DayOfQuarter(DateTime dt)`

### NextQuarterStart

Return the first day of the next quarter:

```csharp
DateTime next = quarter.NextQuarterStart(new DateTime(2025, 8, 15));
// → 2025-10-01 (start of Q4)

DateTime next2 = quarter.NextQuarterStart(new DateTime(2025, 12, 31));
// → 2026-01-01 (start of Q1 next year)
```

**Signature:** `DateTime NextQuarterStart(DateTime dt)`

### PreviousQuarterStart

Return the first day of the previous quarter:

```csharp
DateTime prev = quarter.PreviousQuarterStart(new DateTime(2025, 8, 15));
// → 2025-04-01 (start of Q2)

DateTime prev2 = quarter.PreviousQuarterStart(new DateTime(2025, 1, 15));
// → 2024-10-01 (start of Q4 of previous year)
```

Returns `DateTime.MinValue` when no previous quarter exists (i.e. the date is in Q1 of year 1). Use `TryPreviousQuarterStart` to distinguish this sentinel from a real date.

**Signature:** `DateTime PreviousQuarterStart(DateTime dt)`

### TryNextQuarterStart

Safe alternative to `NextQuarterStart` for use near `DateTime.MaxValue`. Returns `false` (and sets `result` to `DateTime.MaxValue`) when the next quarter would overflow past year 9999; otherwise returns `true` and the first day of the next quarter.

```csharp
var valiDate = new ValiDate();

if (valiDate.TryNextQuarterStart(new DateTime(2025, 8, 15), out var next))
    Console.WriteLine(next); // 2025-10-01

// Returns false near DateTime.MaxValue
bool ok = valiDate.TryNextQuarterStart(new DateTime(9999, 10, 1), out _); // false
```

**Signature:** `bool TryNextQuarterStart(DateTime date, out DateTime result)`

### TryPreviousQuarterStart

Safe alternative to `PreviousQuarterStart` for use near `DateTime.MinValue`. Returns `false` (and sets `result` to `DateTime.MinValue`) when the date is in Q1 of year 1 and there is no previous quarter; otherwise returns `true` and the first day of the previous quarter.

```csharp
var valiDate = new ValiDate();

if (valiDate.TryPreviousQuarterStart(new DateTime(2025, 5, 1), out var prev))
    Console.WriteLine(prev); // 2025-01-01 00:00:00

// Returns false near DateTime.MinValue
bool ok = valiDate.TryPreviousQuarterStart(new DateTime(1, 2, 1), out _); // false
```

**Signature:** `bool TryPreviousQuarterStart(DateTime date, out DateTime result)`

## Complete Example

```csharp
public class QuarterlyReportService(IValiDateQuarter quarter)
{
    public void PrintQuarterSummary(DateTime date)
    {
        int    q          = quarter.QuarterOf(date);
        string name       = quarter.QuarterNameFull(date);
        DateTime qStart   = quarter.QuarterStart(date);
        DateTime qEnd     = quarter.QuarterEnd(date);
        int    total      = quarter.DaysInQuarter(date);
        int    elapsed    = quarter.DaysElapsedInQuarter(date);
        int    remaining  = quarter.DaysRemainingInQuarter(date);
        decimal progress  = quarter.ProgressInQuarter(date);

        Console.WriteLine($"Quarter: {name}");
        Console.WriteLine($"Span:    {qStart:MMM dd} – {qEnd:MMM dd}");
        Console.WriteLine($"Total:   {total} days");
        Console.WriteLine($"Elapsed: {elapsed} days ({progress:P1})");
        Console.WriteLine($"Left:    {remaining} days");

        DateTime next = quarter.NextQuarterStart(date);
        Console.WriteLine($"Next Q starts: {next:yyyy-MM-dd}");
    }
}
```
