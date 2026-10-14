---
id: changelog
title: Vali-Calendar — Historial de cambios
sidebar_label: Historial de cambios
---

# Historial de cambios

Todos los cambios notables de **Vali-Calendar** están documentados aquí.
Sigue [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y [Semantic Versioning](https://semver.org/).

---

## [1.0.1]

### Cambiado
- Se agregó el target `net10.0`. Sigue fijando `Vali-Time` en 1.0.1 y `Vali-Holiday` en 1.0.0 — no necesita ninguno de sus nuevos miembros (sin cambios en la API pública).

---

## [1.0.0] — 2025-07-01

### Agregado
- Struct `CalendarWeek` que representa una semana ISO con su año, número de semana, fecha de inicio y fecha de fin.
- `ValiCalendar` con utilidades de días laborables: `IsWorkday`, `WorkdaysBetween`, `AddWorkdays`, `NextWorkday`, `PreviousWorkday`.
- Utilidades de semana: `WeekOf`, `WeeksInMonth`.
- Agregados de mes y año: `WorkdaysInMonth`, `WorkdaysInYear`, `HolidaysInMonth`, `HolidaysInYear`.
- Integración opcional con `IHolidayProvider` para excluir feriados de los cálculos de días laborables.
- Método de extensión `AddValiCalendar()` para el registro en DI con `IServiceCollection`.

### Rendimiento
- `WeeksInMonth` usa una instancia `static readonly GregorianCalendar` para evitar asignaciones repetidas en cada llamada.
