---
id: providers
title: Holiday Providers
sidebar_label: Providers
---

# Holiday Providers

Vali-Holiday uses a provider pattern. Each `IHolidayProvider` delivers holiday data for one country. `HolidayProviderFactory` offers pre-built groupings for convenient bulk registration.

## IHolidayProvider Interface

```csharp
public interface IHolidayProvider
{
    /// <summary>ISO 3166-1 alpha-2 country code (e.g. "PE", "US", "ES").</summary>
    string CountryCode { get; }

    /// <summary>English name of the country (e.g. "Peru", "Chile", "Argentina").</summary>
    string CountryName { get; }

    /// <summary>BCP 47 tag for the primary language used in holiday names.</summary>
    string PrimaryLanguage { get; }

    /// <summary>Returns all public holidays for the given year.</summary>
    IEnumerable<HolidayInfo> GetHolidays(int year);

    bool IsHoliday(DateTime date);
    bool IsHoliday(DateOnly date);

    HolidayInfo? GetHoliday(DateTime date);
    IEnumerable<HolidayInfo> GetHolidaysInRange(DateTime from, DateTime to);

    string GetName(HolidayInfo holiday, string languageCode);

    /// <summary>Resolves the official "observed"/"substitute" date for a holiday, if it declares a weekend-shift rule.</summary>
    DateTime? GetObservedDate(HolidayInfo holiday, int year);
}
```

Implement this interface — or extend `BaseHolidayProvider`, which already implements the caching, range-filtering, and observed-date resolution logic — to add custom countries or company-specific holiday calendars.

## HolidayProviderFactory

`HolidayProviderFactory` is a static class that provides pre-built collections of providers. Each `CreateX` method returns a ready-to-use `ValiHoliday` instance; each `GetXProviders` method returns the raw `IEnumerable<IHolidayProvider>` if you want to register them yourself or combine groups.

### CreateAll / GetAllProviders

Returns a `ValiHoliday` pre-loaded with all 38 built-in providers (Latin America + Europe + Other):

```csharp
var holiday = HolidayProviderFactory.CreateAll();
// or, to register into an existing instance:
foreach (var provider in HolidayProviderFactory.GetAllProviders())
    holiday.Register(provider);
```

**Signatures:** `static ValiHoliday CreateAll()` · `static IEnumerable<IHolidayProvider> GetAllProviders()`

### CreateLatinAmerica / GetLatinAmericaProviders

Returns providers for 19 Latin American countries:

```csharp
var holiday = HolidayProviderFactory.CreateLatinAmerica();
```

**Countries:** Argentina (AR), Bolivia (BO), Brazil (BR), Chile (CL), Colombia (CO), Costa Rica (CR), Cuba (CU), Dominican Republic (DO), Ecuador (EC), El Salvador (SV), Guatemala (GT), Honduras (HN), Mexico (MX), Nicaragua (NI), Panama (PA), Paraguay (PY), Peru (PE), Uruguay (UY), Venezuela (VE)

**Signatures:** `static ValiHoliday CreateLatinAmerica()` · `static IEnumerable<IHolidayProvider> GetLatinAmericaProviders()`

### CreateEurope / GetEuropeProviders

Returns providers for 16 European countries:

```csharp
var holiday = HolidayProviderFactory.CreateEurope();
```

**Countries:** Austria (AT), Belgium (BE), Switzerland (CH), Germany (DE), Denmark (DK), Spain (ES), Finland (FI), France (FR), United Kingdom (GB), Ireland (IE), Italy (IT), Netherlands (NL), Norway (NO), Poland (PL), Portugal (PT), Sweden (SE)

**Signatures:** `static ValiHoliday CreateEurope()` · `static IEnumerable<IHolidayProvider> GetEuropeProviders()`

### CreateOther / GetOtherProviders

Returns providers for the remaining countries outside Latin America and Europe: USA, Canada, and Australia.

```csharp
var holiday = HolidayProviderFactory.CreateOther();
```

**Countries:** United States (US), Canada (CA), Australia (AU)

**Signatures:** `static ValiHoliday CreateOther()` · `static IEnumerable<IHolidayProvider> GetOtherProviders()`

## All 38 Supported Countries

