---
id: changelog
title: Vali-Schedule — Historial de cambios
sidebar_label: Historial de cambios
---

# Historial de cambios

Todos los cambios notables de **Vali-Schedule** están documentados aquí.
Sigue [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y [Semantic Versioning](https://semver.org/).

---

## [1.1.0] — 2025-10-07

### Agregado
- `IValiSchedule.SkipWeekends()` y `SkipHolidays(IHolidayProvider, HolidaySkipStrategy)` para excluir ocurrencias en fines de semana/feriados, resueltas mediante `NextWorkday` (predeterminado), `PreviousWorkday` o `Skip`.
- Enumeración `HolidaySkipStrategy`.
- `IValiSchedule.OccurrencePeriods(DateTime from, DateTime to)` — empareja ocurrencias consecutivas en periodos `Vali_Range.Models.DateRange`.
- `Vali_Schedule.Cron.CronSchedule` — soporte de expresiones cron de 5 campos sin dependencias externas (`Parse`/`TryParse`), implementando `IValiSchedule`. Ver [Expresiones Cron](./cron.md).
- `Vali_Schedule.Cron.CronFormatException` — errores de parseo atribuidos a campo/token.

### Cambiado
- Se agregó el target framework `net10.0`.
- Nuevas dependencias entre paquetes: `Vali-Schedule` ahora referencia `Vali-Holiday` y `Vali-Range`. Solo `SkipHolidays()` requiere un `IHolidayProvider` concreto; `SkipWeekends()` no tiene ese requisito.

### Corregido
- `OccurrencePeriods` en `CronSchedule` cerraba su último periodo usando `.AddTicks(1)` como punto de búsqueda para la siguiente ocurrencia — con la resolución a granularidad de minuto de `CronSchedule`, esto nunca escapaba del slot de la ocurrencia actual, por lo que la búsqueda de cierre volvía a devolver la misma ocurrencia en lugar de la real siguiente. Corregido a `.AddMinutes(1)`.

## [1.0.0] — 2025-07-01

### Agregado
- Enumeración `RecurrenceType` con valores: `Daily`, `Weekly`, `Monthly`, `Yearly`, `Custom`.
- Constructor fluido `ValiSchedule` con métodos: `Every`, `On`, `At`, `StartingFrom`, `EndsAfter`, `EndsOn`, `WithCustomPredicate`.
- Consultas de ocurrencias: `NextOccurrence`, `PreviousOccurrence`, `OccursOn`.
- Enumeración masiva: `Occurrences`, `OccurrencesInRange`.
- Método de extensión `AddValiSchedule()` para el registro en DI con `IServiceCollection`.

### Rendimiento
- `Occurrences` y `OccurrencesInRange` usan un contador incremental para rastrear el índice de recurrencia, evitando exploraciones completas repetidas de la secuencia al iterar horarios grandes.
