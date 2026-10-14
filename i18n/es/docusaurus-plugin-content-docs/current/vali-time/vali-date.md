---
id: vali-date
title: ValiDate
sidebar_label: ValiDate
---

# ValiDate

`IValiDate` proporciona métodos fluidos de aritmética de fechas, comparación e introspección. Se registra junto con `IValiTime` al llamar a `AddValiTime()` o `AddValiTempo()`.

## API de IValiDate

### Diff

Calcula la diferencia entre dos fechas en una unidad de tiempo dada, con precisión decimal:

```csharp
decimal days = date.Diff(DateTime.Today, new DateTime(2025, 12, 31), TimeUnit.Days);
// → ej. 282.0

decimal months = date.Diff(new DateTime(2024, 1, 1), new DateTime(2025, 6, 15), TimeUnit.Months);
// → ~17.45
```

**Firma:** `decimal Diff(DateTime from, DateTime to, TimeUnit unit, int? decimalPlaces = null)`

### Add

Añade una cantidad decimal de una unidad dada a una fecha:

```csharp
DateTime result = date.Add(DateTime.Today, 2.5m, TimeUnit.Hours);
DateTime future = date.Add(DateTime.Today, 3m, TimeUnit.Months);
DateTime later  = date.Add(DateTime.Today, 1.5m, TimeUnit.Years);
```

**Firma:** `DateTime Add(DateTime dt, decimal amount, TimeUnit unit)`

### Subtract

Resta una cantidad decimal de una unidad dada de una fecha:

```csharp
DateTime pastWeek = date.Subtract(DateTime.Today, 1m, TimeUnit.Weeks);
DateTime lastYear = date.Subtract(DateTime.Today, 365m, TimeUnit.Days);
```

**Firma:** `DateTime Subtract(DateTime dt, decimal amount, TimeUnit unit)`

### StartOf

Obtiene el inicio de un período (día, semana, mes, trimestre, año):

```csharp
DateTime startOfMonth = date.StartOf(DateTime.Today, DatePart.Month);
// → Primer día del mes actual, hora 00:00:00

DateTime startOfYear = date.StartOf(DateTime.Today, DatePart.Year);
// → 1 de enero del año actual

DateTime startOfWeek = date.StartOf(DateTime.Today, DatePart.DayOfWeek);
// → Lunes (o domingo) de la semana actual
```

**Firma:** `DateTime StartOf(DateTime date, DatePart part, WeekStart? weekStart = null)`

### EndOf

Obtiene el final de un período (inclusivo — último tick de ese período):

```csharp
DateTime endOfMonth = date.EndOf(DateTime.Today, DatePart.Month);
// → Último día del mes actual, hora 23:59:59.9999999

DateTime endOfYear = date.EndOf(DateTime.Today, DatePart.Year);
// → 31 de diciembre, 23:59:59.9999999
```

**Firma:** `DateTime EndOf(DateTime date, DatePart part, WeekStart? weekStart = null)`

### IsBefore

Comprueba si una fecha es estrictamente anterior a otra:

```csharp
bool result = date.IsBefore(new DateTime(2024, 1, 1), new DateTime(2025, 1, 1));
// → true
```

**Firma:** `bool IsBefore(DateTime dt, DateTime other)`

### IsAfter

Comprueba si una fecha es estrictamente posterior a otra:

```csharp
bool result = date.IsAfter(DateTime.Today, new DateTime(2020, 1, 1));
// → true
```

**Firma:** `bool IsAfter(DateTime dt, DateTime other)`

### IsSameDay

Comprueba si dos fechas caen en el mismo día calendario:

```csharp
bool same = date.IsSameDay(new DateTime(2025, 3, 15, 8, 0, 0), new DateTime(2025, 3, 15, 20, 0, 0));
// → true (mismo día, distinta hora)
```

**Firma:** `bool IsSameDay(DateTime a, DateTime b)`

### IsSamePeriod

Comprueba si dos fechas caen en el mismo período calendario:

```csharp
bool sameMonth = date.IsSamePeriod(new DateTime(2025, 3, 5), new DateTime(2025, 3, 28), DatePart.Month);
// → true

bool sameYear = date.IsSamePeriod(new DateTime(2025, 1, 1), new DateTime(2025, 12, 31), DatePart.Year);
// → true
```

**Firma:** `bool IsSamePeriod(DateTime a, DateTime b, DatePart part, WeekStart? weekStart = null)`

### IsWeekend

Devuelve `true` si la fecha cae en sábado o domingo:

