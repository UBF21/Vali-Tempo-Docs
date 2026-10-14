---
id: examples
title: Vali-TimeZone — Ejemplos
sidebar_label: Ejemplos
---

# Ejemplos

## Now

Obtiene la hora local actual en la zona horaria de Lima.

```csharp
using Vali_TimeZone.Core;

var tz = new ValiTimeZone();

DateTime nowInLima = tz.Now("America/Lima");

Console.WriteLine($"Current time in Lima: {nowInLima:yyyy-MM-dd HH:mm:ss}");
// → Current time in Lima: 2025-07-15 10:32:00  (UTC-5, sin DST)
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-TimeZone** en la configuración del fiddle.
:::

---

## Convert

Convierte un datetime de una zona horaria a otra (Lima a Tokyo).

```csharp
using Vali_TimeZone.Core;

var tz = new ValiTimeZone();

// Una reunión comienza a las 10:00 AM en Lima (UTC-5)
var limaTime = new DateTime(2025, 7, 15, 10, 0, 0);

DateTime tokyoTime = tz.Convert(limaTime, "America/Lima", "Asia/Tokyo");

Console.WriteLine($"Lima:  {limaTime:yyyy-MM-dd HH:mm} (UTC-5)");
Console.WriteLine($"Tokyo: {tokyoTime:yyyy-MM-dd HH:mm} (UTC+9)");
// → Lima:  2025-07-15 10:00 (UTC-5)
// → Tokyo: 2025-07-16 00:00 (UTC+9)

decimal diff = tz.OffsetDiff("America/Lima", "Asia/Tokyo", DateTime.UtcNow);
Console.WriteLine($"Offset difference: {diff:F0} hours");
// → Offset difference: 14 hours
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-TimeZone** en la configuración del fiddle.
:::

---

## IsDst

Verifica si el horario de verano está actualmente activo para una zona horaria dada.

```csharp
using Vali_TimeZone.Core;

var tz = new ValiTimeZone();

var summerDate = new DateTime(2025, 7, 4);
var winterDate = new DateTime(2025, 1, 4);

bool dstSummer = tz.IsDst(summerDate, "America/New_York");
bool dstWinter = tz.IsDst(winterDate, "America/New_York");
bool dstLima   = tz.IsDst(DateTime.Now, "America/Lima");

Console.WriteLine($"New York on {summerDate:MMM dd}: DST active = {dstSummer}");
// → New York on Jul 04: DST active = True  (EDT, UTC-4)

Console.WriteLine($"New York on {winterDate:MMM dd}: DST active = {dstWinter}");
// → New York on Jan 04: DST active = False (EST, UTC-5)

Console.WriteLine($"Lima (no DST zone):         DST active = {dstLima}");
// → Lima (no DST zone):         DST active = False
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-TimeZone** en la configuración del fiddle.
:::

---

## OffsetDiff

Calcula la diferencia de offset UTC entre dos zonas horarias en un momento específico.

```csharp
using Vali_TimeZone.Core;

var tz = new ValiTimeZone();

// Comparar varios pares de zonas en el mismo instante UTC
var utcNow = DateTime.UtcNow;

decimal limaToTokyo   = tz.OffsetDiff("America/Lima",    "Asia/Tokyo",      utcNow);
decimal limaToMadrid  = tz.OffsetDiff("America/Lima",    "Europe/Madrid",   utcNow);
decimal nyToSaoPaulo  = tz.OffsetDiff("America/New_York","America/Sao_Paulo", utcNow);

Console.WriteLine($"Lima   → Tokyo:     {limaToTokyo:+0;-0} hours");
// → Lima   → Tokyo:     +14 hours

Console.WriteLine($"Lima   → Madrid:    {limaToMadrid:+0;-0} hours");
// → Lima   → Madrid:    +6 hours  (Madrid UTC+1, Lima UTC-5)

Console.WriteLine($"New York → São Paulo: {nyToSaoPaulo:+0;-0} hours");
// → New York → São Paulo: +1 hours  (Sao Paulo UTC-3, New York UTC-4 en verano)
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-TimeZone** en la configuración del fiddle.
:::
