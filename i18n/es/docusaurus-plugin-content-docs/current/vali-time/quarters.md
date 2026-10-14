---
id: quarters
title: Operaciones con trimestres
sidebar_label: Trimestres
---

# Operaciones con trimestres

`IValiDateQuarter` proporciona operaciones completas de trimestre del año. Está incluido en el paquete `Vali-Time` y se registra automáticamente al llamar a `AddValiTime()` o `AddValiTempo()`.

## API de IValiDateQuarter

### QuarterOf

Devuelve el número de trimestre (1–4) de la fecha dada:

```csharp
int q = quarter.QuarterOf(new DateTime(2025, 5, 15));
// → 2 (abril–junio)

int q2 = quarter.QuarterOf(new DateTime(2025, 11, 1));
// → 4 (octubre–diciembre)
```

**Firma:** `int QuarterOf(DateTime dt)`

### QuarterStart

Devuelve el primer día del trimestre que contiene la fecha dada:

```csharp
DateTime start = quarter.QuarterStart(new DateTime(2025, 8, 20));
// → 2025-07-01 (Q3 comienza el 1 de julio)
```

**Firma:** `DateTime QuarterStart(DateTime dt)`

### QuarterEnd

Devuelve el último día del trimestre que contiene la fecha dada:

```csharp
DateTime end = quarter.QuarterEnd(new DateTime(2025, 8, 20));
// → 2025-09-30 (Q3 termina el 30 de septiembre)
```

**Firma:** `DateTime QuarterEnd(DateTime dt)`

### QuarterName

Devuelve el nombre corto del trimestre (`"Q1"`, `"Q2"`, `"Q3"` o `"Q4"`):

```csharp
string name = quarter.QuarterName(new DateTime(2025, 4, 1));
// → "Q2"
```

**Firma:** `string QuarterName(DateTime dt)`

### QuarterNameFull

Devuelve el nombre descriptivo completo incluyendo el año:

```csharp
string full = quarter.QuarterNameFull(new DateTime(2025, 4, 1));
// → "Q2 2025 (Apr – Jun)"
```

**Firma:** `string QuarterNameFull(DateTime dt)`

### DaysInQuarter

Devuelve el número total de días en el trimestre que contiene la fecha dada:

```csharp
int days = quarter.DaysInQuarter(new DateTime(2024, 2, 1)); // Q1 de año bisiesto
// → 91 (ene 31 + feb 29 + mar 31)

int days2 = quarter.DaysInQuarter(new DateTime(2025, 4, 1)); // Q2
// → 91 (abr 30 + may 31 + jun 30)
```

**Firma:** `int DaysInQuarter(DateTime dt)`

### DaysElapsedInQuarter

Devuelve el número de días transcurridos desde el inicio del trimestre (base 1):

```csharp
int elapsed = quarter.DaysElapsedInQuarter(new DateTime(2025, 4, 15));
// → 15 (el 15 de abril es el día 15 del Q2)
```

**Firma:** `int DaysElapsedInQuarter(DateTime dt)`

### DaysRemainingInQuarter

Devuelve el número de días restantes hasta el final del trimestre (incluyendo el último día):

```csharp
int remaining = quarter.DaysRemainingInQuarter(new DateTime(2025, 9, 28));
// → 3 (quedan sep 28, 29, 30)
```

**Firma:** `int DaysRemainingInQuarter(DateTime dt)`

### ProgressInQuarter

Devuelve un valor entre 0.0 y 1.0 que representa qué tan avanzado está el trimestre en la fecha dada:

```csharp
decimal progress = quarter.ProgressInQuarter(new DateTime(2025, 7, 1));
// → 0.0 (primer día del Q3)

decimal progress2 = quarter.ProgressInQuarter(new DateTime(2025, 9, 30));
// → ~1.0 (último día del Q3)
```

**Firma:** `decimal ProgressInQuarter(DateTime dt)`

### IsFirstDayOfQuarter

Devuelve `true` si la fecha es el primer día calendario de su trimestre:

```csharp
bool first = quarter.IsFirstDayOfQuarter(new DateTime(2025, 10, 1));
// → true (el 1 de oct inicia el Q4)

bool notFirst = quarter.IsFirstDayOfQuarter(new DateTime(2025, 10, 2));
// → false
```

**Firma:** `bool IsFirstDayOfQuarter(DateTime dt)`

### IsLastDayOfQuarter

Devuelve `true` si la fecha es el último día calendario de su trimestre:

```csharp
bool last = quarter.IsLastDayOfQuarter(new DateTime(2025, 6, 30));
// → true (el 30 de jun termina el Q2)
```

**Firma:** `bool IsLastDayOfQuarter(DateTime dt)`

### IsInSameQuarter

Devuelve `true` si dos fechas caen en el mismo trimestre del mismo año:

