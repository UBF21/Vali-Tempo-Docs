---
id: examples
title: Vali-Range — Examples
sidebar_label: Examples
---

# Vali-Range — Examples

```bash
dotnet add package Vali-Range
```

## ThisQuarter — Get the Current Quarter Range

Retrieve the date range covering the current calendar quarter in a single call.

```csharp
using Vali_Range.Core;

var vr = new ValiRange();

DateRange quarter = vr.ThisQuarter();

Console.WriteLine($"Quarter start: {quarter.Start:yyyy-MM-dd}");  // e.g. → 2025-01-01
Console.WriteLine($"Quarter end:   {quarter.End:yyyy-MM-dd}");    // e.g. → 2025-03-31
Console.WriteLine($"Total days:    {quarter.Duration(TimeUnit.Days)}"); // → 90
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Range** NuGet package in the fiddle settings.
:::

---

## Overlaps + Intersection — Detect and Extract Overlap Between Two Ranges

Check whether two project timelines overlap, then extract the exact shared period.

```csharp
using Vali_Range.Core;

var vr = new ValiRange();

var projectA = vr.Create(new DateTime(2025, 1, 15), new DateTime(2025, 4, 30));
var projectB = vr.Create(new DateTime(2025, 3, 1),  new DateTime(2025, 6, 30));

bool doOverlap = vr.Overlaps(projectA, projectB);
Console.WriteLine($"Overlap: {doOverlap}"); // → True

if (doOverlap)
{
    DateRange? shared = vr.Intersection(projectA, projectB);
    Console.WriteLine($"Shared period: {shared.Value.Start:yyyy-MM-dd} → {shared.Value.End:yyyy-MM-dd}");
    // → 2025-03-01 → 2025-04-30
    Console.WriteLine($"Shared days: {shared.Value.Duration(TimeUnit.Days)}"); // → 61
}
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Range** NuGet package in the fiddle settings.
:::

---

## EachDay — Iterate Every Day in a Range

Enumerate all calendar days within a range to generate a daily report scaffold.

```csharp
using Vali_Range.Core;

var vr = new ValiRange();

var sprint = vr.Create(new DateTime(2025, 1, 6), new DateTime(2025, 1, 10));

Console.WriteLine("Sprint days:");
foreach (DateTime day in vr.EachDay(sprint))
{
    Console.WriteLine($"  {day:ddd, MMM dd yyyy}");
}

// → Mon, Jan 06 2025
// → Tue, Jan 07 2025
// → Wed, Jan 08 2025
// → Thu, Jan 09 2025
// → Fri, Jan 10 2025
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Range** NuGet package in the fiddle settings.
:::

---

## Gaps — Find Uncovered Periods Between Ranges

Given a list of scheduled ranges and a bounding container, find all unscheduled gaps.

```csharp
using Vali_Range.Core;

var vr = new ValiRange();

// Full year container
var year = vr.Create(new DateTime(2025, 1, 1), new DateTime(2025, 12, 31));

// Scheduled project ranges
var scheduled = new[]
{
    vr.Create(new DateTime(2025, 1, 15), new DateTime(2025, 3, 31)),
    vr.Create(new DateTime(2025, 5, 1),  new DateTime(2025, 7, 31)),
    vr.Create(new DateTime(2025, 9, 1),  new DateTime(2025, 11, 30)),
};

var gaps = vr.Gaps(scheduled, year).ToList();

Console.WriteLine($"Unscheduled periods: {gaps.Count}");
foreach (var gap in gaps)
{
    Console.WriteLine($"  {gap.Start:MMM dd} → {gap.End:MMM dd} ({gap.Duration(TimeUnit.Days)} days)");
}

// → Jan 01 → Jan 14  (14 days)
// → Apr 01 → Apr 30  (30 days)
// → Aug 01 → Aug 31  (31 days)
// → Dec 01 → Dec 31  (31 days)
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Range** NuGet package in the fiddle settings.
:::

---

## Subtract — Remove a Blackout Period From a Booking Window

Carve a maintenance blackout window out of a resource's booking availability, keeping whatever
remains on either side.

```csharp
using Vali_Range.Core;

var vr = new ValiRange();

var availability = vr.Create(new DateTime(2025, 1, 1), new DateTime(2025, 1, 31));
var blackout      = vr.Create(new DateTime(2025, 1, 10), new DateTime(2025, 1, 20));

IEnumerable<DateRange> bookable = vr.Subtract(availability, blackout);

foreach (DateRange window in bookable)
{
    Console.WriteLine($"  {window.Start:yyyy-MM-dd} → {window.End:yyyy-MM-dd}");
}

// → 2025-01-01 → 2025-01-09
// → 2025-01-21 → 2025-01-31
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Range** NuGet package in the fiddle settings.
:::
