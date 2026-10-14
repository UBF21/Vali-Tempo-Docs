---
id: changelog
title: Vali-Age — Historial de cambios
sidebar_label: Historial de cambios
---

# Historial de cambios

Todos los cambios notables de **Vali-Age** están documentados aquí.
Sigue [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y [Semantic Versioning](https://semver.org/).

---

## [1.1.0]

### Agregado
- Formateo de tiempo relativo `Humanize()` (es/en) mediante `HumanizeEngine`, construido sobre `HumanizeCulture` de `Vali-Time`.
- Método de extensión sin estado `DateTime.Humanize(...)` (`Vali_Age.Extensions.DateTimeHumanizeExtensions`) que delega en el mismo motor interno — no requiere DI.
- Target framework `net10.0`.

### Cambiado
- Depende temporalmente del código fuente de `Vali-Time` vía `ProjectReference` en lugar de un `PackageReference`, porque `HumanizeCulture` todavía no existe en el paquete publicado `Vali-Time` 1.0.1 — cambiará a `PackageReference Version="1.1.0"` cuando `Vali-Time` vuelva a publicarse.

---

## [1.0.0] — 2025-07-01

### Agregado
- Struct `AgeResult` con propiedades `Years`, `Months`, `Days` y `TotalDays`.
- `ValiAge` con métodos de cálculo de edad: `Years`, `Exact`.
- Helpers de formateo: `Format` y `Relative`.
- Utilidades de cumpleaños: `IsBirthday`, `NextBirthday`, `DaysUntilBirthday`.
- Verificación de umbral: `IsAtLeast`.
- Manejo correcto de los cumpleaños del 29 de febrero en años no bisiestos (resuelto al 28 de febrero).
- Método de extensión `AddValiAge()` para el registro en DI con `IServiceCollection`.

### Corregido
- `NextBirthday` ahora avanza correctamente al año siguiente cuando el cumpleaños ya ocurrió en el año actual, en lugar de devolver una fecha pasada.
