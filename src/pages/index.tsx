import type { ReactNode } from 'react';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import type { LucideIcon } from 'lucide-react';
import {
  Timer, CalendarDays, CalendarRange, CalendarCheck2, Hourglass, AlarmClock,
  Cake, Repeat, Flag, Globe, Building2, Boxes,
} from 'lucide-react';

import styles from './index.module.css';

// ─── Feature data ────────────────────────────────────────────────────────────

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Timer,
    title: 'Vali-Time',
    description:
      'High-precision time unit conversions with decimal accuracy. Convert between milliseconds, seconds, minutes, hours, days and more. Format, clamp, compare and break down durations.',
  },
  {
    icon: CalendarDays,
    title: 'Vali-Date',
    description:
      'Full date arithmetic — diff, add, subtract, startOf, endOf, isWeekend, isLeapYear, weekOfYear, dayOfYear, progress in year/month and quarter operations.',
  },
  {
    icon: CalendarRange,
    title: 'Vali-Range',
    description:
      'Expressive date range operations: union, intersection, gaps, split by day/week/month/quarter. Enumerate workdays, expand, shrink, shift and merge ranges fluently.',
  },
  {
    icon: CalendarCheck2,
    title: 'Vali-Calendar',
    description:
      'Workday calendar with pluggable holiday provider support. Calculate workdays between dates, add workdays, query weeks and months, and detect first/last day boundaries.',
  },
  {
    icon: Hourglass,
    title: 'Vali-Duration',
    description:
      'High-precision decimal Duration value type. Factory methods from milliseconds to years, full arithmetic operators, TimeSpan interop, formatting and unit conversion.',
  },
  {
    icon: AlarmClock,
    title: 'Vali-CountDown',
    description:
      'Deadline tracking and countdown utilities. Measure time until/since a reference point, report progress as a percentage, and format a human-readable breakdown.',
  },
  {
    icon: Cake,
    title: 'Vali-Age',
    description:
      'Age calculation from a birthdate. Get years, exact breakdown, formatted strings, relative descriptions, birthday detection, next/previous birthday and days until birthday.',
  },
  {
    icon: Repeat,
    title: 'Vali-Schedule',
    description:
      'Fluent builder for recurring schedules — daily, weekly, monthly, yearly, plus a Cron engine. Query next/previous occurrences, enumerate occurrences in a range, and skip weekends/holidays.',
  },
  {
    icon: Flag,
    title: 'Vali-Holiday',
    description:
      '38+ country holiday data with Easter-based movable holidays. Register providers, check if a date is a holiday in one or more countries, get next/previous holidays and observed dates.',
  },
  {
    icon: Globe,
    title: 'Vali-TimeZone',
    description:
      '45+ curated IANA timezone zones. Convert between zones, handle DST, compute offset differences, find zones by country, format with zone info and compare instants.',
  },
  {
    icon: Building2,
    title: 'Vali-BusinessHours',
    description:
      'Cross-timezone business-hours overlap, DST-correct and midnight-crossing aware. Find overlapping windows between two offices and restrict them to workdays.',
  },
  {
    icon: Boxes,
    title: 'Vali-Bucket',
    description:
      'Fixed-size, anchor-aligned time-series bucketing and aggregation. Group events into buckets and aggregate values — sum, average, min, max, count.',
  },
];

const FEATURES_ES: Feature[] = [
  {
    icon: Timer,
    title: 'Vali-Time',
    description:
      'Conversiones de unidades de tiempo con precisión decimal. Convierte entre milisegundos, segundos, minutos, horas, días y más. Formatea, limita, compara y desglosa duraciones.',
  },
  {
    icon: CalendarDays,
    title: 'Vali-Date',
    description:
      'Aritmética de fechas completa — diff, add, subtract, startOf, endOf, isWeekend, isLeapYear, weekOfYear, dayOfYear, progreso en año/mes y operaciones trimestrales.',
  },
  {
    icon: CalendarRange,
    title: 'Vali-Range',
    description:
      'Operaciones de rango de fechas expresivas: unión, intersección, huecos, división por día/semana/mes/trimestre. Enumera días laborables, expande, contrae, desplaza y fusiona rangos.',
  },
  {
    icon: CalendarCheck2,
    title: 'Vali-Calendar',
    description:
      'Calendario laboral con soporte de proveedor de festivos conectable. Calcula días laborables entre fechas, agrega días laborables, consulta semanas y meses, y detecta límites de primer/último día.',
  },
  {
    icon: Hourglass,
    title: 'Vali-Duration',
    description:
      'Tipo de valor Duration decimal de alta precisión. Métodos de fábrica de milisegundos a años, operadores aritméticos completos, interoperabilidad con TimeSpan, formateo y conversión de unidades.',
  },
  {
    icon: AlarmClock,
    title: 'Vali-CountDown',
    description:
      'Seguimiento de plazos y utilidades de cuenta regresiva. Mide el tiempo hasta/desde un punto de referencia, reporta el progreso como porcentaje y formatea un desglose legible.',
  },
  {
    icon: Cake,
    title: 'Vali-Age',
    description:
      'Cálculo de edad desde una fecha de nacimiento. Obtén años, desglose exacto, cadenas formateadas, descripciones relativas, detección de cumpleaños, próximo/anterior cumpleaños y días hasta el cumpleaños.',
  },
  {
    icon: Repeat,
    title: 'Vali-Schedule',
    description:
      'Constructor fluido para programaciones recurrentes — diaria, semanal, mensual, anual, además de un motor Cron. Consulta próximas/anteriores ocurrencias, enumera ocurrencias en un rango y omite fines de semana/festivos.',
  },
  {
    icon: Flag,
    title: 'Vali-Holiday',
    description:
      'Datos de festivos de 38+ países con festivos móviles basados en Pascua. Registra proveedores, verifica si una fecha es festivo en uno o varios países, obtén próximos/anteriores festivos y fechas observadas.',
  },
  {
    icon: Globe,
    title: 'Vali-TimeZone',
    description:
      '45+ zonas IANA curadas. Convierte entre zonas, gestiona el horario de verano (DST), calcula diferencias de offset, encuentra zonas por país, formatea con información de zona y compara instantes.',
  },
  {
    icon: Building2,
    title: 'Vali-BusinessHours',
    description:
      'Solapamiento de horario laboral entre zonas horarias, correcto con DST y cruces de medianoche. Encuentra ventanas solapadas entre dos oficinas y restríngelas a días laborables.',
  },
  {
    icon: Boxes,
    title: 'Vali-Bucket',
    description:
      'Agrupación y agregación de series temporales en buckets de tamaño fijo alineados a un ancla. Agrupa eventos en buckets y agrega valores — suma, promedio, mínimo, máximo, conteo.',
  },
];