```csharp
bool weekend = date.IsWeekend(new DateTime(2025, 3, 15)); // Sábado
// → true
```

**Firma:** `bool IsWeekend(DateTime dt)`

### IsWeekday

Devuelve `true` si la fecha cae entre lunes y viernes:

```csharp
bool weekday = date.IsWeekday(new DateTime(2025, 3, 17)); // Lunes
// → true
```

**Firma:** `bool IsWeekday(DateTime dt)`

### IsLeapYear

Devuelve `true` si el año de la fecha dada es un año bisiesto:

```csharp
bool leap = date.IsLeapYear(2024);
// → true

bool notLeap = date.IsLeapYear(2025);
// → false
```

**Firma:** `bool IsLeapYear(int year)`

### DaysInMonth

Devuelve el número de días del mes y año dados:

```csharp
int days = date.DaysInMonth(2024, 2); // Febrero bisiesto
// → 29

int days2 = date.DaysInMonth(2025, 1);
// → 31
```

**Firma:** `int DaysInMonth(int year, int month)`

### WeekOfYear

Devuelve el número de semana ISO 8601 para la fecha dada:

```csharp
int week = date.WeekOfYear(new DateTime(2025, 1, 6));
// → 2

int week2 = date.WeekOfYear(new DateTime(2025, 12, 29), WeekStart.Monday);
// → 1 (ISO 8601 — primera semana de 2026)
```

**Firma:** `int WeekOfYear(DateTime dt, WeekStart? weekStart = null)`

### WeekYear

Devuelve el año ISO que contiene la semana calendario de la fecha dada. Cerca de los límites del año ISO esto puede diferir de `date.Year`:

```csharp
// El 31 de dic de 2018 cae en la semana ISO 1 de 2019
int y = date.WeekYear(new DateTime(2018, 12, 31)); // 2019

// Para WeekStart.Sunday el método siempre devuelve date.Year
int y2 = date.WeekYear(new DateTime(2018, 12, 31), WeekStart.Sunday); // 2018
```

**Firma:** `int WeekYear(DateTime date, WeekStart? weekStart = null)`

### DayOfYear

Devuelve el número de día del año basado en 1 (1–366):

```csharp
int day = date.DayOfYear(new DateTime(2025, 2, 1));
// → 32
```

**Firma:** `int DayOfYear(DateTime dt)`

### ProgressInYear

Devuelve un valor entre 0.0 y 1.0 que representa qué tan avanzado está el año en la fecha dada:

```csharp
decimal progress = date.ProgressInYear(new DateTime(2025, 7, 1));
// → ~0.496 (aproximadamente a la mitad)
```

**Firma:** `decimal ProgressInYear(DateTime dt)`

### ProgressInMonth

Devuelve un valor entre 0.0 y 1.0 que representa qué tan avanzado está el mes en la fecha dada:

```csharp
decimal progress = date.ProgressInMonth(new DateTime(2025, 3, 15));
// → ~0.484 (día 15 de 31)
```

**Firma:** `decimal ProgressInMonth(DateTime dt)`

## Ejemplo completo

```csharp
public class DeadlineTracker(IValiDate date)
{
    public void AnalyzeDeadline(DateTime deadline)
    {
        var now = DateTime.Now;

        // Días y semanas restantes
        decimal daysLeft  = date.Diff(now, deadline, TimeUnit.Days);
        decimal weeksLeft = date.Diff(now, deadline, TimeUnit.Weeks);

        // Características del plazo
        bool isWeekend  = date.IsWeekend(deadline);
        int  weekNum    = date.WeekOfYear(deadline);
        int  dayOfYear  = date.DayOfYear(deadline);
        decimal yearProg = date.ProgressInYear(deadline);

        // Inicio/fin del mes del plazo
        DateTime monthStart = date.StartOf(deadline, DatePart.Month);
        DateTime monthEnd   = date.EndOf(deadline, DatePart.Month);

        Console.WriteLine($"Days remaining:   {daysLeft:F0}");
        Console.WriteLine($"Weeks remaining:  {weeksLeft:F1}");
        Console.WriteLine($"Falls on weekend: {isWeekend}");
        Console.WriteLine($"ISO week number:  {weekNum}");
        Console.WriteLine($"Day of year:      {dayOfYear}");
        Console.WriteLine($"Year progress:    {yearProg:P1}");
        Console.WriteLine($"Month span:       {monthStart:MMM dd} – {monthEnd:MMM dd}");
    }
}
```
