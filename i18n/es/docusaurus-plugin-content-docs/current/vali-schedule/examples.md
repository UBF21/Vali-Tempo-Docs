---
id: examples
title: Vali-Schedule — Ejemplos
sidebar_label: Ejemplos
---

# Vali-Schedule — Ejemplos

```bash
dotnet add package Vali-Schedule
```

## Horario diario — Próximas 5 ocurrencias diarias

Construye un horario diario simple comenzando desde una fecha fija e imprime las próximas 5 ocurrencias.

```csharp
using System;
using Vali_Schedule.Core;
using Vali_Time.Enums;

var sched = new ValiSchedule()
    .Every(1, TimeUnit.Days)
    .At(new TimeOnly(9, 0))
    .StartingFrom(new DateTime(2025, 6, 15))
    .Build();

// Consultar las próximas 5 ocurrencias desde la propia fecha de inicio del horario
var from = new DateTime(2025, 6, 15);

Console.WriteLine("Daily standup — next 5 occurrences");
Console.WriteLine("------------------------------------");

int index = 1;
foreach (var occ in sched.Occurrences(from, 5))
{
    Console.WriteLine($"  {index++}. {occ:ddd, MMM dd yyyy} at {occ:HH:mm}");
}
// Salida:
// Daily standup — next 5 occurrences
// ------------------------------------
//   1. Sun, Jun 15 2025 at 09:00
//   2. Mon, Jun 16 2025 at 09:00
//   3. Tue, Jun 17 2025 at 09:00
//   4. Wed, Jun 18 2025 at 09:00
//   5. Thu, Jun 19 2025 at 09:00
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Schedule** en la configuración del fiddle.
:::

---

## Horario semanal — Lunes y miércoles

Usa `On(DayOfWeek...)` para restringir un horario semanal a días específicos de la semana.

```csharp
using System;
using Vali_Schedule.Core;
using Vali_Time.Enums;

var sched = new ValiSchedule()
    .Every(1, TimeUnit.Weeks)
    .On(DayOfWeek.Monday, DayOfWeek.Wednesday)
    .At(new TimeOnly(10, 30))
    .StartingFrom(new DateTime(2025, 6, 16)) // Lunes
    .Build();

var from = new DateTime(2025, 6, 16);

Console.WriteLine("Bi-weekly sync — Mondays & Wednesdays (next 6 occurrences)");
Console.WriteLine("-------------------------------------------------------------");

int index = 1;
foreach (var occ in sched.Occurrences(from, 6))
{
    Console.WriteLine($"  {index++}. {occ:dddd, MMMM dd yyyy} at {occ:HH:mm}");
}

// Verificar un día específico
bool occursOnMonday    = sched.OccursOn(new DateTime(2025, 6, 16));
bool occursOnTuesday   = sched.OccursOn(new DateTime(2025, 6, 17));

Console.WriteLine();
Console.WriteLine($"Occurs on Monday  Jun 16 : {occursOnMonday}");
Console.WriteLine($"Occurs on Tuesday Jun 17 : {occursOnTuesday}");
// Salida:
// Bi-weekly sync — Mondays & Wednesdays (next 6 occurrences)
// -------------------------------------------------------------
//   1. Monday, June 16 2025 at 10:30
//   2. Wednesday, June 18 2025 at 10:30
//   3. Monday, June 23 2025 at 10:30
//   4. Wednesday, June 25 2025 at 10:30
//   5. Monday, June 30 2025 at 10:30
//   6. Wednesday, July 02 2025 at 10:30
//
// Occurs on Monday  Jun 16 : True
// Occurs on Tuesday Jun 17 : False
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Schedule** en la configuración del fiddle.
:::

---

## Horario mensual — Día 15 de cada mes

Usa `OnDayOfMonth` para fijar una recurrencia mensual a un día calendario específico.