```csharp
bool same = quarter.IsInSameQuarter(
    new DateTime(2025, 4, 1),
    new DateTime(2025, 6, 30));
// → true (ambas en Q2 2025)

bool notSame = quarter.IsInSameQuarter(
    new DateTime(2025, 3, 31),
    new DateTime(2025, 4, 1));
// → false (Q1 vs Q2)
```

**Firma:** `bool IsInSameQuarter(DateTime a, DateTime b)`

### WeeksInQuarter

Devuelve el número de semanas ISO que se superponen con el trimestre:

```csharp
int weeks = quarter.WeeksInQuarter(new DateTime(2025, 1, 1));
// → ~13
```

**Firma:** `int WeeksInQuarter(DateTime dt)`

### DayOfQuarter

Devuelve la posición ordinal del día dentro del trimestre (base 1):

```csharp
int day = quarter.DayOfQuarter(new DateTime(2025, 4, 5));
// → 5 (5° día del Q2)
```

**Firma:** `int DayOfQuarter(DateTime dt)`

### NextQuarterStart

Devuelve el primer día del siguiente trimestre:

```csharp
DateTime next = quarter.NextQuarterStart(new DateTime(2025, 8, 15));
// → 2025-10-01 (inicio del Q4)

DateTime next2 = quarter.NextQuarterStart(new DateTime(2025, 12, 31));
// → 2026-01-01 (inicio del Q1 del año siguiente)
```

**Firma:** `DateTime NextQuarterStart(DateTime dt)`

### PreviousQuarterStart

Devuelve el primer día del trimestre anterior:

```csharp
DateTime prev = quarter.PreviousQuarterStart(new DateTime(2025, 8, 15));
// → 2025-04-01 (inicio del Q2)

DateTime prev2 = quarter.PreviousQuarterStart(new DateTime(2025, 1, 15));
// → 2024-10-01 (inicio del Q4 del año anterior)
```

Devuelve `DateTime.MinValue` cuando no existe un trimestre anterior (es decir, la fecha está en el Q1 del año 1). Usa `TryPreviousQuarterStart` para distinguir este valor centinela de una fecha real.

**Firma:** `DateTime PreviousQuarterStart(DateTime dt)`

### TryNextQuarterStart

Alternativa segura a `NextQuarterStart` para usar cerca de `DateTime.MaxValue`. Devuelve `false` (y establece `result` en `DateTime.MaxValue`) cuando el siguiente trimestre desbordaría más allá del año 9999; de lo contrario devuelve `true` y el primer día del siguiente trimestre.

```csharp
var valiDate = new ValiDate();

if (valiDate.TryNextQuarterStart(new DateTime(2025, 8, 15), out var next))
    Console.WriteLine(next); // 2025-10-01

// Devuelve false cerca de DateTime.MaxValue
bool ok = valiDate.TryNextQuarterStart(new DateTime(9999, 10, 1), out _); // false
```

**Firma:** `bool TryNextQuarterStart(DateTime date, out DateTime result)`

### TryPreviousQuarterStart

Alternativa segura a `PreviousQuarterStart` para usar cerca de `DateTime.MinValue`. Devuelve `false` (y establece `result` en `DateTime.MinValue`) cuando la fecha está en el Q1 del año 1 y no existe trimestre anterior; de lo contrario devuelve `true` y el primer día del trimestre anterior.

```csharp
var valiDate = new ValiDate();

if (valiDate.TryPreviousQuarterStart(new DateTime(2025, 5, 1), out var prev))
    Console.WriteLine(prev); // 2025-01-01 00:00:00

// Devuelve false cerca de DateTime.MinValue
bool ok = valiDate.TryPreviousQuarterStart(new DateTime(1, 2, 1), out _); // false
```

**Firma:** `bool TryPreviousQuarterStart(DateTime date, out DateTime result)`

## Ejemplo completo

```csharp
public class QuarterlyReportService(IValiDateQuarter quarter)
{
    public void PrintQuarterSummary(DateTime date)
    {
        int    q          = quarter.QuarterOf(date);
        string name       = quarter.QuarterNameFull(date);
        DateTime qStart   = quarter.QuarterStart(date);
        DateTime qEnd     = quarter.QuarterEnd(date);
        int    total      = quarter.DaysInQuarter(date);
        int    elapsed    = quarter.DaysElapsedInQuarter(date);
        int    remaining  = quarter.DaysRemainingInQuarter(date);
        decimal progress  = quarter.ProgressInQuarter(date);

        Console.WriteLine($"Quarter: {name}");
        Console.WriteLine($"Span:    {qStart:MMM dd} – {qEnd:MMM dd}");
        Console.WriteLine($"Total:   {total} days");
        Console.WriteLine($"Elapsed: {elapsed} days ({progress:P1})");
        Console.WriteLine($"Left:    {remaining} days");

        DateTime next = quarter.NextQuarterStart(date);
        Console.WriteLine($"Next Q starts: {next:yyyy-MM-dd}");
    }
}
```