// ─── Package data ─────────────────────────────────────────────────────────────

interface Package {
  name: string;
  description: string;
  nuget: string;
}

const PACKAGES: Package[] = [
  { name: 'Vali-Time',     description: 'Time unit conversions with decimal precision. ValiTime + ValiDate classes.',             nuget: 'https://www.nuget.org/packages/Vali-Time' },
  { name: 'Vali-Range',    description: 'Date range operations — union, intersection, gaps, split, enumerate workdays.',          nuget: 'https://www.nuget.org/packages/Vali-Range' },
  { name: 'Vali-Calendar', description: 'Workday calendar engine with pluggable holiday provider support.',                        nuget: 'https://www.nuget.org/packages/Vali-Calendar' },
  { name: 'Vali-Duration', description: 'High-precision decimal Duration value type with full arithmetic operators.',              nuget: 'https://www.nuget.org/packages/Vali-Duration' },
  { name: 'Vali-CountDown',description: 'Deadline tracking, countdown utilities, progress and breakdown.',                        nuget: 'https://www.nuget.org/packages/Vali-CountDown' },
  { name: 'Vali-Age',      description: 'Age calculation from birthdate. AgeResult struct with years, months, days.',             nuget: 'https://www.nuget.org/packages/Vali-Age' },
  { name: 'Vali-Schedule', description: 'Fluent builder for recurring schedules — daily, weekly, monthly, yearly.',               nuget: 'https://www.nuget.org/packages/Vali-Schedule' },
  { name: 'Vali-Holiday',  description: '35+ country holiday data with Easter-based movable holidays and IHolidayProvider.',      nuget: 'https://www.nuget.org/packages/Vali-Holiday' },
  { name: 'Vali-TimeZone', description: '45+ curated IANA timezone zones with DST support and offset computation.',               nuget: 'https://www.nuget.org/packages/Vali-TimeZone' },
  { name: 'Vali-BusinessHours', description: 'Cross-timezone business-hours overlap, DST-correct and midnight-crossing aware.',   nuget: 'https://www.nuget.org/packages/Vali-BusinessHours' },
  { name: 'Vali-Bucket',   description: 'Fixed-size, anchor-aligned time-series bucketing and aggregation.',                      nuget: 'https://www.nuget.org/packages/Vali-Bucket' },
  { name: 'Vali-Tempo',    description: 'Meta-package that includes all 11 modules. One install, one AddValiTempo() call.',       nuget: 'https://www.nuget.org/packages/Vali-Tempo' },
];

