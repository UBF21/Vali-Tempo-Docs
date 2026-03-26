import type { ReactNode } from 'react';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

import styles from './index.module.css';

// ─── Feature data ────────────────────────────────────────────────────────────

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: '⏱',
    title: 'Vali-Time',
    description:
      'High-precision time unit conversions with decimal accuracy. Convert between milliseconds, seconds, minutes, hours, days and more. Format, clamp, compare and break down durations.',
  },
  {
    icon: '📅',
    title: 'Vali-Date',
    description:
      'Full date arithmetic — diff, add, subtract, startOf, endOf, isWeekend, isLeapYear, weekOfYear, dayOfYear, progress in year/month and quarter operations.',
  },
  {
    icon: '📆',
    title: 'Vali-Range',
    description:
      'Expressive date range operations: union, intersection, gaps, split by day/week/month/quarter. Enumerate workdays, expand, shrink, shift and merge ranges fluently.',
  },
  {
    icon: '🗓',
    title: 'Vali-Calendar',
    description:
      'Workday calendar with pluggable holiday provider support. Calculate workdays between dates, add workdays, query weeks and months, and detect first/last day boundaries.',
  },
  {
    icon: '⏳',
    title: 'Vali-Duration',
    description:
      'High-precision decimal Duration value type. Factory methods from milliseconds to years, full arithmetic operators, TimeSpan interop, formatting and unit conversion.',
  },
  {
    icon: '🎂',
    title: 'Vali-Age',
    description:
      'Age calculation from a birthdate. Get years, exact breakdown, formatted strings, relative descriptions, birthday detection, next/previous birthday and days until birthday.',
  },
  {
    icon: '🔄',
    title: 'Vali-Schedule',
    description:
      'Fluent builder for recurring schedules — daily, weekly, monthly, yearly. Query next/previous occurrences, enumerate occurrences in a range, and use custom predicates.',
  },
  {
    icon: '🌍',
    title: 'Vali-Holiday',
    description:
      '35+ country holiday data with Easter-based movable holidays. Register providers, check if a date is a holiday, get next/previous holidays and detect long weekends.',
  },
  {
    icon: '🌐',
    title: 'Vali-TimeZone',
    description:
      '45+ curated IANA timezone zones. Convert between zones, handle DST, compute offset differences, find zones by country, format with zone info and compare instants.',
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
  { name: 'Vali-Tempo',    description: 'Meta-package that includes all 9 modules. One install, one AddValiTempo() call.',        nuget: 'https://www.nuget.org/packages/Vali-Tempo' },
];

// ─── Module steps ─────────────────────────────────────────────────────────────

