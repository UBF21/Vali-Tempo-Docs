---
id: changelog
title: Vali-Calendar — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-Calendar** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.0.1]

### Changed
- Added `net10.0` target. Still pins `Vali-Time` at 1.0.1 and `Vali-Holiday` at 1.0.0 — doesn't need any of their new members (no public API change).

---

## [1.0.0] — 2025-07-01

### Added
- `CalendarWeek` struct representing an ISO week with its year, week number, start date, and end date.
- `ValiCalendar` with workday utilities: `IsWorkday`, `WorkdaysBetween`, `AddWorkdays`, `NextWorkday`, `PreviousWorkday`.
- Week utilities: `WeekOf`, `WeeksInMonth`.
- Month and year aggregates: `WorkdaysInMonth`, `WorkdaysInYear`, `HolidaysInMonth`, `HolidaysInYear`.
- Optional `IHolidayProvider` integration to exclude holidays from workday calculations.
- `AddValiCalendar()` extension method for `IServiceCollection` DI registration.

### Performance
- `WeeksInMonth` uses a `static readonly GregorianCalendar` instance to avoid repeated allocations on each call.
