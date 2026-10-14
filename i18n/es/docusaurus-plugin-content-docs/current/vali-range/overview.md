---
id: overview
title: Descripción general de Vali-Range
sidebar_label: Descripción general
description: Vali-Range proporciona operaciones con rangos de fechas para .NET — verifica superposiciones, contenimiento, duración e itera sobre rangos de fechas con precisión.
keywords: [Vali-Range, rango de fechas, .NET, NuGet, superposición, C#, intervalo de fechas]
---

# Vali-Range

`IValiRange` proporciona un conjunto completo de operaciones con rangos de fechas construido sobre el struct `DateRange`. Admite creación, consultas, operaciones de conjuntos (unión, intersección), enumeración, división e iteración de días laborables con conciencia del calendario.

## Instalación

```bash
dotnet add package Vali-Range
```

Targets compilados: `net8.0` · `net9.0` · `net10.0`. Compatible con .NET 6 y .NET 7 mediante compatibilidad retroactiva de NuGet.

## Registro

```csharp
builder.Services.AddValiRange();
// o mediante el meta-paquete:
builder.Services.AddValiTempo();
```

## Struct DateRange

`DateRange` es un tipo de valor que representa un intervalo de fechas cerrado `[Start, End]`.

```csharp
var range = new DateRange(new DateTime(2025, 1, 1), new DateTime(2025, 3, 31));
Console.WriteLine(range.Start); // 2025-01-01
Console.WriteLine(range.End);   // 2025-03-31
Console.WriteLine(range.Duration(TimeUnit.Days)); // 89
```

**Miembros:**

| Miembro | Tipo | Descripción |
|---|---|---|
| `Start` | `DateTime` | Fecha de inicio inclusiva |
| `End` | `DateTime` | Fecha de fin inclusiva |
| `IsValid` | `bool` | `true` cuando `Start <= End` |
| `Duration(TimeUnit)` | `decimal` | Duración del rango expresada en la unidad indicada |

## API de IValiRange

### Create

Crea un `DateRange` a partir de fechas de inicio y fin:

```csharp
DateRange r = range.Create(new DateTime(2025, 1, 1), new DateTime(2025, 12, 31));
```

**Firma:** `DateRange Create(DateTime start, DateTime end)`

### LastUnits

Crea un rango que cubre las últimas N unidades antes de una fecha de referencia:

```csharp
DateRange last30Days = range.LastUnits(30, TimeUnit.Days);
DateRange last3Months = range.LastUnits(3, TimeUnit.Months);
```

**Firma:** `DateRange LastUnits(decimal amount, TimeUnit unit)`

`End` es el instante actual (`DateTime.Now`); `Start` es `amount` unidades antes.

> **Nota:** `amount` debe ser mayor que 0. Pasar 0 o un valor negativo lanza `ArgumentException`.

### NextUnits

Crea un rango que cubre las próximas N unidades desde el instante actual:

```csharp
DateRange next7Days   = range.NextUnits(7, TimeUnit.Days);
DateRange nextQuarter = range.NextUnits(3, TimeUnit.Months);
```

**Firma:** `DateRange NextUnits(decimal amount, TimeUnit unit)`

`Start` es el instante actual (`DateTime.Now`); `End` es `amount` unidades después.

> **Nota:** `amount` debe ser mayor que 0. Pasar 0 o un valor negativo lanza `ArgumentException`.

### ThisMonth / ThisWeek / ThisQuarter / ThisYear

Métodos de fábrica convenientes para rangos comunes:

```csharp
DateRange month   = range.ThisMonth();
DateRange week    = range.ThisWeek();
DateRange quarter = range.ThisQuarter();
DateRange year    = range.ThisYear();
```

### Contains

Comprueba si una fecha está dentro de un rango (inclusivo en ambos extremos):

```csharp
bool has = range.Contains(myRange, new DateTime(2025, 6, 15));
```

**Firma:** `bool Contains(DateRange range, DateTime date)`

### Overlaps

Comprueba si dos rangos se superponen (comparten al menos un instante):

```csharp
bool overlapping = range.Overlaps(rangeA, rangeB);
```

**Firma:** `bool Overlaps(DateRange a, DateRange b)`

### IsContainedBy

Comprueba si el primer rango está completamente dentro del segundo:

```csharp
bool inside = range.IsContainedBy(inner, outer);
```

**Firma:** `bool IsContainedBy(DateRange inner, DateRange outer)`

### Intersection

Devuelve la parte superpuesta de dos rangos, o `null` si no se superponen:

```csharp
DateRange? overlap = range.Intersection(rangeA, rangeB);
// → DateRange que cubre los días compartidos, o null si no hay superposición
```

**Firma:** `DateRange? Intersection(DateRange a, DateRange b)`

### Union

Fusiona dos rangos en el rango más pequeño que cubre ambos (no necesitan superponerse):

```csharp
DateRange merged = range.Union(rangeA, rangeB);
```

**Firma:** `DateRange Union(DateRange a, DateRange b)`

### Subtract

Devuelve la diferencia de conjuntos `A \ B` — la(s) porción(es) de `a` que quedan después de
eliminar todo punto también cubierto por `b`:

```csharp
IEnumerable<DateRange> remainder = range.Subtract(rangeA, rangeB);
```

**Firma:** `IEnumerable<DateRange> Subtract(DateRange a, DateRange b)`

Devuelve cero, uno o dos rangos sin superposición, según cómo se superponga `b` con `a`: cero
cuando `b` contiene por completo a `a`, uno cuando la superposición toca solo un extremo de `a`
(o no hay superposición alguna, devolviendo `a` sin cambios), o dos cuando `b` cae estrictamente
dentro de `a`.

### Expand

Extiende un rango N unidades en ambos extremos:

```csharp
DateRange expanded = range.Expand(myRange, 7, TimeUnit.Days);
// Agrega 7 días en cada extremo
```

**Firma:** `DateRange Expand(DateRange range, decimal amount, TimeUnit unit)`

### Shrink

Contrae un rango N unidades desde ambos extremos:

```csharp
DateRange shrunk = range.Shrink(myRange, 1, TimeUnit.Weeks);
```

**Firma:** `DateRange Shrink(DateRange range, decimal amount, TimeUnit unit)`

Lanza `ArgumentException` si el rango resultante sería inválido (`Start > End`).

### Shift

Mueve un rango hacia adelante o hacia atrás en el tiempo, manteniendo su duración:

```csharp
DateRange shifted = range.Shift(myRange, 1, TimeUnit.Months); // hacia adelante
DateRange back    = range.Shift(myRange, -2, TimeUnit.Weeks);  // hacia atrás
```

**Firma:** `DateRange Shift(DateRange range, decimal amount, TimeUnit unit)`

### IsAdjacent

Comprueba si dos rangos son adyacentes (el fin de uno es el día anterior al inicio del otro):

```csharp
bool adj = range.IsAdjacent(rangeA, rangeB);
```

**Firma:** `bool IsAdjacent(DateRange a, DateRange b)`

### Merge

Fusiona una colección de rangos superpuestos o adyacentes en rangos mínimos no superpuestos:

```csharp
IEnumerable<DateRange> merged = range.Merge(listOfRanges);
```

**Firma:** `IEnumerable<DateRange> Merge(IEnumerable<DateRange> ranges)`

### Gaps

Devuelve rangos que representan brechas entre una lista ordenada de rangos, delimitados por un rango contenedor:

```csharp
var container = range.Create(new DateTime(2025, 1, 1), new DateTime(2025, 12, 31));
IEnumerable<DateRange> gaps = range.Gaps(listOfRanges, container);
// → Rangos para períodos dentro del contenedor no cubiertos por ningún rango de entrada
```

**Firma:** `IEnumerable<DateRange> Gaps(IEnumerable<DateRange> ranges, DateRange container)`

El parámetro `container` define el rango delimitador dentro del cual se calculan las brechas. Solo se devuelven los períodos no cubiertos que caen dentro de `container`.

### EachDay / EachWeek / EachMonth

Enumera fechas dentro del rango a un paso dado:

```csharp
foreach (DateTime day in range.EachDay(myRange))
    Console.WriteLine(day);

foreach (DateTime weekStart in range.EachWeek(myRange))
    Console.WriteLine(weekStart);

foreach (DateTime monthStart in range.EachMonth(myRange))
    Console.WriteLine(monthStart);
```

**Firmas:**
- `IEnumerable<DateTime> EachDay(DateRange range)`
- `IEnumerable<DateTime> EachWeek(DateRange range)`
- `IEnumerable<DateTime> EachMonth(DateRange range)`

### EachWorkday

Enumera solo los días laborables (lun–vie) dentro del rango:

```csharp
foreach (DateTime workday in range.EachWorkday(myRange))
    Console.WriteLine(workday);
```

**Firma:** `IEnumerable<DateTime> EachWorkday(DateRange range)`

### SplitByDay / SplitByWeek / SplitByMonth / SplitByQuarter

Divide un rango en sub-rangos:

```csharp
IEnumerable<DateRange> days     = range.SplitByDay(myRange);
IEnumerable<DateRange> weeks    = range.SplitByWeek(myRange);
IEnumerable<DateRange> months   = range.SplitByMonth(myRange);
IEnumerable<DateRange> quarters = range.SplitByQuarter(myRange);
```

## Ejemplo completo

```csharp
public class ProjectAnalyzer(IValiRange range)
{
    public void AnalyzeProject(DateTime projectStart, DateTime projectEnd)
    {
        var project = range.Create(projectStart, projectEnd);

        Console.WriteLine($"Duration: {project.Duration(TimeUnit.Days)} days");

        // Dividir en sprints mensuales
        var sprints = range.SplitByMonth(project).ToList();
        Console.WriteLine($"Sprints: {sprints.Count}");

        // Encontrar brechas de días festivos (si el servicio de feriados está disponible)
        var workdays = range.EachWorkday(project).Count();
        Console.WriteLine($"Workdays: {workdays}");

        // Desglose trimestre por trimestre
        foreach (var quarter in range.SplitByQuarter(project))
        {
            Console.WriteLine($"  {quarter.Start:MMM dd} – {quarter.End:MMM dd}: {quarter.Duration(TimeUnit.Days)} days");
        }
    }
}
```