const MODULE_STEPS = [
  { label: 'ValiTime',     color: 'violet', icon: '⏱', desc: 'unit conversion · formatting' },
  { label: 'ValiDate',     color: 'violet', icon: '📅', desc: 'date arithmetic · quarters' },
  { label: 'ValiRange',    color: 'violet', icon: '📆', desc: 'union · intersection · gaps' },
  { label: 'ValiCalendar', color: 'violet', icon: '🗓', desc: 'workdays · weeks · months' },
  { label: 'ValiDuration', color: 'violet', icon: '⏳', desc: 'decimal · precision · interop' },
  { label: 'ValiAge',      color: 'violet', icon: '🎂', desc: 'years · months · birthdays' },
  { label: 'ValiSchedule', color: 'violet', icon: '🔄', desc: 'daily · weekly · monthly' },
  { label: 'ValiHoliday',  color: 'gold',   icon: '🌍', desc: '35+ countries · Easter' },
  { label: 'ValiTimeZone', color: 'gold',   icon: '🌐', desc: '45+ IANA zones · DST' },
];

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
  const raw = `builder.Services.AddValiTempo();

// Inject what you need
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
          aria-label="Copy code"
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
          {CODE_TOKENS.map((_, i) => (
            <span key={i} className={styles.codeLineNum}>{i + 1}</span>
          ))}
        </div>
        <pre className={styles.codePre}>
          <code>
            {CODE_TOKENS.map((line, li) => (
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

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const sec   = now ? now.getSeconds() : 0;
  const min   = now ? now.getMinutes() : 0;
  const hr    = now ? now.getHours() % 12 : 0;
  const secA  = sec * 6 - 90;
  const minA  = min * 6 + sec * 0.1 - 90;
  const hrA   = hr * 30 + min * 0.5 - 90;
  const toRad = (d: number) => d * Math.PI / 180;
  const cx = 100, cy = 100;

  const quarter = now ? `Q${Math.ceil((now.getMonth() + 1) / 3)} ${now.getFullYear()}` : '—';
  const timeStr = now
    ? now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  // Next monday
  const nextMonday = now ? (() => {
    const d = new Date(now);
    const day = d.getDay();
    const diff = day === 1 ? 7 : (8 - day) % 7;
    d.setDate(d.getDate() + diff);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
      module: 'ValiTimeZone',
      icon: '🌐',
      call: 'Now("America/Lima")',
      result: timeStr,
      live: true,
    },
    {
      module: 'ValiHoliday',
      icon: '🌍',
      call: 'IsHoliday(Today, "US")',
      result: now ? (now.getMonth() === 11 && now.getDate() === 25 ? '✓ holiday' : '✗ working day') : '—',
      live: true,
    },
    {
      module: 'ValiTime',
      icon: '⏱',
      call: 'Convert(90, Min, Hours)',
      result: '"1.50 h"',
      live: false,
    },
    {
      module: 'ValiRange',
      icon: '📆',
      call: 'Intersect(rangeA, rangeB)',
      result: '3 overlapping days',
      live: false,
    },
    {
      module: 'ValiCalendar',
      icon: '🗓',
      call: 'WorkdaysIn(30d)',
      result: `~${workdayEst} workdays`,
      live: false,
    },
    {
      module: 'ValiDuration',
      icon: '⌛',
      call: 'From(TimeSpan.FromHours(2))',
      result: '"2h 0m 0s"',
      live: false,
    },
    {
      module: 'ValiSchedule',
      icon: '🔄',
      call: 'Every(1,Week).On(Mon)',
      result: `next: ${nextMonday}`,
      live: true,
    },
    {
      module: 'ValiAge',
      icon: '🎂',
      call: 'Years(Jan 15, 1993)',
      result: `${now ? now.getFullYear() - 1993 : 33} years`,
      live: true,
    },
    {
      module: 'ValiCountDown',
      icon: '⏳',
      call: 'TimeUntil(NewYear)',
      result: `${daysUntilNY}d remaining`,
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
              <span className={styles.apiCardIcon}>{card.icon}</span>
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
            precision ecosystem
          </div>
          <h2 className={styles.sectionTitle}>Nine modules. One time ecosystem.</h2>
          <p className={styles.sectionSubtitle}>
            Nine focused packages. Use one or all — they compose naturally.
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

function FeatureCard({ icon, title, description, index }: Feature & { index: number }): ReactNode {
  const num = String(index + 1).padStart(2, '0');
  return (
    <div className={styles.featureCard}>
      <span className={styles.featureNumber}>{num}</span>
      <div className={styles.featureIconWrap}>
        <span className={styles.featureIconGlyph}>{icon}</span>
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

const MODULES = ['ValiTime', 'ValiDate', 'ValiRange', 'ValiCalendar', 'ValiDuration', 'ValiAge', 'ValiSchedule', 'ValiHoliday', 'ValiTimeZone'];

function Hero(): ReactNode {
  const [copied, setCopied] = useState(false);
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
          35+ countries · 45+ IANA zones · .NET 8/9
        </div>

        {/* Title */}
        <h1 className={styles.heroTitle}>Vali-Tempo</h1>

        {/* Tagline */}
        <p className={styles.heroTagline}>
          <span className={styles.heroTaglineComment}>{'// '}</span>
          time precision for .NET — dates, calendars & timezones
        </p>

        <p className={styles.heroSubtitle}>Nine modules. One ecosystem. Precision time.</p>

        {/* Module pills marquee */}
        <div className={styles.heroProviders} aria-label="Available modules">
          <div className={styles.heroProvidersTrack}>
            {[...MODULES, ...MODULES].map((m, i) => (
              <span key={i} className={styles.providerPill}>{m}</span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatValue}>9</span>
            <span className={styles.heroStatLabel}>modules</span>
          </div>
          <div className={styles.heroStatDivider} aria-hidden="true" />
          <div className={styles.heroStat}>
            <span className={styles.heroStatValue}>35+</span>
            <span className={styles.heroStatLabel}>countries</span>
          </div>
          <div className={styles.heroStatDivider} aria-hidden="true" />
          <div className={styles.heroStat}>
            <span className={styles.heroStatValue}>.NET 8/9</span>
            <span className={styles.heroStatLabel}>supported</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className={styles.heroCta}>
          <Link className={clsx('button', styles.btnPrimary)} to="/docs/quick-start">Get started →</Link>
          <Link className={clsx('button', styles.btnSecondary)} to="/docs/introduction">Read the docs</Link>
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
              aria-label="Copy"
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
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything you need for precise time handling</h2>
          <p className={styles.sectionSubtitle}>Built for .NET developers who need accurate date, time, and timezone operations.</p>
        </div>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Packages section ─────────────────────────────────────────────────────────

function PackagesSection(): ReactNode {
  return (
    <section className={styles.packagesSection}>
      <div className={styles.packagesDivider} aria-hidden="true" />
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>10 NuGet packages. Install only what you need.</h2>
          <p className={styles.sectionSubtitle}>Each package is independent — add the modules your project requires, or grab Vali-Tempo for the full suite.</p>
        </div>
        <div className={styles.packagesGrid}>
          {PACKAGES.map((p) => <PackageCard key={p.name} {...p} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Author section ───────────────────────────────────────────────────────────

function AuthorSection(): ReactNode {
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
            <p className={styles.authorBuiltBy}>Built by</p>
            <a href="https://github.com/UBF21" target="_blank" rel="noopener noreferrer" className={styles.authorName}>Felipe Montenegro</a>
            <p className={styles.authorBio}>.NET developer and open-source contributor. Also the author of{' '}<a href="https://github.com/UBF21/Vali-Blob" target="_blank" rel="noopener noreferrer" className={styles.authorLink}>Vali-Blob</a>.</p>
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

const SEO_TITLE = 'Vali-Tempo — Time Precision for .NET';
const SEO_DESC  = 'Modular .NET ecosystem for time, dates, calendars and timezones. 10 NuGet packages covering time conversions, date ranges, workday calendars, durations, schedules, holidays and IANA timezone support for .NET 6, 7, 8 & 9.';
const SEO_URL   = 'https://vali-tempo.github.io';
const SEO_IMAGE = `${SEO_URL}/img/docusaurus-social-card.jpg`;

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <>
      <Head>
        {/* Primary */}
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESC} />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#7C3AED" />
        <link rel="canonical" href={SEO_URL} />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={SEO_URL} />
        <meta property="og:title"       content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESC} />
        <meta property="og:image"       content={SEO_IMAGE} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale"          content="en_US" />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:site_name" content="Vali-Tempo" />

        {/* Twitter / X */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={SEO_TITLE} />
        <meta name="twitter:description" content={SEO_DESC} />
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
          "operatingSystem": ".NET 6, .NET 7, .NET 8, .NET 9",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "author": {
            "@type": "Organization",
            "name": "UBF21",
            "url": "https://github.com/UBF21"
          }
        })}</script>
      </Head>

      <Layout title={siteConfig.title} description={SEO_DESC}>
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
