---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
slug: /quick-start
---

# Quick Start

Get Vali-Tempo running in under five minutes.

## 1. Install the package

To use all modules, install the meta-package:

```bash
dotnet add package Vali-Tempo
```

To install individual modules, add only what you need:

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
```

## 2. Register services

In `Program.cs` (or wherever you configure your DI container), call `AddValiTempo()`:

```csharp
using ValiTempo.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Register all 9 Vali-Tempo services as singletons
builder.Services.AddValiTempo();

var app = builder.Build();
app.Run();
```

If you installed individual packages, you can register them separately:

```csharp
builder.Services.AddValiTime();
builder.Services.AddValiHoliday();
builder.Services.AddValiTimeZone();
```

## 3. First examples

### Time unit conversion

```csharp
public class TimerService(IValiTime time)
{
    public string FormatDuration(decimal totalSeconds)
    {
        // Convert seconds to hours with 2 decimal places
        decimal hours = time.Convert(totalSeconds, TimeUnit.Seconds, TimeUnit.Hours);

        // Get the best human-readable unit automatically
        TimeUnit best = time.GetBestUnit(totalSeconds, TimeUnit.Seconds);

        // Format with that unit
        return time.FormatTime(totalSeconds, TimeUnit.Seconds, 1);
        // → "2.5 minutes" or "1.3 hours" etc.
    }
}
```

### Date difference

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

### Age calculation

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

### Holiday checking

```csharp
public class CalendarService(IValiHoliday holiday, IValiCalendar calendar)
{
    public void SetupHolidays()
    {
        // Register holiday providers for your countries
        var providers = HolidayProviderFactory.CreateLatinAmerica();
        foreach (var provider in providers)
            holiday.Register(provider);
    }

    public bool IsWorkday(string country, DateTime date)
    {
        return !holiday.IsHoliday(country, date)
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

### Timezone conversion

```csharp
public class MeetingService(IValiTimeZone tz)
{
    public void ScheduleGlobalMeeting(DateTime utcTime)
    {
        // Convert to various timezone representations
        DateTime lima    = tz.Convert(utcTime, "UTC", "America/Lima");
        DateTime madrid  = tz.Convert(utcTime, "UTC", "Europe/Madrid");
        DateTime tokyo   = tz.Convert(utcTime, "UTC", "Asia/Tokyo");

        Console.WriteLine($"Lima:   {lima:HH:mm}");
        Console.WriteLine($"Madrid: {madrid:HH:mm}");
        Console.WriteLine($"Tokyo:  {tokyo:HH:mm}");

        // Check DST status
        bool limaInDst   = tz.IsDst("America/Lima", lima);
        bool madridInDst = tz.IsDst("Europe/Madrid", madrid);
    }
}
```

## 4. Using specific modules standalone

If you only installed `Vali-Age`, you can register it directly:

```csharp
builder.Services.AddValiAge();
```

Each module ships its own extension method: `AddValiTime()`, `AddValiRange()`, `AddValiCalendar()`, `AddValiDuration()`, `AddValiCountDown()`, `AddValiAge()`, `AddValiSchedule()`, `AddValiHoliday()`, `AddValiTimeZone()`.

## 5. Testing

Because every service is registered behind an interface, mocking is trivial:

```csharp
var mockAge = new Mock<IValiAge>();
mockAge.Setup(a => a.Years(It.IsAny<DateTime>())).Returns(30);

var service = new UserService(mockAge.Object);
service.DisplayAge(new DateTime(1993, 5, 10));
```

## Next Steps

- [Vali-Time](./vali-time/overview) — conversions, formatting, parsing
- [Vali-Date](./vali-time/vali-date) — diff, add, subtract, quarters, weeks
- [Vali-Holiday Providers](./vali-holiday/providers) — register 35+ country holiday providers
- [Vali-Schedule](./vali-schedule/overview) — build recurring schedules fluently
- [Packages Reference](./packages) — all 10 NuGet packages
