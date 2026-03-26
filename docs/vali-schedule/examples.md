---
id: examples
title: Vali-Schedule — Examples
sidebar_label: Examples
---

# Vali-Schedule — Examples

```bash
dotnet add package Vali-Schedule
```

## Daily schedule — Next 5 daily occurrences

Build a simple daily schedule starting from a fixed date and print the next 5 occurrences.

```csharp
using System;
using Vali_Schedule.Core;
using Vali_Schedule.Enums;

var schedule = new ValiSchedule();

var sched = schedule
    .Every(1, RecurrenceType.Daily)
    .At(9, 0)
    .StartingFrom(new DateTime(2025, 6, 15))
    .Build();

// Query the next 5 occurrences starting from the schedule's own start date
var from = new DateTime(2025, 6, 15);

Console.WriteLine("Daily standup — next 5 occurrences");
Console.WriteLine("------------------------------------");

int index = 1;
foreach (var occ in sched.Occurrences(5, from))
{
    Console.WriteLine($"  {index++}. {occ:ddd, MMM dd yyyy} at {occ:HH:mm}");
}
// Output:
// Daily standup — next 5 occurrences
// ------------------------------------
//   1. Sun, Jun 15 2025 at 09:00
//   2. Mon, Jun 16 2025 at 09:00
//   3. Tue, Jun 17 2025 at 09:00
//   4. Wed, Jun 18 2025 at 09:00
//   5. Thu, Jun 19 2025 at 09:00
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Schedule** NuGet package in the fiddle settings.
:::

---

## Weekly schedule — Mondays and Wednesdays

Use `On(DayOfWeek...)` to restrict a weekly schedule to specific days of the week.

```csharp
using System;
using Vali_Schedule.Core;
using Vali_Schedule.Enums;

var schedule = new ValiSchedule();

var sched = schedule
    .Every(1, RecurrenceType.Weekly)
    .On(DayOfWeek.Monday, DayOfWeek.Wednesday)
    .At(10, 30)
    .StartingFrom(new DateTime(2025, 6, 16)) // Monday
    .Build();

var from = new DateTime(2025, 6, 16);

Console.WriteLine("Bi-weekly sync — Mondays & Wednesdays (next 6 occurrences)");
Console.WriteLine("-------------------------------------------------------------");

int index = 1;
foreach (var occ in sched.Occurrences(6, from))
{
    Console.WriteLine($"  {index++}. {occ:dddd, MMMM dd yyyy} at {occ:HH:mm}");
}

// Verify a specific day
bool occursOnMonday    = sched.OccursOn(new DateTime(2025, 6, 16));
bool occursOnTuesday   = sched.OccursOn(new DateTime(2025, 6, 17));

Console.WriteLine();
Console.WriteLine($"Occurs on Monday  Jun 16 : {occursOnMonday}");
Console.WriteLine($"Occurs on Tuesday Jun 17 : {occursOnTuesday}");
// Output:
// Bi-weekly sync — Mondays & Wednesdays (next 6 occurrences)
// -------------------------------------------------------------
//   1. Monday, June 16 2025 at 10:30
//   2. Wednesday, June 18 2025 at 10:30
//   3. Monday, June 23 2025 at 10:30
//   4. Wednesday, June 25 2025 at 10:30
//   5. Monday, June 30 2025 at 10:30
//   6. Wednesday, July 02 2025 at 10:30
//
// Occurs on Monday  Jun 16 : True
// Occurs on Tuesday Jun 17 : False
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Schedule** NuGet package in the fiddle settings.
:::

---

## Monthly schedule — 15th of every month

Use `OnDayOfMonth` to pin a monthly recurrence to a specific calendar day.

