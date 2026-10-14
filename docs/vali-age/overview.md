---
id: overview
title: Vali-Age Overview
sidebar_label: Overview
description: Vali-Age provides age and anniversary calculations for .NET — compute exact ages, next birthdays, culture-aware relative/humanized time, and time elapsed since any past event.
keywords: [Vali-Age, age calculation, birthday, anniversary, humanize, .NET, NuGet, C#]
---

# Vali-Age

`IValiAge` computes accurate ages from birthdates. It handles the Feb 29 leap-year convention (people born on Feb 29 celebrate on Feb 28 in non-leap years) and provides birthday detection, next/previous birthday calculation, relative age descriptions, and culture-aware (en/es) humanized relative time.

## Installation

```bash
dotnet add package Vali-Age
```

Compiled targets: `net8.0` · `net9.0` · `net10.0`. Compatible with .NET 6 and .NET 7 via NuGet backward compatibility.

## Registration

```csharp
builder.Services.AddValiAge();
// or via the meta-package:
builder.Services.AddValiTempo();
```

## AgeResult Struct

`AgeResult` is a readonly value type returned by `Exact()` that breaks down the age into components:

| Property | Type | Description |
|---|---|---|
| `Years` | `int` | Complete years elapsed |
| `Months` | `int` | Remaining complete months after whole years |
| `Days` | `int` | Remaining complete days after whole years and months |
| `TotalDays` | `int` | Total elapsed days between birth date and reference date |

```csharp
AgeResult age = valiAge.Exact(new DateTime(1990, 5, 10));
Console.WriteLine($"{age.Years}y {age.Months}m {age.Days}d");
// → "35y 2m 7d" (depending on today)
```

`AgeResult.ToString()` renders the breakdown as `"{Years} years, {Months} months, {Days} days"` (singular `"year"`/`"month"`/`"day"` when the component is 1).

## IValiAge API

### Years

Return the number of complete years elapsed:

```csharp
int years = valiAge.Years(new DateTime(1990, 5, 10));
// → e.g. 35
```

**Signatures:**
```csharp
int Years(DateTime birthDate);
int Years(DateTime birthDate, DateTime reference);
```

> **Throws** `ArgumentOutOfRangeException` when `birthDate` is after `reference`.

### Exact

Return a detailed `AgeResult` with years, months, days, and total-days breakdown:

```csharp
AgeResult result = valiAge.Exact(new DateTime(1990, 5, 10));
// result.Years     → 35
// result.Months    → 2
// result.Days      → 7
// result.TotalDays → total elapsed days
```

**Signatures:**
```csharp
AgeResult Exact(DateTime birthDate);
AgeResult Exact(DateTime birthDate, DateTime reference);
```

### Format

Format the age as a human-readable breakdown string (delegates to `Exact(...).ToString()`):

```csharp
string s = valiAge.Format(new DateTime(1990, 5, 10));
// → "35 years, 2 months, 7 days"
```

**Signatures:**
```csharp
string Format(DateTime birthDate);
string Format(DateTime birthDate, DateTime reference);
```

### Relative

Return a lightweight relative time description, independent of culture:

```csharp
string rel = valiAge.Relative(new DateTime(2025, 1, 15));
// → "5 months ago" (depending on today)
```

Thresholds applied (absolute difference): less than 60 seconds → `"just now"`; less than 60 minutes → `"X minutes ago"` / `"in X minutes"`; less than 24 hours → `"X hours ago"` / `"in X hours"`; less than 7 days → `"X days ago"` / `"in X days"`; less than ~30.4 days → `"X weeks ago"` / `"in X weeks"`; less than 12 months → `"X months ago"` / `"in X months"`; 12 months or more → `"X years ago"` / `"in X years"`.

**Signatures:**
```csharp
string Relative(DateTime date);
string Relative(DateTime date, DateTime reference);
```

### Humanize

*New in 1.1.0.* Returns a human-readable, **culturally-localized** (English/Spanish) relative time description, with an optional precision floor:

```csharp
using Vali_Time.Enums;

string en = valiAge.Humanize(DateTime.Now.AddDays(-1));
// → "yesterday"

string es = valiAge.Humanize(DateTime.Now.AddDays(-1), culture: HumanizeCulture.Es);
// → "ayer"

string capped = valiAge.Humanize(DateTime.Now.AddMinutes(-5), maxPrecision: TimeUnit.Hours);
// → "less than an hour ago"
```

**Signature:**
```csharp
string Humanize(
    DateTime date,
    DateTime? relativeTo = null,
    HumanizeCulture culture = HumanizeCulture.En,
    TimeUnit? maxPrecision = null);
```

- `relativeTo` defaults to the clock injected into the `ValiAge` instance (real time in production, a fixed test clock in tests) when `null`.
- `culture` selects the output language: `HumanizeCulture.En` or `HumanizeCulture.Es` (both defined in `Vali-Time`).
- `maxPrecision` is the finest `TimeUnit` allowed in the output (`Minutes`, `Hours`, `Days`, `Weeks`, `Months`, or `Years`). When the actual difference is finer than this unit, the output collapses to a "less than one `<unit>`" phrasing instead of a smaller unit. `null` (default) applies no floor, so the "a moment ago" bucket is reachable.

> **Throws** `NotSupportedException` when `culture` is not a recognized `HumanizeCulture` value, or when `maxPrecision` is `TimeUnit.Milliseconds`/`TimeUnit.Seconds` (too fine to act as a floor).

There is also a stateless `DateTime.Humanize(...)` extension method (`Vali_Age.Extensions.DateTimeHumanizeExtensions`) that does not require DI and delegates to the same internal engine, so results are identical:

```csharp
using Vali_Age.Extensions;

string result = someDate.Humanize(culture: HumanizeCulture.Es);
```

### IsAtLeast

Return `true` if the person has reached at least the given threshold, expressed in a specific `DatePart`:

```csharp
using Vali_Time.Enums;

bool adult = valiAge.IsAtLeast(new DateTime(2000, 1, 1), 18, DatePart.Year);
// → true if born in 2000 and today is 2018 or later
```

**Signatures:**
```csharp
bool IsAtLeast(DateTime birthDate, int amount, DatePart part);
bool IsAtLeast(DateTime birthDate, int amount, DatePart part, DateTime reference);
```

- `DatePart.Year` compares against `AgeResult.Years`.
- `DatePart.Month` compares against `Years * 12 + Months`.
- `DatePart.Day` compares against `AgeResult.TotalDays`.

> **Throws** `ArgumentOutOfRangeException` when `part` is not `DatePart.Year`, `DatePart.Month`, or `DatePart.Day`.

### IsBirthday

Return `true` if today (or the reference date) is the person's birthday (same day and month):

```csharp
bool today = valiAge.IsBirthday(new DateTime(1990, 3, 23));
// → true if today is March 23

// Feb 29 convention: celebrated on Feb 28 in non-leap years
bool leapBday = valiAge.IsBirthday(new DateTime(2000, 2, 29));
// → true on Feb 28 in non-leap years, Feb 29 in leap years
```

**Signatures:**
```csharp
bool IsBirthday(DateTime birthDate);
bool IsBirthday(DateTime birthDate, DateTime reference);
```

### NextBirthday

Return the date of the next upcoming birthday after today (or after `reference`):

```csharp
DateTime next = valiAge.NextBirthday(new DateTime(1990, 5, 10));
// → next May 10th from today

// If the reference date is exactly the birthday, the following year's date is returned
```

**Signatures:**
```csharp
DateTime NextBirthday(DateTime birthDate);
DateTime NextBirthday(DateTime birthDate, DateTime reference);
```

> **Throws** `ArgumentOutOfRangeException` when `reference.Year >= 9999` (cannot compute a birthday one year further).

### PreviousBirthday

Return the date of the most recent birthday on or before today (or `reference`):

```csharp
DateTime prev = valiAge.PreviousBirthday(new DateTime(1990, 5, 10));
// → the most recent May 10th on or before today
```

**Signatures:**
```csharp
DateTime PreviousBirthday(DateTime birthDate);
DateTime PreviousBirthday(DateTime birthDate, DateTime reference);
```

> **Throws** `ArgumentOutOfRangeException` when `reference` is before the person's first birthday.

### DaysUntilBirthday

Return the number of days remaining until the next birthday:

```csharp
int days = valiAge.DaysUntilBirthday(new DateTime(1990, 5, 10));
// → e.g. 48 (if today is March 23 and the birthday is May 10)
```

**Signatures:**
```csharp
int DaysUntilBirthday(DateTime birthDate);
int DaysUntilBirthday(DateTime birthDate, DateTime reference);
```

## Feb 29 Convention

People born on February 29 are handled consistently:

- In leap years: birthday is February 29
- In non-leap years: birthday is treated as February 28

This convention applies to `IsBirthday`, `NextBirthday`, `PreviousBirthday`, and `DaysUntilBirthday`.

```csharp
var leapBirthday = new DateTime(2000, 2, 29);

// In 2025 (non-leap):
bool isToday = valiAge.IsBirthday(leapBirthday, new DateTime(2025, 2, 28));
// → true

// In 2024 (leap):
bool isLeapDay = valiAge.IsBirthday(leapBirthday, new DateTime(2024, 2, 29));
// → true
```

## Complete Example

```csharp
using Vali_Age.Core;
using Vali_Age.Models;
using Vali_Time.Enums;

public class UserProfileService(IValiAge age)
{
    public void DisplayProfile(string name, DateTime birthDate)
    {
        int       years    = age.Years(birthDate);
        AgeResult exact    = age.Exact(birthDate);
        bool      isAdult  = age.IsAtLeast(birthDate, 18, DatePart.Year);
        bool      birthday = age.IsBirthday(birthDate);
        int       daysLeft = age.DaysUntilBirthday(birthDate);

        Console.WriteLine($"Name:     {name}");
        Console.WriteLine($"Age:      {years} years");
        Console.WriteLine($"Exact:    {exact.Years}y {exact.Months}m {exact.Days}d");
        Console.WriteLine($"Adult:    {isAdult}");

        if (birthday)
            Console.WriteLine("  Happy Birthday!");
        else
            Console.WriteLine($"  Next birthday in {daysLeft} days ({age.NextBirthday(birthDate):MMM dd})");

        Console.WriteLine($"Relative: {age.Relative(birthDate)}");
        Console.WriteLine($"Humanize: {age.Humanize(birthDate, culture: HumanizeCulture.Es)}");
        Console.WriteLine($"Detail:   {age.Format(birthDate)}");
    }
}
```