```csharp
using System;
using Vali_Schedule.Core;
using Vali_Time.Enums;

var sched = new ValiSchedule()
    .Every(1, TimeUnit.Months)
    .OnDayOfMonth(15)
    .At(new TimeOnly(8, 0))
    .StartingFrom(new DateTime(2025, 1, 15))
    .Build();

var from = new DateTime(2025, 6, 1);

Console.WriteLine("Monthly invoice run — 15th of each month (next 6 occurrences)");
Console.WriteLine("----------------------------------------------------------------");

int index = 1;
foreach (var occ in sched.Occurrences(from, 6))
{
    Console.WriteLine($"  {index++}. {occ:MMMM dd, yyyy} at {occ:HH:mm}");
}

// Verificar dos fechas
bool onThe15th  = sched.OccursOn(new DateTime(2025, 8, 15));
bool onThe16th  = sched.OccursOn(new DateTime(2025, 8, 16));

Console.WriteLine();
Console.WriteLine($"Occurs on Aug 15 : {onThe15th}");
Console.WriteLine($"Occurs on Aug 16 : {onThe16th}");
// Salida:
// Monthly invoice run — 15th of each month (next 6 occurrences)
// ----------------------------------------------------------------
//   1. June 15, 2025 at 08:00
//   2. July 15, 2025 at 08:00
//   3. August 15, 2025 at 08:00
//   4. September 15, 2025 at 08:00
//   5. October 15, 2025 at 08:00
//   6. November 15, 2025 at 08:00
//
// Occurs on Aug 15 : True
// Occurs on Aug 16 : False
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Schedule** en la configuración del fiddle.
:::

---

## Límite AfterOccurrences — Detener después de N ocurrencias

`EndsAfter(n)` limita el horario a exactamente N ocurrencias. Cualquier consulta más allá de ese límite no devuelve resultados.

```csharp
using System;
using Vali_Schedule.Core;
using Vali_Time.Enums;

// Programa de entrenamiento de 8 semanas: todos los lunes y jueves, limitado a 16 sesiones
var sched = new ValiSchedule()
    .Every(1, TimeUnit.Weeks)
    .On(DayOfWeek.Monday, DayOfWeek.Thursday)
    .At(new TimeOnly(7, 0))
    .StartingFrom(new DateTime(2025, 6, 16)) // Lunes
    .EndsAfter(16)
    .Build();

var from = new DateTime(2025, 6, 16);

// Obtener todas las sesiones del programa
var allSessions = sched.Occurrences(from, 20); // solicitar más de 16

Console.WriteLine("8-week training program — all sessions");
Console.WriteLine("---------------------------------------");

int count = 0;
foreach (var session in allSessions)
{
    count++;
    Console.WriteLine($"  Session {count,2}: {session:ddd, MMM dd yyyy} at {session:HH:mm}");
}

Console.WriteLine();
Console.WriteLine($"Total sessions scheduled : {count}");

// Después de que el programa termina, NextOccurrence devuelve null
var lastSession  = new DateTime(2025, 8, 11); // después de la 16ª ocurrencia
DateTime? after  = sched.NextOccurrence(lastSession);

Console.WriteLine($"Next occurrence after program ends : {after?.ToString("MMM dd, yyyy") ?? "null (schedule ended)"}");
// Salida:
// 8-week training program — all sessions
// ---------------------------------------
//   Session  1: Mon, Jun 16 2025 at 07:00
//   Session  2: Thu, Jun 19 2025 at 07:00
//   Session  3: Mon, Jun 23 2025 at 07:00
//   Session  4: Thu, Jun 26 2025 at 07:00
//   Session  5: Mon, Jun 30 2025 at 07:00
//   Session  6: Thu, Jul 03 2025 at 07:00
//   Session  7: Mon, Jul 07 2025 at 07:00
//   Session  8: Thu, Jul 10 2025 at 07:00
//   Session  9: Mon, Jul 14 2025 at 07:00
//   Session 10: Thu, Jul 17 2025 at 07:00
//   Session 11: Mon, Jul 21 2025 at 07:00
//   Session 12: Thu, Jul 24 2025 at 07:00
//   Session 13: Mon, Jul 28 2025 at 07:00
//   Session 14: Thu, Jul 31 2025 at 07:00
//   Session 15: Mon, Aug 04 2025 at 07:00
//   Session 16: Thu, Aug 07 2025 at 07:00
//
// Total sessions scheduled : 16
// Next occurrence after program ends : null (schedule ended)
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Schedule** en la configuración del fiddle.
:::

