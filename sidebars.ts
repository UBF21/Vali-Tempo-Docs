import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'introduction',
    'quick-start',
    {
      type: 'category',
      label: 'Vali-Time',
      collapsed: false,
      items: ['vali-time/overview', 'vali-time/vali-date', 'vali-time/quarters', 'vali-time/examples', 'vali-time/changelog'],
    },
    {
      type: 'category',
      label: 'Vali-Range',
      items: ['vali-range/overview', 'vali-range/examples', 'vali-range/changelog'],
    },
    {
      type: 'category',
      label: 'Vali-Calendar',
      items: ['vali-calendar/overview', 'vali-calendar/examples', 'vali-calendar/changelog'],
    },
    {
      type: 'category',
      label: 'Vali-Duration',
      items: ['vali-duration/overview', 'vali-duration/examples', 'vali-duration/changelog'],
    },
    {
      type: 'category',
      label: 'Vali-CountDown',
      items: ['vali-countdown/overview', 'vali-countdown/examples', 'vali-countdown/changelog'],
    },
    {
      type: 'category',
      label: 'Vali-Age',
      items: ['vali-age/overview', 'vali-age/examples', 'vali-age/changelog'],
    },
    {
      type: 'category',
      label: 'Vali-Schedule',
      items: ['vali-schedule/overview', 'vali-schedule/examples', 'vali-schedule/changelog'],
    },
    {
      type: 'category',
      label: 'Vali-Holiday',
      items: ['vali-holiday/overview', 'vali-holiday/providers', 'vali-holiday/examples', 'vali-holiday/changelog'],
    },
    {
      type: 'category',
      label: 'Vali-TimeZone',
      items: ['vali-timezone/overview', 'vali-timezone/examples', 'vali-timezone/changelog'],
    },
    'packages',
  ],
};

export default sidebars;
