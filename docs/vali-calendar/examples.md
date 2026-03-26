---
id: examples
title: Vali-Calendar — Examples
sidebar_label: Examples
---

# Vali-Calendar — Examples

```bash
dotnet add package Vali-Calendar
```

## AddWorkdays — Advance a Date by Business Days

Add a fixed number of business days to a date, automatically skipping weekends.

```csharp
using Vali_Calendar.Core;

var calendar = new ValiCalendar();

// Invoice issued on a Monday — payment due in 5 business days
DateTime issueDate  = new DateTime(2025, 1, 6);   // Monday Jan 6
DateTime dueDate    = calendar.AddWorkdays(issueDate, 5);

Console.WriteLine($"Issue date: {issueDate:ddd, MMM dd yyyy}");  // → Mon, Jan 06 2025
Console.WriteLine($"Due date:   {dueDate:ddd, MMM dd yyyy}");    // → Mon, Jan 13 2025
// Skips Saturday Jan 11 and Sunday Jan 12
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Calendar** NuGet package in the fiddle settings.
:::

---

## WorkdaysBetween — Count Business Days in a Period

Count the number of workdays between two dates, useful for SLA and billing calculations.

```csharp
using Vali_Calendar.Core;

var calendar = new ValiCalendar();

DateTime from = new DateTime(2025, 1, 6);   // Monday
DateTime to   = new DateTime(2025, 1, 31);  // Friday

int workdays = calendar.WorkdaysBetween(from, to);

Console.WriteLine($"Workdays in January (6–30): {workdays}"); // → 19

// Compare against total calendar days
int totalDays = (to - from).Days;
Console.WriteLine($"Calendar days: {totalDays}"); // → 25
Console.WriteLine($"Weekend days:  {totalDays - workdays}");  // → 6
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Calendar** NuGet package in the fiddle settings.
:::

---

## WeekOf — Get the ISO Calendar Week for a Date

Retrieve the full ISO 8601 week (Monday–Sunday) that contains a given date.

```csharp
using Vali_Calendar.Core;

var calendar = new ValiCalendar();

DateTime date = new DateTime(2025, 3, 15); // Saturday

CalendarWeek week = calendar.WeekOf(date);

Console.WriteLine($"Week number: {week.WeekNumber}");          // → 11
Console.WriteLine($"Week start:  {week.Start:ddd, MMM dd}");  // → Mon, Mar 10
Console.WriteLine($"Week end:    {week.End:ddd, MMM dd}");    // → Sun, Mar 16

Console.WriteLine("Days in week:");
foreach (DateTime day in week.Days)
    Console.WriteLine($"  {day:ddd dd}");
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Calendar** NuGet package in the fiddle settings.
:::

---

## NextWorkday / PreviousWorkday — Navigate to the Nearest Business Day

Jump forward or backward to the nearest workday from any date, including weekends.

```csharp
using Vali_Calendar.Core;

var calendar = new ValiCalendar();

// Starting from a Friday
DateTime friday = new DateTime(2025, 1, 10);

DateTime next = calendar.NextWorkday(friday);
Console.WriteLine($"Next workday after {friday:ddd MMM dd}: {next:ddd MMM dd}");
// → Mon Jan 13

// Starting from a Monday
DateTime monday = new DateTime(2025, 1, 13);

DateTime prev = calendar.PreviousWorkday(monday);
Console.WriteLine($"Previous workday before {monday:ddd MMM dd}: {prev:ddd MMM dd}");
// → Fri Jan 10

// Starting from a Saturday — jumps correctly in both directions
DateTime saturday = new DateTime(2025, 1, 11);
Console.WriteLine($"Next after Saturday:     {calendar.NextWorkday(saturday):ddd MMM dd}");     // → Mon Jan 13
Console.WriteLine($"Previous before Saturday: {calendar.PreviousWorkday(saturday):ddd MMM dd}"); // → Fri Jan 10
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Calendar** NuGet package in the fiddle settings.
:::
