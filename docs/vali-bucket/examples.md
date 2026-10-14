---
id: examples
title: Vali-Bucket — Examples
sidebar_label: Examples
---

# Vali-Bucket — Examples

```bash
dotnet add package Vali-Bucket
```

## Bucketize — Chart Event Volume in 15-Minute Windows

Group raw event timestamps into fixed 15-minute windows to feed a bar chart.

```csharp
using Vali_Bucket.Core;
using Vali_Bucket.Models;
using Vali_Time.Enums;

IValiBucket bucket = new ValiBucket();

var loginEvents = new[]
{
    new DateTime(2025, 1, 1, 9, 2, 0),
    new DateTime(2025, 1, 1, 9, 7, 0),
    new DateTime(2025, 1, 1, 9, 9, 0),
    new DateTime(2025, 1, 1, 9, 16, 0),
    new DateTime(2025, 1, 1, 9, 42, 0),
};

var buckets = bucket.Bucketize(loginEvents, new BucketSize(15, TimeUnit.Minutes));

foreach (var slot in buckets)
    Console.WriteLine($"{slot.Range.Start:HH:mm} - {slot.Range.End:HH:mm} → {slot.Count} logins");

// → 09:00 - 09:14 → 3 logins
// → 09:15 - 09:29 → 1 login
// → 09:30 - 09:44 → 1 login
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Bucket** NuGet package in the fiddle settings.
:::

---

## Aggregate — Average API Latency Per 5-Minute Window

Combine `(timestamp, value)` samples into buckets, computing the average latency observed in
each window.

```csharp
using Vali_Bucket.Core;
using Vali_Bucket.Enums;
using Vali_Bucket.Models;
using Vali_Time.Enums;

IValiBucket bucket = new ValiBucket();

var latencySamples = new[]
{
    (new DateTime(2025, 1, 1, 9, 2, 0), 120m),
    (new DateTime(2025, 1, 1, 9, 6, 0), 95m),
    (new DateTime(2025, 1, 1, 9, 9, 0), 180m),
    (new DateTime(2025, 1, 1, 9, 16, 0), 60m),
};

var buckets = bucket.Aggregate(latencySamples, new BucketSize(5, TimeUnit.Minutes), BucketAggregation.Average);

foreach (var slot in buckets)
    Console.WriteLine($"{slot.Range.Start:HH:mm} → avg {slot.Value:F2}ms over {slot.Count} samples");

// → 09:00 → avg 131.67ms over 3 samples
// → 09:15 → avg 60.00ms over 1 samples
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Bucket** NuGet package in the fiddle settings.
:::

---

## GetBucketFor — Streaming Hot-Path Lookup

Resolve which bucket an incoming event belongs to without re-bucketizing the whole stream — an
O(1) lookup suited to a live ingestion pipeline.

```csharp
using Vali_Bucket.Core;
using Vali_Bucket.Models;
using Vali_Time.Enums;

IValiBucket bucket = new ValiBucket();

var size = new BucketSize(1, TimeUnit.Hours);

void OnEventReceived(DateTime eventTime)
{
    TimeBucket slot = bucket.GetBucketFor(eventTime, size);
    Console.WriteLine($"Routed to hourly bucket starting {slot.Range.Start:yyyy-MM-dd HH:mm}");
}

OnEventReceived(new DateTime(2025, 1, 1, 9, 42, 0));
// → Routed to hourly bucket starting 2025-01-01 09:00
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Bucket** NuGet package in the fiddle settings.
:::

---

## Alignment Anchor — Comparable Buckets Across Separate Calls

Use an explicit anchor so that two independent calls over different data slices still line up on
the same grid — essential when merging bucketed results from multiple sources.

```csharp
using Vali_Bucket.Core;
using Vali_Bucket.Models;
using Vali_Time.Enums;

IValiBucket bucket = new ValiBucket();

var shiftOneAnchor = new DateTime(2025, 1, 1, 9, 0, 0);
var size = new BucketSize(15, TimeUnit.Minutes);

var shiftOneEvents = new[] { new DateTime(2025, 1, 1, 9, 10, 0) };
var shiftTwoEvents = new[] { new DateTime(2025, 1, 1, 10, 25, 0) };

var shiftOneBuckets = bucket.Bucketize(shiftOneEvents, size, shiftOneAnchor);
var shiftTwoBuckets = bucket.Bucketize(shiftTwoEvents, size, shiftOneAnchor);

Console.WriteLine(shiftOneBuckets[0].Range.Start); // → 2025-01-01 09:00:00
Console.WriteLine(shiftTwoBuckets[0].Range.Start); // → 2025-01-01 10:15:00
// Both calls used the same anchor, so the 15-minute grid lines up exactly between them.
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Bucket** NuGet package in the fiddle settings.
:::
