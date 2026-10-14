---
id: introduction
title: Introducción
sidebar_label: Introducción
slug: /introduction
description: Vali-Tempo es un ecosistema .NET modular para la precisión temporal — 12 paquetes NuGet especializados que cubren conversiones de tiempo, rangos de fechas, calendarios, duraciones, programación, feriados, horario laboral, buckets de series temporales y manejo de zonas horarias para .NET 6, 7, 8, 9 y 10.
keywords: [.NET, NuGet, biblioteca de tiempo, manejo de fechas, calendario, zona horaria, horario laboral, buckets, C#, Vali-Tempo]
---

# Introducción

**Vali-Tempo** es un ecosistema .NET modular construido para la precisión temporal. Ofrece doce paquetes NuGet especializados que cubren todos los aspectos del manejo de fechas, horas, calendarios, duraciones, programación, feriados, horario laboral, agrupación de series temporales y zonas horarias — todos diseñados para funcionar en conjunto a través de una sola llamada de inyección de dependencias, o de forma independiente como utilidades autónomas.

## ¿Por qué Vali-Tempo?

Trabajar con el tiempo en .NET es sorprendentemente frágil. La BCL proporciona `DateTime`, `TimeSpan` y `DateTimeOffset` — pero te deja implementar patrones comunes como:

- Convertir entre unidades de tiempo con precisión decimal
- Consultar días laborables considerando feriados específicos de cada país
- Calcular edades exactas a partir de fechas de nacimiento (especialmente cerca del 29 de febrero)
- Construir horarios recurrentes con reglas de recurrencia complejas
- Convertir entre zonas horarias IANA con conciencia de horario de verano
- Enumerar, dividir y combinar rangos de fechas

Vali-Tempo resuelve todo esto con una API coherente y compatible con DI, distribuida en once módulos especializados, más un meta-paquete que los integra todos.

## Ecosistema de módulos

| Paquete | Descripción | Tipo clave |
|---|---|---|
| **Vali-Time** | Conversiones de unidades de tiempo y formateo con precisión decimal | `IValiTime`, `IValiDate` |
| **Vali-Range** | Operaciones con rangos de fechas: unión, intersección, brechas, división, enumeración, resta | `IValiRange`, `DateRange` |
| **Vali-Calendar** | Calendario laboral con soporte para proveedores de feriados intercambiables | `IValiCalendar`, `CalendarWeek` |
| **Vali-Duration** | Tipo de valor `Duration` decimal de alta precisión, parseable desde strings | `ValiDuration` |
| **Vali-CountDown** | Seguimiento de plazos, cuenta regresiva y utilidades de progreso | `IValiCountdown` |
| **Vali-Age** | Cálculo de edad a partir de una fecha de nacimiento, con formateo relativo humanizado | `IValiAge`, `AgeResult` |
| **Vali-Schedule** | Constructor fluido para horarios recurrentes, más un motor de cron | `IValiSchedule` |
| **Vali-Holiday** | Datos de feriados de más de 35 países con feriados móviles basados en Pascua | `IValiHoliday`, `HolidayInfo` |
| **Vali-TimeZone** | Conversión de más de 45 zonas horarias IANA seleccionadas con soporte para horario de verano | `IValiTimeZone`, `ValiZoneInfo` |
| **Vali-BusinessHours** | Solapamiento de horario laboral entre zonas horarias, correcto con DST y cruces de medianoche | `IValiBusinessHours` |
| **Vali-Bucket** | Agrupación y agregación de series temporales en buckets de tamaño fijo alineados a un ancla | `IValiBucket` |
| **Vali-Tempo** | Meta-paquete — incluye los 11 módulos anteriores | — |

## Descripción general de la arquitectura

Los once servicios se registran como **singletons** en el contenedor de DI. No comparten estado mutable entre llamadas, lo que los hace seguros para su uso concurrente durante toda la vida útil de la aplicación.

```
AddValiTempo()
    ├── IValiTime          (Vali-Time)
    ├── IValiDate          (Vali-Time)
    ├── IValiRange         (Vali-Range)
    ├── IValiCalendar      (Vali-Calendar)
    ├── IValiCountdown     (Vali-CountDown)
    ├── IValiAge           (Vali-Age)
    ├── IValiSchedule      (Vali-Schedule)
    ├── IValiHoliday       (Vali-Holiday)
    ├── IValiTimeZone      (Vali-TimeZone)
    ├── IValiBusinessHours (Vali-BusinessHours)
    └── IValiBucket        (Vali-Bucket)
```

:::info Independencia de módulos
Cada paquete también puede instalarse y usarse de forma independiente. No necesitas el meta-paquete para usar un solo módulo.
:::

## Configuración de DI

Instala el meta-paquete:

```bash
dotnet add package Vali-Tempo
```

Registra todos los servicios en `Program.cs`:

```csharp
builder.Services.AddValiTempo();
```

Esta única llamada registra los once servicios. Ahora puedes inyectar cualquiera de ellos:

```csharp
public class ReportService(
    IValiDate date,
    IValiAge age,
    IValiHoliday holiday,
    IValiTimeZone tz)
{
    public void GenerateReport(DateTime birthdate, DateTime deadline)
    {
        var userAge   = age.Years(birthdate);
        var daysLeft  = date.Diff(DateTime.Today, deadline, TimeUnit.Days);
        var isHoliday = holiday.IsHoliday(deadline, "PE");
        var localTime = tz.Convert(deadline, "America/Lima");
    }
}
```

## Características clave de un vistazo

- **Precisión decimal** — las conversiones de tiempo usan aritmética `decimal`, evitando la deriva de punto flotante
- **Tipos de valor** — `DateRange` y `ValiDuration` son structs; sin asignaciones en el heap para operaciones comunes
- **Diseño DI-first** — cada servicio se registra detrás de una interfaz, haciendo las pruebas triviales
- **Inteligencia de feriados** — feriados móviles basados en Pascua calculados algorítmicamente para más de 35 países
- **Soporte de zonas horarias IANA** — más de 45 zonas seleccionadas con horario de verano, diferencia de offsets y comparación de instantes
- **Programación fluida** — encadena `Every().On().At().StartingFrom()` para expresar reglas de recurrencia complejas
- **Rangos componibles** — unión, intersección, expansión, reducción, división, enumeración con una sola cadena de métodos

## Próximos pasos

- [Inicio rápido](./quick-start) — instala y ejecuta tu primer ejemplo en minutos
- [Descripción general de Vali-Time](./vali-time/overview) — conversiones y formateo de unidades de tiempo
- [Proveedores de Vali-Holiday](./vali-holiday/providers) — registra proveedores de feriados para tus países
- [Referencia de paquetes](./packages) — los 12 paquetes NuGet con enlaces y marcos de destino