```csharp
using System;
using Vali_Schedule.Core;
using Vali_Schedule.Enums;

var schedule = new ValiSchedule();

var sched = schedule
    .Every(1, RecurrenceType.Monthly)
    .OnDayOfMonth(15)
    .At(8, 0)
    .StartingFrom(new DateTime(2025, 1, 15))
    .Build();

var from = new DateTime(2025, 6, 1);

Console.WriteLine("Monthly invoice run — 15th of each month (next 6 occurrences)");
Console.WriteLine("----------------------------------------------------------------");

int index = 1;
foreach (var occ in sched.Occurrences(6, from))
{
    Console.WriteLine($"  {index++}. {occ:MMMM dd, yyyy} at {occ:HH:mm}");
}

// Spot-check two dates
bool onThe15th  = sched.OccursOn(new DateTime(2025, 8, 15));
bool onThe16th  = sched.OccursOn(new DateTime(2025, 8, 16));

Console.WriteLine();
Console.WriteLine($"Occurs on Aug 15 : {onThe15th}");
Console.WriteLine($"Occurs on Aug 16 : {onThe16th}");
// Output:
// Monthly invoice run — 15th of each month (next 6 occurrences)
// ----------------------------------------------------------------
//   1. June 15, 2025 at 08:00
//   2. July 15, 2025 at 08:00
//   3. August 15, 2025 at 08:00
//   4. September 15, 2025 at 08:00
//   5. October 15, 2025 at 08:00
//   6. November 15, 2025 at 08:00
//
// Occurs on Aug 15 : True
// Occurs on Aug 16 : False
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Schedule** NuGet package in the fiddle settings.
:::

---

## AfterOccurrences limit — Stopping after N occurrences

`EndsAfter(n)` caps the schedule at exactly N occurrences. Any query beyond that limit returns no results.

```csharp
using System;
using Vali_Schedule.Core;
using Vali_Schedule.Enums;

var schedule = new ValiSchedule();

// 8-week training program: every Monday and Thursday, limited to 16 sessions
var sched = schedule
    .Every(1, RecurrenceType.Weekly)
    .On(DayOfWeek.Monday, DayOfWeek.Thursday)
    .At(7, 0)
    .StartingFrom(new DateTime(2025, 6, 16)) // Monday
    .EndsAfter(16)
    .Build();

var from = new DateTime(2025, 6, 16);

// Fetch all sessions within the program
var allSessions = sched.Occurrences(20, from); // request more than 16

Console.WriteLine("8-week training program — all sessions");
Console.WriteLine("---------------------------------------");

int count = 0;
foreach (var session in allSessions)
{
    count++;
    Console.WriteLine($"  Session {count,2}: {session:ddd, MMM dd yyyy} at {session:HH:mm}");
}

Console.WriteLine();
Console.WriteLine($"Total sessions scheduled : {count}");

// After the program ends, NextOccurrence returns null
var lastSession  = new DateTime(2025, 8, 11); // after the 16th occurrence
DateTime? after  = sched.NextOccurrence(lastSession);

Console.WriteLine($"Next occurrence after program ends : {after?.ToString("MMM dd, yyyy") ?? "null (schedule ended)"}");
// Output:
// 8-week training program — all sessions
// ---------------------------------------
//   Session  1: Mon, Jun 16 2025 at 07:00
//   Session  2: Thu, Jun 19 2025 at 07:00
//   Session  3: Mon, Jun 23 2025 at 07:00
//   Session  4: Thu, Jun 26 2025 at 07:00
//   Session  5: Mon, Jun 30 2025 at 07:00
//   Session  6: Thu, Jul 03 2025 at 07:00
//   Session  7: Mon, Jul 07 2025 at 07:00
//   Session  8: Thu, Jul 10 2025 at 07:00
//   Session  9: Mon, Jul 14 2025 at 07:00
//   Session 10: Thu, Jul 17 2025 at 07:00
//   Session 11: Mon, Jul 21 2025 at 07:00
//   Session 12: Thu, Jul 24 2025 at 07:00
//   Session 13: Mon, Jul 28 2025 at 07:00
//   Session 14: Thu, Jul 31 2025 at 07:00
//   Session 15: Mon, Aug 04 2025 at 07:00
//   Session 16: Thu, Aug 07 2025 at 07:00
//
// Total sessions scheduled : 16
// Next occurrence after program ends : null (schedule ended)
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Schedule** NuGet package in the fiddle settings.
:::
