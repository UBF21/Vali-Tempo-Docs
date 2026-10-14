---
id: overview
title: Descripción general de Vali-Duration
sidebar_label: Descripción general
description: Vali-Duration proporciona formateo de duración legible para humanos en .NET — convierte TimeSpan y duraciones decimales en cadenas de lenguaje natural.
keywords: [Vali-Duration, formateo de duración, TimeSpan, .NET, NuGet, C#, legible para humanos]
---

# Vali-Duration

`ValiDuration` es un tipo de valor de duración decimal de alta precisión. Proporciona métodos de fábrica, operadores aritméticos, conversión de unidades, formateo e interoperabilidad fluida con `TimeSpan`.

## Instalación

```bash
dotnet add package Vali-Duration
```

## Struct ValiDuration

`ValiDuration` almacena su valor internamente como segundos `decimal`, evitando la deriva de punto flotante en las operaciones aritméticas.

### Métodos de fábrica

| Método | Descripción |
|---|---|
| `ValiDuration.FromMilliseconds(decimal)` | Crear desde milisegundos |
| `ValiDuration.FromSeconds(decimal)` | Crear desde segundos |
| `ValiDuration.FromMinutes(decimal)` | Crear desde minutos |
| `ValiDuration.FromHours(decimal)` | Crear desde horas |
| `ValiDuration.FromDays(decimal)` | Crear desde días |
| `ValiDuration.FromWeeks(decimal)` | Crear desde semanas (7 días) |
| `ValiDuration.FromMonths(decimal)` | Crear desde meses (promedio 30.4375 días) |
| `ValiDuration.FromYears(decimal)` | Crear desde años (promedio 365.25 días) |
| `ValiDuration.FromTimeSpan(TimeSpan)` | Crear desde un `TimeSpan` |
| `ValiDuration.Zero` | Una duración de longitud cero |

```csharp
var d1 = ValiDuration.FromHours(2.5m);
var d2 = ValiDuration.FromMinutes(90m);
var d3 = ValiDuration.FromTimeSpan(TimeSpan.FromDays(7));
var d4 = ValiDuration.Zero;
```

### Propiedades

| Propiedad | Tipo | Descripción |
|---|---|---|
| `TotalMilliseconds` | `decimal` | Valor total en milisegundos |
| `TotalSeconds` | `decimal` | Valor total en segundos |
| `TotalMinutes` | `decimal` | Valor total en minutos |
| `TotalHours` | `decimal` | Valor total en horas |
| `TotalDays` | `decimal` | Valor total en días |

```csharp
var d = ValiDuration.FromHours(2.5m);
Console.WriteLine(d.TotalMinutes);      // → 150
Console.WriteLine(d.TotalMilliseconds); // → 9_000_000
```

### Métodos de instancia

#### As

Convierte la duración a un valor decimal en la unidad especificada:

```csharp
var d = ValiDuration.FromDays(1.5m);
decimal hours = d.As(TimeUnit.Hours);   // → 36
decimal mins  = d.As(TimeUnit.Minutes); // → 2160
```

**Firma:** `decimal As(TimeUnit unit)`

#### Format

Formatea la duración como una cadena legible para humanos:

```csharp
var d = ValiDuration.FromMinutes(90m);
Console.WriteLine(d.Format());         // → "1.50 h"
Console.WriteLine(d.Format(1));        // → "1.5 h"
```

`Format` siempre elige una única unidad de mejor ajuste (semanas, días, horas, minutos, segundos o milisegundos) — nunca combina unidades como `"1h 30m"`.

**Firma:** `string Format(int decimalPlaces = 2)`

#### ToTimeSpan

Convierte a un `TimeSpan`. Nota: `TimeSpan` usa `double` internamente, por lo que valores muy grandes o muy precisos pueden perder precisión:

```csharp
var d  = ValiDuration.FromHours(2.5m);
TimeSpan ts = d.ToTimeSpan();
// → TimeSpan de 2h 30m
```

**Firma:** `TimeSpan ToTimeSpan()`

### Operadores aritméticos

`ValiDuration` admite todas las operaciones aritméticas estándar:

```csharp
var a = ValiDuration.FromHours(1.5m);
var b = ValiDuration.FromMinutes(30m);

ValiDuration sum  = a + b;  // 2 horas
ValiDuration diff = a - b;  // 1 hora
ValiDuration scaled = a * 2m; // 3 horas
ValiDuration halved = a / 2m; // 45 minutos

bool equal   = a == b;
bool greater = a > b;
bool less    = a < b;
```

### Operadores de comparación

Se admiten los seis operadores de comparación (`==`, `!=`, `<`, `<=`, `>`, `>=`):

```csharp
var oneHour  = ValiDuration.FromHours(1m);
var twoHours = ValiDuration.FromHours(2m);

bool result = oneHour < twoHours; // → true
```

### Conversiones implícitas

```csharp
// Desde TimeSpan
ValiDuration d = TimeSpan.FromHours(2); // implícito

// A TimeSpan
TimeSpan ts = ValiDuration.FromMinutes(90m); // implícito
```

### Parsing (IParsable\<ValiDuration\>)

`ValiDuration` implementa `IParsable<ValiDuration>`, compartiendo su gramática con `IValiTime.ParseTime` de `Vali-Time` a través del parser público `DurationStringParser`. Acepta notación tipo reloj separada por dos puntos (`"hh:mm:ss"`, `"mm:ss"`) o tokens combinables etiquetados por unidad (`"2d 4h 30m 15s"`, `"1h 30m"`, `"500ms"`, `"90 minutes"`).

```csharp
ValiDuration a = ValiDuration.Parse("1h 30m");          // 1.5 horas
ValiDuration b = ValiDuration.Parse("45:30");           // mm:ss → 45m 30s
ValiDuration c = ValiDuration.Parse("2d 4h 30m 15s");   // tokens combinados

bool ok   = ValiDuration.TryParse("2h", null, out ValiDuration result);           // true
bool fail = ValiDuration.TryParse("not-a-duration", null, out ValiDuration zero); // false, zero == ValiDuration.Zero
```

Tokens de unidad reconocidos: `ms`/`milliseconds`, `s`/`sec`/`seconds`, `m`/`min`/`minutes`, `h`/`hr`/`hours`, `d`/`days`, `w`/`weeks`, `mo`/`months`, `yr`/`years`. El parsing siempre es invariante a la cultura e insensible a mayúsculas/minúsculas.

**Firma:** `static ValiDuration Parse(string s, IFormatProvider? provider = null)` / `static bool TryParse(string? s, IFormatProvider? provider, out ValiDuration result)`

### IFormattable

`ValiDuration` también implementa `IFormattable`. Cuando la cadena de formato se puede parsear como un entero no negativo, se usa como el argumento `decimalPlaces` de `Format(int)`; cualquier otro valor (incluyendo `null` o `"G"`) recae en el valor por defecto de 2 decimales:

```csharp
var d = ValiDuration.FromMinutes(90m); // 1.5 horas

string unDecimal   = d.ToString("1");  // → "1.5 h"
string porDefecto  = d.ToString();     // → "1.50 h"
string interp      = $"{d:1}";         // → "1.5 h"
```

**Firma:** `string ToString(string? format, IFormatProvider? formatProvider)`

## Ejemplo completo

```csharp
public class BillingService
{
    public void CalculateBilling(TimeSpan[] sessionDurations, decimal hourlyRate)
    {
        // Convertir todas las sesiones a ValiDuration
        var durations = sessionDurations
            .Select(ValiDuration.FromTimeSpan)
            .ToArray();

        // Sumar todas las sesiones
        var total = durations.Aggregate(ValiDuration.Zero, (acc, d) => acc + d);

        Console.WriteLine($"Total time:    {total.Format(1)}");
        Console.WriteLine($"Total hours:   {total.TotalHours:F2}");

        // Calcular facturación
        decimal billableHours = total.As(TimeUnit.Hours);
        decimal amount = billableHours * hourlyRate;

        Console.WriteLine($"Billable:      {billableHours:F2}h × ${hourlyRate}/h = ${amount:F2}");

        // Verificar si supera la jornada de 8 horas
        var workday = ValiDuration.FromHours(8m);
        if (total > workday)
        {
            ValiDuration overtime = total - workday;
            Console.WriteLine($"Overtime:      {overtime.Format(1)}");
        }
    }
}
```
