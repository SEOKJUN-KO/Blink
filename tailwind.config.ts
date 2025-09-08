
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#51aa55',
        'grayscale-50': 'rgba(243, 243, 246, 1)',
        'grayscale-100': 'rgba(233, 233, 239, 1)',
        'grayscale-200': 'rgba(202, 202, 211, 1)',
        'grayscale-500': 'rgba(140, 140, 147, 1)',
        'grayscale-700': 'rgba(91, 91, 95, 1)',
        'primary-100': 'rgba(185, 218, 186, 1)',
        'primary-300': 'rgba(116, 197, 119, 1)',
        'primary-500': 'rgba(81, 170, 85, 1)',
        'primary-700': '#418844',
        'secondary-100': 'rgba(197, 205, 242, 1)',
        'secondary-300': 'rgba(129, 143, 213, 1)',
        'secondary-500': 'rgba(68, 85, 170, 1)',
        'text-black-300': 'rgba(0, 0, 0, 0.3)',
        'text-black-500': 'rgba(0, 0, 0, 0.5)',
        'text-black-700': 'rgba(0, 0, 0, 0.7)',
        'text-black-900': 'rgba(0, 0, 0, 0.9)',
        'text-white-800': 'rgba(255, 255, 255, 0.8)',
        'text-white-1000': 'rgba(255, 255, 255, 1)',
        'black': 'rgba(0, 0, 0, 1)',
        'white': 'rgba(255, 255, 255, 1)',
      },
      fontFamily: {
        pretendard: ['Pretendard'],
      },
      fontSize: {
        header: '40px',
        title: '28px',
        subtitle: '18px',
        body: '16px',
        caption: '14px',
      },
      fontWeight: {
        semibold: '600',
        regular: '400',
        medium: '500',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'round': '200px',
      },
    },
  },
  plugins: [],
};
export default config;
