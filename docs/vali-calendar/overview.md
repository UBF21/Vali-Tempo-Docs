---
id: overview
title: Vali-Calendar Overview
sidebar_label: Overview
---

# Vali-Calendar

`IValiCalendar` is a workday-aware calendar engine that supports pluggable holiday providers. It can calculate workdays between dates, add business days, detect month/week boundaries, and enumerate days of a month.

## Installation

```bash
dotnet add package Vali-Calendar
```

## Registration

```csharp
builder.Services.AddValiCalendar();
// or via the meta-package:
builder.Services.AddValiTempo();
```

## CalendarWeek Struct

`CalendarWeek` represents a single ISO 8601 calendar week:

| Property | Type | Description |
|---|---|---|
| `Year` | `int` | Year the week belongs to |
| `WeekNumber` | `int` | ISO week number (1–53) |
| `Start` | `DateTime` | Monday of the week |
| `End` | `DateTime` | Sunday of the week |
| `Days` | `IEnumerable<DateTime>` | All 7 days of the week |

## IValiCalendar API

### WeekOf

Get the `CalendarWeek` that contains a given date:

```csharp
CalendarWeek week = calendar.WeekOf(new DateTime(2025, 3, 15));
Console.WriteLine(week.WeekNumber); // → ISO week number
Console.WriteLine(week.Start);      // → Monday of that week
Console.WriteLine(week.End);        // → Sunday of that week
```

**Signature:** `CalendarWeek WeekOf(DateTime date)`

### CurrentWeek

Get the `CalendarWeek` for the current date:

```csharp
CalendarWeek thisWeek = calendar.CurrentWeek();
```

**Signature:** `CalendarWeek CurrentWeek()`

### WeeksInMonth

Get all calendar weeks that overlap with the month of the given date:

```csharp
IEnumerable<CalendarWeek> weeks = calendar.WeeksInMonth(new DateTime(2025, 3, 1));
// → All weeks overlapping March 2025
```

**Signature:** `IEnumerable<CalendarWeek> WeeksInMonth(DateTime date)`

### WeekCountInMonth

Return the number of (partial or full) calendar weeks in the month of the given date:

```csharp
int count = calendar.WeekCountInMonth(new DateTime(2025, 3, 1));
// → 5 (March 2025 spans 5 weeks)
```

**Signature:** `int WeekCountInMonth(DateTime date)`

### IsFirstDayOfMonth

Return `true` if the date is the first day of its calendar month:

```csharp
bool first = calendar.IsFirstDayOfMonth(new DateTime(2025, 5, 1));
// → true
```

**Signature:** `bool IsFirstDayOfMonth(DateTime date)`

### IsLastDayOfMonth

Return `true` if the date is the last day of its calendar month:

```csharp
bool last = calendar.IsLastDayOfMonth(new DateTime(2025, 1, 31));
// → true
```

**Signature:** `bool IsLastDayOfMonth(DateTime date)`

### DaysInMonth

Return the number of days in the month of the given date:

```csharp
int days = calendar.DaysInMonth(new DateTime(2024, 2, 10));
// → 29 (leap year)
```

**Signature:** `int DaysInMonth(DateTime date)`

### DaysOfMonth

Enumerate all calendar days in the month of the given date:

```csharp
IEnumerable<DateTime> days = calendar.DaysOfMonth(new DateTime(2025, 3, 1));
foreach (var day in days)
    Console.WriteLine(day.ToString("dd ddd"));
```

**Signature:** `IEnumerable<DateTime> DaysOfMonth(DateTime date)`

### IsWorkday

Return `true` if the date is a workday (Monday–Friday and not a registered holiday):

```csharp
bool isWork = calendar.IsWorkday(new DateTime(2025, 12, 25));
// → depends on registered holidays
```

Optionally pass a country code to check against that country's holidays:

```csharp
bool isWork = calendar.IsWorkday(new DateTime(2025, 12, 25), "PE");
```

**Signature:** `bool IsWorkday(DateTime date, string? country = null)`

### WorkdaysBetween

Count the number of workdays between two dates (exclusive of the end date):

