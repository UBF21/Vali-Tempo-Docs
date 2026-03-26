---
id: changelog
title: Vali-TimeZone — Changelog
sidebar_label: Changelog
---

# Changelog

All notable changes to **Vali-TimeZone** are documented here.
Follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2025-07-01

### Added
- `ValiZoneInfo` model with `Id`, `DisplayName`, `Country`, `StandardOffset`, `CurrentOffset`, `SupportsDst`, and `BaseUtcOffset` properties.
- 45+ curated IANA timezone entries covering Latin America, North America, Europe, Asia, Oceania, and Africa.
- `ValiTimeZone` with conversion methods: `Convert`, `ConvertOffset`, `ToUtc`, `FromUtc`, `ToDateTimeOffset`.
- Offset queries: `GetOffset`, `GetBaseOffset`, `OffsetDiff`.
- DST awareness: `IsDst`.
- Zone discovery: `FindZone`, `AllZones`, `ZonesForCountry`, `IsValidZone`.
- Current time helpers: `Now`, `Today`.
- Comparison and formatting: `IsSameInstant`, `FormatWithZone`.
- IANA to Windows timezone identifier fallback for cross-platform compatibility.
- `AddValiTimeZone()` extension method for `IServiceCollection` DI registration.
