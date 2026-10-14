---
id: changelog
title: Vali-Age — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-Age** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.1.0]

### Added
- `Humanize()` relative-time formatting (es/en) via `HumanizeEngine`, built on `Vali-Time`'s `HumanizeCulture`.
- Stateless `DateTime.Humanize(...)` extension method (`Vali_Age.Extensions.DateTimeHumanizeExtensions`) delegating to the same internal engine — no DI required.
- `net10.0` target framework.

### Changed
- Temporarily depends on `Vali-Time`'s source via `ProjectReference` instead of a `PackageReference`, because `HumanizeCulture` doesn't exist in the published `Vali-Time` 1.0.1 package yet — switches to `PackageReference Version="1.1.0"` once `Vali-Time` republishes.

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
