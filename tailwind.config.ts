import { join } from 'path';
import type { Config } from 'tailwindcss';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';

/** @type {import('tailwindcss').Config}*/
const config = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(require.resolve(
      '@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    )
  ],
  darkMode: 'class',

  theme: {
    extend: {}
  },

  plugins: [skeleton({ themes: { preset: ["skeleton"] } })]
} satisfies Config;

module.exports = config;
