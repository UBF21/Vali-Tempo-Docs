---
id: changelog
title: Vali-CountDown — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-CountDown** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2025-07-01

### Added
- `ValiCountdown` with state queries: `IsExpired`, `IsStarted`.
- Time queries: `TimeUntil`, `TimeElapsed`.
- Progress queries: `Progress` (0.0–1.0) and `ProgressPercent` (0–100).
- `Breakdown` for a decomposed view of the remaining time (days, hours, minutes, seconds).
- `Format` for a human-readable countdown string.
- `IsWithin` to check whether the remaining time falls within a given threshold.
- All methods available with both a `DateTime` target overload and a reference-date overload.
- `AddValiCountdown()` extension method for `IServiceCollection` DI registration.
