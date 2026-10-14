---
id: changelog
title: Vali-Bucket — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-Bucket** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — New package

### Added
- `IValiBucket.Bucketize` — groups raw timestamps into fixed-size, anchor-aligned buckets, counting how many fall in each.
- `IValiBucket.Aggregate<T>` — groups `(timestamp, value)` pairs into buckets, combining values per bucket via `BucketAggregation` (`Sum`, `Average`, `Count`, `Min`, `Max`).
- `IValiBucket.GetBucketFor` — O(1) lookup of the bucket a single timestamp belongs to, without bucketizing a whole collection.
- `BucketSize(decimal Amount, TimeUnit Unit)` — fixed-length bucket size (`Milliseconds` through `Weeks`); `Months`/`Years` throw `ArgumentOutOfRangeException`.
- `TimeBucket` / `TimeBucket<T>` — the bucket's `DateRange` plus `Count` (and `Value` for the aggregated overload).
- `AddValiBucket()` extension method for `IServiceCollection` DI registration.
- Reuses `Vali-Range`'s `DateRange` for each bucket's time span.
