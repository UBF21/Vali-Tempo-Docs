---
id: changelog
title: Vali-TimeZone — Historial de cambios
sidebar_label: Historial de cambios
---

# Historial de cambios

Todos los cambios notables de **Vali-TimeZone** están documentados aquí.
Sigue [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y [Semantic Versioning](https://semver.org/).

---

## [1.1.0] — 2026-10-14

### Cambiado
- `ValiZoneInfo` ahora es un `sealed record` (antes era un `sealed class`) — obtiene igualdad estructural; el formato de `ToString()` no cambia.
- Se agregó el target framework `net10.0`. Sigue fijado a `Vali-Time` en `1.0.1` — no necesita ninguno de sus nuevos miembros de la 1.1.0.

---

## [1.0.0] — 2025-07-01

### Agregado
- Modelo `ValiZoneInfo` con propiedades `Id`, `DisplayName`, `StandardName`, `BaseOffset`, `SupportsDst`, `CountryCode` y `CountryName`.
- Más de 45 entradas de zonas horarias IANA seleccionadas que cubren América Latina, Norteamérica, Europa, Asia, Oceanía y África.
- `ValiTimeZone` con métodos de conversión: `Convert`, `ConvertOffset`, `ToUtc`, `FromUtc`, `ToDateTimeOffset`.
- Consultas de offset: `GetOffset`, `GetBaseOffset`, `OffsetDiff`.
- Conciencia de DST: `IsDst`.
- Descubrimiento de zonas: `FindZone`, `AllZones`, `ZonesForCountry`, `IsValidZone`.
- Helpers de hora actual: `Now`, `Today`.
- Comparación y formateo: `IsSameInstant`, `FormatWithZone`.
- Compatibilidad con identificadores de zona horaria IANA a Windows para compatibilidad multiplataforma.
- Método de extensión `AddValiTimeZone()` para el registro en DI con `IServiceCollection`.