const PACKAGES_ES: Package[] = [
  { name: 'Vali-Time',     description: 'Conversiones de unidades de tiempo con precisión decimal. Clases ValiTime + ValiDate.',                 nuget: 'https://www.nuget.org/packages/Vali-Time' },
  { name: 'Vali-Range',    description: 'Operaciones de rango de fechas — unión, intersección, huecos, división, enumeración de días laborables.', nuget: 'https://www.nuget.org/packages/Vali-Range' },
  { name: 'Vali-Calendar', description: 'Motor de calendario laboral con soporte de proveedor de festivos conectable.',                              nuget: 'https://www.nuget.org/packages/Vali-Calendar' },
  { name: 'Vali-Duration', description: 'Tipo de valor Duration decimal de alta precisión con operadores aritméticos completos.',                    nuget: 'https://www.nuget.org/packages/Vali-Duration' },
  { name: 'Vali-CountDown',description: 'Seguimiento de plazos, utilidades de cuenta regresiva, progreso y desglose.',                              nuget: 'https://www.nuget.org/packages/Vali-CountDown' },
  { name: 'Vali-Age',      description: 'Cálculo de edad desde fecha de nacimiento. Struct AgeResult con años, meses, días.',                       nuget: 'https://www.nuget.org/packages/Vali-Age' },
  { name: 'Vali-Schedule', description: 'Constructor fluido para programaciones recurrentes — diaria, semanal, mensual, anual.',                    nuget: 'https://www.nuget.org/packages/Vali-Schedule' },
  { name: 'Vali-Holiday',  description: 'Datos de festivos de 35+ países con festivos móviles basados en Pascua e IHolidayProvider.',               nuget: 'https://www.nuget.org/packages/Vali-Holiday' },
  { name: 'Vali-TimeZone', description: '45+ zonas IANA curadas con soporte DST y cálculo de offset.',                                             nuget: 'https://www.nuget.org/packages/Vali-TimeZone' },
  { name: 'Vali-BusinessHours', description: 'Solapamiento de horario laboral entre zonas horarias, correcto con DST y cruces de medianoche.',     nuget: 'https://www.nuget.org/packages/Vali-BusinessHours' },
  { name: 'Vali-Bucket',   description: 'Agrupación y agregación de series temporales en buckets de tamaño fijo alineados a un ancla.',            nuget: 'https://www.nuget.org/packages/Vali-Bucket' },
  { name: 'Vali-Tempo',    description: 'Meta-paquete que incluye los 11 módulos. Una instalación, una llamada AddValiTempo().',                    nuget: 'https://www.nuget.org/packages/Vali-Tempo' },
];


// ─── Translations ─────────────────────────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    heroBadge: '38+ countries · 45+ IANA zones · .NET 8/9/10',
    heroTagline: 'time precision for .NET — dates, calendars & timezones',
    heroSubtitle: 'Eleven modules. One ecosystem. Precision time.',
    heroModulesLabel: 'Available modules',
    statModules: 'modules',
    statCountries: 'countries',
    statSupported: 'supported',
    ctaGetStarted: 'Get started →',
    ctaReadDocs: 'Read the docs',
    featuresSectionTitle: 'Everything you need for precise time handling',
    featuresSectionSubtitle: 'Built for .NET developers who need accurate date, time, and timezone operations.',
    pipelineBadge: 'precision ecosystem',
    pipelineTitle: 'Eleven modules. One time ecosystem.',
    pipelineSubtitle: 'Eleven focused packages. Use one or all — they compose naturally.',
    packagesSectionTitle: '12 NuGet packages. Install only what you need.',
    packagesSectionSubtitle: 'Each package is independent — add the modules your project requires, or grab Vali-Tempo for the full suite.',
    authorBuiltBy: 'Built by',
    authorBio: '.NET developer and open-source contributor. Also the author of',
    seoTitle: 'Vali-Tempo — Time Precision for .NET',
    seoDesc: 'Modular .NET ecosystem for time, dates, calendars and timezones. 12 NuGet packages covering time conversions, date ranges, workday calendars, durations, schedules, holidays, business hours, time buckets and IANA timezone support for .NET 6, 7, 8, 9 & 10.',
    workingDay: '✗ working day',
    holiday: '✓ holiday',
    overlappingDays: '3 overlapping days',
    workdays: 'workdays',
    nextLabel: 'next:',
    yearsLabel: 'years',
    daysRemaining: 'd remaining',
    codeComment: '// Inject what you need',
    copyAriaLabel: 'Copy code',
    copyToClipboard: 'Copy to clipboard',
  },
  es: {
    heroBadge: '38+ países · 45+ zonas IANA · .NET 8/9/10',
    heroTagline: 'precisión de tiempo para .NET — fechas, calendarios y zonas horarias',
    heroSubtitle: 'Once módulos. Un ecosistema. Precisión temporal.',
    heroModulesLabel: 'Módulos disponibles',
    statModules: 'módulos',
    statCountries: 'países',
    statSupported: 'compatible',
    ctaGetStarted: 'Comenzar →',
    ctaReadDocs: 'Leer la documentación',
    featuresSectionTitle: 'Todo lo que necesitas para el manejo preciso del tiempo',
    featuresSectionSubtitle: 'Construido para desarrolladores .NET que necesitan operaciones precisas de fecha, tiempo y zona horaria.',
    pipelineBadge: 'ecosistema de precisión',
    pipelineTitle: 'Once módulos. Un ecosistema de tiempo.',
    pipelineSubtitle: 'Once paquetes especializados. Úsalos individualmente o todos juntos — se combinan naturalmente.',
    packagesSectionTitle: '12 paquetes NuGet. Instala solo lo que necesitas.',
    packagesSectionSubtitle: 'Cada paquete es independiente — agrega los módulos que tu proyecto requiere, o usa Vali-Tempo para la suite completa.',
    authorBuiltBy: 'Desarrollado por',
    authorBio: 'Desarrollador .NET y contribuidor de código abierto. También autor de',
    seoTitle: 'Vali-Tempo — Precisión de Tiempo para .NET',
    seoDesc: 'Ecosistema modular .NET para tiempo, fechas, calendarios y zonas horarias. 12 paquetes NuGet para conversiones de tiempo, rangos de fechas, calendarios laborales, duraciones, programación, festivos, horario laboral, buckets de series temporales y soporte IANA para .NET 6, 7, 8, 9 y 10.',
    workingDay: '✗ día laboral',
    holiday: '✓ festivo',
    overlappingDays: '3 días solapados',
    workdays: 'días laborables',
    nextLabel: 'próximo:',
    yearsLabel: 'años',
    daysRemaining: 'd restantes',
    codeComment: '// Inyecta lo que necesites',
    copyAriaLabel: 'Copiar código',
    copyToClipboard: 'Copiar al portapapeles',
  },
} as const;

