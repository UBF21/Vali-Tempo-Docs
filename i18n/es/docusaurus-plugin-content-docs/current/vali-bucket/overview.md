---
id: overview
title: Descripción general de Vali-Bucket
sidebar_label: Descripción general
description: Vali-Bucket agrupa timestamps y puntos numéricos de series de tiempo en buckets de tamaño fijo alineados a un anchor, para reportes y analítica en .NET.
keywords: [Vali-Bucket, bucket de tiempo, series de tiempo, agregación, .NET, NuGet, C#, analítica]
---

# Vali-Bucket

`IValiBucket` agrupa timestamps en buckets de tamaño fijo y alineados para reportes y analítica — por ejemplo, "agrupar estos 50.000 timestamps de eventos en ventanas de 15 minutos para un gráfico". Los buckets se alinean a un anchor (por defecto `DateTime.MinValue`), de modo que llamadas separadas con el mismo tamaño y anchor siempre producen buckets comparables e idénticamente alineados. Reutiliza el `DateRange` de `Vali-Range` para el rango de tiempo de cada bucket.

## Características

- **`Bucketize`** — agrupa timestamps crudos en buckets de tamaño fijo, contando cuántos caen en cada uno
- **`Aggregate<T>`** — agrupa pares `(timestamp, value)` en buckets, combinando los valores de cada bucket con `Sum`/`Average`/`Count`/`Min`/`Max`
- **`GetBucketFor`** — búsqueda O(1) del bucket al que pertenece un único timestamp, sin tener que agrupar toda una colección — útil en un hot path de streaming
- **Anchor de alineación** — los buckets de llamadas separadas con el mismo tamaño y anchor siempre son comparables, porque los límites del bucket se calculan a partir del anchor, no de los datos
- Los buckets con cero timestamps/puntos coincidentes se omiten del resultado (sin relleno de buckets vacíos)
- Reutiliza el `DateRange` de `Vali-Range` para el rango de tiempo de cada bucket

## Instalación

```bash
dotnet add package Vali-Bucket
```

Targets compilados: `net8.0` · `net9.0` · `net10.0`. Compatible con .NET 6 y .NET 7 mediante compatibilidad retroactiva de NuGet.

## Registro

```csharp
builder.Services.AddValiBucket();
// o mediante el meta-paquete:
builder.Services.AddValiTempo();
```

## BucketSize

`BucketSize(decimal Amount, TimeUnit Unit)` define el tamaño de un bucket. Solo se admiten
unidades de longitud fija — `Milliseconds`, `Seconds`, `Minutes`, `Hours`, `Days`, `Weeks`.
`Months` y `Years` no tienen una longitud de ticks constante y lanzan
`ArgumentOutOfRangeException`, porque los límites del bucket se calculan con aritmética de ticks pura.

```csharp
var fifteenMinutes = new BucketSize(15, TimeUnit.Minutes);
var oneHour = new BucketSize(1, TimeUnit.Hours);
```

## TimeBucket / TimeBucket&lt;T&gt;

| Miembro | Tipo | Descripción |
|---|---|---|
| `Range` | `DateRange` | El rango de tiempo del bucket (inclusivo en ambos extremos) |
| `Count` | `int` | Número de timestamps/puntos que caen dentro de `Range` |
| `Value` (solo `TimeBucket<T>`) | `T` | El valor agregado del bucket, según el `BucketAggregation` solicitado |

## API de IValiBucket

### Bucketize

Agrupa timestamps en buckets de tamaño fijo, alineados a un anchor. Los buckets con cero
timestamps coincidentes se omiten:

```csharp
var timestamps = new[]
{
    new DateTime(2025, 1, 1, 9, 2, 0),
    new DateTime(2025, 1, 1, 9, 7, 0),
    new DateTime(2025, 1, 1, 9, 16, 0),
};

var buckets = bucket.Bucketize(timestamps, new BucketSize(15, TimeUnit.Minutes));
// Dos buckets de 15 minutos: [09:00–09:14:59.9999999] Count=2, [09:15–09:29:59.9999999] Count=1
```

**Firma:** `IReadOnlyList<TimeBucket> Bucketize(IEnumerable<DateTime> timestamps, BucketSize size, DateTime? anchor = null)`

Los timestamps no necesitan estar ordenados ni ser distintos. El resultado se ordena por el
inicio de `Range`, ascendente. Cuando `anchor` es `null`, se usa `DateTime.MinValue`.

### Aggregate&lt;T&gt;

Agrupa pares `(timestamp, value)` en buckets, agregando los valores de cada bucket según
`BucketAggregation`:

```csharp
var points = new[]
{
    (new DateTime(2025, 1, 1, 9, 2, 0), 100m),
    (new DateTime(2025, 1, 1, 9, 7, 0), 50m),
    (new DateTime(2025, 1, 1, 9, 16, 0), 30m),
};

var totals = bucket.Aggregate(points, new BucketSize(15, TimeUnit.Minutes), BucketAggregation.Sum);
// [bucket 09:00].Value == 150m, [bucket 09:15].Value == 30m
```

**Firma:** `IReadOnlyList<TimeBucket<T>> Aggregate<T>(IEnumerable<(DateTime Timestamp, T Value)> points, BucketSize size, BucketAggregation aggregation, DateTime? anchor = null) where T : INumber<T>`

`BucketAggregation` es `Sum`, `Average`, `Count`, `Min` o `Max`. Los buckets con cero puntos
coincidentes se omiten.

### GetBucketFor

Resuelve el bucket al que pertenece un único timestamp, sin agrupar toda una colección — una
búsqueda O(1) útil en un escenario de streaming/hot path:

```csharp
TimeBucket slot = bucket.GetBucketFor(DateTime.UtcNow, new BucketSize(1, TimeUnit.Hours));
```

**Firma:** `TimeBucket GetBucketFor(DateTime timestamp, BucketSize size, DateTime? anchor = null)`

`Count` siempre es `1` en el bucket devuelto — este overload no consulta ningún otro dato, solo
resuelve la celda de la grilla.

## Alcance de v1

- Sin conciencia de timezone/DST — los límites del bucket son aritmética de ticks pura sobre
  cualquier `DateTime.Kind` que el caller pase. Convierte a un kind/zona consistente antes de
  agrupar si eso importa para tus datos.
- Sin agregación por ventanas móviles (sliding windows, buckets superpuestos) — los buckets
  siempre son disjuntos y alineados a la grilla.
- Solo unidades de longitud fija (`Milliseconds` a `Weeks`) — `Months`/`Years` lanzan
  `ArgumentOutOfRangeException`.

## Ejemplo completo

```csharp
public class EventAnalytics(IValiBucket bucket)
{
    public void ReportHourlyActivity(IEnumerable<DateTime> eventTimestamps)
    {
        var hourly = bucket.Bucketize(eventTimestamps, new BucketSize(1, TimeUnit.Hours));

        foreach (var slot in hourly)
            Console.WriteLine($"{slot.Range.Start:HH:mm} — {slot.Count} events");
    }

    public void ReportAverageLatency(IEnumerable<(DateTime Timestamp, decimal LatencyMs)> samples)
    {
        var buckets = bucket.Aggregate(samples, new BucketSize(5, TimeUnit.Minutes), BucketAggregation.Average);

        foreach (var slot in buckets)
            Console.WriteLine($"{slot.Range.Start:HH:mm} — avg {slot.Value:F2}ms over {slot.Count} samples");
    }
}
```
