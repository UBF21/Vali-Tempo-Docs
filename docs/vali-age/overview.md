---
id: overview
title: Vali-Age Overview
sidebar_label: Overview
---

# Vali-Age

`IValiAge` computes accurate ages from birthdates. It handles the Feb 29 leap-year convention (people born on Feb 29 celebrate on Feb 28 in non-leap years) and provides birthday detection, next/previous birthday calculation, and relative age descriptions.

## Installation

```bash
dotnet add package Vali-Age
```

## Registration

```csharp
builder.Services.AddValiAge();
// or via the meta-package:
builder.Services.AddValiTempo();
```

## AgeResult Struct

`AgeResult` is a value type returned by `Exact()` that breaks down the age into components:

| Property | Type | Description |
|---|---|---|
| `Years` | `int` | Complete years elapsed |
| `Months` | `int` | Remaining months (0–11) |
| `Days` | `int` | Remaining days (0–30) |
| `TotalDays` | `int` | Total days since birthdate |
| `Birthdate` | `DateTime` | Original birthdate |

```csharp
AgeResult age = valiAge.Exact(new DateTime(1990, 5, 10));
Console.WriteLine($"{age.Years}y {age.Months}m {age.Days}d");
// → "35y 2m 7d" (depending on today)
```

## IValiAge API

### Years

Return the number of complete years since the birthdate:

```csharp
int years = age.Years(new DateTime(1990, 5, 10));
// → e.g. 35
```

**Signature:** `int Years(DateTime birthdate, DateTime? referenceDate = null)`

### Exact

Return a detailed `AgeResult` with years, months, and days breakdown:

```csharp
AgeResult result = age.Exact(new DateTime(1990, 5, 10));
// result.Years  → 35
// result.Months → 2
// result.Days   → 7
```

**Signature:** `AgeResult Exact(DateTime birthdate, DateTime? referenceDate = null)`

### Format

Format the age as a human-readable string:

```csharp
string s1 = age.Format(new DateTime(1990, 5, 10));
// → "35 years old"

string s2 = age.Format(new DateTime(1990, 5, 10), detailed: true);
// → "35 years, 2 months, and 7 days"
```

**Signature:** `string Format(DateTime birthdate, bool detailed = false, DateTime? referenceDate = null)`

### Relative

Return a relative age description:

```csharp
string rel = age.Relative(new DateTime(2020, 1, 15));
// → "5 years ago" or "3 months ago" (for a recent date)

string relBaby = age.Relative(DateTime.Today.AddDays(-40));
// → "40 days ago" or "about 1 month ago"
```

**Signature:** `string Relative(DateTime birthdate, DateTime? referenceDate = null)`

### IsAtLeast

Return `true` if the person is at least the given age in years:

```csharp
bool adult = age.IsAtLeast(new DateTime(2000, 1, 1), 18);
// → true if born in 2000 and today is 2018 or later
```

**Signature:** `bool IsAtLeast(DateTime birthdate, int years, DateTime? referenceDate = null)`

### IsBirthday

Return `true` if today (or the reference date) is the person's birthday:

```csharp
bool today = age.IsBirthday(new DateTime(1990, 3, 23));
// → true if today is March 23

// Feb 29 convention: celebrated on Feb 28 in non-leap years
bool leapBday = age.IsBirthday(new DateTime(2000, 2, 29));
// → true on Feb 28 in non-leap years, Feb 29 in leap years
```

**Signature:** `bool IsBirthday(DateTime birthdate, DateTime? referenceDate = null)`

### NextBirthday

Return the date of the next upcoming birthday:

```csharp
DateTime next = age.NextBirthday(new DateTime(1990, 5, 10));
// → 2026-05-10 (if today is before May 10, 2026)

// If today is exactly the birthday, returns next year's date
```

**Signature:** `DateTime NextBirthday(DateTime birthdate, DateTime? referenceDate = null)`

### PreviousBirthday

Return the date of the most recent past birthday:

```csharp
DateTime prev = age.PreviousBirthday(new DateTime(1990, 5, 10));
// → 2025-05-10 (last birthday that has already passed)
```

**Signature:** `DateTime PreviousBirthday(DateTime birthdate, DateTime? referenceDate = null)`

> **Throws** `ArgumentOutOfRangeException` when `reference` is before the person's first birthday.

### DaysUntilBirthday

Return the number of days until the next birthday:

```csharp
int days = age.DaysUntilBirthday(new DateTime(1990, 5, 10));
// → e.g. 48 (if today is March 23 and birthday is May 10)

// Returns 0 if today is the birthday
// Returns 365 (or 366) if today is the day after the birthday
```

**Signature:** `int DaysUntilBirthday(DateTime birthdate, DateTime? referenceDate = null)`

## Feb 29 Convention

People born on February 29 are handled consistently:

- In leap years: birthday is February 29
- In non-leap years: birthday is treated as February 28

This convention applies to `IsBirthday`, `NextBirthday`, `PreviousBirthday`, and `DaysUntilBirthday`.

```csharp
var leapBirthday = new DateTime(2000, 2, 29);

// In 2025 (non-leap):
bool isToday = age.IsBirthday(leapBirthday, new DateTime(2025, 2, 28));
// → true

// In 2024 (leap):
bool isLeapDay = age.IsBirthday(leapBirthday, new DateTime(2024, 2, 29));
// → true
```

## Complete Example

```csharp
public class UserProfileService(IValiAge age)
{
    public void DisplayProfile(string name, DateTime birthdate)
    {
        int    years    = age.Years(birthdate);
        AgeResult exact = age.Exact(birthdate);
        bool   isAdult  = age.IsAtLeast(birthdate, 18);
        bool   birthday = age.IsBirthday(birthdate);
        int    daysLeft = age.DaysUntilBirthday(birthdate);

        Console.WriteLine($"Name:     {name}");
        Console.WriteLine($"Age:      {years} years");
        Console.WriteLine($"Exact:    {exact.Years}y {exact.Months}m {exact.Days}d");
        Console.WriteLine($"Adult:    {isAdult}");

        if (birthday)
            Console.WriteLine("  Happy Birthday!");
        else
            Console.WriteLine($"  Next birthday in {daysLeft} days ({age.NextBirthday(birthdate):MMM dd})");

        Console.WriteLine($"Relative: {age.Relative(birthdate)}");
        Console.WriteLine($"Detail:   {age.Format(birthdate, detailed: true)}");
    }
}
```
