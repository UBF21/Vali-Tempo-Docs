---
id: changelog
title: Vali-Time — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-Time** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.0.1] — 2026-03-25

### Changed
- Version bump to align NuGet publish. No API changes.

---

## [1.0.0] — 2025-07-01

### Added
- `ValiTime` with conversions across 8 time units (milliseconds, seconds, minutes, hours, days, weeks, months, years).
- `ValiDate` with date arithmetic and a full Quarter API (15+ methods).
- `IValiTime` and `IValiDate` interfaces for dependency injection and testing.
- `AddValiTime()` extension method for `IServiceCollection` DI registration.

### Fixed
- `SubtractTimes` now returns correct values for negative time differences instead of throwing or returning zero.
- `EndOf` tick precision corrected to return the last tick of the period rather than the start of the next.
- `TryConvert` and `TryParseTime` exception narrowing: only `FormatException` and `OverflowException` are caught; unexpected exceptions propagate correctly.
