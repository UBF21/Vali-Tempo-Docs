---
id: introduction
title: Introduction
sidebar_label: Introduction
slug: /introduction
---

# Introduction

**Vali-Tempo** is a modular .NET ecosystem built for time precision. It provides ten focused NuGet packages covering every aspect of date, time, calendar, duration, scheduling, holidays, and timezone handling — all designed to work together through a single dependency-injection call, or independently as standalone utilities.

## Why Vali-Tempo?

Working with time in .NET is surprisingly fragile. The BCL provides `DateTime`, `TimeSpan`, and `DateTimeOffset` — but leaves you to implement common patterns like:

- Converting between time units with decimal precision
- Querying workdays considering country-specific holidays
- Computing accurate ages from birthdates (especially around Feb 29)
- Building recurring schedules with complex recurrence rules
- Converting between IANA timezones with DST awareness
- Enumerating, splitting, and merging date ranges

Vali-Tempo solves all of this with a consistent, DI-friendly API across nine specialized modules, plus a meta-package that wires everything together.

## Module Ecosystem

| Package | Description | Key Type |
|---|---|---|
| **Vali-Time** | Time unit conversions and formatting with decimal precision | `IValiTime`, `IValiDate` |
| **Vali-Range** | Date range operations: union, intersection, gaps, split, enumerate | `IValiRange`, `DateRange` |
| **Vali-Calendar** | Workday calendar with pluggable holiday provider support | `IValiCalendar`, `CalendarWeek` |
| **Vali-Duration** | High-precision decimal Duration value type | `ValiDuration` |
| **Vali-CountDown** | Deadline tracking, countdown, and progress utilities | `IValiCountDown` |
| **Vali-Age** | Age calculation from a birthdate | `IValiAge`, `AgeResult` |
| **Vali-Schedule** | Fluent builder for recurring schedules | `IValiSchedule` |
| **Vali-Holiday** | 35+ country holiday data with Easter-based movable holidays | `IValiHoliday`, `HolidayInfo` |
| **Vali-TimeZone** | 45+ curated IANA timezone conversion with DST support | `IValiTimeZone`, `ValiZoneInfo` |
| **Vali-Tempo** | Meta-package — includes all 9 modules above | — |

## Architecture Overview

All nine services are registered as **singletons** in the DI container. They have no shared mutable state between calls, making them safe for concurrent use across the application lifetime.

```
AddValiTempo()
    ├── IValiTime        (Vali-Time)
    ├── IValiDate        (Vali-Time)
    ├── IValiRange       (Vali-Range)
    ├── IValiCalendar    (Vali-Calendar)
    ├── IValiCountDown   (Vali-CountDown)
    ├── IValiAge         (Vali-Age)
    ├── IValiSchedule    (Vali-Schedule)
    ├── IValiHoliday     (Vali-Holiday)
    └── IValiTimeZone    (Vali-TimeZone)
```

:::info Module independence
Each package can also be installed and used independently. You do not need the meta-package to use just one module.
:::

## DI Setup

Install the meta-package:

```bash
dotnet add package Vali-Tempo
```

Register all services in `Program.cs`:

```csharp
builder.Services.AddValiTempo();
```

That single call registers all nine services. You can now inject any of them:

```csharp
public class ReportService(
    IValiDate date,
    IValiAge age,
    IValiHoliday holiday,
    IValiTimeZone tz)
{
    public void GenerateReport(DateTime birthdate, DateTime deadline)
    {
        var userAge   = age.Years(birthdate);
        var daysLeft  = date.Diff(DateTime.Today, deadline, TimeUnit.Days);
        var isHoliday = holiday.IsHoliday(deadline, "PE");
        var localTime = tz.Convert(deadline, "America/Lima");
    }
}
```

## Key Features at a Glance

- **Decimal precision** — time conversions use `decimal` arithmetic, avoiding floating-point drift
- **Value types** — `DateRange` and `ValiDuration` are structs; no heap allocation for common operations
- **DI-first design** — every service is registered as an interface, making testing trivial
- **Holiday intelligence** — Easter-based movable holidays computed algorithmically for 35+ countries
- **IANA timezone support** — 45+ curated zones with DST, offset diff and instant comparison
- **Fluent scheduling** — chain `Every().On().At().StartingFrom()` to express complex recurrence rules
- **Composable ranges** — union, intersection, expand, shrink, split, enumerate with a single method chain

## Next Steps

- [Quick Start](./quick-start) — install and run your first example in minutes
- [Vali-Time Overview](./vali-time/overview) — time unit conversions and formatting
- [Vali-Holiday Providers](./vali-holiday/providers) — register holiday providers for your countries
- [Packages Reference](./packages) — all 10 NuGet packages with links and framework targets
