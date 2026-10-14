---
id: overview
title: Descripción general de Vali-Schedule
sidebar_label: Descripción general
description: Vali-Schedule proporciona programación estilo cron y por recurrencia para .NET — calcula la siguiente y anterior ocurrencia para patrones diarios, semanales, mensuales y personalizados, con omisión de fines de semana/feriados y periodos de ocurrencia.
keywords: [Vali-Schedule, programación, recurrencia, cron, .NET, NuGet, C#, próxima ocurrencia]
---

# Vali-Schedule

`IValiSchedule` es un constructor fluido para horarios recurrentes. Admite patrones de recurrencia diarios, semanales, mensuales, anuales y personalizados, con fecha de inicio, condiciones de fin, predicados personalizados y omisión de fines de semana/feriados. Para horarios basados en expresiones cron, consulta [Expresiones Cron](./cron.md).

## Instalación

```bash
dotnet add package Vali-Schedule
```

Targets compilados: `net8.0` · `net9.0` · `net10.0`. Compatible con .NET 6 y .NET 7 vía retrocompatibilidad de NuGet.

## Registro

```csharp
builder.Services.AddValiSchedule();
// o mediante el meta-paquete:
builder.Services.AddValiTempo();
```

:::warning Seguridad en hilos
`IValiSchedule` **no es seguro para hilos** y **no debe** registrarse como singleton. Regístralo como **scoped** o **transient**, o crea nuevas instancias según sea necesario. El patrón del constructor mantiene estado entre llamadas.
:::

## Enumeraciones

### RecurrenceType

Define con qué frecuencia se repite el horario:

| Valor | Descripción |
|---|---|
| `Daily` | Se repite cada N días |
| `Weekly` | Se repite cada N semanas en días especificados |
| `Monthly` | Se repite cada N meses en un día especificado |
| `Yearly` | Se repite cada N años, anclado al mes/día de la fecha de inicio |
| `Custom` | Se establece implícitamente mediante `WithCustomPredicate` — la validez de la ocurrencia se delega por completo al predicado |

### RecurrenceEnd

Define cuándo se detiene el horario:

| Valor | Descripción |
|---|---|
| `Never` | El horario se repite indefinidamente |
| `AfterOccurrences` | Se detiene después de un número fijo de ocurrencias |
| `OnDate` | Se detiene en o después de una fecha de fin específica |

### HolidaySkipStrategy

Define cómo se resuelve una ocurrencia que cae en una fecha excluida (fin de semana y/o feriado). Usado por `SkipWeekends()`/`SkipHolidays()`:

| Valor | Descripción |
|---|---|
| `NextWorkday` (predeterminado) | Mueve la ocurrencia hacia adelante, día por día, hasta encontrar una fecha no excluida. Descarta la ocurrencia si no se encuentra ninguna dentro de 366 días. |
| `PreviousWorkday` | Mueve la ocurrencia hacia atrás, día por día, hasta encontrar una fecha no excluida. Descarta la ocurrencia si la búsqueda cruza la fecha de inicio del horario, o si no se encuentra ninguna dentro de 366 días. |
| `Skip` | Descarta la ocurrencia por completo — no se genera ninguna fecha de reemplazo. Aun así consume un espacio del presupuesto de `EndsAfter`. |

## API de constructor fluido de IValiSchedule

### Every

Establece el intervalo y, de forma implícita, el tipo de recurrencia:

```csharp
schedule.Every(1, TimeUnit.Days)    // cada día
schedule.Every(2, TimeUnit.Weeks)   // cada 2 semanas
schedule.Every(1, TimeUnit.Months)  // cada mes
schedule.Every(1, TimeUnit.Years)   // cada año
```

**Firma:** `IValiSchedule Every(int interval, TimeUnit unit)`

Solo se admiten `TimeUnit.Days`, `TimeUnit.Weeks`, `TimeUnit.Months` y `TimeUnit.Years`. Cualquier otro `TimeUnit` (por ejemplo, `Hours`, `Minutes`) lanza `ArgumentOutOfRangeException`, igual que un `interval` menor a 1.

### On

Para horarios semanales: especifica en qué días de la semana incluir:

```csharp
schedule.Every(1, TimeUnit.Weeks)
        .On(DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday)
```

**Firma:** `IValiSchedule On(params DayOfWeek[] days)`

### At

Establece la hora del día para las ocurrencias:

```csharp
schedule.Every(1, TimeUnit.Days)
        .At(new TimeOnly(9, 0)) // 9:00 AM
```

**Firma:** `IValiSchedule At(TimeOnly time)`

Cuando nunca se llama, las ocurrencias se devuelven a medianoche (00:00:00).

### StartingFrom

Establece la fecha de inicio (por defecto, `DateTime.Today` en el momento de la consulta si nunca se llama):

```csharp
schedule.Every(1, TimeUnit.Weeks)
        .StartingFrom(new DateTime(2025, 4, 1))
```

**Firma:** `IValiSchedule StartingFrom(DateTime date)`

### EndsAfter

Detiene el horario después de un número fijo de ocurrencias:

```csharp
schedule.Every(1, TimeUnit.Days)
        .EndsAfter(10) // 10 ocurrencias y luego se detiene
```

**Firma:** `IValiSchedule EndsAfter(int occurrences)`

Lanza `ArgumentOutOfRangeException` cuando `occurrences` es menor a 1.

### EndsOn

Detiene el horario en o después de una fecha específica:

```csharp
schedule.Every(1, TimeUnit.Months)
        .EndsOn(new DateTime(2026, 12, 31))
```

**Firma:** `IValiSchedule EndsOn(DateTime date)`

### OnDayOfMonth

Para horarios mensuales: especifica qué día del mes:

```csharp
schedule.Every(1, TimeUnit.Months)
        .OnDayOfMonth(15) // día 15 de cada mes
```

**Firma:** `IValiSchedule OnDayOfMonth(int day)`

Lanza `ArgumentOutOfRangeException` cuando `day` no está entre 1 y 31.

### WithCustomPredicate

Agrega un filtro personalizado — solo se incluyen las ocurrencias donde el predicado devuelve `true`. Establecer esto cambia implícitamente el tipo de recurrencia a `RecurrenceType.Custom`:

```csharp
schedule.WithCustomPredicate(date => date.DayOfWeek != DayOfWeek.Friday)
// Ocurre en cada fecha excepto los viernes
```

**Firma:** `IValiSchedule WithCustomPredicate(Func<DateTime, bool> predicate)`

### SkipWeekends

Excluye los sábados y domingos de las ocurrencias generadas. Una ocurrencia en fin de semana se mueve hacia adelante al siguiente día que no sea fin de semana ni feriado (`HolidaySkipStrategy.NextWorkday`):

```csharp
schedule.Every(1, TimeUnit.Days)
        .SkipWeekends()
```

**Firma:** `IValiSchedule SkipWeekends()`

### SkipHolidays

Excluye fechas que son feriados públicos según `provider`, resolviendo colisiones según `strategy`. Se combina con `SkipWeekends()` si ambos están configurados — una fecha candidata se resuelve contra la unión de fechas excluidas, no en dos pasadas independientes:

```csharp
schedule.Every(1, TimeUnit.Days)
        .SkipWeekends()
        .SkipHolidays(new PeruHolidayProvider(), HolidaySkipStrategy.NextWorkday)
```

**Firma:** `IValiSchedule SkipHolidays(IHolidayProvider provider, HolidaySkipStrategy strategy = HolidaySkipStrategy.NextWorkday)`

Lanza `ArgumentNullException` cuando `provider` es `null`. Requiere el paquete `Vali-Holiday` para un `IHolidayProvider` concreto — consulta [Vali-Holiday](../vali-holiday/overview.md).

### Build

Valida la configuración actual y devuelve el horario, listo para usarse:

```csharp
var sched = schedule
    .Every(1, TimeUnit.Weeks)
    .On(DayOfWeek.Monday)
    .At(new TimeOnly(9, 0))
    .StartingFrom(new DateTime(2025, 1, 6))
    .Build();
```

**Firma:** `IValiSchedule Build()`

Lanza `InvalidOperationException` cuando `RecurrenceType.Weekly` está configurado sin días, o cuando `RecurrenceType.Custom` está configurado (implícitamente, mediante `WithCustomPredicate`) pero no se proporcionó ningún predicado antes de llamar a `Build()`.

## Métodos de consulta

Una vez construido el horario, usa estos métodos para consultar ocurrencias. Todos exploran una ventana de 5 años (1825 días) desde la fecha de referencia.

### NextOccurrence

Devuelve la próxima ocurrencia en o después de la fecha de referencia dada:

```csharp
DateTime? next = sched.NextOccurrence(DateTime.Today);
// → null si el horario ha terminado o no existe ninguna ocurrencia dentro de la ventana de 5 años
```

**Firma:** `DateTime? NextOccurrence(DateTime reference)`

### PreviousOccurrence

Devuelve la ocurrencia más reciente estrictamente antes de la fecha de referencia dada:

```csharp
DateTime? prev = sched.PreviousOccurrence(DateTime.Today);
```

**Firma:** `DateTime? PreviousOccurrence(DateTime reference)`

### OccursOn

Devuelve `true` si el horario tiene una ocurrencia en la fecha dada, sin importar la hora del día:

```csharp
bool occurs = sched.OccursOn(new DateTime(2025, 4, 7));
```

**Firma:** `bool OccursOn(DateTime date)`

### Occurrences

Enumera hasta `limit` ocurrencias comenzando en o después de la fecha de referencia dada (por defecto 10):

```csharp
IEnumerable<DateTime> next5 = sched.Occurrences(DateTime.Today, limit: 5);

foreach (var occ in next5)
    Console.WriteLine(occ.ToString("g"));
```

**Firma:** `IEnumerable<DateTime> Occurrences(DateTime reference, int limit = 10)`

### OccurrencesInRange

Enumera todas las ocurrencias dentro del rango de fechas inclusivo `[from, to]`:

```csharp
IEnumerable<DateTime> q2Meetings = sched.OccurrencesInRange(
    new DateTime(2025, 4, 1), new DateTime(2025, 6, 30));
```

**Firma:** `IEnumerable<DateTime> OccurrencesInRange(DateTime from, DateTime to)`

Lanza `ArgumentException` cuando `from` es posterior a `to`.

### OccurrencePeriods

Empareja cada ocurrencia en `[from, to]` con la próxima ocurrencia real del horario para producir una secuencia de periodos `DateRange` cerrados. Cada periodo es `[ocurrencia_i, ocurrencia_(i+1) − 1 tick]`. La ocurrencia de cierre puede caer más allá de `to` — un periodo nunca se trunca en el límite de la consulta. Si la última ocurrencia en el rango no tiene una ocurrencia real posterior (el horario terminó), no produce ningún periodo:

```csharp
IEnumerable<DateRange> periods = sched.OccurrencePeriods(
    new DateTime(2025, 1, 1), new DateTime(2025, 3, 31));

foreach (var period in periods)
    Console.WriteLine($"{period.Start:yyyy-MM-dd} → {period.End:yyyy-MM-dd}");
```

**Firma:** `IEnumerable<DateRange> OccurrencePeriods(DateTime from, DateTime to)`

Lanza `ArgumentException` cuando `from` es posterior a `to`. Requiere el paquete `Vali-Range` para `DateRange` — consulta [Vali-Range](../vali-range/overview.md).

## Ejemplos completos

### Standup semanal

```csharp
public class StandupScheduler
{
    public IValiSchedule BuildStandup(DateTime startDate)
    {
        return new ValiSchedule()
            .Every(1, TimeUnit.Weeks)
            .On(DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday,
                DayOfWeek.Thursday, DayOfWeek.Friday)
            .At(new TimeOnly(9, 30))
            .StartingFrom(startDate)
            .Build();
    }

    public void PrintNextStandups(IValiSchedule sched, int count = 5)
    {
        Console.WriteLine($"Next {count} standups:");
        foreach (var occ in sched.Occurrences(DateTime.Today, count))
            Console.WriteLine($"  {occ:ddd, MMM dd HH:mm}");
    }
}
```

### Ejecución mensual de nómina, omitiendo fines de semana y feriados

```csharp
public IValiSchedule BuildPayroll(int dayOfMonth = 25)
{
    return new ValiSchedule()
        .Every(1, TimeUnit.Months)
        .OnDayOfMonth(dayOfMonth)
        .At(new TimeOnly(8, 0))
        .StartingFrom(new DateTime(2025, 1, 1))
        .SkipWeekends()
        .SkipHolidays(new PeruHolidayProvider())
        .Build();
}
```

### Recordatorio anual con condición de fin

```csharp
var reminder = new ValiSchedule()
    .Every(1, TimeUnit.Years)
    .At(new TimeOnly(10, 0))
    .StartingFrom(new DateTime(2025, 3, 23))
    .EndsAfter(5) // solo 5 años
    .Build();

DateTime? nextReminder = reminder.NextOccurrence(DateTime.Today);
Console.WriteLine($"Next annual reminder: {nextReminder:MMM dd, yyyy}");
```
