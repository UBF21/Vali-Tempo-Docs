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

    /// <summary>Return all public holidays for the given year.</summary>
    IEnumerable<HolidayInfo> GetHolidays(int year);
}
```

Implement this interface to add custom countries or company-specific holiday calendars.

## HolidayProviderFactory

`HolidayProviderFactory` is a static class that provides pre-built collections of providers.

### CreateAll

Returns providers for all 35 supported countries:

```csharp
foreach (var provider in HolidayProviderFactory.CreateAll())
    holiday.Register(provider);
```

**Signature:** `static IEnumerable<IHolidayProvider> CreateAll()`

### CreateLatinAmerica

Returns providers for 15 Latin American countries:

```csharp
foreach (var provider in HolidayProviderFactory.CreateLatinAmerica())
    holiday.Register(provider);
```

**Countries:** Argentina (AR), Bolivia (BO), Brazil (BR), Chile (CL), Colombia (CO), Costa Rica (CR), Cuba (CU), Dominican Republic (DO), Ecuador (EC), El Salvador (SV), Guatemala (GT), Honduras (HN), Mexico (MX), Panama (PA), Paraguay (PY), Peru (PE), Uruguay (UY), Venezuela (VE)

**Signature:** `static IEnumerable<IHolidayProvider> CreateLatinAmerica()`

### CreateEurope

Returns providers for 17 European countries plus US and Canada:

```csharp
foreach (var provider in HolidayProviderFactory.CreateEurope())
    holiday.Register(provider);
```

**Countries:** Austria (AT), Belgium (BE), Switzerland (CH), Czech Republic (CZ), Germany (DE), Denmark (DK), Spain (ES), Finland (FI), France (FR), United Kingdom (GB), Greece (GR), Hungary (HU), Ireland (IE), Italy (IT), Netherlands (NL), Norway (NO), Poland (PL), Portugal (PT), Romania (RO), Sweden (SE), Canada (CA), United States (US)

**Signature:** `static IEnumerable<IHolidayProvider> CreateEurope()`

### CreateOther

Returns providers for remaining supported countries:

```csharp
foreach (var provider in HolidayProviderFactory.CreateOther())
    holiday.Register(provider);
```

**Countries:** Australia (AU), Japan (JP), South Korea (KR), New Zealand (NZ), Philippines (PH), Russia (RU), South Africa (ZA)

**Signature:** `static IEnumerable<IHolidayProvider> CreateOther()`

## All 35 Supported Countries

| Code | Country | Region |
|---|---|---|
| AR | Argentina | Latin America |
| AT | Austria | Europe |
| AU | Australia | Other |
| BE | Belgium | Europe |
| BO | Bolivia | Latin America |
| BR | Brazil | Latin America |
| CA | Canada | North America |
| CH | Switzerland | Europe |
| CL | Chile | Latin America |
| CO | Colombia | Latin America |
| CR | Costa Rica | Latin America |
| CU | Cuba | Latin America |
| CZ | Czech Republic | Europe |
| DE | Germany | Europe |
| DK | Denmark | Europe |
| DO | Dominican Republic | Latin America |
| EC | Ecuador | Latin America |
| ES | Spain | Europe |
| FI | Finland | Europe |
| FR | France | Europe |
| GB | United Kingdom | Europe |
| GR | Greece | Europe |
| GT | Guatemala | Latin America |
| HN | Honduras | Latin America |
| HU | Hungary | Europe |
| IE | Ireland | Europe |
| IT | Italy | Europe |
| JP | Japan | Other |
| KR | South Korea | Other |
| MX | Mexico | Latin America |
| NL | Netherlands | Europe |
| NO | Norway | Europe |
| NZ | New Zealand | Other |
| PA | Panama | Latin America |
| PE | Peru | Latin America |
| PH | Philippines | Other |
| PL | Poland | Europe |
| PT | Portugal | Europe |
| PY | Paraguay | Latin America |
| RO | Romania | Europe |
| RU | Russia | Other |
| SE | Sweden | Europe |
| SV | El Salvador | Latin America |
| US | United States | North America |
| UY | Uruguay | Latin America |
| VE | Venezuela | Latin America |
| ZA | South Africa | Other |

## EasterCalculator

`EasterCalculator` is a static helper used by all providers that have Easter-dependent holidays. It computes Easter Sunday using the Anonymous Gregorian algorithm:

```csharp
DateTime easter = EasterCalculator.GetEaster(2025);
// → 2025-04-20

DateTime goodFriday  = easter.AddDays(-2);
DateTime holyThurs   = easter.AddDays(-3);
DateTime easterMonday = easter.AddDays(1);
```

**Signature:** `static DateTime GetEaster(int year)`

The algorithm correctly handles all years from 1583 onwards (the start of the Gregorian calendar). Passing a year before 1583 throws `ArgumentOutOfRangeException` (pre-Gregorian calendar). No external dependencies required.

### Countries using Easter-based holidays

All Latin American providers, and most European providers, use `EasterCalculator` for movable holidays including:

- **Carnival** (Fat Tuesday, 47 days before Easter)
- **Palm Sunday** (7 days before Easter)
- **Maundy Thursday** (3 days before Easter)
- **Good Friday** (2 days before Easter)
- **Holy Saturday** (1 day before Easter)
- **Easter Sunday**
- **Easter Monday** (1 day after Easter)
- **Ascension Thursday** (39 days after Easter)
- **Whit Sunday / Pentecost** (49 days after Easter)
- **Corpus Christi** (60 days after Easter)

## Country-Specific Behavior

### Argentina (AR)

Easter Sunday is typed as `HolidayType.Observance` in the Argentina provider. Observance holidays are excluded from `IsHoliday()` national checks, so `IsHoliday("AR", easterDate)` returns `false` for Easter Sunday.

### Chile (CL)

Indigenous Peoples Day is a movable holiday determined by the astronomical solstice cycle. It falls on **June 20** in leap years near the solstice cycle, and **June 21** otherwise.

### Honduras (HN)

The Honduras provider includes:
- **Sep 17 — Día del Maestro** (fixed civic holiday)
- **Easter Sunday** (movable, Easter-based)

## Implementing a Custom Provider

```csharp
public class CompanyHolidayProvider : IHolidayProvider
{
    public string CountryCode => "INTERNAL";

    public IEnumerable<HolidayInfo> GetHolidays(int year)
    {
        yield return new HolidayInfo
        {
            Name      = "Company Foundation Day",
            LocalName = "Día de Fundación",
            Date      = new DateTime(year, 6, 15),
            Country   = CountryCode,
            Type      = HolidayType.Optional,
            IsFixed   = true,
        };

        // Dynamic holiday: first Monday in March
        var firstMonday = Enumerable
            .Range(1, 7)
            .Select(d => new DateTime(year, 3, d))
            .First(d => d.DayOfWeek == DayOfWeek.Monday);

        yield return new HolidayInfo
        {
            Name    = "Team Day",
            Date    = firstMonday,
            Country = CountryCode,
            Type    = HolidayType.Optional,
            IsFixed = false,
        };
    }
}

// Register:
holiday.Register(new CompanyHolidayProvider());
```
