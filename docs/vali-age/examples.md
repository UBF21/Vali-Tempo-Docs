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

`Years` returns the number of complete years elapsed, while `Exact` breaks the age down into years, months, and remaining days.

```csharp
using System;
using Vali_Age.Core;

var valiAge = new ValiAge();

var birthdate = new DateTime(1990, 3, 10);
var reference = new DateTime(2025, 6, 15);

int       years = valiAge.Years(birthdate, referenceDate: reference);
AgeResult exact = valiAge.Exact(birthdate, referenceDate: reference);

Console.WriteLine($"Birthdate   : {birthdate:MMMM dd, yyyy}");
Console.WriteLine($"Reference   : {reference:MMMM dd, yyyy}");
Console.WriteLine();
Console.WriteLine($"Complete years : {years}");
Console.WriteLine($"Exact age      : {exact.Years}y {exact.Months}m {exact.Days}d");
Console.WriteLine($"Total days     : {exact.TotalDays:N0}");
Console.WriteLine($"Formatted      : {valiAge.Format(birthdate, detailed: true, referenceDate: reference)}");
// Output:
// Birthdate   : March 10, 1990
// Reference   : June 15, 2025
//
// Complete years : 35
// Exact age      : 35y 3m 5d
// Total days     : 12,880
// Formatted      : 35 years, 3 months, and 5 days
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
var standardBirthdate = new DateTime(1995, 6, 15);

var today       = new DateTime(2025, 6, 15); // birthday!
var notToday    = new DateTime(2025, 6, 16); // day after

Console.WriteLine($"Standard birthday ({standardBirthdate:MMM dd})");
Console.WriteLine($"  On Jun 15 : {valiAge.IsBirthday(standardBirthdate, referenceDate: today)}");
Console.WriteLine($"  On Jun 16 : {valiAge.IsBirthday(standardBirthdate, referenceDate: notToday)}");

// Feb 29 convention
var leapBirthdate = new DateTime(2000, 2, 29);

var leapYear    = new DateTime(2024, 2, 29); // leap year — actual day
var nonLeapYear = new DateTime(2025, 2, 28); // non-leap year — Feb 28 used instead
var wrongDay    = new DateTime(2025, 3,  1); // neither

Console.WriteLine();
Console.WriteLine($"Leap-day birthday ({leapBirthdate:MMM dd, yyyy})");
Console.WriteLine($"  Feb 29, 2024 (leap)     : {valiAge.IsBirthday(leapBirthdate, referenceDate: leapYear)}");
Console.WriteLine($"  Feb 28, 2025 (non-leap) : {valiAge.IsBirthday(leapBirthdate, referenceDate: nonLeapYear)}");
Console.WriteLine($"  Mar 01, 2025            : {valiAge.IsBirthday(leapBirthdate, referenceDate: wrongDay)}");
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

var people = new (string Name, DateTime Birthdate)[]
{
    ("Alice",   new DateTime(1992, 6, 20)), // birthday in 5 days
    ("Bob",     new DateTime(1985, 3,  8)), // birthday already passed this year
    ("Charlie", new DateTime(2000, 2, 29)), // leap-day birthday
};

Console.WriteLine($"{"Name",-10} | {"Next Birthday",-15} | {"Days Away",9} | Formatted age");
Console.WriteLine(new string('-', 62));

foreach (var (name, birthdate) in people)
{
    DateTime next    = valiAge.NextBirthday(birthdate, referenceDate: reference);
    int      days    = valiAge.DaysUntilBirthday(birthdate, referenceDate: reference);
    string   ageStr  = valiAge.Format(birthdate, referenceDate: reference);

    Console.WriteLine($"{name,-10} | {next:MMM dd, yyyy}    | {days,9} | {ageStr}");
}
// Output:
// Name       | Next Birthday   | Days Away | Formatted age
// --------------------------------------------------------------
// Alice      | Jun 20, 2025    |         5 | 32 years old
// Bob        | Mar 08, 2026    |       266 | 40 years old
// Charlie    | Feb 28, 2026    |       258 | 25 years old
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Age** NuGet package in the fiddle settings.
:::

---

## Relative — Formatting age as a relative description

`Relative` returns a human-friendly string such as `"5 years ago"` or `"3 months ago"` depending on how far back the date is.

```csharp
using System;
using Vali_Age.Core;

var valiAge = new ValiAge();

var reference = new DateTime(2025, 6, 15);

var birthdates = new (string Label, DateTime Date)[]
{
    ("Adult (born 1990)",       new DateTime(1990, 1, 20)),
    ("Teen (born 2010)",        new DateTime(2010, 9,  5)),
    ("Toddler (born 2023)",     new DateTime(2023, 2, 28)),
    ("Infant (born May 2025)",  new DateTime(2025, 5,  1)),
    ("Newborn (born Jun 2025)", new DateTime(2025, 6,  1)),
};

Console.WriteLine($"{"Label",-28} | Relative description");
Console.WriteLine(new string('-', 55));

foreach (var (label, date) in birthdates)
{
    string rel = valiAge.Relative(date, referenceDate: reference);
    Console.WriteLine($"{label,-28} | {rel}");
}
// Output:
// Label                        | Relative description
// -------------------------------------------------------
// Adult (born 1990)            | 35 years ago
// Teen (born 2010)             | 14 years ago
// Toddler (born 2023)          | 2 years ago
// Infant (born May 2025)       | about 1 month ago
// Newborn (born Jun 2025)      | 14 days ago
```

:::tip Try it live
[▶ Open in dotnetfiddle](https://dotnetfiddle.net) — Add the **Vali-Age** NuGet package in the fiddle settings.
:::
