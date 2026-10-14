import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  plugins: [
    // Fix: webpack-dev-server v5 injects webpack/hot/dev-server as an entry,
    // but module.hot is not available in Docusaurus's webpack 5 setup, causing
    // an uncaught error. NormalModuleReplacementPlugin intercepts the module
    // at resolution time and replaces it with a safe shim.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (() => ({
      name: 'webpack-hmr-shim',
      configureWebpack(_config: unknown, isServer: boolean) {
        if (isServer) return undefined;
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const webpack = require('webpack');
        return {
          plugins: [
            new webpack.NormalModuleReplacementPlugin(
              /webpack[/\\]hot[/\\]dev-server/,
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              require.resolve('./src/webpack-hmr-shim.js'),
            ),
          ],
        };
      },
    })) as any,
  ],

  title: 'Vali-Tempo',
  tagline: '// time precision for .NET — dates, calendars & timezones',
  favicon: 'img/favicon.ico',

  url: 'https://vali-tempo.github.io',
  baseUrl: '/',

  organizationName: 'vali-tempo',
  projectName: 'vali-tempo',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  trailingSlash: false,

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Space+Mono:wght@400;500&display=swap',
      type: 'text/css',
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    localeConfigs: {
      en: { label: 'English', direction: 'ltr', htmlLang: 'en' },
      es: { label: 'Español', direction: 'ltr', htmlLang: 'es' },
    },
  },

  markdown: { format: 'mdx' },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: 'https://github.com/UBF21/Vali-Tempo/tree/main/',
          showLastUpdateTime: false,
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logo.png',
    metadata: [
      { name: 'robots', content: 'index, follow' },
      { name: 'theme-color', content: '#7C3AED' },
      { name: 'keywords', content: '.NET, NuGet, C#, time library, date handling, calendar, timezone, duration, scheduling, holidays, business hours, time buckets, .NET 6, .NET 7, .NET 8, .NET 9, .NET 10, Vali-Tempo' },
      { name: 'author', content: 'Felipe Montenegro' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Vali-Tempo' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@vali_tempo' },
    ],
    colorMode: { defaultMode: 'dark', respectPrefersColorScheme: true },
    navbar: {
      title: 'Vali-Tempo',
      logo: { alt: 'Vali-Tempo', src: 'img/logo.png' },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        { type: 'localeDropdown', position: 'right' },
        {
          href: 'https://www.nuget.org/packages/Vali-Tempo',
          label: 'NuGet',
          position: 'right',
        },
        {
          href: 'https://github.com/UBF21/Vali-Tempo',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Introduction', to: '/docs/introduction' },
            { label: 'Quick Start', to: '/docs/quick-start' },
            { label: 'Modules', to: '/docs/vali-time/overview' },
            { label: 'Packages', to: '/docs/packages' },
          ],
        },
        {
          title: 'Packages',
          items: [
            { label: 'Vali-Time', href: 'https://www.nuget.org/packages/Vali-Time' },
            { label: 'Vali-Range', href: 'https://www.nuget.org/packages/Vali-Range' },
            { label: 'Vali-Calendar', href: 'https://www.nuget.org/packages/Vali-Calendar' },
            { label: 'Vali-Duration', href: 'https://www.nuget.org/packages/Vali-Duration' },
            { label: 'Vali-CountDown', href: 'https://www.nuget.org/packages/Vali-CountDown' },
            { label: 'Vali-Age', href: 'https://www.nuget.org/packages/Vali-Age' },
            { label: 'Vali-Schedule', href: 'https://www.nuget.org/packages/Vali-Schedule' },
            { label: 'Vali-Holiday', href: 'https://www.nuget.org/packages/Vali-Holiday' },
            { label: 'Vali-TimeZone', href: 'https://www.nuget.org/packages/Vali-TimeZone' },
            { label: 'Vali-BusinessHours', href: 'https://www.nuget.org/packages/Vali-BusinessHours' },
            { label: 'Vali-Bucket', href: 'https://www.nuget.org/packages/Vali-Bucket' },
            { label: 'Vali-Tempo', href: 'https://www.nuget.org/packages/Vali-Tempo' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Vali-Blob', href: 'https://github.com/UBF21/Vali-Blob' },
            { label: 'Vali-Mediator', href: 'https://github.com/UBF21/Vali-Mediator' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Vali-Tempo Contributors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['csharp', 'bash', 'json', 'yaml', 'markup'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
