---
id: providers
title: Proveedores de feriados
sidebar_label: Proveedores
---

# Proveedores de feriados

Vali-Holiday usa un patrón de proveedor. Cada `IHolidayProvider` entrega datos de feriados para un país. `HolidayProviderFactory` ofrece agrupaciones predefinidas para un registro masivo conveniente.

## Interfaz IHolidayProvider

```csharp
public interface IHolidayProvider
{
    /// <summary>Código de país ISO 3166-1 alpha-2 (ej. "PE", "US", "ES").</summary>
    string CountryCode { get; }

    /// <summary>Nombre en inglés del país (ej. "Peru", "Chile", "Argentina").</summary>
    string CountryName { get; }

    /// <summary>Etiqueta BCP 47 del idioma principal usado en los nombres de feriados.</summary>
    string PrimaryLanguage { get; }

    /// <summary>Devuelve todos los feriados públicos del año dado.</summary>
    IEnumerable<HolidayInfo> GetHolidays(int year);

    bool IsHoliday(DateTime date);
    bool IsHoliday(DateOnly date);

    HolidayInfo? GetHoliday(DateTime date);
    IEnumerable<HolidayInfo> GetHolidaysInRange(DateTime from, DateTime to);

    string GetName(HolidayInfo holiday, string languageCode);

    /// <summary>Resuelve la fecha oficial "observada"/"sustituta" de un feriado, si declara una regla de corrimiento de fin de semana.</summary>
    DateTime? GetObservedDate(HolidayInfo holiday, int year);
}
```

Implementa esta interfaz — o extiende `BaseHolidayProvider`, que ya implementa la caché, el filtrado por rango y la resolución de fecha observada — para agregar países personalizados o calendarios de feriados específicos de empresa.

## HolidayProviderFactory

`HolidayProviderFactory` es una clase estática que proporciona colecciones predefinidas de proveedores. Cada método `CreateX` devuelve una instancia `ValiHoliday` lista para usar; cada método `GetXProviders` devuelve el `IEnumerable<IHolidayProvider>` crudo, por si quieres registrarlos tú mismo o combinar grupos.

### CreateAll / GetAllProviders

Devuelve un `ValiHoliday` precargado con los 38 proveedores incorporados (América Latina + Europa + Otros):

```csharp
var holiday = HolidayProviderFactory.CreateAll();
// o, para registrar en una instancia existente:
foreach (var provider in HolidayProviderFactory.GetAllProviders())
    holiday.Register(provider);
```

**Firmas:** `static ValiHoliday CreateAll()` · `static IEnumerable<IHolidayProvider> GetAllProviders()`

### CreateLatinAmerica / GetLatinAmericaProviders

Devuelve proveedores para 19 países latinoamericanos:

```csharp
var holiday = HolidayProviderFactory.CreateLatinAmerica();
```

**Países:** Argentina (AR), Bolivia (BO), Brasil (BR), Chile (CL), Colombia (CO), Costa Rica (CR), Cuba (CU), República Dominicana (DO), Ecuador (EC), El Salvador (SV), Guatemala (GT), Honduras (HN), México (MX), Nicaragua (NI), Panamá (PA), Paraguay (PY), Perú (PE), Uruguay (UY), Venezuela (VE)

**Firmas:** `static ValiHoliday CreateLatinAmerica()` · `static IEnumerable<IHolidayProvider> GetLatinAmericaProviders()`

### CreateEurope / GetEuropeProviders

Devuelve proveedores para 16 países europeos:

```csharp
var holiday = HolidayProviderFactory.CreateEurope();
```

**Países:** Austria (AT), Bélgica (BE), Suiza (CH), Alemania (DE), Dinamarca (DK), España (ES), Finlandia (FI), Francia (FR), Reino Unido (GB), Irlanda (IE), Italia (IT), Países Bajos (NL), Noruega (NO), Polonia (PL), Portugal (PT), Suecia (SE)

**Firmas:** `static ValiHoliday CreateEurope()` · `static IEnumerable<IHolidayProvider> GetEuropeProviders()`

### CreateOther / GetOtherProviders

Devuelve proveedores para los países restantes fuera de América Latina y Europa: EE. UU., Canadá y Australia.

```csharp
var holiday = HolidayProviderFactory.CreateOther();
```

**Países:** Estados Unidos (US), Canadá (CA), Australia (AU)

**Firmas:** `static ValiHoliday CreateOther()` · `static IEnumerable<IHolidayProvider> GetOtherProviders()`

## Los 38 países admitidos

| Código | País | Región |
|---|---|---|
| AR | Argentina | América Latina |
| AT | Austria | Europa |
| AU | Australia | Otros |
| BE | Bélgica | Europa |
| BO | Bolivia | América Latina |
| BR | Brasil | América Latina |
| CA | Canadá | Otros |
| CH | Suiza | Europa |
| CL | Chile | América Latina |
| CO | Colombia | América Latina |
| CR | Costa Rica | América Latina |
| CU | Cuba | América Latina |
| DE | Alemania | Europa |
| DK | Dinamarca | Europa |
| DO | República Dominicana | América Latina |
| EC | Ecuador | América Latina |
| ES | España | Europa |
| FI | Finlandia | Europa |
| FR | Francia | Europa |
| GB | Reino Unido | Europa |
| GT | Guatemala | América Latina |
| HN | Honduras | América Latina |
| IE | Irlanda | Europa |
| IT | Italia | Europa |
| MX | México | América Latina |
| NI | Nicaragua | América Latina |
| NL | Países Bajos | Europa |
| NO | Noruega | Europa |
| PA | Panamá | América Latina |
| PE | Perú | América Latina |
| PL | Polonia | Europa |
| PT | Portugal | Europa |
| PY | Paraguay | América Latina |
| SE | Suecia | Europa |
| SV | El Salvador | América Latina |
| US | Estados Unidos | Otros |
| UY | Uruguay | América Latina |
| VE | Venezuela | América Latina |

