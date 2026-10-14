---
id: examples
title: Vali-Time — Ejemplos
sidebar_label: Ejemplos
---

# Vali-Time — Ejemplos

```bash
dotnet add package Vali-Time
```

## Convert — Segundos a horas

Convierte un valor bruto de una unidad de tiempo a otra usando aritmética de precisión decimal.

```csharp
using Vali_Time.Core;
using Vali_Time.Enums;

var vt = new ValiTime();

decimal hours = vt.Convert(7200m, TimeUnit.Seconds, TimeUnit.Hours);

Console.WriteLine($"{hours} hours"); // → 2 hours
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Time** en la configuración del fiddle.
:::

---

## SumTimes — Sumar duraciones expresadas en distintas unidades

Suma varias duraciones de tareas — cada una posiblemente en una unidad distinta — y obtén el total en horas.

```csharp
using Vali_Time.Core;
using Vali_Time.Enums;

var vt = new ValiTime();

var tasks = new List<(decimal time, TimeUnit unit)>
{
    (45m, TimeUnit.Minutes),
    (1m,  TimeUnit.Hours),
    (30m, TimeUnit.Minutes),
};

decimal totalHours = vt.SumTimes(TimeUnit.Hours, tasks, decimalPlaces: 2);

Console.WriteLine($"Total work: {totalHours} hours"); // → 2.25 hours
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Time** en la configuración del fiddle.
:::

---

## ParseTime — Analizar una cadena de duración legible para humanos

Analiza una cadena de duración en texto plano y devuelve el total en segundos, listo para su posterior conversión.

```csharp
using Vali_Time.Core;
using Vali_Time.Enums;

var vt = new ValiTime();

decimal seconds = vt.ParseTime("1h 30m");

decimal inMinutes = vt.Convert(seconds, TimeUnit.Seconds, TimeUnit.Minutes);

Console.WriteLine($"Parsed: {seconds} seconds");   // → Parsed: 5400 seconds
Console.WriteLine($"In minutes: {inMinutes}");     // → In minutes: 90
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Time** en la configuración del fiddle.
:::

---

## DurationStringParser — Reutilizar la gramática de duración de forma independiente

Desde la **1.1.0**, la misma gramática de tokens separados por dos puntos/etiquetados detrás de `ParseTime` también está disponible como utilidad estática independiente — sin necesitar una instancia de `ValiTime`. `IParsable<ValiDuration>` de `Vali-Duration` la reutiliza directamente.

```csharp
using Vali_Time.Utils;

decimal seconds = DurationStringParser.Parse("2d 4h 30m 15s");
Console.WriteLine(seconds); // → 188415

if (DurationStringParser.TryParse("garbage", out decimal result))
    Console.WriteLine(result);
else
    Console.WriteLine("Could not parse"); // esta rama se ejecuta
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Time** en la configuración del fiddle.
:::

---

## Breakdown — Descomponer una duración en componentes

Descompone un número total de segundos en sus horas, minutos y segundos constituyentes.

```csharp
using Vali_Time.Core;
using Vali_Time.Enums;

var vt = new ValiTime();

var parts = vt.Breakdown(5461m, TimeUnit.Seconds);

Console.WriteLine($"Hours:   {parts[TimeUnit.Hours]}");    // → 1
Console.WriteLine($"Minutes: {parts[TimeUnit.Minutes]}");  // → 31
Console.WriteLine($"Seconds: {parts[TimeUnit.Seconds]}");  // → 1
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Time** en la configuración del fiddle.
:::

---

## GetBestUnit — Detectar la unidad más legible para una duración

Dado un tiempo en segundos, determina automáticamente la unidad más legible para humanos y su valor convertido.

```csharp
using Vali_Time.Core;
using Vali_Time.Enums;

var vt = new ValiTime();

// 5400 segundos → 1.5 horas
var (value, unit) = vt.GetBestUnit(5400m);
string formatted = vt.FormatTime(value, unit, 1);

Console.WriteLine($"Best unit: {unit}");       // → Hours
Console.WriteLine($"Formatted: {formatted}");  // → 1.5 hours

// 75 segundos → 1.25 minutos
var (value2, unit2) = vt.GetBestUnit(75m);
Console.WriteLine($"Best unit: {unit2}");      // → Minutes
Console.WriteLine($"Value: {value2}");         // → 1.25
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Time** en la configuración del fiddle.
:::
