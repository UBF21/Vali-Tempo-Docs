---
id: quick-start
title: Inicio rápido
sidebar_label: Inicio rápido
slug: /quick-start
description: Comienza con Vali-Tempo en menos de cinco minutos. Instala mediante NuGet y registra todos los módulos con una sola llamada de inyección de dependencias en .NET 6, 7, 8, 9 o 10.
keywords: [Vali-Tempo, inicio rápido, instalación NuGet, inyección de dependencias, .NET, C#]
---

# Inicio rápido

Pon en marcha Vali-Tempo en menos de cinco minutos.

## 1. Instala el paquete

Para usar todos los módulos, instala el meta-paquete:

```bash
dotnet add package Vali-Tempo
```

Para instalar módulos individuales, agrega solo lo que necesitas:

```bash
dotnet add package Vali-Time
dotnet add package Vali-Range
dotnet add package Vali-Calendar
dotnet add package Vali-Duration
dotnet add package Vali-CountDown
dotnet add package Vali-Age
dotnet add package Vali-Schedule
dotnet add package Vali-Holiday
dotnet add package Vali-TimeZone
dotnet add package Vali-BusinessHours
dotnet add package Vali-Bucket
```

## 2. Registra los servicios

En `Program.cs` (o donde configures tu contenedor de DI), llama a `AddValiTempo()`:

```csharp
using ValiTempo.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Registra los 11 servicios de Vali-Tempo como singletons
builder.Services.AddValiTempo();

var app = builder.Build();
app.Run();
```

Si instalaste paquetes individuales, puedes registrarlos por separado:

```csharp
builder.Services.AddValiTime();
builder.Services.AddValiHoliday();
builder.Services.AddValiTimeZone();
```

## 3. Primeros ejemplos

### Conversión de unidades de tiempo

```csharp
public class TimerService(IValiTime time)
{
    public string FormatDuration(decimal totalSeconds)
    {
        // Convierte segundos a horas con 2 decimales
        decimal hours = time.Convert(totalSeconds, TimeUnit.Seconds, TimeUnit.Hours);

        // Obtiene la mejor unidad legible para humanos automáticamente
        TimeUnit best = time.GetBestUnit(totalSeconds, TimeUnit.Seconds);

        // Formatea con esa unidad
        return time.FormatTime(totalSeconds, TimeUnit.Seconds, 1);
        // → "2.5 minutes" o "1.3 hours", etc.
    }
}
```

### Diferencia de fechas

```csharp
public class ProjectService(IValiDate date)
{
    public void PrintDeadlineInfo(DateTime deadline)
    {
        decimal daysLeft = date.Diff(DateTime.Today, deadline, TimeUnit.Days);
        bool    isWeekend = date.IsWeekend(deadline);
        int     week = date.WeekOfYear(deadline);

        Console.WriteLine($"Days left: {daysLeft}");
        Console.WriteLine($"Deadline falls on weekend: {isWeekend}");
        Console.WriteLine($"Week of year: {week}");
    }
}
```

### Cálculo de edad

```csharp
public class UserService(IValiAge age)
{
    public void DisplayAge(DateTime birthdate)
    {
        int years = age.Years(birthdate);
        AgeResult exact = age.Exact(birthdate);
        bool isBirthday = age.IsBirthday(birthdate);

        Console.WriteLine($"Age: {years} years");
        Console.WriteLine($"Exact: {exact.Years}y {exact.Months}m {exact.Days}d");

        if (isBirthday)
            Console.WriteLine("Happy birthday!");

        DateTime next = age.NextBirthday(birthdate);
        int daysUntil = age.DaysUntilBirthday(birthdate);
        Console.WriteLine($"Next birthday: {next:MMM dd} ({daysUntil} days)");
    }
}
```

### Verificación de feriados

```csharp
public class CalendarService(IValiHoliday holiday, IValiCalendar calendar)
{
    public void SetupHolidays()
    {
        // Registra proveedores de feriados para tus países
        var providers = HolidayProviderFactory.CreateLatinAmerica();
        foreach (var provider in providers)
            holiday.Register(provider);
    }

    public bool IsWorkday(string country, DateTime date)
    {
        return !holiday.IsHoliday(date, country)
            && calendar.IsWorkday(date);
    }

    public IEnumerable<HolidayInfo> GetUpcomingHolidays(string country, DateTime from)
    {
        return holiday.GetHolidays(country, from.Year)
            .Where(h => h.Date >= from)
            .OrderBy(h => h.Date);
    }
}
```

### Conversión de zonas horarias

```csharp
public class MeetingService(IValiTimeZone tz)
{
    public void ScheduleGlobalMeeting(DateTime utcTime)
    {
        // Convierte a distintas representaciones de zona horaria
        DateTime lima    = tz.Convert(utcTime, "UTC", "America/Lima");
        DateTime madrid  = tz.Convert(utcTime, "UTC", "Europe/Madrid");
        DateTime tokyo   = tz.Convert(utcTime, "UTC", "Asia/Tokyo");

        Console.WriteLine($"Lima:   {lima:HH:mm}");
        Console.WriteLine($"Madrid: {madrid:HH:mm}");
        Console.WriteLine($"Tokyo:  {tokyo:HH:mm}");

        // Verifica el estado de horario de verano
        bool limaInDst   = tz.IsDst("America/Lima", lima);
        bool madridInDst = tz.IsDst("Europe/Madrid", madrid);
    }
}
```

## 4. Usar módulos específicos de forma autónoma

Si solo instalaste `Vali-Age`, puedes registrarlo directamente:

```csharp
builder.Services.AddValiAge();
```

Cada módulo incluye su propio método de extensión: `AddValiTime()`, `AddValiRange()`, `AddValiCalendar()`, `AddValiDuration()`, `AddValiCountdown()`, `AddValiAge()`, `AddValiSchedule()`, `AddValiHoliday()`, `AddValiTimeZone()`, `AddValiBusinessHours()`, `AddValiBucket()`.

## 5. Pruebas

Como cada servicio se registra detrás de una interfaz, crear mocks es trivial:

```csharp
var mockAge = new Mock<IValiAge>();
mockAge.Setup(a => a.Years(It.IsAny<DateTime>())).Returns(30);

var service = new UserService(mockAge.Object);
service.DisplayAge(new DateTime(1993, 5, 10));
```

## Próximos pasos

- [Vali-Time](./vali-time/overview) — conversiones, formateo, análisis
- [Vali-Date](./vali-time/vali-date) — diferencia, suma, resta, trimestres, semanas
- [Proveedores de Vali-Holiday](./vali-holiday/providers) — registra proveedores de feriados para más de 35 países
- [Vali-Schedule](./vali-schedule/overview) — construye horarios recurrentes de forma fluida
- [Referencia de paquetes](./packages) — los 12 paquetes NuGet
