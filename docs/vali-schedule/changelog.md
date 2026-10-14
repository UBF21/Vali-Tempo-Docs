---
id: changelog
title: Vali-Schedule — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-Schedule** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.1.0] — 2025-10-07

### Added
- `IValiSchedule.SkipWeekends()` and `SkipHolidays(IHolidayProvider, HolidaySkipStrategy)` to exclude weekend/holiday occurrences, resolved via `NextWorkday` (default), `PreviousWorkday`, or `Skip`.
- `HolidaySkipStrategy` enum.
- `IValiSchedule.OccurrencePeriods(DateTime from, DateTime to)` — pairs consecutive occurrences into `Vali_Range.Models.DateRange` periods.
- `Vali_Schedule.Cron.CronSchedule` — zero-dependency 5-field cron expression support (`Parse`/`TryParse`), implementing `IValiSchedule`. See [Cron Expressions](./cron.md).
- `Vali_Schedule.Cron.CronFormatException` — field/token-attributed parse errors.

### Changed
- Added the `net10.0` target framework.
- New cross-package dependencies: `Vali-Schedule` now references `Vali-Holiday` and `Vali-Range`. Only `SkipHolidays()` requires a concrete `IHolidayProvider`; `SkipWeekends()` has no such requirement.

### Fixed
- `OccurrencePeriods` on `CronSchedule` used to close its last period with `.AddTicks(1)` as the search start for the next occurrence — at `CronSchedule`'s minute-granularity resolution this never escaped the current occurrence's slot, so the closing lookup re-returned the same occurrence instead of the real next one. Fixed to `.AddMinutes(1)`.

## [1.0.0] — 2025-07-01

### Added
- `RecurrenceType` enum with values: `Daily`, `Weekly`, `Monthly`, `Yearly`, `Custom`.
- `ValiSchedule` fluent builder with methods: `Every`, `On`, `At`, `StartingFrom`, `EndsAfter`, `EndsOn`, `WithCustomPredicate`.
- Occurrence queries: `NextOccurrence`, `PreviousOccurrence`, `OccursOn`.
- Bulk enumeration: `Occurrences`, `OccurrencesInRange`.
- `AddValiSchedule()` extension method for `IServiceCollection` DI registration.

### Performance
- `Occurrences` and `OccurrencesInRange` use an incremental counter to track recurrence index, avoiding repeated full-sequence scans when iterating large schedules.
