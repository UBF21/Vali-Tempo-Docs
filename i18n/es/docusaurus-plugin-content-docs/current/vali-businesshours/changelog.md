---
id: changelog
title: Vali-BusinessHours — Historial de cambios
sidebar_label: Historial de cambios
---

# Historial de cambios

Todos los cambios notables de **Vali-BusinessHours** están documentados aquí.
Sigue [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2025-07-01 (paquete nuevo)

### Agregado
- `IValiBusinessHours.Overlap` / `OverlapOnWorkday` — solapamiento de horario laboral entre zonas horarias, correcto con DST y con conciencia de cruce de medianoche, componiendo `Vali-Calendar` y `Vali-TimeZone` sin acoplarlos entre sí.
- Struct `BusinessHoursWindow` (readonly record struct) — `ZoneId`, `Start`, `End` describiendo un único bloque diario de horario laboral para una zona horaria IANA.
- Struct `BusinessHoursOverlapResult` (readonly struct) — `HasOverlap`, `StartUtc`, `EndUtc`, `StartInZoneA`, `EndInZoneA`, `StartInZoneB`, `EndInZoneB`.
- Método de extensión `AddValiBusinessHours()` para el registro en DI con `IServiceCollection`. Requiere que un `IValiTimeZone` ya esté registrado.
