---
id: changelog
title: Vali-TimeZone — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-TimeZone** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.1.0] — 2026-10-14

### Changed
- `ValiZoneInfo` is now a `sealed record` (previously a `sealed class`) — adds structural equality; `ToString()` format is unchanged.
- Added the `net10.0` target framework. Still pins `Vali-Time` at `1.0.1` — doesn't need any of its new 1.1.0 members.

---

## [1.0.0] — 2025-07-01

### Added
- `ValiZoneInfo` model with `Id`, `DisplayName`, `StandardName`, `BaseOffset`, `SupportsDst`, `CountryCode`, and `CountryName` properties.
- 45+ curated IANA timezone entries covering Latin America, North America, Europe, Asia, Oceania, and Africa.
- `ValiTimeZone` with conversion methods: `Convert`, `ConvertOffset`, `ToUtc`, `FromUtc`, `ToDateTimeOffset`.
- Offset queries: `GetOffset`, `GetBaseOffset`, `OffsetDiff`.
- DST awareness: `IsDst`.
- Zone discovery: `FindZone`, `AllZones`, `ZonesForCountry`, `IsValidZone`.
- Current time helpers: `Now`, `Today`.
- Comparison and formatting: `IsSameInstant`, `FormatWithZone`.
- IANA to Windows timezone identifier fallback for cross-platform compatibility.
- `AddValiTimeZone()` extension method for `IServiceCollection` DI registration.