---

## SkipWeekends + SkipHolidays — Resolver ocurrencias con HolidaySkipStrategy

`SkipWeekends()` y `SkipHolidays(provider, strategy)` se combinan contra la unión de fechas excluidas. Aquí un horario diario encuentra un feriado que cae en fin de semana — `Santa Rosa de Lima` (30 de agosto de 2025) es sábado, por lo que la ocurrencia se desplaza hasta el siguiente lunes.

```csharp
using System;
using Vali_Schedule.Core;
using Vali_Time.Enums;
using Vali_Holiday.Providers.LatinAmerica;

var sched = new ValiSchedule()
    .Every(1, TimeUnit.Days)
    .At(new TimeOnly(9, 0))
    .StartingFrom(new DateTime(2025, 8, 28))
    .SkipWeekends()
    .SkipHolidays(new PeruHolidayProvider()) // por defecto, HolidaySkipStrategy.NextWorkday
    .Build();

Console.WriteLine("Daily reminder around Santa Rosa de Lima (Aug 30, 2025 — a Saturday)");
Console.WriteLine("-----------------------------------------------------------------------");

foreach (var occ in sched.Occurrences(new DateTime(2025, 8, 28), 4))
    Console.WriteLine($"  {occ:dddd, MMM dd yyyy}");
// Salida:
// Daily reminder around Santa Rosa de Lima (Aug 30, 2025 — a Saturday)
// -----------------------------------------------------------------------
//   Thursday, Aug 28 2025
//   Friday, Aug 29 2025
//   Monday, Sep 01 2025   <- 30 ago (sábado, feriado) y 31 ago (domingo) omitidos
//   Tuesday, Sep 02 2025
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega los paquetes NuGet **Vali-Schedule** y **Vali-Holiday** en la configuración del fiddle.
:::

---

## OccurrencePeriods — Emparejar ocurrencias en rangos de fechas

`OccurrencePeriods` empareja cada ocurrencia con la próxima ocurrencia real del horario, produciendo periodos `DateRange` cerrados útiles para ciclos de facturación, ventanas de reportes, o lógica de "vigente hasta la próxima ocurrencia". El último periodo se cierra con la próxima ocurrencia real aunque caiga más allá del límite `to` de la consulta.

```csharp
using System;
using Vali_Schedule.Core;
using Vali_Time.Enums;

var sched = new ValiSchedule()
    .Every(1, TimeUnit.Weeks)
    .On(DayOfWeek.Monday)
    .StartingFrom(new DateTime(2025, 1, 6)) // Lunes
    .Build();

var periods = sched.OccurrencePeriods(new DateTime(2025, 1, 1), new DateTime(2025, 1, 31));

Console.WriteLine("Weekly billing periods — January 2025");
Console.WriteLine("----------------------------------------");

foreach (var period in periods)
    Console.WriteLine($"  {period.Start:yyyy-MM-dd} → {period.End:yyyy-MM-dd HH:mm:ss.fffffff}");
// Salida:
// Weekly billing periods — January 2025
// ----------------------------------------
//   2025-01-06 → 2025-01-12 23:59:59.9999999
//   2025-01-13 → 2025-01-19 23:59:59.9999999
//   2025-01-20 → 2025-01-26 23:59:59.9999999
//   2025-01-27 → 2025-02-02 23:59:59.9999999   <- cerrado por el 3 de feb (la próxima ocurrencia real), más allá de `to`
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega los paquetes NuGet **Vali-Schedule** y **Vali-Range** en la configuración del fiddle.
:::
