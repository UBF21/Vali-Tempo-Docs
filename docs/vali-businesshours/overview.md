---
id: overview
title: Vali-BusinessHours Overview
sidebar_label: Overview
description: Vali-BusinessHours resolves the simultaneous business-hours overlap window between two IANA timezones for .NET — DST-correct, midnight-crossing aware, workday-filterable.
keywords: [Vali-BusinessHours, business hours, timezone overlap, DST, .NET, NuGet, C#, scheduling]
---

# Vali-BusinessHours

`IValiBusinessHours` resolves the simultaneous business-hours overlap window between two IANA timezones, for a single calendar reference date. It composes `Vali-Calendar` and `Vali-TimeZone` without coupling either package to the other — each zone's real offset (including DST) is resolved at the specific instant evaluated, never a cached base offset, and the search accounts for the second window falling on the calendar day before or after the reference date once projected into the first zone (midnight-crossing).

:::info v1 scope
Exactly two timezones per call, a single daily business-hours block per zone (no recurrence/exceptions), and no automatic holiday filtering unless you opt in via `OverlapOnWorkday` with your own `IValiCalendar` per side.
:::

## Installation

```bash
dotnet add package Vali-BusinessHours
```

## Registration

```csharp
builder.Services.AddValiTimeZone();      // required dependency
builder.Services.AddValiBusinessHours();
// or via the meta-package:
builder.Services.AddValiTempo();
```

`AddValiBusinessHours()` registers `IValiBusinessHours` as a singleton. It requires an `IValiTimeZone` to already be registered (e.g. via `AddValiTimeZone()`) — `ValiBusinessHours` resolves it from the container.

## BusinessHoursWindow Struct

`BusinessHoursWindow` defines a single daily business-hours block for one IANA timezone — e.g. "09:00–18:00 in America/Lima". Assumed to apply identically on every workday (v1 does not support per-day or recurring exceptions).

| Property | Type | Description |
|---|---|---|
| `ZoneId` | `string` | The IANA timezone ID, e.g. `"America/Lima"` |
| `Start` | `TimeOnly` | The inclusive local start time of the business-hours block |
| `End` | `TimeOnly` | The exclusive local end time of the business-hours block. Must be later than `Start` |

**Signature:** `readonly record struct BusinessHoursWindow(string ZoneId, TimeOnly Start, TimeOnly End)`

## BusinessHoursOverlapResult Struct

`BusinessHoursOverlapResult` describes the outcome of resolving the overlap between two windows.

| Property | Type | Description |
|---|---|---|
| `HasOverlap` | `bool` | `true` if the two windows share any overlapping instant. When `false`, every other member is `null` |
| `StartUtc` | `DateTimeOffset?` | The start of the overlap window, as an absolute UTC instant |
| `EndUtc` | `DateTimeOffset?` | The end of the overlap window, as an absolute UTC instant |
| `StartInZoneA` | `DateTimeOffset?` | The start of the overlap window, projected to the first window's local timezone |
| `EndInZoneA` | `DateTimeOffset?` | The end of the overlap window, projected to the first window's local timezone |
| `StartInZoneB` | `DateTimeOffset?` | The start of the overlap window, projected to the second window's local timezone |
| `EndInZoneB` | `DateTimeOffset?` | The end of the overlap window, projected to the second window's local timezone |

## IValiBusinessHours API

### Overlap

Resolves the overlap between two `BusinessHoursWindow` instances for a given calendar date, interpreted in the first window's timezone:

```csharp
var lima = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(18, 0));
var madrid = new BusinessHoursWindow("Europe/Madrid", new TimeOnly(9, 0), new TimeOnly(18, 0));

BusinessHoursOverlapResult result = businessHours.Overlap(lima, madrid, new DateTime(2025, 6, 2));

if (result.HasOverlap)
{
    Console.WriteLine($"Overlap starts {result.StartInZoneA} Lima time");
    Console.WriteLine($"Overlap starts {result.StartInZoneB} Madrid time");
}
```

**Signature:** `BusinessHoursOverlapResult Overlap(BusinessHoursWindow a, BusinessHoursWindow b, DateTime referenceDate)`

Throws `ArgumentException` if either window's `Start` is not earlier than its `End`. Throws `TimeZoneNotFoundException` if either window's `ZoneId` cannot be resolved.

### OverlapOnWorkday

Same as `Overlap`, but first requires the reference date to be a workday in both sides' calendars (as resolved by each calendar's own `IsWorkday`, e.g. configured with each side's own holiday provider):

```csharp
IValiCalendar calendarLima = new ValiCalendar();
IValiCalendar calendarMadrid = new ValiCalendar();

var result = businessHours.OverlapOnWorkday(
    (lima, calendarLima),
    (madrid, calendarMadrid),
    new DateTime(2025, 6, 7)); // a Saturday → no overlap, calendars not even consulted for hours
```

**Signature:** `BusinessHoursOverlapResult OverlapOnWorkday((BusinessHoursWindow Window, IValiCalendar Calendar) a, (BusinessHoursWindow Window, IValiCalendar Calendar) b, DateTime referenceDate)`

Returns a result with `HasOverlap` set to `false` when the reference date is not a workday for either side, or when the windows otherwise don't overlap.

## Complete Example

```csharp
public class MeetingWindowFinder(IValiBusinessHours businessHours)
{
    public void FindOverlap(DateTime referenceDate)
    {
        var lima = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(18, 0));
        var madrid = new BusinessHoursWindow("Europe/Madrid", new TimeOnly(9, 0), new TimeOnly(18, 0));

        var result = businessHours.Overlap(lima, madrid, referenceDate);

        if (!result.HasOverlap)
        {
            Console.WriteLine("No shared business-hours window on this date.");
            return;
        }

        Console.WriteLine($"Overlap (UTC): {result.StartUtc:HH:mm} – {result.EndUtc:HH:mm}");
        Console.WriteLine($"Lima local:    {result.StartInZoneA:HH:mm} – {result.EndInZoneA:HH:mm}");
        Console.WriteLine($"Madrid local:  {result.StartInZoneB:HH:mm} – {result.EndInZoneB:HH:mm}");
    }
}
```
