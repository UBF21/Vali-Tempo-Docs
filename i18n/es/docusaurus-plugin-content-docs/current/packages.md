---
id: packages
title: Referencia de paquetes
sidebar_label: Paquetes
description: Referencia completa de los 12 paquetes NuGet de Vali-Tempo. Instala módulos individuales o el meta-paquete Vali-Tempo para obtenerlos todos de una vez.
keywords: [Vali-Tempo, paquetes NuGet, Vali-Time, Vali-Range, Vali-Calendar, Vali-Duration, Vali-Schedule, Vali-Holiday, Vali-TimeZone, Vali-BusinessHours, Vali-Bucket, .NET]
---

# Referencia de paquetes

Vali-Tempo se distribuye como 12 paquetes NuGet independientes. Instala solo los módulos que necesites, o usa `Vali-Tempo` para obtenerlos todos.

## Todos los paquetes

| Paquete | Versión | Descripción | Marcos de destino |
|---|---|---|---|
| [Vali-Time](#vali-time) | 1.1.0 | Conversiones de unidades de tiempo + ValiDate | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Range](#vali-range) | 1.1.0 | Operaciones con rangos de fechas | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Calendar](#vali-calendar) | 1.0.1 | Calendario laboral | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Duration](#vali-duration) | 1.1.0 | Struct Duration decimal | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-CountDown](#vali-countdown) | 1.0.1 | Cuenta regresiva y seguimiento de plazos | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Age](#vali-age) | 1.1.0 | Cálculo de edad | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Schedule](#vali-schedule) | 1.1.0 | Constructor de horarios recurrentes + cron | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Holiday](#vali-holiday) | 1.1.0 | Datos de feriados para más de 35 países | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-TimeZone](#vali-timezone) | 1.1.0 | Conversión de zonas horarias IANA | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-BusinessHours](#vali-businesshours) | 1.0.0 | Solapamiento de horario laboral entre zonas horarias | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Bucket](#vali-bucket) | 1.0.0 | Agrupación de series temporales en buckets de tamaño fijo | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Tempo](#vali-tempo-meta) | 1.1.1 | Meta-paquete (todos los módulos) | net6.0, net7.0, net8.0, net9.0, net10.0 |

---

## Vali-Time

**NuGet:** [nuget.org/packages/Vali-Time](https://www.nuget.org/packages/Vali-Time)

```bash
dotnet add package Vali-Time
```

**Proporciona:**
- `IValiTime` — Convert, SumTimes, SubtractTimes, FormatTime, GetBestUnit, ParseTime, Breakdown, ToTimeSpan, FromTimeSpan, Clamp, Compare, MultiConvert
- `IValiDate` — Diff, Add, Subtract, StartOf, EndOf, IsBefore, IsAfter, IsSameDay, IsSamePeriod, IsWeekend, IsWeekday, IsLeapYear, DaysInMonth, WeekOfYear, WeekYear, DayOfYear, ProgressInYear, ProgressInMonth
- `IValiDateQuarter` — QuarterOf, QuarterStart, QuarterEnd, QuarterNameFull, DaysInQuarter, ProgressInQuarter, NextQuarterStart, TryNextQuarterStart, PreviousQuarterStart, TryPreviousQuarterStart, etc.
- `DurationStringParser` *(nuevo en 1.1.0)* — parser público detrás de `ParseTime`, reutilizado directamente por el `IParsable<ValiDuration>` de `Vali-Duration`
- Enumeración `HumanizeCulture` *(nueva en 1.1.0)* (`En`/`Es`) — reutilizada por `Humanize()` de `Vali-Age`
- `DateTimeExtensions` — `StartOfWeek`/`IsWeekend`/`IsWeekday`, ahora la única fuente de verdad reutilizada en todo el ecosistema
- Enumeraciones: `TimeUnit`, `DatePart`, `WeekStart`

**Registro:** `services.AddValiTime()`

---

## Vali-Range

**NuGet:** [nuget.org/packages/Vali-Range](https://www.nuget.org/packages/Vali-Range)

```bash
dotnet add package Vali-Range
```

**Proporciona:**
- `IValiRange` — Create, LastUnits, NextUnits, ThisMonth/ThisWeek/ThisQuarter/ThisYear, Contains, Overlaps, IsContainedBy, Intersection, Union, **Subtract** *(nuevo en 1.1.0 — diferencia teórica de conjuntos A \ B)*, Expand, Shrink, Shift, IsAdjacent, Merge, Gaps(ranges, container), EachDay/EachWeek/EachMonth, EachWorkday, SplitByDay/Week/Month/Quarter
- Struct `DateRange` — Start, End, Duration, TotalDays, IsEmpty

**Registro:** `services.AddValiRange()`

---

## Vali-Calendar

**NuGet:** [nuget.org/packages/Vali-Calendar](https://www.nuget.org/packages/Vali-Calendar)

```bash
dotnet add package Vali-Calendar
```

**Proporciona:**
- `IValiCalendar` — WeekOf, CurrentWeek, WeeksInMonth, WeekCountInMonth, IsFirstDayOfMonth, IsLastDayOfMonth, DaysInMonth, DaysOfMonth, IsWorkday, WorkdaysBetween, AddWorkdays, WorkdaysInMonth, WorkdaysInYear, NextWorkday, PreviousWorkday, HasHolidayProvider, HolidaysInMonth, HolidaysInYear, IsLeapYear, DaysInYear
- Struct `CalendarWeek` — Year, WeekNumber, Start, End, Days

**Registro:** `services.AddValiCalendar()`

---

## Vali-Duration

**NuGet:** [nuget.org/packages/Vali-Duration](https://www.nuget.org/packages/Vali-Duration)

```bash
dotnet add package Vali-Duration
```

**Proporciona:**
- Struct `ValiDuration` — FromMilliseconds hasta FromYears, FromTimeSpan, Zero; TotalMilliseconds hasta TotalDays; As, Format, ToTimeSpan; operadores aritméticos (+, -, *, /); operadores de comparación; conversiones implícitas hacia/desde `TimeSpan`
- `IParsable<ValiDuration>`/`IFormattable` *(nuevo en 1.1.0)* — `Parse`/`TryParse` de un string de duración (`"1h30m"`, `"2d 4h"`, etc.) y `ToString(format, provider)`, construido sobre el `DurationStringParser` compartido de `Vali-Time`

**Nota:** `ValiDuration` es un tipo de valor autónomo — no requiere registro en DI.

---

## Vali-CountDown

**NuGet:** [nuget.org/packages/Vali-CountDown](https://www.nuget.org/packages/Vali-CountDown)

```bash
dotnet add package Vali-CountDown
```

**Proporciona:**
- `IValiCountdown` — IsExpired, TimeUntil, TimeElapsed, Progress, ProgressPercent, Breakdown, Format, IsWithin, IsStarted(from) — devuelve `true` si el instante de inicio está en el pasado o presente

**Registro:** `services.AddValiCountdown()`

---

## Vali-Age

**NuGet:** [nuget.org/packages/Vali-Age](https://www.nuget.org/packages/Vali-Age)

```bash
dotnet add package Vali-Age
```

**Proporciona:**
- `IValiAge` — Years, Exact, Format, Relative, IsAtLeast, IsBirthday, NextBirthday, PreviousBirthday, DaysUntilBirthday
- `Humanize()` *(nuevo en 1.1.0)* — formateo de tiempo relativo (`"3 days ago"`, `"hace 2 semanas"`) en `es`/`en`, vía `HumanizeEngine` construido sobre `HumanizeCulture` de `Vali-Time`
- Struct `AgeResult` — Years, Months, Days, TotalDays, Birthdate
- Convención de año bisiesto para el 29 de febrero manejada automáticamente

**Registro:** `services.AddValiAge()`

---

## Vali-Schedule

**NuGet:** [nuget.org/packages/Vali-Schedule](https://www.nuget.org/packages/Vali-Schedule)

```bash
dotnet add package Vali-Schedule
```

**Proporciona:**
- Constructor fluido `IValiSchedule` — Every, On, At, StartingFrom, EndsAfter, EndsOn, OnDayOfMonth, WithCustomPredicate, **SkipWeekends()**, **SkipHolidays(IHolidayProvider, HolidaySkipStrategy)** *(ambos nuevos en 1.1.0)*, Build
- Métodos de consulta — NextOccurrence, PreviousOccurrence, OccursOn, Occurrences, OccurrencesInRange, **OccurrencePeriods(from, to)** *(nuevo en 1.1.0 — empareja ocurrencias consecutivas en períodos `DateRange`)*
- `Vali_Schedule.Cron.CronSchedule` *(nuevo en 1.1.0)* — soporte de expresiones cron de 5 campos sin dependencias (`Parse`/`TryParse`), implementa `IValiSchedule` como motor paralelo para horarios con múltiples ocurrencias por día
- Enumeraciones: `RecurrenceType` (Daily, Weekly, Monthly, Yearly), `RecurrenceEnd` (Never, AfterOccurrences, OnDate), `HolidaySkipStrategy`

**Registro:** `services.AddValiSchedule()` — registrar como **Transient** o **Scoped** (no como Singleton)

---

## Vali-Holiday

**NuGet:** [nuget.org/packages/Vali-Holiday](https://www.nuget.org/packages/Vali-Holiday)

```bash
dotnet add package Vali-Holiday
```

**Proporciona:**
- `IValiHoliday` — Register, For, Supports, SupportedCountries, IsHoliday, GetHolidays, GetNextHolidayWithYear, GetPreviousHolidayWithYear, IsLongWeekend, HolidaysThisMonth(year, month, countryCode)
  - **Obsoleto:** `GetNextHoliday` y `GetPreviousHoliday` — usa las variantes `WithYear` (`GetNextHolidayWithYear` / `GetPreviousHolidayWithYear`)
  - `IsHoliday(DateTime, params string[])` (ANY/alguno) e `IsHolidayInAll(DateTime, params string[])` (ALL/todos) *(nuevo en 1.1.0)* — verificación multi-país en una sola llamada
  - `GetObservedHoliday(DateTime, string)` *(nuevo en 1.1.0)* — resuelve el día "observado"/"sustituto" por corrimiento de fin de semana, actualmente para USA y Reino Unido
- `HolidayInfo` — ahora es un `record` *(cambiado en 1.1.0, igualdad estructural; `ToString()` sin cambios)* — Name, LocalName, Date, Country, Type, IsObserved, IsFixed, `TryToDateTime` (conversión segura de 29 de febrero)
- Enumeración `HolidayType` — Public, Bank, School, Optional, Observance
- Enumeración `ObservedRule` *(nueva en 1.1.0)* — la convención de corrimiento de fin de semana que declara un proveedor (ej. sábado→viernes/domingo→lunes para USA)
- Interfaz `IHolidayProvider` — implementa para calendarios de feriados personalizados
- `HolidayProviderFactory` — CreateAll (más de 35 países), CreateLatinAmerica (15), CreateEurope (22), CreateOther (7)
- `EasterCalculator` — método estático `GetEaster(year)`

**Registro:** `services.AddValiHoliday()`

---

## Vali-TimeZone

**NuGet:** [nuget.org/packages/Vali-TimeZone](https://www.nuget.org/packages/Vali-TimeZone)

```bash
dotnet add package Vali-TimeZone
```

**Proporciona:**
- `IValiTimeZone` — Convert, ConvertOffset, ToUtc, FromUtc, ToDateTimeOffset, GetOffset, GetBaseOffset, IsDst, OffsetDiff, FindZone, AllZones, ZonesForCountry, IsValidZone, Now, Today, IsSameInstant, FormatWithZone
- `ValiZoneInfo` — ahora es un `record` *(cambiado en 1.1.0, igualdad estructural; `ToString()` sin cambios)* — Id, DisplayName, Country, StandardOffset, CurrentOffset, SupportsDst, BaseUtcOffset
- Más de 45 zonas horarias IANA seleccionadas

**Registro:** `services.AddValiTimeZone()`

---

## Vali-BusinessHours

**NuGet:** [nuget.org/packages/Vali-BusinessHours](https://www.nuget.org/packages/Vali-BusinessHours)

```bash
dotnet add package Vali-BusinessHours
```

**Proporciona:**
- `IValiBusinessHours.Overlap(a, b, referenceDate)` — resuelve la ventana de solapamiento de horario laboral simultánea entre dos zonas horarias IANA, correcto con DST y consciente de cruces de medianoche
- `IValiBusinessHours.OverlapOnWorkday(a, b, referenceDate)` — igual, pero cada lado también requiere un `IValiCalendar` para confirmar que la fecha de referencia es un día hábil
- Readonly record struct `BusinessHoursWindow` — ZoneId, Start, End (como `TimeOnly`)
- `BusinessHoursOverlapResult` — la ventana resuelta, expresada en la hora local de ambas partes, o "no encontrada" cuando no hay solapamiento

Compone `Vali-Calendar` y `Vali-TimeZone` sin acoplar ninguno de los dos paquetes al otro.

**Registro:** `services.AddValiBusinessHours()`

---

## Vali-Bucket

**NuGet:** [nuget.org/packages/Vali-Bucket](https://www.nuget.org/packages/Vali-Bucket)

```bash
dotnet add package Vali-Bucket
```

**Proporciona:**
- `IValiBucket.Bucketize(timestamps, bucketSize, anchor)` — agrupa timestamps crudos en buckets de tiempo de tamaño fijo alineados a un ancla
- `IValiBucket.Aggregate<T>(values, bucketSize, aggregation, anchor)` — agrega valores numéricos por bucket (`Sum`/`Average`/`Count`/`Min`/`Max` vía `BucketAggregation`)
- `IValiBucket.GetBucketFor(timestamp, bucketSize, anchor)` — busca a qué bucket pertenece un timestamp individual, correcto también para timestamps anteriores al ancla
- Readonly record struct `BucketSize` (Amount, TimeUnit) y `TimeBucket`/`TimeBucket<T>` — el rango de cada bucket, reutilizando `DateRange` de `Vali-Range`

**Registro:** `services.AddValiBucket()`

---

## Vali-Tempo (meta-paquete) {#vali-tempo-meta}

**NuGet:** [nuget.org/packages/Vali-Tempo](https://www.nuget.org/packages/Vali-Tempo)

```bash
dotnet add package Vali-Tempo
```

El meta-paquete depende de los 11 módulos anteriores. Proporciona un único método de extensión que registra todos los servicios:

```csharp
// Program.cs
builder.Services.AddValiTempo();

// Registra como singletons:
// IValiTime, IValiDate, IValiDateQuarter
// IValiRange
// IValiCalendar
// IValiCountdown
// IValiAge
// IValiSchedule
// IValiHoliday
// IValiTimeZone
// IValiBusinessHours
// IValiBucket
```

**Dependencias:** Vali-Time, Vali-Range, Vali-Calendar, Vali-Duration, Vali-CountDown, Vali-Age, Vali-Schedule, Vali-Holiday, Vali-TimeZone, Vali-BusinessHours, Vali-Bucket

---

## Mapa de dependencias

```
Vali-Tempo
├── Vali-Time
├── Vali-Range          (referencia Vali-Time para TimeUnit)
├── Vali-Calendar       (opcional: referencia Vali-Holiday para días laborables con feriados)
├── Vali-Duration       (referencia Vali-Time para DurationStringParser)
├── Vali-CountDown      (referencia Vali-Time)
├── Vali-Age            (referencia Vali-Time para HumanizeCulture)
├── Vali-Schedule       (referencia Vali-Time, Vali-Holiday, Vali-Range)
├── Vali-Holiday        (referencia Vali-Time)
├── Vali-TimeZone       (referencia Vali-Time)
├── Vali-BusinessHours  (referencia Vali-Calendar + Vali-TimeZone)
└── Vali-Bucket         (referencia Vali-Time + Vali-Range)
```

Todos los paquetes tienen como destino múltiple `net6.0`, `net7.0`, `net8.0`, `net9.0` y `net10.0`.
