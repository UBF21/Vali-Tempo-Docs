---
id: examples
title: Vali-Age — Examples
sidebar_label: Examples
---

# Vali-Age — Examples

```bash
dotnet add package Vali-Age
```

## Years + Exact — Calculating exact age

`Years` returns the number of complete years elapsed, while `Exact` breaks the age down into years, months, remaining days, and total days.

```csharp
using System;
using Vali_Age.Core;
using Vali_Age.Models;

var valiAge = new ValiAge();

var birthDate = new DateTime(1990, 3, 10);
var reference = new DateTime(2025, 6, 15);

int       years = valiAge.Years(birthDate, reference);
AgeResult exact = valiAge.Exact(birthDate, reference);

Console.WriteLine($"Birthdate   : {birthDate:MMMM dd, yyyy}");
Console.WriteLine($"Reference   : {reference:MMMM dd, yyyy}");
Console.WriteLine();
Console.WriteLine($"Complete years : {years}");
Console.WriteLine($"Exact age      : {exact.Years}y {exact.Months}m {exact.Days}d");
Console.WriteLine($"Total days     : {exact.TotalDays:N0}");
Console.WriteLine($"Formatted      : {valiAge.Format(birthDate, reference)}");
// Output:
// Birthdate   : March 10, 1990
// Reference   : June 15, 2025
//
// Complete years : 35
// Exact age      : 35y 3m 5d
// Total days     : 12,880
// Formatted      : 35 years, 3 months, 5 days
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Age** NuGet package in the fiddle settings.
:::

---

## IsBirthday — Checking whether today is someone's birthday

`IsBirthday` returns `true` when the reference date matches the birthday month and day. The Feb 29 convention is applied automatically for leap-year birthdates.

```csharp
using System;
using Vali_Age.Core;

var valiAge = new ValiAge();

// Standard birthday
var standardBirthDate = new DateTime(1995, 6, 15);

var today    = new DateTime(2025, 6, 15); // birthday!
var notToday = new DateTime(2025, 6, 16); // day after

Console.WriteLine($"Standard birthday ({standardBirthDate:MMM dd})");
Console.WriteLine($"  On Jun 15 : {valiAge.IsBirthday(standardBirthDate, today)}");
Console.WriteLine($"  On Jun 16 : {valiAge.IsBirthday(standardBirthDate, notToday)}");

// Feb 29 convention
var leapBirthDate = new DateTime(2000, 2, 29);

var leapYear    = new DateTime(2024, 2, 29); // leap year — actual day
var nonLeapYear = new DateTime(2025, 2, 28); // non-leap year — Feb 28 used instead
var wrongDay    = new DateTime(2025, 3,  1); // neither

Console.WriteLine();
Console.WriteLine($"Leap-day birthday ({leapBirthDate:MMM dd, yyyy})");
Console.WriteLine($"  Feb 29, 2024 (leap)     : {valiAge.IsBirthday(leapBirthDate, leapYear)}");
Console.WriteLine($"  Feb 28, 2025 (non-leap) : {valiAge.IsBirthday(leapBirthDate, nonLeapYear)}");
Console.WriteLine($"  Mar 01, 2025            : {valiAge.IsBirthday(leapBirthDate, wrongDay)}");
// Output:
// Standard birthday (Jun 15)
//   On Jun 15 : True
//   On Jun 16 : False
//
// Leap-day birthday (Feb 29, 2000)
//   Feb 29, 2024 (leap)     : True
//   Feb 28, 2025 (non-leap) : True
//   Mar 01, 2025            : False
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Age** NuGet package in the fiddle settings.
:::

---

## NextBirthday + DaysUntilBirthday — Planning ahead for upcoming birthdays

`NextBirthday` returns the date of the next birthday occurrence and `DaysUntilBirthday` tells you how many days away it is.

