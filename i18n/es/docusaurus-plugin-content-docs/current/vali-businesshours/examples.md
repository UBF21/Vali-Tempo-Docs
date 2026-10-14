---
id: examples
title: Vali-BusinessHours — Ejemplos
sidebar_label: Ejemplos
---

# Ejemplos

## Mismo offset relativo — solapamiento total

Lima y una ventana con las mismas horas locales y sin diferencia de offset se solapan por completo.

```csharp
using Vali_BusinessHours.Core;
using Vali_BusinessHours.Models;
using Vali_TimeZone.Core;

IValiTimeZone timeZone = new ValiTimeZone();
IValiBusinessHours businessHours = new ValiBusinessHours(timeZone);

var a = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(18, 0));
var b = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(18, 0));

var result = businessHours.Overlap(a, b, new DateTime(2025, 6, 2));

Console.WriteLine($"Has overlap: {result.HasOverlap}");
Console.WriteLine($"Zone A window: {result.StartInZoneA:HH:mm} – {result.EndInZoneA:HH:mm}");
// → Has overlap: True
// → Zone A window: 09:00 – 18:00
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-BusinessHours** en la configuración del fiddle.
:::

---

## Lima y Madrid — solapamiento parcial con una diferencia de 7 horas

Lima (UTC-5, sin DST) y Madrid (UTC+2 en junio, CEST) corren ambas 09:00–18:00 local. El solapamiento real es más angosto que cualquiera de las dos ventanas y cae en una hora local distinta en cada lado.

```csharp
using Vali_BusinessHours.Core;
using Vali_BusinessHours.Models;
using Vali_TimeZone.Core;

IValiTimeZone timeZone = new ValiTimeZone();
IValiBusinessHours businessHours = new ValiBusinessHours(timeZone);

// Lima 09:00-18:00 local = 14:00-23:00 UTC.
// Madrid 09:00-18:00 local = 07:00-16:00 UTC.
// Solapamiento en UTC: max(14:00,07:00) .. min(23:00,16:00) = 14:00-16:00 UTC.
var lima = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(18, 0));
var madrid = new BusinessHoursWindow("Europe/Madrid", new TimeOnly(9, 0), new TimeOnly(18, 0));

var result = businessHours.Overlap(lima, madrid, new DateTime(2025, 6, 2));

Console.WriteLine($"Overlap (UTC): {result.StartUtc:HH:mm} – {result.EndUtc:HH:mm}");
Console.WriteLine($"Lima local:    {result.StartInZoneA:HH:mm} – {result.EndInZoneA:HH:mm}");
Console.WriteLine($"Madrid local:  {result.StartInZoneB:HH:mm} – {result.EndInZoneB:HH:mm}");
// → Overlap (UTC): 14:00 – 16:00
// → Lima local:    09:00 – 11:00
// → Madrid local:  16:00 – 18:00
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-BusinessHours** en la configuración del fiddle.
:::

---

## Sin ventana compartida

Lima y Tokyo corren ambas ventanas cortas de 09:00–11:00, lo suficientemente separadas como para no coincidir nunca en la misma fecha de referencia.

```csharp
using Vali_BusinessHours.Core;
using Vali_BusinessHours.Models;
using Vali_TimeZone.Core;

IValiTimeZone timeZone = new ValiTimeZone();
IValiBusinessHours businessHours = new ValiBusinessHours(timeZone);

var lima = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(11, 0));
var tokyo = new BusinessHoursWindow("Asia/Tokyo", new TimeOnly(9, 0), new TimeOnly(11, 0));

var result = businessHours.Overlap(lima, tokyo, new DateTime(2025, 6, 2));

Console.WriteLine($"Has overlap: {result.HasOverlap}");
Console.WriteLine($"StartUtc is null: {result.StartUtc is null}");
// → Has overlap: False
// → StartUtc is null: True
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-BusinessHours** en la configuración del fiddle.
:::

---

## Cruce de medianoche — Los Ángeles y Tokyo

Los Ángeles (UTC-7 en junio, PDT) 09:00–18:00 local abarca de 16:00 (2 de jun) a 01:00 (3 de jun) UTC. La ventana equivalente de Tokyo en términos UTC en realidad cae el 3 de junio — el resolver verifica el día calendario anterior y posterior a la fecha de referencia en la segunda zona para que una ventana que cruza la medianoche al proyectarse nunca se pierda.

```csharp
using Vali_BusinessHours.Core;
using Vali_BusinessHours.Models;
using Vali_TimeZone.Core;

IValiTimeZone timeZone = new ValiTimeZone();
IValiBusinessHours businessHours = new ValiBusinessHours(timeZone);

var la = new BusinessHoursWindow("America/Los_Angeles", new TimeOnly(9, 0), new TimeOnly(18, 0));
var tokyo = new BusinessHoursWindow("Asia/Tokyo", new TimeOnly(9, 0), new TimeOnly(18, 0));

var result = businessHours.Overlap(la, tokyo, new DateTime(2025, 6, 2));

Console.WriteLine($"Has overlap: {result.HasOverlap}");
Console.WriteLine($"Overlap (UTC): {result.StartUtc:yyyy-MM-dd HH:mm} – {result.EndUtc:yyyy-MM-dd HH:mm}");
// → Has overlap: True
// → Overlap (UTC): 2025-06-03 00:00 – 2025-06-03 01:00
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-BusinessHours** en la configuración del fiddle.
:::

---

## OverlapOnWorkday — omitir días no hábiles antes de calcular horarios

Empareja cada ventana con su propio `IValiCalendar` para filtrar fines de semana y feriados por lado, sin cálculo adicional de horas.

```csharp
using Vali_BusinessHours.Core;
using Vali_BusinessHours.Models;
using Vali_Calendar.Core;
using Vali_TimeZone.Core;

IValiTimeZone timeZone = new ValiTimeZone();
IValiBusinessHours businessHours = new ValiBusinessHours(timeZone);

var lima = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(18, 0));
var madrid = new BusinessHoursWindow("Europe/Madrid", new TimeOnly(9, 0), new TimeOnly(18, 0));
IValiCalendar calendarLima = new ValiCalendar();
IValiCalendar calendarMadrid = new ValiCalendar();

var saturday = new DateTime(2025, 6, 7);
var saturdayResult = businessHours.OverlapOnWorkday((lima, calendarLima), (madrid, calendarMadrid), saturday);

var monday = new DateTime(2025, 6, 2);
var mondayResult = businessHours.OverlapOnWorkday((lima, calendarLima), (madrid, calendarMadrid), monday);

Console.WriteLine($"Saturday has overlap: {saturdayResult.HasOverlap}");
Console.WriteLine($"Monday has overlap:   {mondayResult.HasOverlap}");
// → Saturday has overlap: False
// → Monday has overlap:   True
```

:::tip Pruébalo en vivo
[▶ Abrir en dotnetfiddle](https://dotnetfiddle.net) — Agrega el paquete NuGet **Vali-BusinessHours** en la configuración del fiddle.
:::
