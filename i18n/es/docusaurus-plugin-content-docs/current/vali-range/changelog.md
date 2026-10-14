---
id: changelog
title: Vali-Range — Historial de cambios
sidebar_label: Historial de cambios
---

# Historial de cambios

Todos los cambios notables de **Vali-Range** están documentados aquí.
Sigue [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y [Semantic Versioning](https://semver.org/).

---

## [1.1.0] — 2026-10-14

### Agregado
- `IValiRange.Subtract(DateRange a, DateRange b)` — diferencia de conjuntos A \ B, completando el trío Intersection/Union/Subtract.

### Cambiado
- Se agregó el target framework `net10.0`. Sigue fijado a `Vali-Time` 1.0.1 — no necesita ninguno de sus miembros más nuevos.

---

## [1.0.0] — 2025-07-01

### Agregado
- Struct `DateRange` que representa un par de fechas inicio/fin.
- `ValiRange` con métodos de fábrica: `Create`, `LastUnits`, `NextUnits`, `ThisMonth`, `ThisWeek`, `ThisQuarter`, `ThisYear`.
- Consultas de rangos: `Contains`, `Overlaps`, `IsContainedBy`, `Intersection`, `Union`.
- Transformaciones de rangos: `Expand`, `Shrink`, `Shift`, `IsAdjacent`, `Merge`, `Gaps`.
- Helpers de enumeración: `EachDay`, `EachWeek`, `EachMonth`, `EachWorkday`.
- Helpers de división: `SplitByMonth`, `SplitByQuarter`.
- Método de extensión `AddValiRange()` para el registro en DI con `IServiceCollection`.

### Rendimiento
- `Merge` usa `Count == 0` en lugar de `Any()` para evitar enumeración innecesaria al verificar una colección vacía.
