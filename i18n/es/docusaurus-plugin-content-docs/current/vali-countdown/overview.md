---
id: overview
title: Descripción general de Vali-CountDown
sidebar_label: Descripción general
description: Vali-CountDown proporciona cálculos de cuenta regresiva y tiempo transcurrido para .NET — mide el tiempo restante hasta una fecha objetivo o el tiempo transcurrido desde un evento.
keywords: [Vali-CountDown, cuenta regresiva, tiempo transcurrido, .NET, NuGet, C#, tiempo restante]
---

# Vali-CountDown

`IValiCountdown` proporciona seguimiento de plazos, cálculo de cuenta regresiva, medición de tiempo transcurrido y reporte de progreso. Todos los métodos aceptan un parámetro de tiempo de referencia opcional, lo que te permite probar contra cualquier punto en el tiempo en lugar de usar siempre `DateTime.Now`.

## Instalación

```bash
dotnet add package Vali-CountDown
```

Targets compilados: `net8.0` · `net9.0` · `net10.0`. Compatible con .NET 6 y .NET 7 mediante compatibilidad retroactiva de NuGet.

## Registro

```csharp
builder.Services.AddValiCountdown();
// o mediante el meta-paquete:
builder.Services.AddValiTempo();
```

## API de IValiCountdown

### IsExpired

Devuelve `true` si el plazo ya ha pasado:

```csharp
bool expired = countdown.IsExpired(deadline);
bool expiredAt = countdown.IsExpired(deadline, reference: DateTime.Now);
```

**Firma:** `bool IsExpired(DateTime deadline)` / `bool IsExpired(DateTime deadline, DateTime reference)`

### TimeUntil

Devuelve la cantidad de tiempo restante hasta el plazo en la unidad especificada. Devuelve `0` si ya ha expirado:

```csharp
decimal remaining = countdown.TimeUntil(deadline, TimeUnit.Hours);
// → ej. 47.5

decimal remainingRounded = countdown.TimeUntil(deadline, TimeUnit.Days, decimalPlaces: 1);
// → ej. 2.0
```

**Firma:** `decimal TimeUntil(DateTime deadline, TimeUnit unit, int? decimalPlaces = null)`

### TimeElapsed

Devuelve la cantidad de tiempo transcurrido desde el punto dado, en la unidad especificada:

```csharp
decimal elapsed = countdown.TimeElapsed(startDate, TimeUnit.Hours);
// → Cuántas horas han pasado desde startDate
```

**Firma:** `decimal TimeElapsed(DateTime from, TimeUnit unit, int? decimalPlaces = null)`

> **Nota:** Cuando `from` está en el futuro, devuelve 0. Usa `IsStarted()` para verificar si el tiempo transcurrido es significativo.

### Progress

Devuelve el progreso fraccionado (0.0–1.0) entre inicio y fin. Devuelve `0` antes del inicio; `1` en el fin o después:

```csharp
decimal progress = countdown.Progress(startDate, deadline);
// → 0.0 al inicio, 1.0 en el plazo
```

**Firma:** `decimal Progress(DateTime start, DateTime end)` / `decimal Progress(DateTime start, DateTime end, DateTime reference)`

### ProgressPercent

Devuelve el progreso como porcentaje (0–100):

```csharp
decimal pct = countdown.ProgressPercent(startDate, deadline);
// → 0.0 a 100.0
```

**Firma:** `decimal ProgressPercent(DateTime start, DateTime end)`

### Breakdown

Descompone el tiempo restante en unidades componentes. Devuelve todos ceros si el plazo ha expirado:

```csharp
var parts = countdown.Breakdown(deadline);
// → Diccionario con claves Days, Hours, Minutes, Seconds, Milliseconds

Console.WriteLine($"{parts[TimeUnit.Days]}d {parts[TimeUnit.Hours]}h {parts[TimeUnit.Minutes]}m");
```

**Firma:** `Dictionary<TimeUnit, decimal> Breakdown(DateTime deadline)`

### Format

Formatea el tiempo restante hasta el plazo como una cadena legible para humanos (ej. `"5d 3h 20m"`). Devuelve `"Expired"` si el plazo ya ha pasado. Solo se incluyen los componentes no nulos.

Cuando queda entre 0 y 1 segundo, devuelve `"< 1s"`.

```csharp
string formatted = countdown.Format(deadline);
// → "2d 3h 20m"

string withSeconds = countdown.Format(deadline, includeSeconds: true);
// → "2d 3h 20m 15s"
```

**Firma:** `string Format(DateTime deadline, bool includeSeconds = false)`

### IsWithin

Devuelve `true` si el plazo está dentro de una cantidad dada (expresada en la unidad especificada) desde ahora. Devuelve `false` si el plazo ya ha expirado:

```csharp
bool urgent = countdown.IsWithin(deadline, 24, TimeUnit.Hours);
// → true si el plazo es dentro de las próximas 24 horas

bool soonWarning = countdown.IsWithin(deadline, 7, TimeUnit.Days);
```

**Firma:** `bool IsWithin(DateTime deadline, decimal amount, TimeUnit unit)`

### IsStarted

Devuelve `true` si `from` está en el pasado o presente (es decir, el tiempo transcurrido es significativo):

```csharp
bool started = countdown.IsStarted(projectStart);
// → true cuando DateTime.Now >= projectStart
```

**Firma:** `bool IsStarted(DateTime from)`

## Ejemplo completo

```csharp
public class TaskDashboard(IValiCountdown countdown)
{
    public void DisplayTaskStatus(string taskName, DateTime created, DateTime deadline)
    {
        bool isExpired = countdown.IsExpired(deadline);

        if (isExpired)
        {
            decimal overdue = countdown.TimeElapsed(deadline, TimeUnit.Hours, decimalPlaces: 1);
            Console.WriteLine($"[OVERDUE] {taskName} — overdue by {overdue:F1} hours");
            return;
        }

        decimal progressPct = countdown.ProgressPercent(created, deadline);
        bool    isUrgent    = countdown.IsWithin(deadline, 48, TimeUnit.Hours);

        var parts = countdown.Breakdown(deadline);

        Console.WriteLine($"Task:       {taskName}");
        Console.WriteLine($"Progress:   {progressPct:F1}%");
        Console.WriteLine($"Remaining:  {parts[TimeUnit.Days]}d {parts[TimeUnit.Hours]}h {parts[TimeUnit.Minutes]}m");
        Console.WriteLine($"Formatted:  {countdown.Format(deadline)}");

        if (isUrgent)
            Console.WriteLine("  *** URGENT: less than 48 hours ***");
    }
}
```
