---
id: examples
title: Vali-Age — Ejemplos
sidebar_label: Ejemplos
---

# Vali-Age — Ejemplos

```bash
dotnet add package Vali-Age
```

## Years + Exact — Calcular la edad exacta

`Years` devuelve el número de años completos transcurridos, mientras que `Exact` desglosa la edad en años, meses, días restantes y total de días.

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
// Salida:
// Birthdate   : March 10, 1990
// Reference   : June 15, 2025
//
// Complete years : 35
// Exact age      : 35y 3m 5d
// Total days     : 12,880
// Formatted      : 35 years, 3 months, 5 days
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Age** en la configuración del fiddle.
:::

---

## IsBirthday — Verificar si hoy es el cumpleaños de alguien

`IsBirthday` devuelve `true` cuando la fecha de referencia coincide con el mes y día del cumpleaños. La convención del 29 de febrero se aplica automáticamente para fechas de nacimiento en años bisiestos.

```csharp
using System;
using Vali_Age.Core;

var valiAge = new ValiAge();

// Cumpleaños estándar
var standardBirthDate = new DateTime(1995, 6, 15);

var today    = new DateTime(2025, 6, 15); // ¡cumpleaños!
var notToday = new DateTime(2025, 6, 16); // día siguiente

Console.WriteLine($"Standard birthday ({standardBirthDate:MMM dd})");
Console.WriteLine($"  On Jun 15 : {valiAge.IsBirthday(standardBirthDate, today)}");
Console.WriteLine($"  On Jun 16 : {valiAge.IsBirthday(standardBirthDate, notToday)}");

// Convención del 29 de febrero
var leapBirthDate = new DateTime(2000, 2, 29);

var leapYear    = new DateTime(2024, 2, 29); // año bisiesto — día real
var nonLeapYear = new DateTime(2025, 2, 28); // año no bisiesto — se usa el 28 de feb
var wrongDay    = new DateTime(2025, 3,  1); // ninguno de los dos

Console.WriteLine();
Console.WriteLine($"Leap-day birthday ({leapBirthDate:MMM dd, yyyy})");
Console.WriteLine($"  Feb 29, 2024 (leap)     : {valiAge.IsBirthday(leapBirthDate, leapYear)}");
Console.WriteLine($"  Feb 28, 2025 (non-leap) : {valiAge.IsBirthday(leapBirthDate, nonLeapYear)}");
Console.WriteLine($"  Mar 01, 2025            : {valiAge.IsBirthday(leapBirthDate, wrongDay)}");
// Salida:
// Standard birthday (Jun 15)
//   On Jun 15 : True
//   On Jun 16 : False
//
// Leap-day birthday (Feb 29, 2000)
//   Feb 29, 2024 (leap)     : True
//   Feb 28, 2025 (non-leap) : True
//   Mar 01, 2025            : False
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Age** en la configuración del fiddle.
:::

---

## NextBirthday + DaysUntilBirthday — Planificar próximos cumpleaños

`NextBirthday` devuelve la fecha de la próxima ocurrencia del cumpleaños y `DaysUntilBirthday` indica cuántos días faltan.

```csharp
using System;
using Vali_Age.Core;

var valiAge = new ValiAge();

var reference = new DateTime(2025, 6, 15);

var people = new (string Name, DateTime BirthDate)[]
{
    ("Alice",   new DateTime(1992, 6, 20)), // cumpleaños en 5 días
    ("Bob",     new DateTime(1985, 3,  8)), // cumpleaños ya pasó este año
    ("Charlie", new DateTime(2000, 2, 29)), // cumpleaños en día bisiesto
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
// Salida:
// Name       | Next Birthday   | Days Away | Formatted age
// --------------------------------------------------------------
// Alice      | Jun 20, 2025    |         5 | 32 years, 11 months, 26 days
// Bob        | Mar 08, 2026    |       266 | 40 years, 3 months, 7 days
// Charlie    | Feb 28, 2026    |       258 | 25 years, 3 months, 18 days
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Age** en la configuración del fiddle.
:::

---

## Relative — Formatear la edad como descripción relativa

`Relative` devuelve una cadena simple e independiente de la cultura, como `"5 years ago"` o `"3 months ago"`, según qué tan atrás en el tiempo esté la fecha.

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
// Salida:
// Label                        | Relative description
// -------------------------------------------------------
// Adult (born 1990)            | 35 years ago
// Teen (born 2010)             | 14 years ago
// Toddler (born 2023)          | 2 years ago
// Infant (born May 2025)       | 1 month ago
// Newborn (born Jun 2025)      | 2 weeks ago
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Age** en la configuración del fiddle.
:::

---

## Humanize — Tiempo relativo cultural con un piso de precisión

*Nuevo en 1.1.0.* `Humanize` renderiza una descripción de tiempo relativo localizada al inglés o al español, con un piso opcional `maxPrecision` que colapsa diferencias más finas en una frase "less than one `<unit>`".

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

// Piso de precisión: una diferencia de 5 segundos colapsa a "less than a minute ago"
// en lugar de contar segundos, porque Humanize no tiene un bucket a nivel de Seconds.
string capped = valiAge.Humanize(reference.AddSeconds(-5), reference, maxPrecision: TimeUnit.Minutes);
Console.WriteLine();
Console.WriteLine($"Capped at Minutes: {capped}");
// Salida:
// Label          | English        | Español
// ------------------------------------------------
// 5 seconds ago  | a moment ago   | hace un momento
// Yesterday      | yesterday      | ayer
// In 2 weeks     | in 2 weeks     | en 2 semanas
// Last year      | last year      | el año pasado
//
// Capped at Minutes: less than a minute ago
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Age** en la configuración del fiddle.
:::
