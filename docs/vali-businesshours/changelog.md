---
id: changelog
title: Vali-BusinessHours — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-BusinessHours** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2025-07-01 (new package)

### Added
- `IValiBusinessHours.Overlap` / `OverlapOnWorkday` — cross-timezone business-hours overlap, DST-correct and midnight-crossing aware, composing `Vali-Calendar` and `Vali-TimeZone` without coupling them to each other.
- `BusinessHoursWindow` readonly record struct — `ZoneId`, `Start`, `End` describing a single daily business-hours block for one IANA timezone.
- `BusinessHoursOverlapResult` readonly struct — `HasOverlap`, `StartUtc`, `EndUtc`, `StartInZoneA`, `EndInZoneA`, `StartInZoneB`, `EndInZoneB`.
- `AddValiBusinessHours()` extension method for `IServiceCollection` DI registration. Requires an `IValiTimeZone` to already be registered.