```csharp
using System;
using Vali_Age.Core;

var valiAge = new ValiAge();

var reference = new DateTime(2025, 6, 15);

var people = new (string Name, DateTime BirthDate)[]
{
    ("Alice",   new DateTime(1992, 6, 20)), // birthday in 5 days
    ("Bob",     new DateTime(1985, 3,  8)), // birthday already passed this year
    ("Charlie", new DateTime(2000, 2, 29)), // leap-day birthday
};

Console.WriteLine($"{"Name",-10} | {"Next Birthday",-15} | {"Days Away",9} | Formatted age");
Console.WriteLine(new string('-', 62));

foreach (var (name, birthDate) in people)
{
    DateTime next   = valiAge.NextBirthday(birthDate, reference);
    int      days   = valiAge.DaysUntilBirthday(birthDate, reference);
    string   ageStr = valiAge.Format(birthDate, reference);

    Console.WriteLine($"{name,-10} | {next:MMM dd, yyyy}    | {days,9} | {ageStr}");
}
// Output:
// Name       | Next Birthday   | Days Away | Formatted age
// --------------------------------------------------------------
// Alice      | Jun 20, 2025    |         5 | 32 years, 11 months, 26 days
// Bob        | Mar 08, 2026    |       266 | 40 years, 3 months, 7 days
// Charlie    | Feb 28, 2026    |       258 | 25 years, 3 months, 18 days
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Age** NuGet package in the fiddle settings.
:::

---

## Relative — Formatting age as a relative description

`Relative` returns a simple, culture-independent string such as `"5 years ago"` or `"3 months ago"` depending on how far back the date is.

```csharp
using System;
using Vali_Age.Core;

var valiAge = new ValiAge();

var reference = new DateTime(2025, 6, 15);

var birthDates = new (string Label, DateTime Date)[]
{
    ("Adult (born 1990)",       new DateTime(1990, 1, 20)),
    ("Teen (born 2010)",        new DateTime(2010, 9,  5)),
    ("Toddler (born 2023)",     new DateTime(2023, 2, 28)),
    ("Infant (born May 2025)",  new DateTime(2025, 5,  1)),
    ("Newborn (born Jun 2025)", new DateTime(2025, 6,  1)),
};

Console.WriteLine($"{"Label",-28} | Relative description");
Console.WriteLine(new string('-', 55));

foreach (var (label, date) in birthDates)
{
    string rel = valiAge.Relative(date, reference);
    Console.WriteLine($"{label,-28} | {rel}");
}
// Output:
// Label                        | Relative description
// -------------------------------------------------------
// Adult (born 1990)            | 35 years ago
// Teen (born 2010)             | 14 years ago
// Toddler (born 2023)          | 2 years ago
// Infant (born May 2025)       | 1 month ago
// Newborn (born Jun 2025)      | 2 weeks ago
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Age** NuGet package in the fiddle settings.
:::

---

## Humanize — Culture-aware relative time with a precision floor

*New in 1.1.0.* `Humanize` renders a relative time description localized to English or Spanish, with an optional `maxPrecision` floor that collapses finer differences into a "less than one `<unit>`" phrasing.

```csharp
using System;
using Vali_Age.Core;
using Vali_Time.Enums;

var valiAge = new ValiAge();

var reference = new DateTime(2025, 6, 15, 12, 0, 0);

var moments = new (string Label, DateTime Date)[]
{
    ("5 seconds ago",  reference.AddSeconds(-5)),
    ("Yesterday",      reference.AddDays(-1)),
    ("In 2 weeks",     reference.AddDays(14)),
    ("Last year",      reference.AddYears(-1)),
};

Console.WriteLine($"{"Label",-14} | {"English",-14} | {"Español",-14}");
Console.WriteLine(new string('-', 48));

foreach (var (label, date) in moments)
{
    string en = valiAge.Humanize(date, reference);
    string es = valiAge.Humanize(date, reference, HumanizeCulture.Es);
    Console.WriteLine($"{label,-14} | {en,-14} | {es,-14}");
}

// Precision floor: a 5-second difference collapses to "less than a minute ago"
// instead of counting seconds, because Humanize has no Seconds-level bucket.
string capped = valiAge.Humanize(reference.AddSeconds(-5), reference, maxPrecision: TimeUnit.Minutes);
Console.WriteLine();
Console.WriteLine($"Capped at Minutes: {capped}");
// Output:
// Label          | English        | Español
// ------------------------------------------------
// 5 seconds ago  | a moment ago   | hace un momento
// Yesterday      | yesterday      | ayer
// In 2 weeks     | in 2 weeks     | en 2 semanas
// Last year      | last year      | el año pasado
//
// Capped at Minutes: less than a minute ago
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Age** NuGet package in the fiddle settings.
:::
