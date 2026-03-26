---
id: changelog
title: Vali-Age — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-Age** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2025-07-01

### Added
- `AgeResult` struct with `Years`, `Months`, `Days`, and `TotalDays` properties.
- `ValiAge` with age calculation methods: `Years`, `Exact`.
- Formatting helpers: `Format` and `Relative`.
- Birthday utilities: `IsBirthday`, `NextBirthday`, `DaysUntilBirthday`.
- Threshold check: `IsAtLeast`.
- Correct handling of February 29 birthdays in non-leap years (resolved to Feb 28).
- `AddValiAge()` extension method for `IServiceCollection` DI registration.

### Fixed
- `NextBirthday` now correctly advances to the following year when the birthday has already occurred in the current year, instead of returning a past date.
