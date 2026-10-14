---
id: changelog
title: Vali-Holiday — Historial de cambios
sidebar_label: Historial de cambios
---

# Historial de cambios

Todos los cambios notables de **Vali-Holiday** están documentados aquí.
Sigue [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) y [Semantic Versioning](https://semver.org/).

---

## [1.1.0]

### Agregado
- `IValiHoliday.IsHoliday(DateTime, params string[])` (semántica ANY) e `IsHolidayInAll(DateTime, params string[])` (semántica ALL) — verificaciones de feriados multi-país en una sola llamada.
- `HolidayInfo.TryToDateTime(int year, out DateTime result)` — conversión segura `(Month, Day, year)` que devuelve `false` en vez de lanzar para el 29 de feb en un año no bisiesto.
- Enumeración `ObservedRule` y `IHolidayProvider.GetObservedDate(HolidayInfo, int)` / `IValiHoliday.GetObservedHoliday(DateTime, string)` — resolución oficial de corrimiento de fin de semana ("observado"/"sustituto"), implementada para EE. UU. (sábado → viernes anterior, domingo → lunes siguiente) y Reino Unido (fin de semana → siguiente día laborable disponible, con manejo coordinado de colisiones entre Navidad y Boxing Day). Ningún otro proveedor declara una regla en esta versión.

### Cambiado
- `IsHoliday(DateTime, params string[])` e `IsHolidayInAll(DateTime, params string[])` ahora lanzan `ArgumentNullException` en vez de `NullReferenceException` cuando se llaman con un arreglo `null`.
- `HolidayInfo` ahora es un `sealed record` (antes era una `sealed class`) — agrega igualdad estructural; el formato de `ToString()` no cambia. `Names` sigue comparándose por referencia, ya que los records no comparan colecciones en profundidad.
- Se movieron `UsaHolidayProvider.cs`/`CanadaHolidayProvider.cs` a `Providers/NorthAmerica/` y `AustraliaHolidayProvider.cs` a `Providers/Oceania/`, alineándolos con sus namespaces ya declarados (sin cambio de namespace ni de comportamiento).
- Se agregó el target `net10.0`.

### Corregido
- `BaseHolidayProvider.GetHolidaysInRange` y `ValiHoliday.GetNextHolidayWithYear`/`GetPreviousHolidayWithYear` ahora comparten una única guarda para el 29 de feb/año no bisiesto (vía `HolidayInfo.TryToDateTime`) en vez de tres verificaciones escritas de forma independiente.

## [1.0.0] — 2025-07-01

### Agregado
- Modelo `HolidayInfo` con soporte multilingüe: español (es), inglés (en), portugués (pt), francés (fr), alemán (de).
- Interfaz `IHolidayProvider` y clase base abstracta `BaseHolidayProvider`.
- `EasterCalculator` usando el algoritmo gaussiano, compatible con 9 feriados móviles basados en la Pascua.
- Proveedores de país para más de 35 países en América Latina y Europa.
- `HolidayProviderFactory` con métodos de fábrica `CreateAll()`, `CreateLatinAmerica()` y `CreateEurope()`.
- `ValiHoliday` con gestión de proveedores: `Register`, `Supports`, `SupportedCountries`.
- Consultas de feriados: `IsHoliday`, `GetHolidays`, `For`.
- Helpers de navegación: `GetNextHolidayWithYear`, `GetPreviousHolidayWithYear`.
- Helpers de fin de semana: `IsLongWeekend`, `HolidaysThisMonth`.
- Método de extensión `AddValiHoliday()` para el registro en DI con `IServiceCollection`.

### Rendimiento
- `BaseHolidayProvider.IsHoliday` usa una caché `HashSet` de O(1) por año para evitar exploraciones lineales repetidas al verificar el mismo año varias veces.
