---
id: examples
title: Vali-TimeZone — Examples
sidebar_label: Examples
---

# Examples

## Now

Get the current local time in the Lima timezone.

```csharp
using Vali_TimeZone.Core;

var tz = new ValiTimeZone();

DateTime nowInLima = tz.Now("America/Lima");

Console.WriteLine($"Current time in Lima: {nowInLima:yyyy-MM-dd HH:mm:ss}");
// → Current time in Lima: 2025-07-15 10:32:00  (UTC-5, no DST)
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-TimeZone** NuGet package in the fiddle settings.
:::

---

## Convert

Convert a datetime from one timezone to another (Lima to Tokyo).

```csharp
using Vali_TimeZone.Core;

var tz = new ValiTimeZone();

// A meeting starts at 10:00 AM in Lima (UTC-5)
var limaTime = new DateTime(2025, 7, 15, 10, 0, 0);

DateTime tokyoTime = tz.Convert(limaTime, "America/Lima", "Asia/Tokyo");

Console.WriteLine($"Lima:  {limaTime:yyyy-MM-dd HH:mm} (UTC-5)");
Console.WriteLine($"Tokyo: {tokyoTime:yyyy-MM-dd HH:mm} (UTC+9)");
// → Lima:  2025-07-15 10:00 (UTC-5)
// → Tokyo: 2025-07-16 00:00 (UTC+9)

TimeSpan diff = tz.OffsetDiff("America/Lima", "Asia/Tokyo", DateTime.UtcNow);
Console.WriteLine($"Offset difference: {diff.TotalHours:F0} hours");
// → Offset difference: 14 hours
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-TimeZone** NuGet package in the fiddle settings.
:::

---

## IsDst

Check whether Daylight Saving Time is currently active for a given timezone.

```csharp
using Vali_TimeZone.Core;

var tz = new ValiTimeZone();

var summerDate = new DateTime(2025, 7, 4);
var winterDate = new DateTime(2025, 1, 4);

bool dstSummer = tz.IsDst("America/New_York", summerDate);
bool dstWinter = tz.IsDst("America/New_York", winterDate);
bool dstLima   = tz.IsDst("America/Lima", DateTime.Now);

Console.WriteLine($"New York on {summerDate:MMM dd}: DST active = {dstSummer}");
// → New York on Jul 04: DST active = True  (EDT, UTC-4)

Console.WriteLine($"New York on {winterDate:MMM dd}: DST active = {dstWinter}");
// → New York on Jan 04: DST active = False (EST, UTC-5)

Console.WriteLine($"Lima (no DST zone):         DST active = {dstLima}");
// → Lima (no DST zone):         DST active = False
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-TimeZone** NuGet package in the fiddle settings.
:::

---

## OffsetDiff

Calculate the UTC offset difference between two timezones at a specific moment.

```csharp
using Vali_TimeZone.Core;

var tz = new ValiTimeZone();

// Compare several zone pairs at the same UTC instant
var utcNow = DateTime.UtcNow;

TimeSpan limaToTokyo   = tz.OffsetDiff("America/Lima",    "Asia/Tokyo",      utcNow);
TimeSpan limaToMadrid  = tz.OffsetDiff("America/Lima",    "Europe/Madrid",   utcNow);
TimeSpan nyToSaoPaulo  = tz.OffsetDiff("America/New_York","America/Sao_Paulo", utcNow);

Console.WriteLine($"Lima   → Tokyo:     {limaToTokyo.TotalHours:+0;-0} hours");
// → Lima   → Tokyo:     +14 hours

Console.WriteLine($"Lima   → Madrid:    {limaToMadrid.TotalHours:+0;-0} hours");
// → Lima   → Madrid:    +6 hours  (Madrid UTC+1, Lima UTC-5)

Console.WriteLine($"New York → São Paulo: {nyToSaoPaulo.TotalHours:+0;-0} hours");
// → New York → São Paulo: +1 hours  (Sao Paulo UTC-3, New York UTC-4 in summer)
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-TimeZone** NuGet package in the fiddle settings.
:::
