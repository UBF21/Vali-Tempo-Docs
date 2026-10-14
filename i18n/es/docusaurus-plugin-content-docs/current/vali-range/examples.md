---
id: examples
title: Vali-Range — Ejemplos
sidebar_label: Ejemplos
---

# Vali-Range — Ejemplos

```bash
dotnet add package Vali-Range
```

## ThisQuarter — Obtener el rango del trimestre actual

Recupera el rango de fechas que cubre el trimestre calendario actual en una sola llamada.

```csharp
using Vali_Range.Core;

var vr = new ValiRange();

DateRange quarter = vr.ThisQuarter();

Console.WriteLine($"Quarter start: {quarter.Start:yyyy-MM-dd}");  // ej. → 2025-01-01
Console.WriteLine($"Quarter end:   {quarter.End:yyyy-MM-dd}");    // ej. → 2025-03-31
Console.WriteLine($"Total days:    {quarter.Duration(TimeUnit.Days)}"); // → 90
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Range** en la configuración del fiddle.
:::

---

## Overlaps + Intersection — Detectar y extraer la superposición entre dos rangos

Comprueba si dos cronogramas de proyecto se superponen y luego extrae el período compartido exacto.

```csharp
using Vali_Range.Core;

var vr = new ValiRange();

var projectA = vr.Create(new DateTime(2025, 1, 15), new DateTime(2025, 4, 30));
var projectB = vr.Create(new DateTime(2025, 3, 1),  new DateTime(2025, 6, 30));

bool doOverlap = vr.Overlaps(projectA, projectB);
Console.WriteLine($"Overlap: {doOverlap}"); // → True

if (doOverlap)
{
    DateRange? shared = vr.Intersection(projectA, projectB);
    Console.WriteLine($"Shared period: {shared.Value.Start:yyyy-MM-dd} → {shared.Value.End:yyyy-MM-dd}");
    // → 2025-03-01 → 2025-04-30
    Console.WriteLine($"Shared days: {shared.Value.Duration(TimeUnit.Days)}"); // → 61
}
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Range** en la configuración del fiddle.
:::

---

## EachDay — Iterar sobre cada día de un rango

Enumera todos los días calendario dentro de un rango para generar un andamiaje de reporte diario.

```csharp
using Vali_Range.Core;

var vr = new ValiRange();

var sprint = vr.Create(new DateTime(2025, 1, 6), new DateTime(2025, 1, 10));

Console.WriteLine("Sprint days:");
foreach (DateTime day in vr.EachDay(sprint))
{
    Console.WriteLine($"  {day:ddd, MMM dd yyyy}");
}

// → Mon, Jan 06 2025
// → Tue, Jan 07 2025
// → Wed, Jan 08 2025
// → Thu, Jan 09 2025
// → Fri, Jan 10 2025
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Range** en la configuración del fiddle.
:::

---

## Gaps — Encontrar períodos no cubiertos entre rangos

Dado una lista de rangos programados y un contenedor delimitador, encuentra todas las brechas no programadas.

```csharp
using Vali_Range.Core;

var vr = new ValiRange();

// Contenedor de año completo
var year = vr.Create(new DateTime(2025, 1, 1), new DateTime(2025, 12, 31));

// Rangos de proyectos programados
var scheduled = new[]
{
    vr.Create(new DateTime(2025, 1, 15), new DateTime(2025, 3, 31)),
    vr.Create(new DateTime(2025, 5, 1),  new DateTime(2025, 7, 31)),
    vr.Create(new DateTime(2025, 9, 1),  new DateTime(2025, 11, 30)),
};

var gaps = vr.Gaps(scheduled, year).ToList();

Console.WriteLine($"Unscheduled periods: {gaps.Count}");
foreach (var gap in gaps)
{
    Console.WriteLine($"  {gap.Start:MMM dd} → {gap.End:MMM dd} ({gap.Duration(TimeUnit.Days)} days)");
}

// → Jan 01 → Jan 14  (14 days)
// → Apr 01 → Apr 30  (30 days)
// → Aug 01 → Aug 31  (31 days)
// → Dec 01 → Dec 31  (31 days)
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Range** en la configuración del fiddle.
:::

---

## Subtract — Quitar un período de bloqueo de una ventana de reservas

Recorta una ventana de bloqueo por mantenimiento de la disponibilidad de reservas de un recurso,
conservando lo que queda a cada lado.

```csharp
using Vali_Range.Core;

var vr = new ValiRange();

var availability = vr.Create(new DateTime(2025, 1, 1), new DateTime(2025, 1, 31));
var blackout      = vr.Create(new DateTime(2025, 1, 10), new DateTime(2025, 1, 20));

IEnumerable<DateRange> bookable = vr.Subtract(availability, blackout);

foreach (DateRange window in bookable)
{
    Console.WriteLine($"  {window.Start:yyyy-MM-dd} → {window.End:yyyy-MM-dd}");
}

// → 2025-01-01 → 2025-01-09
// → 2025-01-21 → 2025-01-31
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Range** en la configuración del fiddle.
:::
