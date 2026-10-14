---
id: changelog
title: Vali-CountDown — Historial de cambios
sidebar_label: Historial de cambios
---

# Historial de cambios

Todos los cambios notables de **Vali-CountDown** están documentados aquí.
Sigue [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y [Semantic Versioning](https://semver.org/).

---

## [1.0.1]

### Cambiado
- Se agregó el target `net10.0`. Sin cambios en la API pública.
- Interno: se eliminaron constantes duplicadas de conversión de ticks en favor de `TimeSpan.TicksPerX` — solo interno, sin cambios en la API pública.

---

## [1.0.0] — 2025-07-01

### Agregado
- `ValiCountdown` con consultas de estado: `IsExpired`, `IsStarted`.
- Consultas de tiempo: `TimeUntil`, `TimeElapsed`.
- Consultas de progreso: `Progress` (0.0–1.0) y `ProgressPercent` (0–100).
- `Breakdown` para una vista descompuesta del tiempo restante (días, horas, minutos, segundos).
- `Format` para una cadena de cuenta regresiva legible para humanos.
- `IsWithin` para verificar si el tiempo restante está dentro de un umbral dado.
- Todos los métodos disponibles tanto con una sobrecarga de `DateTime` objetivo como con una sobrecarga de fecha de referencia.
- Método de extensión `AddValiCountdown()` para el registro en DI con `IServiceCollection`.
