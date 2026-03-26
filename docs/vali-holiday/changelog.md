---
id: changelog
title: Vali-Holiday — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-Holiday** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2025-07-01

### Added
- `HolidayInfo` model with multilingual support: Spanish (es), English (en), Portuguese (pt), French (fr), German (de).
- `IHolidayProvider` interface and `BaseHolidayProvider` abstract base class.
- `EasterCalculator` using the Gaussian algorithm, supporting 9 Easter-based movable holidays.
- Country providers for 35+ countries across Latin America and Europe.
- `HolidayProviderFactory` with `CreateAll()`, `CreateLatinAmerica()`, and `CreateEurope()` factory methods.
- `ValiHoliday` with provider management: `Register`, `Supports`, `SupportedCountries`.
- Holiday queries: `IsHoliday`, `GetHolidays`, `For`.
- Navigation helpers: `GetNextHolidayWithYear`, `GetPreviousHolidayWithYear`.
- Weekend helpers: `IsLongWeekend`, `HolidaysThisMonth`.
- `AddValiHoliday()` extension method for `IServiceCollection` DI registration.

### Performance
- `BaseHolidayProvider.IsHoliday` uses an O(1) `HashSet` cache per year to avoid repeated linear scans when checking the same year multiple times.
