---
id: changelog
title: Vali-Duration — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-Duration** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.1.0]

### Added
- `IParsable<ValiDuration>` — `Parse`/`TryParse` human-readable duration strings (colon-separated `"hh:mm:ss"`/`"mm:ss"` or unit-labelled tokens like `"2d 4h 30m 15s"`), via the shared `DurationStringParser` extracted from `Vali-Time`.
- `IFormattable` — `ToString(string?, IFormatProvider?)`, using the format string as `Format(int)`'s `decimalPlaces` when it parses as a non-negative integer.
- Added net10.0 target framework.

### Changed
- Now depends on `Vali-Time` 1.1.0 (for the shared `DurationStringParser`). No breaking changes.

---

## [1.0.0] — 2025-07-01

### Added
- `ValiDuration` struct with decimal precision for sub-millisecond accuracy.
- Factory methods: `FromMilliseconds`, `FromSeconds`, `FromMinutes`, `FromHours`, `FromDays`, `FromWeeks`.
- Arithmetic operators: `+`, `-`, `*`, `/`.
- Comparison operators: `<`, `>`, `<=`, `>=`, `==`, `!=`.
- `IEquatable<ValiDuration>` and `IComparable<ValiDuration>` implementations.
- Implicit conversion to and from `TimeSpan`.
- `Format()` for human-readable string output.
- `As(TimeUnit)` to convert the duration value into a specific unit.
