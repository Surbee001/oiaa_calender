import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // OIAA Calendar colors matching the PDF
        inbound: '#4ade80',      // green
        outbound: '#3b82f6',     // blue
        event: '#a855f7',        // purple
        studytour: '#06b6d4',    // cyan
        university: '#6b7280',   // gray
        holiday: '#ef4444',      // red
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config