type Locale = keyof typeof TRANSLATIONS;
function useT() {
  const { i18n } = useDocusaurusContext();
  const locale = (i18n.currentLocale === 'es' ? 'es' : 'en') as Locale;
  return { t: TRANSLATIONS[locale], locale };
}

// ─── Canvas particle system ───────────────────────────────────────────────────

function useParticles(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      color: string;
      alpha: number;
    }

    const COLORS = ['rgba(124,58,237,', 'rgba(167,139,250,', 'rgba(251,191,36,'];
    let particles: Particle[] = [];

    function resize() {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function spawn(): Particle {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        color: c,
        alpha: Math.random() * 0.5 + 0.2,
      };
    }

    function init() {
      const count = Math.floor((w * h) / 8000);
      particles = Array.from({ length: Math.min(count, 90) }, spawn);
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124,58,237,${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, `${p.color}${p.alpha})`);
        grad.addColorStop(1, `${p.color}0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.fillStyle = `${p.color}${p.alpha + 0.3})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [canvasRef]);
}

// ─── Syntax-highlighted C# code ──────────────────────────────────────────────

type Token = { text: string; cls: string };

const CODE_TOKENS: Token[][] = [
  [{ text: 'builder', cls: 'cVar' }, { text: '.', cls: 'cPunc' }, { text: 'Services', cls: 'cType' }, { text: '.', cls: 'cPunc' }, { text: 'AddValiTempo', cls: 'cMethod' }, { text: '();', cls: 'cPunc' }],
  [],
  [{ text: '// Inject what you need', cls: 'cComment' }],
  [{ text: 'public', cls: 'cKw' }, { text: ' class ', cls: 'cPunc' }, { text: 'ScheduleService', cls: 'cType' }, { text: '(', cls: 'cPunc' }],
  [{ text: '    ', cls: 'cPunc' }, { text: 'IValiTime', cls: 'cType' }, { text: ' time,', cls: 'cPunc' }],
  [{ text: '    ', cls: 'cPunc' }, { text: 'IValiDate', cls: 'cType' }, { text: ' date,', cls: 'cPunc' }],
  [{ text: '    ', cls: 'cPunc' }, { text: 'IValiHoliday', cls: 'cType' }, { text: ' holiday,', cls: 'cPunc' }],
  [{ text: '    ', cls: 'cPunc' }, { text: 'IValiTimeZone', cls: 'cType' }, { text: ' tz) {', cls: 'cPunc' }],
  [{ text: '  ', cls: 'cPunc' }, { text: 'public', cls: 'cKw' }, { text: ' bool ', cls: 'cPunc' }, { text: 'IsBusinessHour', cls: 'cMethod' }, { text: '(', cls: 'cPunc' }, { text: 'string', cls: 'cKw' }, { text: ' zone)', cls: 'cPunc' }],
  [{ text: '    => !', cls: 'cPunc' }, { text: 'holiday', cls: 'cVar' }, { text: '.', cls: 'cPunc' }, { text: 'IsHoliday', cls: 'cMethod' }, { text: '(', cls: 'cPunc' }, { text: 'DateTime', cls: 'cType' }, { text: '.', cls: 'cPunc' }, { text: 'Today', cls: 'cProp' }, { text: ', ', cls: 'cPunc' }, { text: '"PE"', cls: 'cString' }, { text: ')', cls: 'cPunc' }],
  [{ text: '        && ', cls: 'cPunc' }, { text: 'time', cls: 'cVar' }, { text: '.', cls: 'cPunc' }, { text: 'Convert', cls: 'cMethod' }, { text: '(', cls: 'cPunc' }, { text: '9', cls: 'cNum' }, { text: ', ', cls: 'cPunc' }, { text: 'TimeUnit', cls: 'cType' }, { text: '.', cls: 'cPunc' }, { text: 'Hours', cls: 'cProp' }, { text: ', ', cls: 'cPunc' }, { text: 'TimeUnit', cls: 'cType' }, { text: '.', cls: 'cPunc' }, { text: 'Minutes', cls: 'cProp' }, { text: ')', cls: 'cPunc' }],
  [{ text: '            <= ', cls: 'cPunc' }, { text: 'tz', cls: 'cVar' }, { text: '.', cls: 'cPunc' }, { text: 'Now', cls: 'cMethod' }, { text: '(zone).', cls: 'cPunc' }, { text: 'TimeOfDay', cls: 'cProp' }, { text: '.', cls: 'cPunc' }, { text: 'TotalMinutes', cls: 'cProp' }, { text: ';', cls: 'cPunc' }],
  [{ text: '}', cls: 'cPunc' }],
];

