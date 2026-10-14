---
id: examples
title: Vali-BusinessHours — Examples
sidebar_label: Examples
---

# Examples

## Same relative offset — full overlap

Lima and a window with the same local hours and no offset difference overlap completely.

```csharp
using Vali_BusinessHours.Core;
using Vali_BusinessHours.Models;
using Vali_TimeZone.Core;

IValiTimeZone timeZone = new ValiTimeZone();
IValiBusinessHours businessHours = new ValiBusinessHours(timeZone);

var a = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(18, 0));
var b = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(18, 0));

var result = businessHours.Overlap(a, b, new DateTime(2025, 6, 2));

Console.WriteLine($"Has overlap: {result.HasOverlap}");
Console.WriteLine($"Zone A window: {result.StartInZoneA:HH:mm} – {result.EndInZoneA:HH:mm}");
// → Has overlap: True
// → Zone A window: 09:00 – 18:00
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-BusinessHours** NuGet package in the fiddle settings.
:::

---

## Lima and Madrid — partial overlap across a 7-hour gap

Lima (UTC-5, no DST) and Madrid (UTC+2 in June, CEST) both run 09:00–18:00 local. The real overlap is narrower than either window and lands at a different local time on each side.

```csharp
using Vali_BusinessHours.Core;
using Vali_BusinessHours.Models;
using Vali_TimeZone.Core;

IValiTimeZone timeZone = new ValiTimeZone();
IValiBusinessHours businessHours = new ValiBusinessHours(timeZone);

// Lima 09:00-18:00 local = 14:00-23:00 UTC.
// Madrid 09:00-18:00 local = 07:00-16:00 UTC.
// Overlap in UTC: max(14:00,07:00) .. min(23:00,16:00) = 14:00-16:00 UTC.
var lima = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(18, 0));
var madrid = new BusinessHoursWindow("Europe/Madrid", new TimeOnly(9, 0), new TimeOnly(18, 0));

var result = businessHours.Overlap(lima, madrid, new DateTime(2025, 6, 2));

Console.WriteLine($"Overlap (UTC): {result.StartUtc:HH:mm} – {result.EndUtc:HH:mm}");
Console.WriteLine($"Lima local:    {result.StartInZoneA:HH:mm} – {result.EndInZoneA:HH:mm}");
Console.WriteLine($"Madrid local:  {result.StartInZoneB:HH:mm} – {result.EndInZoneB:HH:mm}");
// → Overlap (UTC): 14:00 – 16:00
// → Lima local:    09:00 – 11:00
// → Madrid local:  16:00 – 18:00
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-BusinessHours** NuGet package in the fiddle settings.
:::

---

## No shared window

Lima and Tokyo both run short 09:00–11:00 windows, far enough apart that they never coincide on the same reference date.

```csharp
using Vali_BusinessHours.Core;
using Vali_BusinessHours.Models;
using Vali_TimeZone.Core;

IValiTimeZone timeZone = new ValiTimeZone();
IValiBusinessHours businessHours = new ValiBusinessHours(timeZone);

var lima = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(11, 0));
var tokyo = new BusinessHoursWindow("Asia/Tokyo", new TimeOnly(9, 0), new TimeOnly(11, 0));

var result = businessHours.Overlap(lima, tokyo, new DateTime(2025, 6, 2));

Console.WriteLine($"Has overlap: {result.HasOverlap}");
Console.WriteLine($"StartUtc is null: {result.StartUtc is null}");
// → Has overlap: False
// → StartUtc is null: True
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-BusinessHours** NuGet package in the fiddle settings.
:::

---

## Midnight-crossing — Los Angeles and Tokyo

Los Angeles (UTC-7 in June, PDT) 09:00–18:00 local spans 16:00 (Jun 2) to 01:00 (Jun 3) UTC. Tokyo's matching window actually falls on Jun 3 in UTC terms — the resolver checks the calendar day before and after the reference date in the second zone so a window that crosses midnight once projected is never missed.

```csharp
using Vali_BusinessHours.Core;
using Vali_BusinessHours.Models;
using Vali_TimeZone.Core;

IValiTimeZone timeZone = new ValiTimeZone();
IValiBusinessHours businessHours = new ValiBusinessHours(timeZone);

var la = new BusinessHoursWindow("America/Los_Angeles", new TimeOnly(9, 0), new TimeOnly(18, 0));
var tokyo = new BusinessHoursWindow("Asia/Tokyo", new TimeOnly(9, 0), new TimeOnly(18, 0));

var result = businessHours.Overlap(la, tokyo, new DateTime(2025, 6, 2));

Console.WriteLine($"Has overlap: {result.HasOverlap}");
Console.WriteLine($"Overlap (UTC): {result.StartUtc:yyyy-MM-dd HH:mm} – {result.EndUtc:yyyy-MM-dd HH:mm}");
// → Has overlap: True
// → Overlap (UTC): 2025-06-03 00:00 – 2025-06-03 01:00
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-BusinessHours** NuGet package in the fiddle settings.
:::

---

## OverlapOnWorkday — skip non-workdays before computing hours

Pair each window with its own `IValiCalendar` so weekends and holidays are filtered per side without any extra hour math.

```csharp
using Vali_BusinessHours.Core;
using Vali_BusinessHours.Models;
using Vali_Calendar.Core;
using Vali_TimeZone.Core;

IValiTimeZone timeZone = new ValiTimeZone();
IValiBusinessHours businessHours = new ValiBusinessHours(timeZone);

var lima = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(18, 0));
var madrid = new BusinessHoursWindow("Europe/Madrid", new TimeOnly(9, 0), new TimeOnly(18, 0));
IValiCalendar calendarLima = new ValiCalendar();
IValiCalendar calendarMadrid = new ValiCalendar();

var saturday = new DateTime(2025, 6, 7);
var saturdayResult = businessHours.OverlapOnWorkday((lima, calendarLima), (madrid, calendarMadrid), saturday);

var monday = new DateTime(2025, 6, 2);
var mondayResult = businessHours.OverlapOnWorkday((lima, calendarLima), (madrid, calendarMadrid), monday);

Console.WriteLine($"Saturday has overlap: {saturdayResult.HasOverlap}");
Console.WriteLine($"Monday has overlap:   {mondayResult.HasOverlap}");
// → Saturday has overlap: False
// → Monday has overlap:   True
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-BusinessHours** NuGet package in the fiddle settings.
:::
