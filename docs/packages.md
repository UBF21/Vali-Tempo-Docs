---
id: packages
title: Packages Reference
sidebar_label: Packages
description: Complete reference of all 12 Vali-Tempo NuGet packages. Install individual modules or the meta-package Vali-Tempo to get them all in one go.
keywords: [Vali-Tempo, NuGet packages, Vali-Time, Vali-Range, Vali-Calendar, Vali-Duration, Vali-Schedule, Vali-Holiday, Vali-TimeZone, Vali-BusinessHours, Vali-Bucket, .NET]
---

# Packages Reference

Vali-Tempo is distributed as 12 independent NuGet packages. Install only the modules you need, or grab `Vali-Tempo` to get everything.

## All Packages

| Package | Version | Description | Target Frameworks |
|---|---|---|---|
| [Vali-Time](#vali-time) | 1.1.0 | Time unit conversions + ValiDate | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Range](#vali-range) | 1.1.0 | Date range operations | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Calendar](#vali-calendar) | 1.0.1 | Workday calendar | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Duration](#vali-duration) | 1.1.0 | Decimal Duration struct | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-CountDown](#vali-countdown) | 1.0.1 | Countdown & deadline tracking | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Age](#vali-age) | 1.1.0 | Age calculation | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Schedule](#vali-schedule) | 1.1.0 | Recurring schedule builder + cron | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Holiday](#vali-holiday) | 1.1.0 | 35+ country holiday data | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-TimeZone](#vali-timezone) | 1.1.0 | IANA timezone conversion | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-BusinessHours](#vali-businesshours) | 1.0.0 | Cross-timezone business-hours overlap | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Bucket](#vali-bucket) | 1.0.0 | Fixed-size time-series bucketing | net6.0, net7.0, net8.0, net9.0, net10.0 |
| [Vali-Tempo](#vali-tempo-meta) | 1.1.1 | Meta-package (all modules) | net6.0, net7.0, net8.0, net9.0, net10.0 |

---

## Vali-Time

**NuGet:** [nuget.org/packages/Vali-Time](https://www.nuget.org/packages/Vali-Time)

```bash
dotnet add package Vali-Time
```

**Provides:**
- `IValiTime` — Convert, SumTimes, SubtractTimes, FormatTime, GetBestUnit, ParseTime, Breakdown, ToTimeSpan, FromTimeSpan, Clamp, Compare, MultiConvert
- `IValiDate` — Diff, Add, Subtract, StartOf, EndOf, IsBefore, IsAfter, IsSameDay, IsSamePeriod, IsWeekend, IsWeekday, IsLeapYear, DaysInMonth, WeekOfYear, WeekYear, DayOfYear, ProgressInYear, ProgressInMonth
- `IValiDateQuarter` — QuarterOf, QuarterStart, QuarterEnd, QuarterNameFull, DaysInQuarter, ProgressInQuarter, NextQuarterStart, TryNextQuarterStart, PreviousQuarterStart, TryPreviousQuarterStart, etc.
- `DurationStringParser` *(new in 1.1.0)* — public parser behind `ParseTime`, reused directly by `Vali-Duration`'s `IParsable<ValiDuration>`
- `HumanizeCulture` enum *(new in 1.1.0)* (`En`/`Es`) — reused by `Vali-Age`'s `Humanize()`
- `DateTimeExtensions` — `StartOfWeek`/`IsWeekend`/`IsWeekday`, the single source of truth now reused across the ecosystem
- Enums: `TimeUnit`, `DatePart`, `WeekStart`

**Registration:** `services.AddValiTime()`

---

## Vali-Range

**NuGet:** [nuget.org/packages/Vali-Range](https://www.nuget.org/packages/Vali-Range)

```bash
dotnet add package Vali-Range
```

**Provides:**
- `IValiRange` — Create, LastUnits, NextUnits, ThisMonth/ThisWeek/ThisQuarter/ThisYear, Contains, Overlaps, IsContainedBy, Intersection, Union, **Subtract** *(new in 1.1.0 — set-theoretic difference A \ B)*, Expand, Shrink, Shift, IsAdjacent, Merge, Gaps(ranges, container), EachDay/EachWeek/EachMonth, EachWorkday, SplitByDay/Week/Month/Quarter
- `DateRange` struct — Start, End, Duration, TotalDays, IsEmpty

**Registration:** `services.AddValiRange()`

---

## Vali-Calendar

**NuGet:** [nuget.org/packages/Vali-Calendar](https://www.nuget.org/packages/Vali-Calendar)

```bash
dotnet add package Vali-Calendar
```

**Provides:**
- `IValiCalendar` — WeekOf, CurrentWeek, WeeksInMonth, WeekCountInMonth, IsFirstDayOfMonth, IsLastDayOfMonth, DaysInMonth, DaysOfMonth, IsWorkday, WorkdaysBetween, AddWorkdays, WorkdaysInMonth, WorkdaysInYear, NextWorkday, PreviousWorkday, HasHolidayProvider, HolidaysInMonth, HolidaysInYear, IsLeapYear, DaysInYear
- `CalendarWeek` struct — Year, WeekNumber, Start, End, Days

**Registration:** `services.AddValiCalendar()`

---

## Vali-Duration

**NuGet:** [nuget.org/packages/Vali-Duration](https://www.nuget.org/packages/Vali-Duration)

```bash
dotnet add package Vali-Duration
```

**Provides:**
- `ValiDuration` struct — FromMilliseconds through FromYears, FromTimeSpan, Zero; TotalMilliseconds through TotalDays; As, Format, ToTimeSpan; arithmetic operators (+, -, *, /); comparison operators; implicit conversions to/from `TimeSpan`
- `IParsable<ValiDuration>`/`IFormattable` *(new in 1.1.0)* — `Parse`/`TryParse` a duration string (`"1h30m"`, `"2d 4h"`, etc.) and `ToString(format, provider)`, built on `Vali-Time`'s shared `DurationStringParser`

**Note:** `ValiDuration` is a standalone value type — no DI registration required.

---

## Vali-CountDown

**NuGet:** [nuget.org/packages/Vali-CountDown](https://www.nuget.org/packages/Vali-CountDown)

```bash
dotnet add package Vali-CountDown
```

**Provides:**
- `IValiCountdown` — IsExpired, TimeUntil, TimeElapsed, Progress, ProgressPercent, Breakdown, Format, IsWithin, IsStarted(from) — returns true if the start instant is in the past or present

**Registration:** `services.AddValiCountdown()`

---

## Vali-Age

**NuGet:** [nuget.org/packages/Vali-Age](https://www.nuget.org/packages/Vali-Age)

```bash
dotnet add package Vali-Age
```

**Provides:**
- `IValiAge` — Years, Exact, Format, Relative, IsAtLeast, IsBirthday, NextBirthday, PreviousBirthday, DaysUntilBirthday
- `Humanize()` *(new in 1.1.0)* — relative-time formatting (`"3 days ago"`, `"hace 2 semanas"`) in `es`/`en`, via `HumanizeEngine` built on `Vali-Time`'s `HumanizeCulture`
- `AgeResult` struct — Years, Months, Days, TotalDays, Birthdate
- Feb 29 leap-year convention handled automatically

**Registration:** `services.AddValiAge()`

---

## Vali-Schedule

**NuGet:** [nuget.org/packages/Vali-Schedule](https://www.nuget.org/packages/Vali-Schedule)

```bash
dotnet add package Vali-Schedule
```

**Provides:**
- `IValiSchedule` fluent builder — Every, On, At, StartingFrom, EndsAfter, EndsOn, OnDayOfMonth, WithCustomPredicate, **SkipWeekends()**, **SkipHolidays(IHolidayProvider, HolidaySkipStrategy)** *(both new in 1.1.0)*, Build
- Query methods — NextOccurrence, PreviousOccurrence, OccursOn, Occurrences, OccurrencesInRange, **OccurrencePeriods(from, to)** *(new in 1.1.0 — pairs consecutive occurrences into `DateRange` periods)*
- `Vali_Schedule.Cron.CronSchedule` *(new in 1.1.0)* — zero-dependency 5-field cron expression support (`Parse`/`TryParse`), implements `IValiSchedule` as a parallel engine for schedules that need multiple occurrences per day
- Enums: `RecurrenceType` (Daily, Weekly, Monthly, Yearly), `RecurrenceEnd` (Never, AfterOccurrences, OnDate), `HolidaySkipStrategy`

**Registration:** `services.AddValiSchedule()` — register as **Transient** or **Scoped** (not Singleton)

---

## Vali-Holiday

**NuGet:** [nuget.org/packages/Vali-Holiday](https://www.nuget.org/packages/Vali-Holiday)

```bash
dotnet add package Vali-Holiday
```

**Provides:**
- `IValiHoliday` — Register, For, Supports, SupportedCountries, IsHoliday, GetHolidays, GetNextHolidayWithYear, GetPreviousHolidayWithYear, IsLongWeekend, HolidaysThisMonth(year, month, countryCode)
  - **Deprecated:** `GetNextHoliday` and `GetPreviousHoliday` — prefer the `WithYear` variants (`GetNextHolidayWithYear` / `GetPreviousHolidayWithYear`)
  - `IsHoliday(DateTime, params string[])` (ANY) and `IsHolidayInAll(DateTime, params string[])` (ALL) *(new in 1.1.0)* — multi-country checks in one call
  - `GetObservedHoliday(DateTime, string)` *(new in 1.1.0)* — resolves the weekend-shift "observed"/"substitute" day, currently for USA and United Kingdom
- `HolidayInfo` — now a `record` *(changed in 1.1.0, structural equality; `ToString()` unchanged)* — Name, LocalName, Date, Country, Type, IsObserved, IsFixed, `TryToDateTime` (safe Feb-29 conversion)
- `HolidayType` enum — Public, Bank, School, Optional, Observance
- `ObservedRule` enum *(new in 1.1.0)* — the weekend-shift convention a provider declares (e.g. Saturday→Friday/Sunday→Monday for USA)
- `IHolidayProvider` interface — implement for custom holiday calendars
- `HolidayProviderFactory` — CreateAll (35+ countries), CreateLatinAmerica (15), CreateEurope (22), CreateOther (7)
- `EasterCalculator` — `GetEaster(year)` static method

**Registration:** `services.AddValiHoliday()`

---

## Vali-TimeZone

**NuGet:** [nuget.org/packages/Vali-TimeZone](https://www.nuget.org/packages/Vali-TimeZone)

```bash
dotnet add package Vali-TimeZone
```

**Provides:**
- `IValiTimeZone` — Convert, ConvertOffset, ToUtc, FromUtc, ToDateTimeOffset, GetOffset, GetBaseOffset, IsDst, OffsetDiff, FindZone, AllZones, ZonesForCountry, IsValidZone, Now, Today, IsSameInstant, FormatWithZone
- `ValiZoneInfo` — now a `record` *(changed in 1.1.0, structural equality; `ToString()` unchanged)* — Id, DisplayName, Country, StandardOffset, CurrentOffset, SupportsDst, BaseUtcOffset
- 45+ curated IANA timezone zones

**Registration:** `services.AddValiTimeZone()`

---

## Vali-BusinessHours

**NuGet:** [nuget.org/packages/Vali-BusinessHours](https://www.nuget.org/packages/Vali-BusinessHours)

```bash
dotnet add package Vali-BusinessHours
```

**Provides:**
- `IValiBusinessHours.Overlap(a, b, referenceDate)` — resolves the simultaneous business-hours overlap window between two IANA timezones, DST-correct and midnight-crossing aware
- `IValiBusinessHours.OverlapOnWorkday(a, b, referenceDate)` — same, but each side also requires an `IValiCalendar` to confirm the reference date is a workday
- `BusinessHoursWindow` readonly record struct — ZoneId, Start, End (as `TimeOnly`)
- `BusinessHoursOverlapResult` — the resolved window, expressed in both parties' local time, or "not found" when there's no overlap

Composes `Vali-Calendar` and `Vali-TimeZone` without coupling either package to the other.

**Registration:** `services.AddValiBusinessHours()`

---

## Vali-Bucket

**NuGet:** [nuget.org/packages/Vali-Bucket](https://www.nuget.org/packages/Vali-Bucket)

```bash
dotnet add package Vali-Bucket
```

**Provides:**
- `IValiBucket.Bucketize(timestamps, bucketSize, anchor)` — groups raw timestamps into fixed-size, anchor-aligned time buckets
- `IValiBucket.Aggregate<T>(values, bucketSize, aggregation, anchor)` — aggregates numeric values per bucket (`Sum`/`Average`/`Count`/`Min`/`Max` via `BucketAggregation`)
- `IValiBucket.GetBucketFor(timestamp, bucketSize, anchor)` — looks up which bucket a single timestamp falls into, correct for timestamps before the anchor too
- `BucketSize` readonly record struct (Amount, TimeUnit) and `TimeBucket`/`TimeBucket<T>` — each bucket's span, reusing `Vali-Range`'s `DateRange`

**Registration:** `services.AddValiBucket()`

---

## Vali-Tempo (meta-package) {#vali-tempo-meta}

**NuGet:** [nuget.org/packages/Vali-Tempo](https://www.nuget.org/packages/Vali-Tempo)

```bash
dotnet add package Vali-Tempo
```

The meta-package depends on all 11 modules above. It provides a single extension method that registers every service:

```csharp
// Program.cs
builder.Services.AddValiTempo();

// Registers as singletons:
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

**Dependencies:** Vali-Time, Vali-Range, Vali-Calendar, Vali-Duration, Vali-CountDown, Vali-Age, Vali-Schedule, Vali-Holiday, Vali-TimeZone, Vali-BusinessHours, Vali-Bucket

---

## Dependency Map

```
Vali-Tempo
├── Vali-Time
├── Vali-Range          (references Vali-Time for TimeUnit)
├── Vali-Calendar       (optional: references Vali-Holiday for holiday-aware workdays)
├── Vali-Duration       (references Vali-Time for DurationStringParser)
├── Vali-CountDown      (references Vali-Time)
├── Vali-Age            (references Vali-Time for HumanizeCulture)
├── Vali-Schedule       (references Vali-Time, Vali-Holiday, Vali-Range)
├── Vali-Holiday        (references Vali-Time)
├── Vali-TimeZone       (references Vali-Time)
├── Vali-BusinessHours  (references Vali-Calendar + Vali-TimeZone)
└── Vali-Bucket         (references Vali-Time + Vali-Range)
```

All packages target `net6.0`, `net7.0`, `net8.0`, `net9.0`, and `net10.0` multi-targeting.
