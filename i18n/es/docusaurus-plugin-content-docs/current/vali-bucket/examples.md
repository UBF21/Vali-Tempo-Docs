---
id: examples
title: Vali-Bucket — Ejemplos
sidebar_label: Ejemplos
---

# Vali-Bucket — Ejemplos

```bash
dotnet add package Vali-Bucket
```

## Bucketize — Graficar el volumen de eventos en ventanas de 15 minutos

Agrupa timestamps crudos de eventos en ventanas fijas de 15 minutos para alimentar un gráfico de barras.

```csharp
using Vali_Bucket.Core;
using Vali_Bucket.Models;
using Vali_Time.Enums;

IValiBucket bucket = new ValiBucket();

var loginEvents = new[]
{
    new DateTime(2025, 1, 1, 9, 2, 0),
    new DateTime(2025, 1, 1, 9, 7, 0),
    new DateTime(2025, 1, 1, 9, 9, 0),
    new DateTime(2025, 1, 1, 9, 16, 0),
    new DateTime(2025, 1, 1, 9, 42, 0),
};

var buckets = bucket.Bucketize(loginEvents, new BucketSize(15, TimeUnit.Minutes));

foreach (var slot in buckets)
    Console.WriteLine($"{slot.Range.Start:HH:mm} - {slot.Range.End:HH:mm} → {slot.Count} logins");

// → 09:00 - 09:14 → 3 logins
// → 09:15 - 09:29 → 1 login
// → 09:30 - 09:44 → 1 login
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Bucket** en la configuración del fiddle.
:::

---

## Aggregate — Latencia promedio de API por ventana de 5 minutos

Combina muestras `(timestamp, value)` en buckets, calculando la latencia promedio observada en
cada ventana.

```csharp
using Vali_Bucket.Core;
using Vali_Bucket.Enums;
using Vali_Bucket.Models;
using Vali_Time.Enums;

IValiBucket bucket = new ValiBucket();

var latencySamples = new[]
{
    (new DateTime(2025, 1, 1, 9, 2, 0), 120m),
    (new DateTime(2025, 1, 1, 9, 6, 0), 95m),
    (new DateTime(2025, 1, 1, 9, 9, 0), 180m),
    (new DateTime(2025, 1, 1, 9, 16, 0), 60m),
};

var buckets = bucket.Aggregate(latencySamples, new BucketSize(5, TimeUnit.Minutes), BucketAggregation.Average);

foreach (var slot in buckets)
    Console.WriteLine($"{slot.Range.Start:HH:mm} → avg {slot.Value:F2}ms over {slot.Count} samples");

// → 09:00 → avg 131.67ms over 3 samples
// → 09:15 → avg 60.00ms over 1 samples
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Bucket** en la configuración del fiddle.
:::

---

## GetBucketFor — Búsqueda en hot path de streaming

Resuelve a qué bucket pertenece un evento entrante sin volver a agrupar todo el stream — una
búsqueda O(1) adecuada para un pipeline de ingesta en vivo.

```csharp
using Vali_Bucket.Core;
using Vali_Bucket.Models;
using Vali_Time.Enums;

IValiBucket bucket = new ValiBucket();

var size = new BucketSize(1, TimeUnit.Hours);

void OnEventReceived(DateTime eventTime)
{
    TimeBucket slot = bucket.GetBucketFor(eventTime, size);
    Console.WriteLine($"Routed to hourly bucket starting {slot.Range.Start:yyyy-MM-dd HH:mm}");
}

OnEventReceived(new DateTime(2025, 1, 1, 9, 42, 0));
// → Routed to hourly bucket starting 2025-01-01 09:00
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Bucket** en la configuración del fiddle.
:::

---

## Anchor de alineación — Buckets comparables entre llamadas separadas

Usa un anchor explícito para que dos llamadas independientes sobre distintos tramos de datos
sigan alineadas en la misma grilla — esencial al combinar resultados agrupados de múltiples
fuentes.

```csharp
using Vali_Bucket.Core;
using Vali_Bucket.Models;
using Vali_Time.Enums;

IValiBucket bucket = new ValiBucket();

var shiftOneAnchor = new DateTime(2025, 1, 1, 9, 0, 0);
var size = new BucketSize(15, TimeUnit.Minutes);

var shiftOneEvents = new[] { new DateTime(2025, 1, 1, 9, 10, 0) };
var shiftTwoEvents = new[] { new DateTime(2025, 1, 1, 10, 25, 0) };

var shiftOneBuckets = bucket.Bucketize(shiftOneEvents, size, shiftOneAnchor);
var shiftTwoBuckets = bucket.Bucketize(shiftTwoEvents, size, shiftOneAnchor);

Console.WriteLine(shiftOneBuckets[0].Range.Start); // → 2025-01-01 09:00:00
Console.WriteLine(shiftTwoBuckets[0].Range.Start); // → 2025-01-01 10:15:00
// Ambas llamadas usaron el mismo anchor, por lo que la grilla de 15 minutos coincide exactamente entre ellas.
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-Bucket** en la configuración del fiddle.
:::
