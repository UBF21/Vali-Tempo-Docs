---
id: overview
title: Vali-Calendar Overview
sidebar_label: Overview
description: Vali-Calendar provides workday calendar operations for .NET — calculate business days, skip weekends and holidays, and navigate calendar months.
keywords: [Vali-Calendar, business days, workday, .NET, NuGet, C#, calendar operations]
---

# Vali-Calendar

`IValiCalendar` is a workday-aware calendar engine that supports a pluggable `IHolidayProvider`. It can calculate workdays between dates, add business days, detect month/week boundaries, and enumerate days of a month.

## Installation

```bash
dotnet add package Vali-Calendar
```

Compiled targets: `net8.0` · `net9.0` · `net10.0`. Compatible with .NET 6 and .NET 7 via NuGet backward compatibility.

## Registration

```csharp
builder.Services.AddValiCalendar();
// or via the meta-package:
builder.Services.AddValiTempo();
```

To exclude public holidays from workday logic, register with an `IHolidayProvider` (a single, already-country-scoped provider — see [Holiday Integration](#holiday-integration) below):

```csharp
builder.Services.AddValiCalendar(myHolidayProvider);
```

## CalendarWeek Struct

`CalendarWeek` represents a single ISO 8601 calendar week:

| Property | Type | Description |
|---|---|---|
| `Year` | `int` | Year the week belongs to |
| `WeekNumber` | `int` | ISO week number (1–53) |
| `Start` | `DateTime` | First day of the week |
| `End` | `DateTime` | Last day of the week |
| `Days` | `IEnumerable<DateTime>` | All 7 days of the week |

## IValiCalendar API

### WeekOf

Get the `CalendarWeek` that contains a given date:

```csharp
CalendarWeek week = calendar.WeekOf(new DateTime(2025, 3, 15));
Console.WriteLine(week.WeekNumber); // → ISO week number
Console.WriteLine(week.Start);      // → first day of that week
Console.WriteLine(week.End);        // → last day of that week
```

**Signature:** `CalendarWeek WeekOf(DateTime date, WeekStart? weekStart = null)`

`weekStart` overrides the instance default (`WeekStart.Monday` or `WeekStart.Sunday`) for this call only.

### CurrentWeek

Get the `CalendarWeek` for the current date:

```csharp
CalendarWeek thisWeek = calendar.CurrentWeek();
```

**Signature:** `CalendarWeek CurrentWeek(WeekStart? weekStart = null)`

### WeeksInMonth

Get all calendar weeks that overlap with a given month:

```csharp
IEnumerable<CalendarWeek> weeks = calendar.WeeksInMonth(2025, 3);
// → All weeks overlapping March 2025
```

**Signature:** `IEnumerable<CalendarWeek> WeeksInMonth(int year, int month, WeekStart? weekStart = null)`

### WeekCountInMonth

Return the number of (partial or full) calendar weeks in a given month:

```csharp
int count = calendar.WeekCountInMonth(2025, 3);
// → 5 (March 2025 spans 5 weeks)
```

**Signature:** `int WeekCountInMonth(int year, int month, WeekStart? weekStart = null)`

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

Enumerate all calendar days in a given month:

```csharp
IEnumerable<DateTime> days = calendar.DaysOfMonth(2025, 3);
foreach (var day in days)
    Console.WriteLine(day.ToString("dd ddd"));
```

**Signature:** `IEnumerable<DateTime> DaysOfMonth(int year, int month)`

### IsWorkday

Return `true` if the date is a workday — a weekday (Monday–Friday) that is not a public holiday when an `IHolidayProvider` is configured on the instance:

```csharp
bool isWork = calendar.IsWorkday(new DateTime(2025, 12, 25));
// → false if the instance has a holiday provider that marks Dec 25 as a holiday,
//   otherwise true/false based on weekday only
```

**Signature:** `bool IsWorkday(DateTime date)`

The holiday provider is not passed per call — it is bound once, at construction (see [Holiday Integration](#holiday-integration)). A `ValiCalendar` instance is therefore scoped to at most one holiday provider (one country) at a time.

### WorkdaysBetween

Count the number of workdays between two dates, **inclusive of both endpoints**:

```csharp
int workdays = calendar.WorkdaysBetween(
    new DateTime(2025, 3, 3),  // Monday
    new DateTime(2025, 3, 14)); // Friday
// → 10 (two weeks of Mon–Fri)
```

**Signature:** `int WorkdaysBetween(DateTime from, DateTime to)`

Throws `ArgumentException` if `from` is after `to`, and `InvalidOperationException` if the span exceeds the internal 10-year scan limit.

### AddWorkdays

Add a number of business days to a date, skipping weekends (and holidays when a provider is configured). Negative values move backward:

```csharp
DateTime result = calendar.AddWorkdays(new DateTime(2025, 3, 28), 5);
// → Moves 5 workdays forward, skipping weekends (and holidays if configured)
```

**Signature:** `DateTime AddWorkdays(DateTime date, int workdays)`

### WorkdaysInMonth

Return the count of workdays in a given month:

```csharp
int count = calendar.WorkdaysInMonth(2025, 3);
// → 21 (March 2025)
```

**Signature:** `int WorkdaysInMonth(int year, int month)`

### WorkdaysInYear

Return the total count of workdays in a given year:

```csharp
int count = calendar.WorkdaysInYear(2025);
// → 261
```

**Signature:** `int WorkdaysInYear(int year)`

### NextWorkday

Return the next workday on or after the given date. If the date is already a workday, it is returned as-is:

```csharp
DateTime next = calendar.NextWorkday(new DateTime(2025, 3, 28)); // Friday
// → 2025-03-28 (already a workday)
```

**Signature:** `DateTime NextWorkday(DateTime date)`

### PreviousWorkday

Return the most recent workday on or before the given date. If the date is already a workday, it is returned as-is:

```csharp
DateTime prev = calendar.PreviousWorkday(new DateTime(2025, 3, 31)); // Monday
// → 2025-03-31 (already a workday)
```

**Signature:** `DateTime PreviousWorkday(DateTime date)`

### HasHolidayProvider

Returns `true` if this instance has an `IHolidayProvider` configured. It is a read-only property, not a method:

```csharp
bool has = calendar.HasHolidayProvider;
```

**Signature:** `bool HasHolidayProvider { get; }`

### HolidaysInMonth

Return all public holidays in a given month, using the configured holiday provider:

```csharp
IEnumerable<HolidayInfo> holidays = calendar.HolidaysInMonth(2025, 12);
```

**Signature:** `IEnumerable<HolidayInfo> HolidaysInMonth(int year, int month)`

Throws `InvalidOperationException` if no `IHolidayProvider` was passed to the constructor.

### HolidaysInYear

Return all public holidays in a given year, using the configured holiday provider:

```csharp
IEnumerable<HolidayInfo> holidays = calendar.HolidaysInYear(2025);
```

**Signature:** `IEnumerable<HolidayInfo> HolidaysInYear(int year)`

Throws `InvalidOperationException` if no `IHolidayProvider` was passed to the constructor.

### IsLeapYear

Return `true` if the given year is a leap year:

```csharp
bool leap = calendar.IsLeapYear(2024);
// → true
```

**Signature:** `bool IsLeapYear(int year)`

### DaysInYear

Return the number of days in the given year (365 or 366):

```csharp
int days = calendar.DaysInYear(2024);
// → 366
```

**Signature:** `int DaysInYear(int year)`

## Holiday Integration

`ValiCalendar` takes an optional `IHolidayProvider` in its constructor — a **single-country** provider (e.g. one obtained from [Vali-Holiday](../vali-holiday/overview.md) via `IValiHoliday.For(countryCode)`), not the multi-country `IValiHoliday` facade itself:

```csharp
using Vali_Calendar.Core;
using Vali_Holiday.Core;

IValiHoliday holidayFacade = HolidayProviderFactory.CreateLatinAmerica();
IHolidayProvider peruProvider = holidayFacade.For("PE");

var calendar = new ValiCalendar(WeekStart.Monday, peruProvider);
```

Each `ValiCalendar` instance is bound to one holiday provider. If you need workday logic for several countries, create one `ValiCalendar` per country.

## Complete Example

```csharp
using Vali_Calendar.Core;
using Vali_Holiday.Core;

public class HRCalendarFactory(IValiHoliday holiday)
{
    // One ValiCalendar instance per country — the holiday provider is bound at construction
    public IValiCalendar ForCountry(string countryCode)
        => new ValiCalendar(WeekStart.Monday, holiday.For(countryCode));
}

public class HRCalendarReports
{
    public void PrintMonthSummary(IValiCalendar calendar, int year, int month)
    {
        Console.WriteLine($"Days in month:     {calendar.DaysInMonth(new DateTime(year, month, 1))}");
        Console.WriteLine($"Workdays in month: {calendar.WorkdaysInMonth(year, month)}");
        Console.WriteLine($"Weeks in month:    {calendar.WeekCountInMonth(year, month)}");

        Console.WriteLine("Holidays this month:");
        foreach (var h in calendar.HolidaysInMonth(year, month))
            Console.WriteLine($"  {h.Month:D2}-{h.Day:D2} — {h.Name}");
    }

    public DateTime ComputePaymentDate(IValiCalendar calendar, DateTime issueDate)
    {
        // Payment due 5 business days after invoice date
        return calendar.AddWorkdays(issueDate, 5);
    }
}
```
