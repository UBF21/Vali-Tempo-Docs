---
id: overview
title: Descripción general de Vali-TimeZone
sidebar_label: Descripción general
description: Vali-TimeZone proporciona soporte de zonas horarias IANA para .NET — convierte entre zonas horarias, lista zonas y calcula offsets UTC en más de 45 zonas IANA admitidas.
keywords: [Vali-TimeZone, zona horaria IANA, UTC, .NET, NuGet, C#, conversión de zona horaria]
---

# Vali-TimeZone

`IValiTimeZone` proporciona conversión de zonas horarias IANA, conciencia de horario de verano, cálculo de offsets y descubrimiento de zonas en más de 45 zonas seleccionadas. Envuelve la API `TimeZoneInfo` de .NET con una interfaz más amigable e identificadores IANA consistentes.

## Instalación

```bash
dotnet add package Vali-TimeZone
```

## Registro

```csharp
builder.Services.AddValiTimeZone();
// o mediante el meta-paquete:
builder.Services.AddValiTempo();
```

## Clase ValiZoneInfo

`ValiZoneInfo` describe una zona horaria:

| Propiedad | Tipo | Descripción |
|---|---|---|
| `Id` | `string` | Identificador IANA de zona (ej. `"America/Lima"`) |
| `DisplayName` | `string` | Nombre legible para humanos con el offset UTC (ej. `"(UTC-05:00) Lima, Bogota, Quito"`) |
| `StandardName` | `string` | Nombre de zona horaria estándar de Windows/BCL usado por `TimeZoneInfo.FindSystemTimeZoneById` (ej. `"SA Pacific Standard Time"`) |
| `BaseOffset` | `TimeSpan` | Offset UTC base, sin ajustes de DST |
| `SupportsDst` | `bool` | Verdadero si esta zona observa DST |
| `CountryCode` | `string` | Código de país ISO 3166-1 alpha-2 (ej. `"PE"`) |
| `CountryName` | `string` | Nombre completo del país en inglés (ej. `"Peru"`) |

`ValiZoneInfo` es un `sealed record` (desde la 1.1.0, antes era un `sealed class`) — obtiene igualdad estructural sin costo adicional; `ToString()` devuelve `"[PE] America/Lima (UTC-05:00)"`.

## API de IValiTimeZone

### Convert

Convierte un `DateTime` de una zona horaria IANA a otra:

```csharp
DateTime lima = tz.Convert(utcTime, "UTC", "America/Lima");
DateTime tokyo = tz.Convert(nyTime, "America/New_York", "Asia/Tokyo");
```

**Firma:** `DateTime Convert(DateTime dateTime, string fromZone, string toZone)`

### ConvertOffset

Convierte un `DateTimeOffset` a otra zona, preservando el instante absoluto en el tiempo. Como el `DateTimeOffset` ya incluye su propio offset, solo se necesita la zona destino:

```csharp
DateTimeOffset result = tz.ConvertOffset(dto, "Europe/Madrid");
```

**Firma:** `DateTimeOffset ConvertOffset(DateTimeOffset dateTimeOffset, string toZoneId)`

### ToUtc

Convierte un datetime local en una zona horaria nombrada a UTC:

```csharp
DateTime utc = tz.ToUtc(new DateTime(2025, 7, 15, 10, 0, 0), "America/Lima");
// → 2025-07-15 15:00:00 UTC (Lima es UTC-5)
```

**Firma:** `DateTime ToUtc(DateTime localTime, string fromZone)`

### FromUtc

Convierte un datetime UTC a una zona horaria local nombrada:

```csharp
DateTime local = tz.FromUtc(DateTime.UtcNow, "America/Sao_Paulo");
```

**Firma:** `DateTime FromUtc(DateTime utcTime, string toZone)`

### ToDateTimeOffset

Convierte un `DateTime` en una zona dada a un `DateTimeOffset` con el offset correcto incluido:

```csharp
DateTimeOffset dto = tz.ToDateTimeOffset(localDateTime, "Europe/Madrid");
// → DateTimeOffset con +02:00 (verano) o +01:00 (invierno)
```

**Firma:** `DateTimeOffset ToDateTimeOffset(DateTime dateTime, string zone)`

### GetOffset

Obtiene el offset UTC para un datetime específico en una zona nombrada (con conciencia de DST):

```csharp
TimeSpan offset = tz.GetOffset("America/New_York", new DateTime(2025, 7, 1));
// → -04:00 (EDT, horario de verano)

TimeSpan offset2 = tz.GetOffset("America/New_York", new DateTime(2025, 1, 1));
// → -05:00 (EST, horario estándar)

TimeSpan offsetNow = tz.GetOffset("America/New_York");
// → al omitir at, usa DateTime.UtcNow por defecto
```

**Firma:** `TimeSpan GetOffset(string zoneId, DateTime? at = null)`

### GetBaseOffset

Obtiene el offset UTC base (estándar, sin DST) de una zona:

```csharp
TimeSpan base1 = tz.GetBaseOffset("America/Lima");
// → -05:00 (Perú siempre es UTC-5, sin DST)

TimeSpan base2 = tz.GetBaseOffset("Europe/Berlin");
// → +01:00 (horario estándar — CET)
```

**Firma:** `TimeSpan GetBaseOffset(string zone)`

### IsDst

Devuelve `true` si el horario de verano está en vigor en una zona dada a una hora dada:

```csharp
bool dst = tz.IsDst(new DateTime(2025, 7, 4), "America/New_York");
// → true (verano — EDT)

bool notDst = tz.IsDst(new DateTime(2025, 1, 4), "America/New_York");
// → false (invierno — EST)

bool neverDst = tz.IsDst(DateTime.Now, "America/Lima");
// → false (Lima no tiene DST)
```

**Firma:** `bool IsDst(DateTime dateTime, string zoneId)`

### OffsetDiff

Calcula la diferencia de offset entre dos zonas en un momento UTC dado:

```csharp
decimal diff = tz.OffsetDiff("America/Lima", "Asia/Tokyo", DateTime.UtcNow);
// → 14 (Lima UTC-5, Tokyo UTC+9 → diferencia de 14h). offsetDiff(zoneId1, zoneId2) = offset(zoneId1) - offset(zoneId2)

decimal diffNow = tz.OffsetDiff("America/Lima", "Asia/Tokyo");
// → al omitir at, usa DateTime.UtcNow por defecto
```

**Firma:** `decimal OffsetDiff(string zoneId1, string zoneId2, DateTime? at = null)` — devuelve la diferencia en horas decimales, no un `TimeSpan`.

### FindZone

Encuentra un `ValiZoneInfo` por identificador IANA:

```csharp
ValiZoneInfo? zone = tz.FindZone("America/Lima");
if (zone is not null)
{
    Console.WriteLine(zone.DisplayName);
    Console.WriteLine(zone.SupportsDst);
}
```

**Firma:** `ValiZoneInfo? FindZone(string zoneId)`

### AllZones

Devuelve todas las más de 45 zonas IANA seleccionadas:

```csharp
IEnumerable<ValiZoneInfo> all = tz.AllZones();
foreach (var z in all.OrderBy(z => z.BaseOffset))
    Console.WriteLine($"{z.Id,-35} {z.BaseOffset:hh\\:mm}");
```

**Firma:** `IEnumerable<ValiZoneInfo> AllZones()`

### ZonesForCountry

Devuelve todas las zonas seleccionadas para un código de país dado:

```csharp
IEnumerable<ValiZoneInfo> usZones = tz.ZonesForCountry("US");
// → America/New_York, America/Chicago, America/Denver, America/Los_Angeles, etc.
```

**Firma:** `IEnumerable<ValiZoneInfo> ZonesForCountry(string countryCode)`

### IsValidZone

Devuelve `true` si el identificador de zona IANA es reconocido:

```csharp
bool valid = tz.IsValidZone("America/Lima");     // → true
bool invalid = tz.IsValidZone("Invalid/Zone");   // → false
```

**Firma:** `bool IsValidZone(string zoneId)`

### Now

Obtiene la hora local actual en una zona horaria nombrada:

```csharp
DateTime nowInTokyo = tz.Now("Asia/Tokyo");
DateTime nowInLima  = tz.Now("America/Lima");
```

**Firma:** `DateTime Now(string zone)`

### Today

Obtiene la fecha calendario actual en una zona horaria nombrada:

```csharp
DateTime todayInSydney = tz.Today("Australia/Sydney");
// → Puede diferir de la fecha UTC al cruzar la medianoche
```

**Firma:** `DateTime Today(string zone)`

### IsSameInstant

Devuelve `true` si dos pares de datetime+zona representan el mismo instante UTC:

```csharp
bool same = tz.IsSameInstant(
    new DateTime(2025, 7, 15, 10, 0, 0), "America/Lima",   // UTC-5
    new DateTime(2025, 7, 15, 15, 0, 0), "UTC");            // ambas son 15:00 UTC
// → true
```

**Firma:** `bool IsSameInstant(DateTime a, string zoneA, DateTime b, string zoneB)`

### FormatWithZone

Formatea un datetime con información de zona horaria incluida:

```csharp
string formatted = tz.FormatWithZone(DateTime.Now, "America/Lima", "yyyy-MM-dd HH:mm zzz");
// → "2025-07-15 10:00 -05:00"

string formatted2 = tz.FormatWithZone(DateTime.Now, "Asia/Tokyo");
// → "2025-07-16 00:00 JST" (formato predeterminado)
```

**Firma:** `string FormatWithZone(DateTime dateTime, string zoneId, string format = "yyyy-MM-dd HH:mm:ss zzz")`

## Muestra de zonas seleccionadas

| ID IANA | Offset estándar | País | DST |
|---|---|---|---|
| `UTC` | +00:00 | — | No |
| `America/New_York` | -05:00 | US | Sí |
| `America/Chicago` | -06:00 | US | Sí |
| `America/Denver` | -07:00 | US | Sí |
| `America/Los_Angeles` | -08:00 | US | Sí |
| `America/Lima` | -05:00 | PE | No |
| `America/Bogota` | -05:00 | CO | No |
| `America/Mexico_City` | -06:00 | MX | Sí |
| `America/Sao_Paulo` | -03:00 | BR | Sí |
| `America/Buenos_Aires` | -03:00 | AR | No |
| `Europe/London` | +00:00 | GB | Sí |
| `Europe/Paris` | +01:00 | FR | Sí |
| `Europe/Berlin` | +01:00 | DE | Sí |
| `Europe/Madrid` | +01:00 | ES | Sí |
| `Europe/Rome` | +01:00 | IT | Sí |
| `Asia/Tokyo` | +09:00 | JP | No |
| `Asia/Shanghai` | +08:00 | CN | No |
| `Asia/Kolkata` | +05:30 | IN | No |
| `Asia/Dubai` | +04:00 | AE | No |
| `Australia/Sydney` | +10:00 | AU | Sí |
| `Pacific/Auckland` | +12:00 | NZ | Sí |
| `Africa/Lagos` | +01:00 | NG | No |

## Ejemplo completo

```csharp
public class GlobalMeetingScheduler(IValiTimeZone tz)
{
    public void ScheduleMeeting(DateTime utcTime)
    {
        var participants = new[]
        {
            ("Lima",    "America/Lima"),
            ("Madrid",  "Europe/Madrid"),
            ("Tokyo",   "Asia/Tokyo"),
            ("New York","America/New_York"),
        };

        Console.WriteLine($"Meeting UTC: {utcTime:HH:mm}");
        Console.WriteLine();

        foreach (var (city, zone) in participants)
        {
            DateTime local  = tz.FromUtc(utcTime, zone);
            TimeSpan offset = tz.GetOffset(zone, utcTime);
            bool     isDst  = tz.IsDst(utcTime, zone);

            Console.WriteLine($"{city,-12} {local:HH:mm} (UTC{offset:+hh\\:mm;-hh\\:mm}{(isDst ? " DST" : "")})");
        }

        // Encontrar la diferencia horaria entre Lima y Tokyo
        decimal diff = tz.OffsetDiff("America/Lima", "Asia/Tokyo", utcTime);
        Console.WriteLine($"\nLima ↔ Tokyo difference: {diff:F0} hours");
    }
}
```
