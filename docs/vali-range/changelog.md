---
id: changelog
title: Vali-Range — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-Range** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2025-07-01

### Added
- `DateRange` struct representing a start/end date pair.
- `ValiRange` with factory methods: `Create`, `LastUnits`, `NextUnits`, `ThisMonth`, `ThisWeek`, `ThisQuarter`, `ThisYear`.
- Range queries: `Contains`, `Overlaps`, `IsContainedBy`, `Intersection`, `Union`.
- Range transformations: `Expand`, `Shrink`, `Shift`, `IsAdjacent`, `Merge`, `Gaps`.
- Enumeration helpers: `EachDay`, `EachWeek`, `EachMonth`, `EachWorkday`.
- Split helpers: `SplitByMonth`, `SplitByQuarter`.
- `AddValiRange()` extension method for `IServiceCollection` DI registration.

### Performance
- `Merge` uses `Count == 0` instead of `Any()` to avoid unnecessary enumeration when checking for an empty collection.
