---
id: overview
title: Descripción general de Vali-BusinessHours
sidebar_label: Descripción general
description: Vali-BusinessHours resuelve la ventana de solapamiento de horario laboral entre dos zonas horarias IANA para .NET — correcto con DST, con conciencia de cruce de medianoche y filtrable por día hábil.
keywords: [Vali-BusinessHours, horario laboral, solapamiento de zonas horarias, DST, .NET, NuGet, C#, scheduling]
---

# Vali-BusinessHours

`IValiBusinessHours` resuelve la ventana de solapamiento simultáneo de horario laboral entre dos zonas horarias IANA, para una única fecha calendario de referencia. Compone `Vali-Calendar` y `Vali-TimeZone` sin acoplar ninguno de los dos paquetes al otro — el offset real de cada zona (incluyendo DST) se resuelve en el instante específico evaluado, nunca con un offset base en caché, y la búsqueda contempla que la segunda ventana caiga en el día calendario anterior o posterior a la fecha de referencia una vez proyectada a la primera zona (cruce de medianoche).

:::info Alcance de v1
Exactamente dos zonas horarias por llamada, un único bloque diario de horario laboral por zona (sin recurrencia/excepciones), y sin filtrado automático de feriados a menos que lo habilites explícitamente vía `OverlapOnWorkday` con tu propio `IValiCalendar` por cada lado.
:::

## Instalación

```bash
dotnet add package Vali-BusinessHours
```

## Registro

```csharp
builder.Services.AddValiTimeZone();      // dependencia requerida
builder.Services.AddValiBusinessHours();
// o mediante el meta-paquete:
builder.Services.AddValiTempo();
```

`AddValiBusinessHours()` registra `IValiBusinessHours` como singleton. Requiere que un `IValiTimeZone` ya esté registrado (por ejemplo vía `AddValiTimeZone()`) — `ValiBusinessHours` lo resuelve desde el contenedor.

## Struct BusinessHoursWindow

`BusinessHoursWindow` define un único bloque diario de horario laboral para una zona horaria IANA — por ejemplo "09:00–18:00 en America/Lima". Se asume que aplica igual todos los días hábiles (v1 no admite excepciones por día ni recurrencias).

| Propiedad | Tipo | Descripción |
|---|---|---|
| `ZoneId` | `string` | El identificador IANA de la zona horaria, ej. `"America/Lima"` |
| `Start` | `TimeOnly` | La hora local de inicio inclusiva del bloque de horario laboral |
| `End` | `TimeOnly` | La hora local de fin exclusiva del bloque de horario laboral. Debe ser posterior a `Start` |

**Firma:** `readonly record struct BusinessHoursWindow(string ZoneId, TimeOnly Start, TimeOnly End)`

## Struct BusinessHoursOverlapResult

`BusinessHoursOverlapResult` describe el resultado de resolver el solapamiento entre dos ventanas.

| Propiedad | Tipo | Descripción |
|---|---|---|
| `HasOverlap` | `bool` | `true` si las dos ventanas comparten algún instante solapado. Cuando es `false`, todos los demás miembros son `null` |
| `StartUtc` | `DateTimeOffset?` | El inicio de la ventana de solapamiento, como instante UTC absoluto |
| `EndUtc` | `DateTimeOffset?` | El fin de la ventana de solapamiento, como instante UTC absoluto |
| `StartInZoneA` | `DateTimeOffset?` | El inicio de la ventana de solapamiento, proyectado a la zona horaria local de la primera ventana |
| `EndInZoneA` | `DateTimeOffset?` | El fin de la ventana de solapamiento, proyectado a la zona horaria local de la primera ventana |
| `StartInZoneB` | `DateTimeOffset?` | El inicio de la ventana de solapamiento, proyectado a la zona horaria local de la segunda ventana |
| `EndInZoneB` | `DateTimeOffset?` | El fin de la ventana de solapamiento, proyectado a la zona horaria local de la segunda ventana |

## API de IValiBusinessHours

### Overlap

Resuelve el solapamiento entre dos instancias de `BusinessHoursWindow` para una fecha calendario dada, interpretada en la zona horaria de la primera ventana:

```csharp
var lima = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(18, 0));
var madrid = new BusinessHoursWindow("Europe/Madrid", new TimeOnly(9, 0), new TimeOnly(18, 0));

BusinessHoursOverlapResult result = businessHours.Overlap(lima, madrid, new DateTime(2025, 6, 2));

if (result.HasOverlap)
{
    Console.WriteLine($"Overlap starts {result.StartInZoneA} Lima time");
    Console.WriteLine($"Overlap starts {result.StartInZoneB} Madrid time");
}
```

**Firma:** `BusinessHoursOverlapResult Overlap(BusinessHoursWindow a, BusinessHoursWindow b, DateTime referenceDate)`

Lanza `ArgumentException` si el `Start` de cualquiera de las ventanas no es anterior a su `End`. Lanza `TimeZoneNotFoundException` si el `ZoneId` de cualquiera de las ventanas no puede resolverse.

### OverlapOnWorkday

Igual que `Overlap`, pero primero requiere que la fecha de referencia sea un día hábil en los calendarios de ambos lados (según lo resuelva el propio `IsWorkday` de cada calendario, por ejemplo configurado con el holiday provider propio de cada lado):

```csharp
IValiCalendar calendarLima = new ValiCalendar();
IValiCalendar calendarMadrid = new ValiCalendar();

var result = businessHours.OverlapOnWorkday(
    (lima, calendarLima),
    (madrid, calendarMadrid),
    new DateTime(2025, 6, 7)); // un sábado → sin solapamiento, ni siquiera se consultan los horarios
```

**Firma:** `BusinessHoursOverlapResult OverlapOnWorkday((BusinessHoursWindow Window, IValiCalendar Calendar) a, (BusinessHoursWindow Window, IValiCalendar Calendar) b, DateTime referenceDate)`

Devuelve un resultado con `HasOverlap` en `false` cuando la fecha de referencia no es día hábil para alguno de los dos lados, o cuando las ventanas de todos modos no se solapan.

## Ejemplo completo

```csharp
public class MeetingWindowFinder(IValiBusinessHours businessHours)
{
    public void FindOverlap(DateTime referenceDate)
    {
        var lima = new BusinessHoursWindow("America/Lima", new TimeOnly(9, 0), new TimeOnly(18, 0));
        var madrid = new BusinessHoursWindow("Europe/Madrid", new TimeOnly(9, 0), new TimeOnly(18, 0));

        var result = businessHours.Overlap(lima, madrid, referenceDate);

        if (!result.HasOverlap)
        {
            Console.WriteLine("No shared business-hours window on this date.");
            return;
        }

        Console.WriteLine($"Overlap (UTC): {result.StartUtc:HH:mm} – {result.EndUtc:HH:mm}");
        Console.WriteLine($"Lima local:    {result.StartInZoneA:HH:mm} – {result.EndInZoneA:HH:mm}");
        Console.WriteLine($"Madrid local:  {result.StartInZoneB:HH:mm} – {result.EndInZoneB:HH:mm}");
    }
}
```
