---
id: packages
title: Packages Reference
sidebar_label: Packages
---

# Packages Reference

Vali-Tempo is distributed as 10 independent NuGet packages. Install only the modules you need, or grab `Vali-Tempo` to get everything.

## All Packages

| Package | Version | Description | Target Frameworks |
|---|---|---|---|
| [Vali-Time](#vali-time) | Latest | Time unit conversions + ValiDate | net6.0, net7.0, net8.0, net9.0 |
| [Vali-Range](#vali-range) | Latest | Date range operations | net6.0, net7.0, net8.0, net9.0 |
| [Vali-Calendar](#vali-calendar) | Latest | Workday calendar | net6.0, net7.0, net8.0, net9.0 |
| [Vali-Duration](#vali-duration) | Latest | Decimal Duration struct | net6.0, net7.0, net8.0, net9.0 |
| [Vali-CountDown](#vali-countdown) | Latest | Countdown & deadline tracking | net6.0, net7.0, net8.0, net9.0 |
| [Vali-Age](#vali-age) | Latest | Age calculation | net6.0, net7.0, net8.0, net9.0 |
| [Vali-Schedule](#vali-schedule) | Latest | Recurring schedule builder | net6.0, net7.0, net8.0, net9.0 |
| [Vali-Holiday](#vali-holiday) | Latest | 35+ country holiday data | net6.0, net7.0, net8.0, net9.0 |
| [Vali-TimeZone](#vali-timezone) | Latest | IANA timezone conversion | net6.0, net7.0, net8.0, net9.0 |
| [Vali-Tempo](#vali-tempo-meta) | Latest | Meta-package (all modules) | net6.0, net7.0, net8.0, net9.0 |

---

## Vali-Time

**NuGet:** [nuget.org/packages/Vali-Time](https://www.nuget.org/packages/Vali-Time)

```bash
dotnet add package Vali-Time
```

**Provides:**
- `IValiTime` — Convert, SumTimes, SubtractTimes, FormatTime, GetBestUnit, ParseTime, Breakdown, ToTimeSpan, FromTimeSpan, Clamp, Compare, MultiConvert
- `IValiDate` — Diff, Add, Subtract, StartOf, EndOf, IsBefore, IsAfter, IsSameDay, IsSamePeriod, IsWeekend, IsWeekday, IsLeapYear, DaysInMonth, WeekOfYear, WeekYear, DayOfYear, ProgressInYear, ProgressInMonth
- `IValiDateQuarter` — QuarterOf, QuarterStart, QuarterEnd, QuarterNameFull, DaysInQuarter, ProgressInQuarter, NextQuarterStart, TryNextQuarterStart, TryPreviousQuarterStart, etc.
- Enums: `TimeUnit`, `DatePart`, `WeekStart`

**Registration:** `services.AddValiTime()`

---

## Vali-Range

**NuGet:** [nuget.org/packages/Vali-Range](https://www.nuget.org/packages/Vali-Range)

```bash
dotnet add package Vali-Range
```

**Provides:**
- `IValiRange` — Create, LastUnits, NextUnits, ThisMonth/ThisWeek/ThisQuarter/ThisYear, Contains, Overlaps, IsContainedBy, Intersection, Union, Expand, Shrink, Shift, IsAdjacent, Merge, Gaps(ranges, container), EachDay/EachWeek/EachMonth, EachWorkday, SplitByDay/Week/Month/Quarter
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

**Note:** `ValiDuration` is a standalone value type — no DI registration required.

---

## Vali-CountDown

**NuGet:** [nuget.org/packages/Vali-CountDown](https://www.nuget.org/packages/Vali-CountDown)

```bash
dotnet add package Vali-CountDown
```

**Provides:**
- `IValiCountDown` — IsExpired, TimeUntil, TimeElapsed, Progress, ProgressPercent, Breakdown, Format, IsWithin, IsStarted(from) — returns true if the start instant is in the past or present

**Registration:** `services.AddValiCountDown()`

---

## Vali-Age

**NuGet:** [nuget.org/packages/Vali-Age](https://www.nuget.org/packages/Vali-Age)

```bash
dotnet add package Vali-Age
```

**Provides:**
- `IValiAge` — Years, Exact, Format, Relative, IsAtLeast, IsBirthday, NextBirthday, PreviousBirthday, DaysUntilBirthday
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
- `IValiSchedule` fluent builder — Every, On, At, StartingFrom, EndsAfter, EndsOn, OnDayOfMonth, WithCustomPredicate, Build
- `Schedule` query object — NextOccurrence, PreviousOccurrence, OccursOn, Occurrences, OccurrencesInRange
- Enums: `RecurrenceType` (Daily, Weekly, Monthly, Yearly), `RecurrenceEnd` (Never, AfterOccurrences, OnDate)

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
- `HolidayInfo` class — Name, LocalName, Date, Country, Type, IsObserved, IsFixed
- `HolidayType` enum — Public, Bank, School, Optional, Observance
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
- `ValiZoneInfo` class — Id, DisplayName, Country, StandardOffset, CurrentOffset, SupportsDst, BaseUtcOffset
- 45+ curated IANA timezone zones

**Registration:** `services.AddValiTimeZone()`

---

## Vali-Tempo (meta-package) {#vali-tempo-meta}

**NuGet:** [nuget.org/packages/Vali-Tempo](https://www.nuget.org/packages/Vali-Tempo)

```bash
dotnet add package Vali-Tempo
```

The meta-package depends on all 9 modules above. It provides a single extension method that registers every service:

```csharp
// Program.cs
builder.Services.AddValiTempo();

// Registers as singletons:
// IValiTime, IValiDate, IValiDateQuarter
// IValiRange
// IValiCalendar
// IValiCountDown
// IValiAge
// IValiSchedule
// IValiHoliday
// IValiTimeZone
```

**Dependencies:** Vali-Time, Vali-Range, Vali-Calendar, Vali-Duration, Vali-CountDown, Vali-Age, Vali-Schedule, Vali-Holiday, Vali-TimeZone

---

## Dependency Map

```
Vali-Tempo
├── Vali-Time
├── Vali-Range          (references Vali-Time for TimeUnit)
├── Vali-Calendar       (optional: references Vali-Holiday for holiday-aware workdays)
├── Vali-Duration
├── Vali-CountDown      (references Vali-Duration)
├── Vali-Age
├── Vali-Schedule       (references Vali-Range for OccurrencesInRange)
├── Vali-Holiday
└── Vali-TimeZone
```

All packages target `net6.0`, `net7.0`, `net8.0`, and `net9.0` multi-targeting.
