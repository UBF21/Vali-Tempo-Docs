---
id: changelog
title: Vali-Holiday — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-Holiday** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.1.0]

### Added
- `IValiHoliday.IsHoliday(DateTime, params string[])` (ANY semantics) and `IsHolidayInAll(DateTime, params string[])` (ALL semantics) — multi-country holiday checks in a single call.
- `HolidayInfo.TryToDateTime(int year, out DateTime result)` — safe `(Month, Day, year)` conversion that returns `false` instead of throwing for Feb 29 in a non-leap year.
- `ObservedRule` enum and `IHolidayProvider.GetObservedDate(HolidayInfo, int)` / `IValiHoliday.GetObservedHoliday(DateTime, string)` — official weekend-shift ("observed"/"substitute" day) resolution, implemented for USA (Saturday → previous Friday, Sunday → following Monday) and United Kingdom (weekend → next available weekday, with coordinated Christmas Day/Boxing Day collision handling). No other provider declares a rule in this release.

### Changed
- `IsHoliday(DateTime, params string[])` and `IsHolidayInAll(DateTime, params string[])` now throw `ArgumentNullException` instead of `NullReferenceException` when called with a `null` array.
- `HolidayInfo` is now a `sealed record` (previously a `sealed class`) — adds structural equality; `ToString()` format is unchanged. `Names` is still compared by reference, since records do not deep-compare collections.
- Moved `UsaHolidayProvider.cs`/`CanadaHolidayProvider.cs` to `Providers/NorthAmerica/` and `AustraliaHolidayProvider.cs` to `Providers/Oceania/`, matching their already-declared namespaces (no namespace or behavior change).
- Added `net10.0` target.

### Fixed
- `BaseHolidayProvider.GetHolidaysInRange` and `ValiHoliday.GetNextHolidayWithYear`/`GetPreviousHolidayWithYear` now share a single Feb-29/non-leap-year guard (via `HolidayInfo.TryToDateTime`) instead of three independently-written checks.

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
