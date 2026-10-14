---
id: overview
title: Descripción general de Vali-Age
sidebar_label: Descripción general
description: Vali-Age proporciona cálculos de edad y aniversarios para .NET — calcula edades exactas, próximos cumpleaños, tiempo relativo humanizado y cultural (en/es), y tiempo transcurrido desde cualquier evento pasado.
keywords: [Vali-Age, cálculo de edad, cumpleaños, aniversario, humanize, .NET, NuGet, C#]
---

# Vali-Age

`IValiAge` calcula edades exactas a partir de fechas de nacimiento. Maneja la convención de año bisiesto para el 29 de febrero (las personas nacidas el 29 de febrero celebran el 28 de febrero en años no bisiestos) y proporciona detección de cumpleaños, cálculo del próximo/anterior cumpleaños, descripciones de edad relativa, y tiempo relativo humanizado y cultural (en/es).

## Instalación

```bash
dotnet add package Vali-Age
```

Targets compilados: `net8.0` · `net9.0` · `net10.0`. Compatible con .NET 6 y .NET 7 mediante compatibilidad retroactiva de NuGet.

## Registro

```csharp
builder.Services.AddValiAge();
// o mediante el meta-paquete:
builder.Services.AddValiTempo();
```

## Struct AgeResult

`AgeResult` es un tipo de valor readonly devuelto por `Exact()` que desglosa la edad en componentes:

| Propiedad | Tipo | Descripción |
|---|---|---|
| `Years` | `int` | Años completos transcurridos |
| `Months` | `int` | Meses completos restantes después de los años completos |
| `Days` | `int` | Días completos restantes después de los años y meses completos |
| `TotalDays` | `int` | Total de días transcurridos entre la fecha de nacimiento y la fecha de referencia |

```csharp
AgeResult age = valiAge.Exact(new DateTime(1990, 5, 10));
Console.WriteLine($"{age.Years}y {age.Months}m {age.Days}d");
// → "35y 2m 7d" (dependiendo de la fecha de hoy)
```

`AgeResult.ToString()` renderiza el desglose como `"{Years} years, {Months} months, {Days} days"` (singular `"year"`/`"month"`/`"day"` cuando el componente es 1).

## API de IValiAge

### Years

Devuelve el número de años completos transcurridos:

```csharp
int years = valiAge.Years(new DateTime(1990, 5, 10));
// → ej. 35
```

**Firmas:**
```csharp
int Years(DateTime birthDate);
int Years(DateTime birthDate, DateTime reference);
```

> **Lanza** `ArgumentOutOfRangeException` cuando `birthDate` es posterior a `reference`.

### Exact

Devuelve un `AgeResult` detallado con el desglose en años, meses, días y total de días:

```csharp
AgeResult result = valiAge.Exact(new DateTime(1990, 5, 10));
// result.Years     → 35
// result.Months    → 2
// result.Days      → 7
// result.TotalDays → total de días transcurridos
```

**Firmas:**
```csharp
AgeResult Exact(DateTime birthDate);
AgeResult Exact(DateTime birthDate, DateTime reference);
```

### Format

Formatea la edad como una cadena de desglose legible para humanos (delega en `Exact(...).ToString()`):

```csharp
string s = valiAge.Format(new DateTime(1990, 5, 10));
// → "35 years, 2 months, 7 days"
```

**Firmas:**
```csharp
string Format(DateTime birthDate);
string Format(DateTime birthDate, DateTime reference);
```

### Relative

Devuelve una descripción de tiempo relativo simple, independiente de la cultura:

```csharp
string rel = valiAge.Relative(new DateTime(2025, 1, 15));
// → "5 months ago" (dependiendo de hoy)
```

Umbrales aplicados (diferencia absoluta): menos de 60 segundos → `"just now"`; menos de 60 minutos → `"X minutes ago"` / `"in X minutes"`; menos de 24 horas → `"X hours ago"` / `"in X hours"`; menos de 7 días → `"X days ago"` / `"in X days"`; menos de ~30.4 días → `"X weeks ago"` / `"in X weeks"`; menos de 12 meses → `"X months ago"` / `"in X months"`; 12 meses o más → `"X years ago"` / `"in X years"`.

**Firmas:**
```csharp
string Relative(DateTime date);
string Relative(DateTime date, DateTime reference);
```

### Humanize

*Nuevo en 1.1.0.* Devuelve una descripción de tiempo relativo legible para humanos y **localizada culturalmente** (inglés/español), con un piso de precisión opcional:

```csharp
using Vali_Time.Enums;

string en = valiAge.Humanize(DateTime.Now.AddDays(-1));
// → "yesterday"

string es = valiAge.Humanize(DateTime.Now.AddDays(-1), culture: HumanizeCulture.Es);
// → "ayer"

string capped = valiAge.Humanize(DateTime.Now.AddMinutes(-5), maxPrecision: TimeUnit.Hours);
// → "less than an hour ago"
```

**Firma:**
```csharp
string Humanize(
    DateTime date,
    DateTime? relativeTo = null,
    HumanizeCulture culture = HumanizeCulture.En,
    TimeUnit? maxPrecision = null);
```

- `relativeTo` toma por defecto el reloj inyectado en la instancia `ValiAge` (tiempo real en producción, un reloj fijo de prueba en tests) cuando es `null`.
- `culture` selecciona el idioma de salida: `HumanizeCulture.En` o `HumanizeCulture.Es` (ambos definidos en `Vali-Time`).
- `maxPrecision` es el `TimeUnit` más fino permitido en la salida (`Minutes`, `Hours`, `Days`, `Weeks`, `Months` o `Years`). Cuando la diferencia real es más fina que esta unidad, la salida colapsa a una frase "less than one `<unit>`" en lugar de una unidad menor. `null` (por defecto) no aplica ningún piso, por lo que el bucket "a moment ago" es alcanzable.

> **Lanza** `NotSupportedException` cuando `culture` no es un valor reconocido de `HumanizeCulture`, o cuando `maxPrecision` es `TimeUnit.Milliseconds`/`TimeUnit.Seconds` (demasiado fino para actuar como piso).

También existe un método de extensión sin estado `DateTime.Humanize(...)` (`Vali_Age.Extensions.DateTimeHumanizeExtensions`) que no requiere DI y delega en el mismo motor interno, por lo que los resultados son idénticos:

```csharp
using Vali_Age.Extensions;

string result = someDate.Humanize(culture: HumanizeCulture.Es);
```

### IsAtLeast

Devuelve `true` si la persona alcanzó al menos el umbral dado, expresado en un `DatePart` específico:

```csharp
using Vali_Time.Enums;

bool adult = valiAge.IsAtLeast(new DateTime(2000, 1, 1), 18, DatePart.Year);
// → true si nació en 2000 y hoy es 2018 o posterior
```

**Firmas:**
```csharp
bool IsAtLeast(DateTime birthDate, int amount, DatePart part);
bool IsAtLeast(DateTime birthDate, int amount, DatePart part, DateTime reference);
```

- `DatePart.Year` compara contra `AgeResult.Years`.
- `DatePart.Month` compara contra `Years * 12 + Months`.
- `DatePart.Day` compara contra `AgeResult.TotalDays`.

> **Lanza** `ArgumentOutOfRangeException` cuando `part` no es `DatePart.Year`, `DatePart.Month` o `DatePart.Day`.

### IsBirthday

Devuelve `true` si hoy (o la fecha de referencia) es el cumpleaños de la persona (mismo día y mes):

```csharp
bool today = valiAge.IsBirthday(new DateTime(1990, 3, 23));
// → true si hoy es el 23 de marzo

// Convención del 29 de feb: celebrado el 28 de feb en años no bisiestos
bool leapBday = valiAge.IsBirthday(new DateTime(2000, 2, 29));
// → true el 28 de feb en años no bisiestos, el 29 de feb en años bisiestos
```

**Firmas:**
```csharp
bool IsBirthday(DateTime birthDate);
bool IsBirthday(DateTime birthDate, DateTime reference);
```

### NextBirthday

Devuelve la fecha del próximo cumpleaños después de hoy (o después de `reference`):

```csharp
DateTime next = valiAge.NextBirthday(new DateTime(1990, 5, 10));
// → el próximo 10 de mayo desde hoy

// Si la fecha de referencia es exactamente el cumpleaños, se devuelve la fecha del año siguiente
```

**Firmas:**
```csharp
DateTime NextBirthday(DateTime birthDate);
DateTime NextBirthday(DateTime birthDate, DateTime reference);
```

> **Lanza** `ArgumentOutOfRangeException` cuando `reference.Year >= 9999` (no se puede calcular un cumpleaños un año más adelante).

### PreviousBirthday

Devuelve la fecha del cumpleaños más reciente en o antes de hoy (o `reference`):

```csharp
DateTime prev = valiAge.PreviousBirthday(new DateTime(1990, 5, 10));
// → el 10 de mayo más reciente en o antes de hoy
```

**Firmas:**
```csharp
DateTime PreviousBirthday(DateTime birthDate);
DateTime PreviousBirthday(DateTime birthDate, DateTime reference);
```

> **Lanza** `ArgumentOutOfRangeException` cuando `reference` es anterior al primer cumpleaños de la persona.

### DaysUntilBirthday

Devuelve el número de días restantes hasta el próximo cumpleaños:

```csharp
int days = valiAge.DaysUntilBirthday(new DateTime(1990, 5, 10));
// → ej. 48 (si hoy es el 23 de marzo y el cumpleaños es el 10 de mayo)
```

**Firmas:**
```csharp
int DaysUntilBirthday(DateTime birthDate);
int DaysUntilBirthday(DateTime birthDate, DateTime reference);
```

## Convención del 29 de febrero

Las personas nacidas el 29 de febrero se manejan de forma consistente:

- En años bisiestos: el cumpleaños es el 29 de febrero
- En años no bisiestos: el cumpleaños se trata como el 28 de febrero

Esta convención se aplica a `IsBirthday`, `NextBirthday`, `PreviousBirthday` y `DaysUntilBirthday`.

```csharp
var leapBirthday = new DateTime(2000, 2, 29);

// En 2025 (no bisiesto):
bool isToday = valiAge.IsBirthday(leapBirthday, new DateTime(2025, 2, 28));
// → true

// En 2024 (bisiesto):
bool isLeapDay = valiAge.IsBirthday(leapBirthday, new DateTime(2024, 2, 29));
// → true
```

## Ejemplo completo

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
