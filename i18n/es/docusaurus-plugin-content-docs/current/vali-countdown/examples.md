---
id: examples
title: Vali-CountDown — Ejemplos
sidebar_label: Ejemplos
---

# Vali-CountDown — Ejemplos

```bash
dotnet add package Vali-CountDown
```

## IsExpired + TimeUntil — Verificar si un plazo ha pasado

Usa `IsExpired` para detectar plazos vencidos y `TimeUntil` para obtener el tiempo restante en la unidad elegida.

```csharp
using System;
using Vali_CountDown.Core;
using Vali_Time.Enums;

var countdown = new ValiCountdown();

// Punto de referencia: 15 de junio de 2025 a las 12:00
var reference = new DateTime(2025, 6, 15, 12, 0, 0);

var pastDeadline   = new DateTime(2025, 6, 10, 9, 0, 0);  // ya expirado
var futureDeadline = new DateTime(2025, 6, 20, 17, 0, 0); // todavía abierto

bool isPastExpired   = countdown.IsExpired(pastDeadline,   reference);
bool isFutureExpired = countdown.IsExpired(futureDeadline, reference);

Console.WriteLine($"Past deadline expired   : {isPastExpired}");
Console.WriteLine($"Future deadline expired : {isFutureExpired}");

if (!isFutureExpired)
{
    decimal hoursLeft = countdown.TimeUntil(futureDeadline, TimeUnit.Hours,   decimalPlaces: 1);
    decimal daysLeft  = countdown.TimeUntil(futureDeadline, TimeUnit.Days,    decimalPlaces: 2);

    Console.WriteLine($"Hours remaining : {hoursLeft}");
    Console.WriteLine($"Days remaining  : {daysLeft}");
}
// Salida:
// Past deadline expired   : True
// Future deadline expired : False
// Hours remaining : 125
// Days remaining  : 5.21
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-CountDown** en la configuración del fiddle.
:::

---

## Progress / ProgressPercent — Seguimiento del progreso entre inicio y plazo

`Progress` devuelve una fracción (0.0–1.0) y `ProgressPercent` devuelve 0–100, ambas representando qué tan avanzada está la cuenta regresiva.

```csharp
using System;
using Vali_CountDown.Core;

var countdown = new ValiCountdown();

var start    = new DateTime(2025, 6, 1,  0, 0, 0);
var deadline = new DateTime(2025, 6, 30, 0, 0, 0);

// Simular tres puntos de control
var checkpoints = new[]
{
    new DateTime(2025, 6, 1,  0, 0, 0),  // al inicio
    new DateTime(2025, 6, 15, 0, 0, 0),  // a la mitad
    new DateTime(2025, 6, 30, 0, 0, 0),  // en el plazo
};

Console.WriteLine("Sprint progress");
Console.WriteLine("---------------");

foreach (var point in checkpoints)
{
    decimal fraction = countdown.Progress(start, deadline, point);
    decimal percent  = fraction * 100m; // ProgressPercent no tiene sobrecarga de reference — misma fórmula que usa internamente
    int     bar      = (int)(percent / 5);

    Console.WriteLine($"{point:MMM dd} | [{"#".PadRight(bar).PadRight(20, '-')}] {percent:F1}%");
}
// Salida:
// Sprint progress
// ---------------
// Jun 01 | [--------------------] 0.0%
// Jun 15 | [##########----------] 48.3%
// Jun 30 | [####################] 100.0%
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-CountDown** en la configuración del fiddle.
:::

---

## Format — Formatear el tiempo restante como cadena legible para humanos

`Format` produce una cadena de cuenta regresiva compacta y legible (ej. `"3d 4h 20m"`). Devuelve `"Expired"` cuando el plazo está en el pasado.

```csharp
using System;
using Vali_CountDown.Core;
using Vali_Time.Abstractions;

var reference = new DateTime(2025, 6, 15, 10, 0, 0);

// Format no tiene sobrecarga de reference — siempre lee del reloj inyectado.
// Fijamos el reloj en `reference` para un ejemplo determinista.
var countdown = new ValiCountdown(new FixedClock(reference));

var deadlines = new (string Name, DateTime Deadline)[]
{
    ("Code freeze",  new DateTime(2025, 6, 18, 14, 30, 0)),
    ("Beta release", new DateTime(2025, 6, 15,  9, 55, 0)), // expirado
    ("Launch day",   new DateTime(2025, 7,  1,  0,  0, 0)),
};

Console.WriteLine("Upcoming deadlines");
Console.WriteLine("------------------");

foreach (var (name, deadline) in deadlines)
{
    string compact     = countdown.Format(deadline, includeSeconds: false);
    string withSeconds = countdown.Format(deadline, includeSeconds: true);

    Console.WriteLine($"{name,-14} | {compact,-15} | {withSeconds}");
}
// Salida:
// Upcoming deadlines
// ------------------
// Code freeze    | 3d 4h 30m      | 3d 4h 30m 0s
// Beta release   | Expired        | Expired
// Launch day     | 15d 14h        | 15d 14h 0m 0s

// Test double mínimo de IClock usado arriba:
record FixedClock(DateTime Now) : IClock
{
    public DateTime Today => Now.Date;
}
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-CountDown** en la configuración del fiddle.
:::

---

## IsStarted — Verificar si una cuenta regresiva ya ha comenzado

`IsStarted` devuelve `true` cuando la fecha de inicio dada está en el pasado o presente respecto a ahora (o a una fecha de referencia).

```csharp
using System;
using Vali_CountDown.Core;
using Vali_Time.Abstractions;

// Punto de referencia: 15 de junio de 2025
var reference = new DateTime(2025, 6, 15, 0, 0, 0);

// IsStarted no tiene sobrecarga de reference — fijamos el reloj en `reference` (ver FixedClock arriba).
var countdown = new ValiCountdown(new FixedClock(reference));

var phases = new (string Phase, DateTime Start, DateTime Deadline)[]
{
    ("Planning",     new DateTime(2025, 5, 1),  new DateTime(2025, 5, 31)),
    ("Development",  new DateTime(2025, 6, 1),  new DateTime(2025, 6, 30)),
    ("QA Testing",   new DateTime(2025, 7, 1),  new DateTime(2025, 7, 14)),
    ("Deployment",   new DateTime(2025, 7, 15), new DateTime(2025, 7, 20)),
};

Console.WriteLine($"{"Phase",-14} | Started | Expired | Status");
Console.WriteLine(new string('-', 50));

foreach (var (phase, start, deadline) in phases)
{
    bool started = countdown.IsStarted(start);
    bool expired = countdown.IsExpired(deadline);

    string status = !started          ? "Upcoming"
                  : started && expired ? "Completed"
                  :                      "In progress";

    Console.WriteLine($"{phase,-14} | {started,-7} | {expired,-7} | {status}");
}
// Salida:
// Phase          | Started | Expired | Status
// --------------------------------------------------
// Planning       | True    | True    | Completed
// Development    | True    | False   | In progress
// QA Testing     | False   | False   | Upcoming
// Deployment     | False   | False   | Upcoming
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-CountDown** en la configuración del fiddle.
:::