> No hay otros países admitidos actualmente — en particular, **no** existen proveedores incorporados para República Checa, Grecia, Hungría, Rumanía, Japón, Corea del Sur, Nueva Zelanda, Filipinas, Rusia ni Sudáfrica, a pesar de que versiones anteriores de esta página los listaban.

## EasterCalculator

`EasterCalculator` es un helper estático usado por todos los proveedores que tienen feriados dependientes de la Pascua. Calcula el Domingo de Pascua usando el algoritmo gaussiano:

```csharp
DateTime easter = EasterCalculator.GetEaster(2025);
// → 2025-04-20

DateTime goodFriday  = easter.AddDays(-2);
DateTime holyThurs   = easter.AddDays(-3);
DateTime easterMonday = easter.AddDays(1);
```

**Firma:** `static DateTime GetEaster(int year)`

### Países que usan feriados basados en la Pascua

Todos los proveedores latinoamericanos, y la mayoría de los europeos, usan `EasterCalculator` para feriados móviles incluyendo:

- **Carnaval** (Martes Gordo, 47 días antes de la Pascua)
- **Domingo de Ramos** (7 días antes de la Pascua)
- **Jueves Santo** (3 días antes de la Pascua)
- **Viernes Santo** (2 días antes de la Pascua)
- **Sábado Santo** (1 día antes de la Pascua)
- **Domingo de Pascua**
- **Lunes de Pascua** (1 día después de la Pascua)
- **Jueves de la Ascensión** (39 días después de la Pascua)
- **Pentecostés / Domingo de Pentecostés** (49 días después de la Pascua)
- **Corpus Christi** (60 días después de la Pascua)

## Comportamiento específico por país

### Argentina (AR)

El Domingo de Pascua está tipificado como `HolidayType.Observance` en el proveedor de Argentina. Los feriados de Observance se excluyen de la verificación rápida nacional de `IsHoliday()`, por lo que `IsHoliday(easterDate, "AR")` devuelve `false` para el Domingo de Pascua.

### Chile (CL)

El Día de los Pueblos Indígenas es un feriado móvil determinado por el ciclo astronómico del solsticio. Cae el **20 de junio** en años bisiestos cercanos al ciclo del solsticio, y el **21 de junio** en los demás.

### Honduras (HN)

El proveedor de Honduras incluye:
- **17 de sep — Día del Maestro** (feriado cívico fijo)
- **Domingo de Pascua** (móvil, basado en la Pascua)

### EE. UU. (US) / Reino Unido (GB)

Los únicos dos proveedores que declaran un `ObservedRule` en sus feriados (resolución de corrimiento de fin de semana vía `GetObservedDate`/`GetObservedHoliday`):

- **EE. UU.** — `SaturdayToFriday_SundayToMonday`: sábado → viernes anterior, domingo → lunes siguiente.
- **Reino Unido** — `NextAvailableWeekday`: fin de semana → siguiente día laborable disponible que no sea ya un día sustituto, con manejo coordinado de colisiones entre Navidad y Boxing Day.

## Implementar un proveedor personalizado

Extiende `BaseHolidayProvider` e implementa `GetFixedHolidays()` (y opcionalmente `GetMovableHolidays(year)`):

```csharp
public class CompanyHolidayProvider : BaseHolidayProvider
{
    public override string CountryCode => "INTERNAL";
    public override string CountryName => "Internal Company Calendar";
    public override string PrimaryLanguage => "en";

    protected override IEnumerable<HolidayInfo> GetFixedHolidays()
    {
        yield return new HolidayInfo(
            id: "company_foundation_day",
            month: 6,
            day: 15,
            countryCode: CountryCode,
            name: "Company Foundation Day",
            names: Names(es: "Día de Fundación", en: "Company Foundation Day"),
            type: HolidayType.Optional);
    }

    protected override IEnumerable<HolidayInfo> GetMovableHolidays(int year)
    {
        // Feriado dinámico: primer lunes de marzo
        var firstMonday = Enumerable
            .Range(1, 7)
            .Select(d => new DateTime(year, 3, d))
            .First(d => d.DayOfWeek == DayOfWeek.Monday);

        yield return new HolidayInfo(
            id: "company_team_day",
            month: firstMonday.Month,
            day: firstMonday.Day,
            countryCode: CountryCode,
            name: "Team Day",
            names: Names(es: "Día del Equipo", en: "Team Day"),
            type: HolidayType.Optional,
            isMovable: true);
    }
}

// Registrar:
holiday.Register(new CompanyHolidayProvider());
```
