---
id: changelog
title: Vali-Schedule — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-Schedule** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2025-07-01

### Added
- `RecurrenceType` enum with values: `Daily`, `Weekly`, `Monthly`, `Yearly`, `Custom`.
- `ValiSchedule` fluent builder with methods: `Every`, `On`, `At`, `StartingFrom`, `EndsAfter`, `EndsOn`, `WithCustomPredicate`.
- Occurrence queries: `NextOccurrence`, `PreviousOccurrence`, `OccursOn`.
- Bulk enumeration: `Occurrences`, `OccurrencesInRange`.
- `AddValiSchedule()` extension method for `IServiceCollection` DI registration.

### Performance
- `Occurrences` and `OccurrencesInRange` use an incremental counter to track recurrence index, avoiding repeated full-sequence scans when iterating large schedules.
