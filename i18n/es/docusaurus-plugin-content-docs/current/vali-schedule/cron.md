---
id: cron
title: Vali-Schedule — Expresiones Cron
sidebar_label: Expresiones Cron
description: CronSchedule parsea expresiones cron estándar de 5 campos en una implementación de IValiSchedule — recurrencia con granularidad de minuto, con rangos, pasos, listas y alias de nombres de mes/día de la semana.
keywords: [Vali-Schedule, cron, expresión cron, CronSchedule, .NET, NuGet, C#]
---

# Expresiones Cron

`CronSchedule` (namespace `Vali_Schedule.Cron`) parsea una **expresión cron estándar de 5 campos**, separada por espacios — minuto, hora, día del mes, mes, día de la semana — en un `IValiSchedule` listo para consultar. Es una implementación separada e independiente de `IValiSchedule`, no una configuración de `ValiSchedule`, porque un horario cron puede disparar más de una vez por día (por ejemplo, `"*/15 9-17 * * MON-FRI"` dispara 33 veces en un día laboral que coincide), mientras que `ValiSchedule` emite como máximo una ocurrencia por día a una única hora configurada.

Cero dependencias externas — el parser y el escáner están implementados íntegramente dentro de `Vali-Schedule`.

## Instalación

```bash
dotnet add package Vali-Schedule
```

Targets compilados: `net8.0` · `net9.0` · `net10.0`. Compatible con .NET 6 y .NET 7 vía retrocompatibilidad de NuGet.

## Parsear una expresión

```csharp
using Vali_Schedule.Cron;

CronSchedule schedule = CronSchedule.Parse("*/15 9-17 * * MON-FRI");
```

**Firma:** `static CronSchedule Parse(string cronExpression)`

Lanza `ArgumentNullException` cuando `cronExpression` es nulo/espacios en blanco, y `CronFormatException` cuando no tiene exactamente 5 campos, o cuando algún campo contiene un token fuera de la sintaxis o rango de valores soportados para ese campo.

### TryParse

Para entradas no confiables o provistas por el usuario, usa `TryParse` para evitar un try/catch:

```csharp
if (CronSchedule.TryParse(userInput, out var schedule, out var error))
{
    // schedule está listo para consultarse
}
else
{
    Console.WriteLine($"Invalid cron expression: {error}");
}
```

**Firma:** `static bool TryParse(string cronExpression, out CronSchedule? schedule, out string? error)`

`error` es una descripción legible del primer fallo de parseo encontrado.

## Sintaxis de los campos

Cada uno de los 5 campos admite una lista de componentes separados por comas. Cada componente es uno de:

| Sintaxis | Significado | Ejemplo |
|---|---|---|
| `*` | Todos los valores del rango del campo | `* * * * *` (cada minuto) |
| `N` | Un valor único | `0 9 * * *` (9:00 todos los días) |
| `N-M` | Un rango inclusivo | `0 9-17 * * *` (9:00–17:00 cada hora) |
| `*/paso` | Cada `paso`-ésimo valor comenzando en el mínimo del campo | `*/15 * * * *` (cada 15 minutos) |
| `N/paso` | Cada `paso`-ésimo valor comenzando en `N`, hasta el máximo del campo | `10/20 * * * *` (minutos 10, 30, 50) |
| `N-M/paso` | Cada `paso`-ésimo valor dentro de un rango explícito | `0 9-17/2 * * *` (9:00, 11:00, 13:00, 15:00, 17:00) |
| `a,b,c` | Una lista — cualquier forma de componente, separada por comas | `0 8,12,18 * * *` |

### Límites y alias de campos

| Campo | Rango | Alias de nombres |
|---|---|---|
| Minuto | 0–59 | — |
| Hora | 0–23 | — |
| Día del mes | 1–31 | — |
| Mes | 1–12 | `JAN`–`DEC` (sin distinguir mayúsculas/minúsculas) |
| Día de la semana | 0–6 (0 = domingo) | `SUN`–`SAT` (sin distinguir mayúsculas/minúsculas); `7` también se acepta como alias de domingo |

Un rango descendente (por ejemplo, `17-9`) o un paso que no sea un entero positivo lanza `CronFormatException`, identificando el campo y el token responsables.

### Regla OR de día del mes / día de la semana

Cuando **ambos** campos, día del mes y día de la semana, están restringidos (ninguno es `*`), una fecha coincide si satisface **cualquiera** de los dos campos — la regla estándar de combinación OR de cron. Cuando solo uno de los dos está restringido, solo se exige ese campo.

## Métodos del constructor — soportados vs. no soportados

`CronSchedule` implementa `IValiSchedule`, pero varios métodos del constructor no tienen sentido una vez que la recurrencia ya está completamente expresada en la cadena cron — llamarlos lanza `NotSupportedException`:

| Método | Comportamiento en `CronSchedule` |
|---|---|
| `Every(int, TimeUnit)` | **Lanza** `NotSupportedException` — expresa el intervalo en la cadena cron (por ejemplo, `"*/15 * * * *"`). |
| `On(params DayOfWeek[])` | **Lanza** `NotSupportedException` — los días de la semana ya están en el 5º campo. |
| `At(TimeOnly)` | **Lanza** `NotSupportedException` — la hora del día ya está en los campos de minuto/hora, y cron puede disparar más de una vez por día. |
| `OnDayOfMonth(int)` | **Lanza** `NotSupportedException` — el día del mes ya está en el 3er campo. |
| `StartingFrom(DateTime)` | Soportado. Establece el límite inferior inclusivo; por defecto es hoy, la misma convención que `ValiSchedule`. |
| `EndsAfter(int)` | Soportado. Lanza `ArgumentOutOfRangeException` cuando `occurrences` es menor a 1. |
| `EndsOn(DateTime)` | Soportado. |
| `WithCustomPredicate(Func<DateTime, bool>)` | Soportado, y aditivo — cada llamada agrega otro predicado, todos evaluados con AND lógico sobre la coincidencia cron. Lanza `ArgumentNullException` para un predicado nulo. |
| `Build()` | Soportado — es un no-op; la expresión ya está completamente parseada y validada en el momento de `Parse()`. Devuelve la instancia actual. |

### SkipWeekends / SkipHolidays — descartar, no desplazar

A diferencia de `ValiSchedule.SkipWeekends()`, que desplaza una ocurrencia excluida hacia adelante al siguiente día laboral, `CronSchedule.SkipWeekends()` y `SkipHolidays()` **descartan** la ocurrencia excluida por completo (equivalente a la semántica de `HolidaySkipStrategy.Skip` — el parámetro `strategy` en `SkipHolidays` se acepta por compatibilidad de interfaz pero no tiene ningún otro efecto). Un horario cron puede disparar varias veces por día, así que "desplazar al siguiente día laboral, a la misma hora" reubicaría cada una de las ocurrencias de ese día en el día siguiente, colisionando con las ocurrencias propias de ese día.

```csharp
var sched = CronSchedule.Parse("0 9 * * MON-FRI")
    .SkipWeekends() // redundante aquí porque MON-FRI ya excluye los fines de semana, pero se combina con SkipHolidays
    .SkipHolidays(new PeruHolidayProvider());
```

## Advertencia de DST / hora de reloj

`CronSchedule` opera puramente sobre valores de reloj (`DateTime`) y no tiene conocimiento de zonas horarias. En una transición de "adelanto de hora" (spring forward), una hora configurada en la expresión cron puede no existir ese día; en un "retraso de hora" (fall back), puede coincidir dos veces si se evalúa contra instantes ambiguos de `DateTimeKind` distintos. Convierte a UTC (o a una zona fija) antes de consultar si se requiere una evaluación correcta respecto al DST.

## Métodos de consulta

`CronSchedule` expone la misma superficie de consulta de `IValiSchedule` que `ValiSchedule` — `NextOccurrence`, `PreviousOccurrence`, `OccursOn`, `Occurrences`, `OccurrencesInRange`, `OccurrencePeriods` — todos acotados por `StartingFrom`/`EndsAfter`/`EndsOn`/`WithCustomPredicate` y explorando hasta 5 años. Consulta [Métodos de consulta](./overview.md#métodos-de-consulta) en la página de descripción general para el contrato compartido; las notas a continuación cubren el comportamiento específico de cron.

### OccursOn

Solo se evalúan los campos de calendario (mes, día del mes, día de la semana) — equivalente a "sin importar en qué minuto/hora dispara":

```csharp
bool firesToday = sched.OccursOn(DateTime.Today);
```

### OccurrencesInRange

Las fechas se comparan por día — los componentes de hora del día de `from`/`to` acotan el primer/último día considerado, pero cada minuto coincidente dentro del último día del rango sigue incluido.

## Ejemplo completo

```csharp
using System;
using Vali_Schedule.Cron;
using Vali_Holiday.Providers.LatinAmerica;

// Cada 15 minutos, de 9am a 5pm, de lunes a viernes, omitiendo feriados peruanos
var sched = CronSchedule.Parse("*/15 9-17 * * MON-FRI")
    .SkipHolidays(new PeruHolidayProvider())
    .StartingFrom(new DateTime(2025, 6, 2)); // Lunes

Console.WriteLine("Next 5 polling windows:");
foreach (var occ in sched.Occurrences(new DateTime(2025, 6, 2), 5))
    Console.WriteLine($"  {occ:ddd MMM dd yyyy HH:mm}");
// Salida:
// Next 5 polling windows:
//   Mon Jun 02 2025 09:00
//   Mon Jun 02 2025 09:15
//   Mon Jun 02 2025 09:30
//   Mon Jun 02 2025 09:45
//   Mon Jun 02 2025 10:00
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega los paquetes NuGet **Vali-Schedule** y **Vali-Holiday** en la configuración del fiddle.
:::