| Code | Country | Region |
|---|---|---|
| AR | Argentina | Latin America |
| AT | Austria | Europe |
| AU | Australia | Other |
| BE | Belgium | Europe |
| BO | Bolivia | Latin America |
| BR | Brazil | Latin America |
| CA | Canada | Other |
| CH | Switzerland | Europe |
| CL | Chile | Latin America |
| CO | Colombia | Latin America |
| CR | Costa Rica | Latin America |
| CU | Cuba | Latin America |
| DE | Germany | Europe |
| DK | Denmark | Europe |
| DO | Dominican Republic | Latin America |
| EC | Ecuador | Latin America |
| ES | Spain | Europe |
| FI | Finland | Europe |
| FR | France | Europe |
| GB | United Kingdom | Europe |
| GT | Guatemala | Latin America |
| HN | Honduras | Latin America |
| IE | Ireland | Europe |
| IT | Italy | Europe |
| MX | Mexico | Latin America |
| NI | Nicaragua | Latin America |
| NL | Netherlands | Europe |
| NO | Norway | Europe |
| PA | Panama | Latin America |
| PE | Peru | Latin America |
| PL | Poland | Europe |
| PT | Portugal | Europe |
| PY | Paraguay | Latin America |
| SE | Sweden | Europe |
| SV | El Salvador | Latin America |
| US | United States | Other |
| UY | Uruguay | Latin America |
| VE | Venezuela | Latin America |

> No other countries are currently supported — in particular, there are **no** built-in providers for Czech Republic, Greece, Hungary, Romania, Japan, South Korea, New Zealand, Philippines, Russia, or South Africa, despite earlier versions of this page listing them.

## EasterCalculator

`EasterCalculator` is a static helper used by all providers that have Easter-dependent holidays. It computes Easter Sunday using the Gaussian algorithm:

```csharp
DateTime easter = EasterCalculator.GetEaster(2025);
// → 2025-04-20

DateTime goodFriday  = easter.AddDays(-2);
DateTime holyThurs   = easter.AddDays(-3);
DateTime easterMonday = easter.AddDays(1);
```

**Signature:** `static DateTime GetEaster(int year)`

### Countries using Easter-based holidays

All Latin American providers, and most European providers, use `EasterCalculator` for movable holidays including:

- **Carnival** (Fat Tuesday, 47 days before Easter)
- **Palm Sunday** (7 days before Easter)
- **Maundy/Holy Thursday** (3 days before Easter)
- **Good Friday** (2 days before Easter)
- **Holy Saturday** (1 day before Easter)
- **Easter Sunday**
- **Easter Monday** (1 day after Easter)
- **Ascension Thursday** (39 days after Easter)
- **Whit Sunday / Pentecost** (49 days after Easter)
- **Corpus Christi** (60 days after Easter)

## Country-Specific Behavior

### Argentina (AR)

Easter Sunday is typed as `HolidayType.Observance` in the Argentina provider. Observance holidays are excluded from the `IsHoliday()` national fast-path check, so `IsHoliday(easterDate, "AR")` returns `false` for Easter Sunday.

### Chile (CL)

Indigenous Peoples Day is a movable holiday determined by the astronomical solstice cycle. It falls on **June 20** in leap years near the solstice cycle, and **June 21** otherwise.

### Honduras (HN)

The Honduras provider includes:
- **Sep 17 — Día del Maestro** (fixed civic holiday)
- **Easter Sunday** (movable, Easter-based)

### USA (US) / United Kingdom (GB)

The only two providers that declare an `ObservedRule` on their holidays (weekend-shift resolution via `GetObservedDate`/`GetObservedHoliday`):

- **USA** — `SaturdayToFriday_SundayToMonday`: Saturday → previous Friday, Sunday → following Monday.
- **United Kingdom** — `NextAvailableWeekday`: weekend → next available weekday not already a substitute day, with coordinated Christmas Day/Boxing Day collision handling.

## Implementing a Custom Provider

Extend `BaseHolidayProvider` and implement `GetFixedHolidays()` (and optionally `GetMovableHolidays(year)`):

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
        // Dynamic holiday: first Monday in March
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

// Register:
holiday.Register(new CompanyHolidayProvider());
```
