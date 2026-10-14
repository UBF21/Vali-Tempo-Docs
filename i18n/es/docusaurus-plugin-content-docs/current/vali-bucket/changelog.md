---
id: changelog
title: Vali-Bucket — Changelog
sidebar_label: Changelog
---

# Changelog

Todos los cambios notables de **Vali-Bucket** se documentan aquí.
Sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.0.0] — Paquete nuevo

### Agregado
- `IValiBucket.Bucketize` — agrupa timestamps crudos en buckets de tamaño fijo alineados a un anchor, contando cuántos caen en cada uno.
- `IValiBucket.Aggregate<T>` — agrupa pares `(timestamp, value)` en buckets, combinando los valores de cada bucket mediante `BucketAggregation` (`Sum`, `Average`, `Count`, `Min`, `Max`).
- `IValiBucket.GetBucketFor` — búsqueda O(1) del bucket al que pertenece un único timestamp, sin tener que agrupar toda una colección.
- `BucketSize(decimal Amount, TimeUnit Unit)` — tamaño de bucket de longitud fija (`Milliseconds` a `Weeks`); `Months`/`Years` lanzan `ArgumentOutOfRangeException`.
- `TimeBucket` / `TimeBucket<T>` — el `DateRange` del bucket más `Count` (y `Value` para el overload agregado).
- Método de extensión `AddValiBucket()` para el registro en DI de `IServiceCollection`.
- Reutiliza el `DateRange` de `Vali-Range` para el rango de tiempo de cada bucket.