function CodeBlock(): ReactNode {
  const [copied, setCopied] = useState(false);
  const { t } = useT();
  // Build tokens dynamically so the comment is translated
  const tokens: Token[][] = [
    CODE_TOKENS[0],
    CODE_TOKENS[1],
    [{ text: t.codeComment, cls: 'cComment' }],
    ...CODE_TOKENS.slice(3),
  ];
  const raw = `builder.Services.AddValiTempo();

${t.codeComment}
public class ScheduleService(
    IValiTime time,
    IValiDate date,
    IValiHoliday holiday,
    IValiTimeZone tz) {
  public bool IsBusinessHour(string zone)
    => !holiday.IsHoliday(DateTime.Today, "PE")
        && time.Convert(9, TimeUnit.Hours, TimeUnit.Minutes)
            <= tz.Now(zone).TimeOfDay.TotalMinutes;
}`;

  return (
    <div className={styles.codeCard}>
      {/* Window chrome */}
      <div className={styles.codeChrome}>
        <span className={styles.chromeDot} data-color="red" />
        <span className={styles.chromeDot} data-color="yellow" />
        <span className={styles.chromeDot} data-color="green" />
        <span className={styles.codeFile}>Program.cs</span>
        <button
          className={styles.codeCopyBtn}
          onClick={() => {
            navigator.clipboard.writeText(raw).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}
          aria-label={t.copyAriaLabel}
        >
          {copied ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>

      {/* Code */}
      <div className={styles.codeBody}>
        <div className={styles.codeLineNumbers}>
          {tokens.map((_, i) => (
            <span key={i} className={styles.codeLineNum}>{i + 1}</span>
          ))}
        </div>
        <pre className={styles.codePre}>
          <code>
            {tokens.map((line, li) => (
              <div key={li} className={styles.codeLine}>
                {line.map((tok, ti) => (
                  <span key={ti} className={styles[tok.cls]}>{tok.text}</span>
                ))}
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Bottom glow bar */}
      <div className={styles.codeGlowBar} />
    </div>
  );
}

// ─── Live Clock Panel ─────────────────────────────────────────────────────────

function LiveClockPanel(): ReactNode {
  const [now, setNow] = useState<Date | null>(null);
  const { t, locale } = useT();

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const sec   = now ? now.getSeconds() : 0;
  const min   = now ? now.getMinutes() : 0;
  const hr    = now ? now.getHours() % 12 : 0;
  const secA  = sec * 6 - 90;
  const minA  = min * 6 + sec * 0.1 - 90;
  const hrA   = hr * 30 + min * 0.5 - 90;
  const toRad = (d: number) => d * Math.PI / 180;
  const cx = 100, cy = 100;

  const localeStr = locale === 'es' ? 'es-ES' : 'en-US';
  const timeStr = now
    ? now.toLocaleTimeString(localeStr, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  // Next monday
  const nextMonday = now ? (() => {
    const d = new Date(now);
    const day = d.getDay();
    const diff = day === 1 ? 7 : (8 - day) % 7;
    d.setDate(d.getDate() + diff);
    return d.toLocaleDateString(localeStr, { month: 'short', day: 'numeric' });
  })() : '—';

  // Days until next new year
  const daysUntilNY = now ? (() => {
    const ny = new Date(now.getFullYear() + 1, 0, 1);
    return Math.ceil((ny.getTime() - now.getTime()) / 86400000);
  })() : 0;

  // Workdays between today and 30 days from now
  const workdayEst = now ? Math.round(30 * 5 / 7) : 22;

  const API_CARDS = [
    {
      module: 'Vali-TimeZone',
      icon: Globe,
      call: 'Now("America/Lima")',
      result: timeStr,
      live: true,
    },
    {
      module: 'Vali-Holiday',
      icon: Flag,
      call: 'IsHoliday(Today, "US")',
      result: now ? (now.getMonth() === 11 && now.getDate() === 25 ? t.holiday : t.workingDay) : '—',
      live: true,
    },
    {
      module: 'Vali-Time',
      icon: Timer,
      call: 'Convert(90, Min, Hours)',
      result: '"1.50 h"',
      live: false,
    },
    {
      module: 'Vali-Range',
      icon: CalendarRange,
      call: 'Intersect(rangeA, rangeB)',
      result: t.overlappingDays,
      live: false,
    },
    {
      module: 'Vali-Calendar',
      icon: CalendarCheck2,
      call: 'WorkdaysIn(30d)',
      result: `~${workdayEst} ${t.workdays}`,
      live: false,
    },
    {
      module: 'Vali-Duration',
      icon: Hourglass,
      call: 'From(TimeSpan.FromHours(2))',
      result: '"2h 0m 0s"',
      live: false,
    },
    {
      module: 'Vali-Schedule',
      icon: Repeat,
      call: 'Every(1,Week).On(Mon)',
      result: `${t.nextLabel} ${nextMonday}`,
      live: true,
    },
    {
      module: 'Vali-Age',
      icon: Cake,
      call: 'Years(Jan 15, 1993)',
      result: `${now ? now.getFullYear() - 1993 : 33} ${t.yearsLabel}`,
      live: true,
    },
    {
      module: 'Vali-CountDown',
      icon: AlarmClock,
      call: 'TimeUntil(NewYear)',
      result: `${daysUntilNY}${t.daysRemaining}`,
      live: true,
    },
  ];

  return (
    <div className={styles.clockPanel}>
      {/* Analog clock */}
      <div className={styles.clockFaceWrap}>
        <svg className={styles.clockSvg} viewBox="0 0 200 200" fill="none" aria-label="Live clock">
          {/* Outer dashed ring */}
          <circle cx={cx} cy={cy} r="93" stroke="rgba(124,58,237,0.2)" strokeWidth="1" strokeDasharray="3 7"/>
          {/* Middle ring */}
          <circle cx={cx} cy={cy} r="80" stroke="rgba(124,58,237,0.12)" strokeWidth="1"/>
          {/* Inner ring */}
          <circle cx={cx} cy={cy} r="65" stroke="rgba(251,191,36,0.1)" strokeWidth="1" strokeDasharray="2 5"/>

          {/* 12 tick marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = toRad(i * 30 - 90);
            const isMajor = i % 3 === 0;
            const r1 = isMajor ? 73 : 76;
            return (
              <line key={i}
                x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
                x2={cx + 82 * Math.cos(a)} y2={cy + 82 * Math.sin(a)}
                stroke={isMajor ? 'rgba(251,191,36,0.6)' : 'rgba(124,58,237,0.35)'}
                strokeWidth={isMajor ? 2 : 1}
                strokeLinecap="round"
              />
            );
          })}

          {/* Hour hand */}
          <line
            x1={cx - 10 * Math.cos(toRad(hrA))} y1={cy - 10 * Math.sin(toRad(hrA))}
            x2={cx + 42 * Math.cos(toRad(hrA))} y2={cy + 42 * Math.sin(toRad(hrA))}
            stroke="#A78BFA" strokeWidth="3.5" strokeLinecap="round"
          />
          {/* Minute hand */}
          <line
            x1={cx - 12 * Math.cos(toRad(minA))} y1={cy - 12 * Math.sin(toRad(minA))}
            x2={cx + 60 * Math.cos(toRad(minA))} y2={cy + 60 * Math.sin(toRad(minA))}
            stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round"
          />
          {/* Second hand */}
          <line
            x1={cx - 14 * Math.cos(toRad(secA))} y1={cy - 14 * Math.sin(toRad(secA))}
            x2={cx + 70 * Math.cos(toRad(secA))} y2={cy + 70 * Math.sin(toRad(secA))}
            stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round"
          />

          {/* Center cap */}
          <circle cx={cx} cy={cy} r="5" fill="#7C3AED"/>
          <circle cx={cx} cy={cy} r="2.5" fill="#FBBF24"/>
        </svg>

        {/* Digital readout */}
        <div className={styles.clockDigital}>{timeStr}</div>
        <div className={styles.clockLabel}>ValiTimeZone.Now("local")</div>
      </div>

      {/* 6-card API grid */}
      <div className={styles.apiGrid}>
        {API_CARDS.map((card) => (
          <div key={card.module} className={styles.apiCard}>
            <div className={styles.apiCardHeader}>
              <card.icon className={styles.apiCardIcon} size={13} aria-hidden="true" />
              <span className={styles.apiCardModule}>{card.module}</span>
              {card.live && <span className={styles.apiCardLiveDot} />}
            </div>
            <code className={styles.apiCardCall}>{card.call}</code>
            <div className={styles.apiCardResult}>{card.result}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Module Ecosystem Section (premium animated) ──────────────────────────────

function ModuleSection(): ReactNode {
  const { t } = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  useParticles(canvasRef as React.RefObject<HTMLCanvasElement>);

  // GSAP entrance animation on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let gsapMod: typeof import('gsap') | null = null;

    import('gsap').then((mod) => {
      gsapMod = mod;
      const { gsap } = mod;

      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current) return;

        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
          }
        );

        gsap.fromTo(
          codeRef.current,
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.3,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          }
        );
      }).catch(() => {
        gsap.fromTo(headerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        gsap.fromTo(codeRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 });
      });
    });

    return () => {
      if (gsapMod) {
        try {
          // @ts-ignore
          gsapMod.gsap?.globalTimeline?.clear();
        } catch { /* ignore */ }
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.pipelineSection}>
      {/* Particle canvas */}
      <canvas ref={canvasRef as React.RefObject<HTMLCanvasElement>} className={styles.pipelineCanvas} aria-hidden="true" />

      {/* Ambient glows */}
      <div className={styles.pipelineGlow1} aria-hidden="true" />
      <div className={styles.pipelineGlow2} aria-hidden="true" />

      <div className={clsx('container', styles.pipelineContainer)}>
        {/* Header */}
        <div ref={headerRef} className={clsx(styles.sectionHeader, styles.pipelineHeader)}>
          <div className={styles.pipelineBadge}>
            <span className={styles.pipelineBadgePulse} />
            {t.pipelineBadge}
          </div>
          <h2 className={styles.sectionTitle}>{t.pipelineTitle}</h2>
          <p className={styles.sectionSubtitle}>
            {t.pipelineSubtitle}
          </p>
        </div>

        {/* Top: live clock + api cards */}
        <LiveClockPanel />

        {/* Bottom: code block */}
        <div ref={codeRef} className={styles.pipelineCodeCol}>
          <CodeBlock />
        </div>
      </div>
    </section>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FeatureCard({ icon: Icon, title, description, index }: Feature & { index: number }): ReactNode {
  const num = String(index + 1).padStart(2, '0');
  return (
    <div className={styles.featureCard}>
      <span className={styles.featureNumber}>{num}</span>
      <div className={styles.featureIconWrap}>
        <Icon className={styles.featureIconGlyph} size={20} aria-hidden="true" />
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}

function CopyButton({ text }: { text: string }): ReactNode {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={styles.copyButton}
      onClick={() => navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

function PackageCard({ name, description, nuget }: Package): ReactNode {
  const installCommand = `dotnet add package ${name}`;
  return (
    <div className={styles.packageCard}>
      <div className={styles.packageAccent} aria-hidden="true" />
      <div className={styles.packageHeader}>
        <a href={nuget} target="_blank" rel="noopener noreferrer" className={styles.packageName}>
          <span className={styles.packageChip}>{name}</span>
        </a>
      </div>
      <p className={styles.packageDescription}>{description}</p>
      <div className={styles.packageInstall}>
        <code className={styles.packageInstallCode}>{installCommand}</code>
        <CopyButton text={installCommand} />
      </div>
    </div>
  );
}

// ─── Clock Ring Decoration ────────────────────────────────────────────────────

function ClockRingDecoration(): ReactNode {
  return (
    <div className={styles.clockRing} aria-hidden="true">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer ring */}
        <circle cx="200" cy="200" r="190" stroke="rgba(124,58,237,0.15)" strokeWidth="1" strokeDasharray="4 8"/>
        {/* Mid ring */}
        <circle cx="200" cy="200" r="150" stroke="rgba(124,58,237,0.10)" strokeWidth="1"/>
        {/* Inner ring */}
        <circle cx="200" cy="200" r="110" stroke="rgba(251,191,36,0.12)" strokeWidth="1" strokeDasharray="2 6"/>
        {/* Tick marks at 12 positions */}
        {Array.from({length: 12}, (_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 200 + 185 * Math.cos(angle);
          const y1 = 200 + 185 * Math.sin(angle);
          const x2 = 200 + 175 * Math.cos(angle);
          const y2 = 200 + 175 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(124,58,237,0.3)" strokeWidth="2"/>;
        })}
        {/* Center dot */}
        <circle cx="200" cy="200" r="4" fill="rgba(251,191,36,0.4)"/>
        {/* Clock hand pointing to ~2 o'clock */}
        <line x1="200" y1="200" x2="260" y2="130" stroke="rgba(251,191,36,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="200" y1="200" x2="185" y2="240" stroke="rgba(124,58,237,0.3)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const MODULES = ['ValiTime', 'ValiDate', 'ValiRange', 'ValiCalendar', 'ValiDuration', 'ValiCountDown', 'ValiAge', 'ValiSchedule', 'ValiHoliday', 'ValiTimeZone', 'ValiBusinessHours', 'ValiBucket'];

function Hero(): ReactNode {
  const [copied, setCopied] = useState(false);
  const { t } = useT();
  const installCmd = 'dotnet add package Vali-Tempo';
  return (
    <section className={styles.hero}>
      {/* Radial circle grid background */}
      <div className={styles.heroGrid} aria-hidden="true" />
      <ClockRingDecoration />

      {/* Large floating orbs */}
      <div className={styles.heroOrb1} aria-hidden="true" />
      <div className={styles.heroOrb2} aria-hidden="true" />
      <div className={styles.heroOrb3} aria-hidden="true" />

      <div className={styles.heroInner}>
        {/* Badge */}
        <div className={styles.heroBadge}>
          <span className={styles.heroBadgePulse} />
          <span className={styles.heroBadgeDot} />
          {t.heroBadge}
        </div>

        {/* Title */}
        <h1 className={styles.heroTitle}>Vali-Tempo</h1>

        {/* Tagline */}
        <p className={styles.heroTagline}>
          <span className={styles.heroTaglineComment}>{'// '}</span>
          {t.heroTagline}
        </p>

        <p className={styles.heroSubtitle}>{t.heroSubtitle}</p>

        {/* Module pills marquee */}
        <div className={styles.heroProviders} aria-label={t.heroModulesLabel}>
          <div className={styles.heroProvidersTrack}>
            {[...MODULES, ...MODULES].map((m, i) => (
              <span key={i} className={styles.providerPill}>{m}</span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatValue}>11</span>
            <span className={styles.heroStatLabel}>{t.statModules}</span>
          </div>
          <div className={styles.heroStatDivider} aria-hidden="true" />
          <div className={styles.heroStat}>
            <span className={styles.heroStatValue}>38+</span>
            <span className={styles.heroStatLabel}>{t.statCountries}</span>
          </div>
          <div className={styles.heroStatDivider} aria-hidden="true" />
          <div className={styles.heroStat}>
            <span className={styles.heroStatValue}>.NET 8/9/10</span>
            <span className={styles.heroStatLabel}>{t.statSupported}</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className={styles.heroCta}>
          <Link className={clsx('button', styles.btnPrimary)} to="/docs/quick-start">{t.ctaGetStarted}</Link>
          <Link className={clsx('button', styles.btnSecondary)} to="/docs/introduction">{t.ctaReadDocs}</Link>
        </div>

        {/* Install block */}
        <div className={styles.heroInstallWrap}>
          <div className={styles.heroInstall}>
            <span className={styles.heroInstallPrompt}>$</span>
            <code className={styles.heroInstallCode}>{installCmd}</code>
            <button
              className={styles.heroInstallCopy}
              onClick={() => {
                navigator.clipboard.writeText(installCmd).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              aria-label={t.copyToClipboard}
            >
              {copied
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              }
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features section ─────────────────────────────────────────────────────────

function FeaturesSection(): ReactNode {
  const { t, locale } = useT();
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t.featuresSectionTitle}</h2>
          <p className={styles.sectionSubtitle}>{t.featuresSectionSubtitle}</p>
        </div>
        <div className={styles.featuresGrid}>
          {(locale === 'es' ? FEATURES_ES : FEATURES).map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Packages section ─────────────────────────────────────────────────────────

function PackagesSection(): ReactNode {
  const { t, locale } = useT();
  return (
    <section className={styles.packagesSection}>
      <div className={styles.packagesDivider} aria-hidden="true" />
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t.packagesSectionTitle}</h2>
          <p className={styles.sectionSubtitle}>{t.packagesSectionSubtitle}</p>
        </div>
        <div className={styles.packagesGrid}>
          {(locale === 'es' ? PACKAGES_ES : PACKAGES).map((p) => <PackageCard key={p.name} {...p} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Author section ───────────────────────────────────────────────────────────

function AuthorSection(): ReactNode {
  const { t } = useT();
  return (
    <section className={styles.authorSection}>
      <div className={styles.authorDivider} aria-hidden="true" />
      <div className="container">
        <div className={styles.authorCard}>
          <div className={styles.avatarRingWrap}>
            <div className={styles.avatarRing} aria-hidden="true" />
            <div className={styles.authorAvatar}>
              <span className={styles.authorAvatarInitials}>FM</span>
            </div>
          </div>
          <div className={styles.authorInfo}>
            <p className={styles.authorBuiltBy}>{t.authorBuiltBy}</p>
            <a href="https://github.com/UBF21" target="_blank" rel="noopener noreferrer" className={styles.authorName}>Felipe Montenegro</a>
            <p className={styles.authorBio}>{t.authorBio}{' '}<a href="https://github.com/UBF21/Vali-Blob" target="_blank" rel="noopener noreferrer" className={styles.authorLink}>Vali-Blob</a>.</p>
          </div>
          <div className={styles.authorLinks}>
            <a href="https://github.com/UBF21" target="_blank" rel="noopener noreferrer" className={clsx(styles.authorSocialLink, styles.authorSocialLinkGithub)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" /></svg>
              GitHub
            </a>
            <a href="https://www.nuget.org/profiles/UBF21" target="_blank" rel="noopener noreferrer" className={clsx(styles.authorSocialLink, styles.authorSocialLinkNuget)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 8.5v7L12 19.82 4 15.5v-7L12 4.18z"/></svg>
              NuGet
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

const SEO_DESC  = 'Modular .NET ecosystem for time, dates, calendars and timezones. 12 NuGet packages covering time conversions, date ranges, workday calendars, durations, schedules, holidays, business hours, time buckets and IANA timezone support for .NET 6, 7, 8, 9 & 10.';
const SEO_URL   = 'https://vali-tempo.github.io';
const SEO_IMAGE = `${SEO_URL}/img/docusaurus-social-card.jpg`;

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const { t } = useT();
  return (
    <>
      <Head>
        {/* Primary */}
        <title>{t.seoTitle}</title>
        <meta name="description" content={t.seoDesc} />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#7C3AED" />
        <link rel="canonical" href={SEO_URL} />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={SEO_URL} />
        <meta property="og:title"       content={t.seoTitle} />
        <meta property="og:description" content={t.seoDesc} />
        <meta property="og:image"       content={SEO_IMAGE} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale"          content="en_US" />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:site_name" content="Vali-Tempo" />

        {/* Twitter / X */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={t.seoTitle} />
        <meta name="twitter:description" content={t.seoDesc} />
        <meta name="twitter:image"       content={SEO_IMAGE} />

        {/* hreflang i18n */}
        <link rel="alternate" hrefLang="en" href={SEO_URL} />
        <link rel="alternate" hrefLang="es" href={`${SEO_URL}/es/`} />
        <link rel="alternate" hrefLang="x-default" href={SEO_URL} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Vali-Tempo",
          "description": SEO_DESC,
          "url": SEO_URL,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": ".NET 6, .NET 7, .NET 8, .NET 9, .NET 10",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "author": {
            "@type": "Organization",
            "name": "UBF21",
            "url": "https://github.com/UBF21"
          }
        })}</script>
      </Head>

      <Layout title={siteConfig.title} description={t.seoDesc}>
        <Hero />
        <main>
          <FeaturesSection />
          <ModuleSection />
          <PackagesSection />
          <AuthorSection />
        </main>
      </Layout>
    </>
  );
}
