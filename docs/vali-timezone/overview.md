---
id: overview
title: Vali-TimeZone Overview
sidebar_label: Overview
description: Vali-TimeZone provides IANA timezone support for .NET — convert between timezones, list zones, and calculate UTC offsets across 45+ supported IANA zones.
keywords: [Vali-TimeZone, IANA timezone, UTC, .NET, NuGet, C#, timezone conversion]
---

# Vali-TimeZone

`IValiTimeZone` provides IANA timezone conversion, DST awareness, offset computation, and zone discovery across 45+ curated zones. It wraps the .NET `TimeZoneInfo` API with a friendlier interface and consistent IANA identifiers.

## Installation

```bash
dotnet add package Vali-TimeZone
```

## Registration

```csharp
builder.Services.AddValiTimeZone();
// or via the meta-package:
builder.Services.AddValiTempo();
```

## ValiZoneInfo Class

`ValiZoneInfo` describes a timezone zone:

| Property | Type | Description |
|---|---|---|
| `Id` | `string` | IANA zone identifier (e.g. `"America/Lima"`) |
| `DisplayName` | `string` | Human-readable name with UTC offset (e.g. `"(UTC-05:00) Lima, Bogota, Quito"`) |
| `StandardName` | `string` | Windows/BCL standard timezone name used by `TimeZoneInfo.FindSystemTimeZoneById` (e.g. `"SA Pacific Standard Time"`) |
| `BaseOffset` | `TimeSpan` | Base UTC offset, without DST adjustments |
| `SupportsDst` | `bool` | True if this zone observes DST |
| `CountryCode` | `string` | ISO 3166-1 alpha-2 country code (e.g. `"PE"`) |
| `CountryName` | `string` | Full English country name (e.g. `"Peru"`) |

`ValiZoneInfo` is a `sealed record` (as of 1.1.0, previously a `sealed class`) — it gets structural equality for free; `ToString()` returns `"[PE] America/Lima (UTC-05:00)"`.

## IValiTimeZone API

### Convert

Convert a `DateTime` from one IANA timezone to another:

```csharp
DateTime lima = tz.Convert(utcTime, "UTC", "America/Lima");
DateTime tokyo = tz.Convert(nyTime, "America/New_York", "Asia/Tokyo");
```

**Signature:** `DateTime Convert(DateTime dateTime, string fromZone, string toZone)`

### ConvertOffset

Convert a `DateTimeOffset` to another zone, preserving the absolute instant in time. Since a `DateTimeOffset` already carries its own offset, only the target zone is needed:

```csharp
DateTimeOffset result = tz.ConvertOffset(dto, "Europe/Madrid");
```

**Signature:** `DateTimeOffset ConvertOffset(DateTimeOffset dateTimeOffset, string toZoneId)`

### ToUtc

Convert a local datetime in a named timezone to UTC:

```csharp
DateTime utc = tz.ToUtc(new DateTime(2025, 7, 15, 10, 0, 0), "America/Lima");
// → 2025-07-15 15:00:00 UTC (Lima is UTC-5)
```

**Signature:** `DateTime ToUtc(DateTime localTime, string fromZone)`

### FromUtc

Convert a UTC datetime to a named local timezone:

```csharp
DateTime local = tz.FromUtc(DateTime.UtcNow, "America/Sao_Paulo");
```

**Signature:** `DateTime FromUtc(DateTime utcTime, string toZone)`

### ToDateTimeOffset

Convert a `DateTime` in a given zone to a `DateTimeOffset` with the correct offset included:

```csharp
DateTimeOffset dto = tz.ToDateTimeOffset(localDateTime, "Europe/Madrid");
// → DateTimeOffset with +02:00 (summer) or +01:00 (winter)
```

**Signature:** `DateTimeOffset ToDateTimeOffset(DateTime dateTime, string zone)`

### GetOffset

Get the UTC offset for a specific datetime in a named zone (DST-aware):

```csharp
TimeSpan offset = tz.GetOffset("America/New_York", new DateTime(2025, 7, 1));
// → -04:00 (EDT, daylight saving time)

TimeSpan offset2 = tz.GetOffset("America/New_York", new DateTime(2025, 1, 1));
// → -05:00 (EST, standard time)

TimeSpan offsetNow = tz.GetOffset("America/New_York");
// → at is omitted, defaults to DateTime.UtcNow
```

**Signature:** `TimeSpan GetOffset(string zoneId, DateTime? at = null)`

### GetBaseOffset

Get the base (standard, non-DST) UTC offset for a zone:

```csharp
TimeSpan base1 = tz.GetBaseOffset("America/Lima");
// → -05:00 (Peru is always UTC-5, no DST)

TimeSpan base2 = tz.GetBaseOffset("Europe/Berlin");
// → +01:00 (standard time — CET)
```

**Signature:** `TimeSpan GetBaseOffset(string zone)`

### IsDst

Return `true` if DST is in effect for a given zone at a given time:

```csharp
bool dst = tz.IsDst(new DateTime(2025, 7, 4), "America/New_York");
// → true (summer — EDT)

bool notDst = tz.IsDst(new DateTime(2025, 1, 4), "America/New_York");
// → false (winter — EST)

bool neverDst = tz.IsDst(DateTime.Now, "America/Lima");
// → false (Lima has no DST)
```

**Signature:** `bool IsDst(DateTime dateTime, string zoneId)`

### OffsetDiff

Compute the offset difference between two zones at a given UTC moment:

```csharp
decimal diff = tz.OffsetDiff("America/Lima", "Asia/Tokyo", DateTime.UtcNow);
// → 14 (Lima UTC-5, Tokyo UTC+9 → diff of 14h). offsetDiff(zoneId1, zoneId2) = offset(zoneId1) - offset(zoneId2)

decimal diffNow = tz.OffsetDiff("America/Lima", "Asia/Tokyo");
// → at is omitted, defaults to DateTime.UtcNow
```

**Signature:** `decimal OffsetDiff(string zoneId1, string zoneId2, DateTime? at = null)` — returns the difference in decimal hours, not a `TimeSpan`.

### FindZone

Find a `ValiZoneInfo` by IANA identifier:

```csharp
ValiZoneInfo? zone = tz.FindZone("America/Lima");
if (zone is not null)
{
    Console.WriteLine(zone.DisplayName);
    Console.WriteLine(zone.SupportsDst);
}
```

**Signature:** `ValiZoneInfo? FindZone(string zoneId)`

### AllZones

Return all 45+ curated IANA zones:

```csharp
IEnumerable<ValiZoneInfo> all = tz.AllZones();
foreach (var z in all.OrderBy(z => z.BaseOffset))
    Console.WriteLine($"{z.Id,-35} {z.BaseOffset:hh\\:mm}");
```

**Signature:** `IEnumerable<ValiZoneInfo> AllZones()`

### ZonesForCountry

Return all curated zones for a given country code:

```csharp
IEnumerable<ValiZoneInfo> usZones = tz.ZonesForCountry("US");
// → America/New_York, America/Chicago, America/Denver, America/Los_Angeles, etc.
```

**Signature:** `IEnumerable<ValiZoneInfo> ZonesForCountry(string countryCode)`

### IsValidZone

Return `true` if the IANA zone identifier is recognized:

```csharp
bool valid = tz.IsValidZone("America/Lima");     // → true
bool invalid = tz.IsValidZone("Invalid/Zone");   // → false
```

**Signature:** `bool IsValidZone(string zoneId)`

### Now

Get the current local time in a named timezone:

```csharp
DateTime nowInTokyo = tz.Now("Asia/Tokyo");
DateTime nowInLima  = tz.Now("America/Lima");
```

**Signature:** `DateTime Now(string zone)`

### Today

Get the current calendar date in a named timezone:

```csharp
DateTime todayInSydney = tz.Today("Australia/Sydney");
// → May differ from UTC date when crossing midnight
```

**Signature:** `DateTime Today(string zone)`

### IsSameInstant

Return `true` if two datetime+zone pairs represent the same UTC instant:

```csharp
bool same = tz.IsSameInstant(
    new DateTime(2025, 7, 15, 10, 0, 0), "America/Lima",   // UTC-5
    new DateTime(2025, 7, 15, 15, 0, 0), "UTC");            // both are 15:00 UTC
// → true
```

**Signature:** `bool IsSameInstant(DateTime a, string zoneA, DateTime b, string zoneB)`

### FormatWithZone

Format a datetime with timezone information included:

```csharp
string formatted = tz.FormatWithZone(DateTime.Now, "America/Lima", "yyyy-MM-dd HH:mm zzz");
// → "2025-07-15 10:00 -05:00"

string formatted2 = tz.FormatWithZone(DateTime.Now, "Asia/Tokyo");
// → "2025-07-16 00:00 JST" (default format)
```

**Signature:** `string FormatWithZone(DateTime dateTime, string zoneId, string format = "yyyy-MM-dd HH:mm:ss zzz")`

## Curated Zones Sample

| IANA ID | Standard Offset | Country | DST |
|---|---|---|---|
| `UTC` | +00:00 | — | No |
| `America/New_York` | -05:00 | US | Yes |
| `America/Chicago` | -06:00 | US | Yes |
| `America/Denver` | -07:00 | US | Yes |
| `America/Los_Angeles` | -08:00 | US | Yes |
| `America/Lima` | -05:00 | PE | No |
| `America/Bogota` | -05:00 | CO | No |
| `America/Mexico_City` | -06:00 | MX | Yes |
| `America/Sao_Paulo` | -03:00 | BR | Yes |
| `America/Buenos_Aires` | -03:00 | AR | No |
| `Europe/London` | +00:00 | GB | Yes |
| `Europe/Paris` | +01:00 | FR | Yes |
| `Europe/Berlin` | +01:00 | DE | Yes |
| `Europe/Madrid` | +01:00 | ES | Yes |
| `Europe/Rome` | +01:00 | IT | Yes |
| `Asia/Tokyo` | +09:00 | JP | No |
| `Asia/Shanghai` | +08:00 | CN | No |
| `Asia/Kolkata` | +05:30 | IN | No |
| `Asia/Dubai` | +04:00 | AE | No |
| `Australia/Sydney` | +10:00 | AU | Yes |
| `Pacific/Auckland` | +12:00 | NZ | Yes |
| `Africa/Lagos` | +01:00 | NG | No |

## Complete Example

```csharp
public class GlobalMeetingScheduler(IValiTimeZone tz)
{
    public void ScheduleMeeting(DateTime utcTime)
    {
        var participants = new[]
        {
            ("Lima",    "America/Lima"),
            ("Madrid",  "Europe/Madrid"),
            ("Tokyo",   "Asia/Tokyo"),
            ("New York","America/New_York"),
        };

        Console.WriteLine($"Meeting UTC: {utcTime:HH:mm}");
        Console.WriteLine();

        foreach (var (city, zone) in participants)
        {
            DateTime local  = tz.FromUtc(utcTime, zone);
            TimeSpan offset = tz.GetOffset(zone, utcTime);
            bool     isDst  = tz.IsDst(utcTime, zone);

            Console.WriteLine($"{city,-12} {local:HH:mm} (UTC{offset:+hh\\:mm;-hh\\:mm}{(isDst ? " DST" : "")})");
        }

        // Find the time difference between Lima and Tokyo
        decimal diff = tz.OffsetDiff("America/Lima", "Asia/Tokyo", utcTime);
        Console.WriteLine($"\nLima ↔ Tokyo difference: {diff:F0} hours");
    }
}
```
