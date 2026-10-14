---
id: examples
title: Vali-Calendar — Ejemplos
sidebar_label: Ejemplos
---

# Vali-Calendar — Ejemplos

```bash
dotnet add package Vali-Calendar
```

## AddWorkdays — Avanzar una fecha por días hábiles

Agrega un número fijo de días hábiles a una fecha, omitiendo automáticamente los fines de semana.

```csharp
using Vali_Calendar.Core;

var calendar = new ValiCalendar();

// Factura emitida un lunes — pago vence en 5 días hábiles
DateTime issueDate  = new DateTime(2025, 1, 6);   // Lunes 6 de enero
DateTime dueDate    = calendar.AddWorkdays(issueDate, 5);

Console.WriteLine($"Issue date: {issueDate:ddd, MMM dd yyyy}");  // → Mon, Jan 06 2025
Console.WriteLine($"Due date:   {dueDate:ddd, MMM dd yyyy}");    // → Mon, Jan 13 2025
// Omite sábado 11 y domingo 12 de enero
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Calendar** en la configuración del fiddle.
:::

---

## WorkdaysBetween — Contar días hábiles en un período

Cuenta el número de días laborables entre dos fechas, útil para cálculos de SLA y facturación.

```csharp
using Vali_Calendar.Core;

var calendar = new ValiCalendar();

DateTime from = new DateTime(2025, 1, 6);   // Lunes
DateTime to   = new DateTime(2025, 1, 31);  // Viernes

int workdays = calendar.WorkdaysBetween(from, to);

Console.WriteLine($"Workdays in January (6–30): {workdays}"); // → 19

// Comparar con el total de días calendario
int totalDays = (to - from).Days;
Console.WriteLine($"Calendar days: {totalDays}"); // → 25
Console.WriteLine($"Weekend days:  {totalDays - workdays}");  // → 6
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Calendar** en la configuración del fiddle.
:::

---

## WeekOf — Obtener la semana calendario ISO para una fecha

Recupera la semana ISO 8601 completa (lunes–domingo) que contiene una fecha dada.

```csharp
using Vali_Calendar.Core;

var calendar = new ValiCalendar();

DateTime date = new DateTime(2025, 3, 15); // Sábado

CalendarWeek week = calendar.WeekOf(date);

Console.WriteLine($"Week number: {week.WeekNumber}");          // → 11
Console.WriteLine($"Week start:  {week.Start:ddd, MMM dd}");  // → Mon, Mar 10
Console.WriteLine($"Week end:    {week.End:ddd, MMM dd}");    // → Sun, Mar 16

Console.WriteLine("Days in week:");
foreach (DateTime day in week.Days)
    Console.WriteLine($"  {day:ddd dd}");
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Calendar** en la configuración del fiddle.
:::

---

## NextWorkday / PreviousWorkday — Navegar al día hábil más cercano

Avanza o retrocede al día hábil más cercano desde cualquier fecha, incluyendo fines de semana.

```csharp
using Vali_Calendar.Core;

var calendar = new ValiCalendar();

// Partiendo de un viernes
DateTime friday = new DateTime(2025, 1, 10);

DateTime next = calendar.NextWorkday(friday);
Console.WriteLine($"Next workday after {friday:ddd MMM dd}: {next:ddd MMM dd}");
// → Mon Jan 13

// Partiendo de un lunes
DateTime monday = new DateTime(2025, 1, 13);

DateTime prev = calendar.PreviousWorkday(monday);
Console.WriteLine($"Previous workday before {monday:ddd MMM dd}: {prev:ddd MMM dd}");
// → Fri Jan 10

// Partiendo de un sábado — salta correctamente en ambas direcciones
DateTime saturday = new DateTime(2025, 1, 11);
Console.WriteLine($"Next after Saturday:     {calendar.NextWorkday(saturday):ddd MMM dd}");     // → Mon Jan 13
Console.WriteLine($"Previous before Saturday: {calendar.PreviousWorkday(saturday):ddd MMM dd}"); // → Fri Jan 10
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Calendar** en la configuración del fiddle.
:::