```csharp
int workdays = calendar.WorkdaysBetween(
    new DateTime(2025, 3, 3),  // Monday
    new DateTime(2025, 3, 14), // Friday
    "US");
// → 10 (two weeks of Mon–Fri)
```

**Signature:** `int WorkdaysBetween(DateTime from, DateTime to, string? country = null)`

### AddWorkdays

Add a number of business days to a date, skipping weekends and holidays:

```csharp
DateTime result = calendar.AddWorkdays(new DateTime(2025, 3, 28), 5, "PE");
// → Moves 5 workdays forward, skipping weekends and Peruvian holidays
```

**Signature:** `DateTime AddWorkdays(DateTime date, int count, string? country = null)`

### WorkdaysInMonth

Return the count of workdays in the month of the given date:

```csharp
int count = calendar.WorkdaysInMonth(new DateTime(2025, 3, 1), "US");
// → ~21 (March 2025 has 21 workdays in the US)
```

**Signature:** `int WorkdaysInMonth(DateTime date, string? country = null)`

### WorkdaysInYear

Return the count of workdays in the year of the given date:

```csharp
int count = calendar.WorkdaysInYear(new DateTime(2025, 1, 1), "US");
// → ~261
```

**Signature:** `int WorkdaysInYear(DateTime date, string? country = null)`

### NextWorkday

Return the next workday after the given date:

```csharp
DateTime next = calendar.NextWorkday(new DateTime(2025, 3, 28)); // Friday
// → 2025-03-31 (Monday)
```

**Signature:** `DateTime NextWorkday(DateTime date, string? country = null)`

### PreviousWorkday

Return the workday immediately before the given date:

```csharp
DateTime prev = calendar.PreviousWorkday(new DateTime(2025, 3, 31)); // Monday
// → 2025-03-28 (Friday)
```

**Signature:** `DateTime PreviousWorkday(DateTime date, string? country = null)`

### HasHolidayProvider

Return `true` if a holiday provider is registered for the given country code:

```csharp
bool has = calendar.HasHolidayProvider("PE");
```

**Signature:** `bool HasHolidayProvider(string country)`

### HolidaysInMonth

Return all registered holidays in the month of the given date for a country:

```csharp
IEnumerable<HolidayInfo> holidays = calendar.HolidaysInMonth(new DateTime(2025, 12, 1), "PE");
```

**Signature:** `IEnumerable<HolidayInfo> HolidaysInMonth(DateTime date, string country)`

### HolidaysInYear

Return all registered holidays in the year of the given date for a country:

```csharp
IEnumerable<HolidayInfo> holidays = calendar.HolidaysInYear(new DateTime(2025, 1, 1), "US");
```

**Signature:** `IEnumerable<HolidayInfo> HolidaysInYear(DateTime date, string country)`

### IsLeapYear

Return `true` if the year of the given date is a leap year:

```csharp
bool leap = calendar.IsLeapYear(new DateTime(2024, 1, 1));
// → true
```

**Signature:** `bool IsLeapYear(DateTime date)`

### DaysInYear

Return the number of days in the year of the given date (365 or 366):

```csharp
int days = calendar.DaysInYear(new DateTime(2024, 6, 1));
// → 366
```

**Signature:** `int DaysInYear(DateTime date)`

## Complete Example

```csharp
public class HRCalendar(IValiCalendar calendar, IValiHoliday holiday)
{
    public void Setup()
    {
        // Register holiday providers
        foreach (var p in HolidayProviderFactory.CreateLatinAmerica())
            holiday.Register(p);
    }

    public void PrintMonthSummary(DateTime date, string country)
    {
        Console.WriteLine($"Days in month:     {calendar.DaysInMonth(date)}");
        Console.WriteLine($"Workdays in month: {calendar.WorkdaysInMonth(date, country)}");
        Console.WriteLine($"Weeks in month:    {calendar.WeekCountInMonth(date)}");

        Console.WriteLine("Holidays this month:");
        foreach (var h in calendar.HolidaysInMonth(date, country))
            Console.WriteLine($"  {h.Date:MMM dd} — {h.Name}");
    }

    public DateTime ComputePaymentDate(DateTime issueDate, string country)
    {
        // Payment due 5 business days after invoice date
        return calendar.AddWorkdays(issueDate, 5, country);
    }
}
```
