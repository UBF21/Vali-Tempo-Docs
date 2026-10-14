---
id: changelog
title: Vali-Time — Historial de cambios
sidebar_label: Historial de cambios
---

# Historial de cambios

Todos los cambios notables de **Vali-Time** están documentados aquí.
Sigue [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y [Semantic Versioning](https://semver.org/).

---

## [1.1.0] — 2026-10-14

### Agregado
- `DurationStringParser` — parser público (`Parse`/`TryParse`) extraído de la gramática de cadenas de duración de `ParseTime`, reutilizado por `IParsable<ValiDuration>` de `Vali-Duration` para que ambos paquetes compartan exactamente una sola gramática.
- Enum `HumanizeCulture` (`En`/`Es`), reutilizado por el formateador de tiempo relativo `Humanize()` de `Vali-Age`.
- `Constants.IsClampedMonthEnd(originalDay, candidate)` — detección compartida de clamp de fin de mes, reutilizada por `ValiAge.Exact()`.
- Target framework `net10.0`.

### Modificado
- `StartOfWeek`/`IsWeekend`/`IsWeekday` consolidados en `DateTimeExtensions` como única fuente de verdad (antes duplicados en otros paquetes).

## [1.0.1] — 2026-03-25

### Modificado
- Incremento de versión para alinear la publicación en NuGet. Sin cambios en la API.

---

## [1.0.0] — 2025-07-01

### Agregado
- `ValiTime` con conversiones entre 8 unidades de tiempo (milisegundos, segundos, minutos, horas, días, semanas, meses, años).
- `ValiDate` con aritmética de fechas y una API completa de trimestres (más de 15 métodos).
- Interfaces `IValiTime` e `IValiDate` para inyección de dependencias y pruebas.
- Método de extensión `AddValiTime()` para el registro en DI con `IServiceCollection`.

### Corregido
- `SubtractTimes` ahora devuelve valores correctos para diferencias de tiempo negativas en lugar de lanzar una excepción o devolver cero.
- Precisión de ticks de `EndOf` corregida para devolver el último tick del período en lugar del inicio del siguiente.
- Restricción de excepciones en `TryConvert` y `TryParseTime`: solo se capturan `FormatException` y `OverflowException`; las excepciones inesperadas se propagan correctamente.
