---
id: overview
title: Vali-Bucket Overview
sidebar_label: Overview
description: Vali-Bucket groups timestamps and numeric time-series points into fixed-size, anchor-aligned time buckets for reporting and analytics in .NET.
keywords: [Vali-Bucket, time bucket, time series, aggregation, .NET, NuGet, C#, analytics]
---

# Vali-Bucket

`IValiBucket` groups timestamps into fixed-size, aligned time buckets for reporting and analytics — e.g. "bucket these 50,000 event timestamps into 15-minute windows for a chart." Buckets are aligned to an anchor (defaulting to `DateTime.MinValue`) so that separate calls with the same size and anchor always produce comparable, identically-aligned buckets. It reuses `Vali-Range`'s `DateRange` for each bucket's time span.

## Features

- **`Bucketize`** — group raw timestamps into fixed-size buckets, counting how many fall in each
- **`Aggregate<T>`** — group `(timestamp, value)` pairs into buckets, combining values per bucket with `Sum`/`Average`/`Count`/`Min`/`Max`
- **`GetBucketFor`** — O(1) lookup of the bucket a single timestamp belongs to, without bucketizing a whole collection — useful in a streaming hot path
- **Alignment anchor** — buckets from separate calls with the same size and anchor are always comparable, because bucket boundaries are computed from the anchor, not from the data
- Buckets with zero matching timestamps/points are omitted from results (no empty-bucket padding)
- Reuses `Vali-Range`'s `DateRange` for each bucket's time span

## Installation

```bash
dotnet add package Vali-Bucket
```

Compiled targets: `net8.0` · `net9.0` · `net10.0`. Compatible with .NET 6 and .NET 7 via NuGet backward compatibility.

## Registration

```csharp
builder.Services.AddValiBucket();
// or via the meta-package:
builder.Services.AddValiTempo();
```

## BucketSize

`BucketSize(decimal Amount, TimeUnit Unit)` defines the size of a bucket. Only fixed-length units
are supported — `Milliseconds`, `Seconds`, `Minutes`, `Hours`, `Days`, `Weeks`. `Months` and `Years`
have no constant tick length and throw `ArgumentOutOfRangeException` because bucket boundaries are
computed with pure tick arithmetic.

```csharp
var fifteenMinutes = new BucketSize(15, TimeUnit.Minutes);
var oneHour = new BucketSize(1, TimeUnit.Hours);
```

## TimeBucket / TimeBucket&lt;T&gt;

| Member | Type | Description |
|---|---|---|
| `Range` | `DateRange` | The bucket's time range (inclusive on both ends) |
| `Count` | `int` | Number of timestamps/points that fall within `Range` |
| `Value` (`TimeBucket<T>` only) | `T` | The aggregated value for the bucket, per the requested `BucketAggregation` |

## IValiBucket API

### Bucketize

Groups timestamps into buckets of a fixed size, aligned to an anchor. Buckets with zero matching
timestamps are omitted:

```csharp
var timestamps = new[]
{
    new DateTime(2025, 1, 1, 9, 2, 0),
    new DateTime(2025, 1, 1, 9, 7, 0),
    new DateTime(2025, 1, 1, 9, 16, 0),
};

var buckets = bucket.Bucketize(timestamps, new BucketSize(15, TimeUnit.Minutes));
// Two 15-minute buckets: [09:00–09:14:59.9999999] Count=2, [09:15–09:29:59.9999999] Count=1
```

**Signature:** `IReadOnlyList<TimeBucket> Bucketize(IEnumerable<DateTime> timestamps, BucketSize size, DateTime? anchor = null)`

Timestamps need not be sorted or distinct. Result is ordered by `Range` start, ascending. When
`anchor` is `null`, `DateTime.MinValue` is used.

### Aggregate&lt;T&gt;

Groups `(timestamp, value)` pairs into buckets, aggregating each bucket's values per
`BucketAggregation`:

```csharp
var points = new[]
{
    (new DateTime(2025, 1, 1, 9, 2, 0), 100m),
    (new DateTime(2025, 1, 1, 9, 7, 0), 50m),
    (new DateTime(2025, 1, 1, 9, 16, 0), 30m),
};

var totals = bucket.Aggregate(points, new BucketSize(15, TimeUnit.Minutes), BucketAggregation.Sum);
// [09:00 bucket].Value == 150m, [09:15 bucket].Value == 30m
```

**Signature:** `IReadOnlyList<TimeBucket<T>> Aggregate<T>(IEnumerable<(DateTime Timestamp, T Value)> points, BucketSize size, BucketAggregation aggregation, DateTime? anchor = null) where T : INumber<T>`

`BucketAggregation` is `Sum`, `Average`, `Count`, `Min`, or `Max`. Buckets with zero matching points
are omitted.

### GetBucketFor

Resolves the bucket a single timestamp falls into, without bucketizing an entire collection —
an O(1) lookup useful in a streaming/hot-path scenario:

```csharp
TimeBucket slot = bucket.GetBucketFor(DateTime.UtcNow, new BucketSize(1, TimeUnit.Hours));
```

**Signature:** `TimeBucket GetBucketFor(DateTime timestamp, BucketSize size, DateTime? anchor = null)`

`Count` is always `1` on the returned bucket — this overload does not consult any other data, it
only resolves the grid cell.

## v1 Scope

- No timezone/DST awareness — bucket boundaries are pure tick arithmetic over whatever
  `DateTime.Kind` the caller passes in. Convert to a consistent kind/zone before bucketizing if
  that matters for your data.
- No windowed/rolling aggregation (sliding windows, overlapping buckets) — buckets are always
  disjoint and grid-aligned.
- Only fixed-length units (`Milliseconds` through `Weeks`) — `Months`/`Years` throw
  `ArgumentOutOfRangeException`.

## Complete Example

```csharp
public class EventAnalytics(IValiBucket bucket)
{
    public void ReportHourlyActivity(IEnumerable<DateTime> eventTimestamps)
    {
        var hourly = bucket.Bucketize(eventTimestamps, new BucketSize(1, TimeUnit.Hours));

        foreach (var slot in hourly)
            Console.WriteLine($"{slot.Range.Start:HH:mm} — {slot.Count} events");
    }

    public void ReportAverageLatency(IEnumerable<(DateTime Timestamp, decimal LatencyMs)> samples)
    {
        var buckets = bucket.Aggregate(samples, new BucketSize(5, TimeUnit.Minutes), BucketAggregation.Average);

        foreach (var slot in buckets)
            Console.WriteLine($"{slot.Range.Start:HH:mm} — avg {slot.Value:F2}ms over {slot.Count} samples");
    }
}
```
