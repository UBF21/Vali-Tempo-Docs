---
id: changelog
title: Vali-Duration — Historial de cambios
sidebar_label: Historial de cambios
---

# Historial de cambios

Todos los cambios notables de **Vali-Duration** están documentados aquí.
Sigue [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y [Semantic Versioning](https://semver.org/).

---

## [1.1.0]

### Agregado
- `IParsable<ValiDuration>` — `Parse`/`TryParse` de cadenas de duración legibles para humanos (notación tipo reloj `"hh:mm:ss"`/`"mm:ss"` o tokens etiquetados por unidad como `"2d 4h 30m 15s"`), mediante el `DurationStringParser` compartido y extraído de `Vali-Time`.
- `IFormattable` — `ToString(string?, IFormatProvider?)`, usando la cadena de formato como el `decimalPlaces` de `Format(int)` cuando se puede parsear como entero no negativo.
- Se agregó el target framework net10.0.

### Cambiado
- Ahora depende de `Vali-Time` 1.1.0 (por el `DurationStringParser` compartido). Sin cambios disruptivos.

---

## [1.0.0] — 2025-07-01

### Agregado
- Struct `ValiDuration` con precisión decimal para exactitud sub-milisegundo.
- Métodos de fábrica: `FromMilliseconds`, `FromSeconds`, `FromMinutes`, `FromHours`, `FromDays`, `FromWeeks`.
- Operadores aritméticos: `+`, `-`, `*`, `/`.
- Operadores de comparación: `<`, `>`, `<=`, `>=`, `==`, `!=`.
- Implementaciones de `IEquatable<ValiDuration>` e `IComparable<ValiDuration>`.
- Conversión implícita hacia y desde `TimeSpan`.
- `Format()` para salida de cadena legible para humanos.
- `As(TimeUnit)` para convertir el valor de duración a una unidad específica.
