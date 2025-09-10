
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
        'gray-scale-50': 'rgba(243, 243, 246, 1)',
        'gray-scale-100': 'rgba(233, 233, 239, 1)',
        'gray-scale-200': 'rgba(202, 202, 211, 1)',
        'gray-scale-500': 'rgba(140, 140, 147, 1)',
        'gray-scale-700': 'rgba(91, 91, 95, 1)',
        'primary-scale-100': 'rgba(185, 218, 186, 1)',
        'primary-scale-300': 'rgba(116, 197, 119, 1)',
        'primary-scale-500': 'rgba(81, 170, 85, 1)',
        'primary-scale-700': '#418844',
        'secondary-scale-100': 'rgba(197, 205, 242, 1)',
        'secondary-scale-300': 'rgba(129, 143, 213, 1)',
        'secondary-scale-500': 'rgba(68, 85, 170, 1)',
        'text-black-300': 'rgba(0, 0, 0, 0.3)',
        'text-black-500': 'rgba(0, 0, 0, 0.5)',
        'text-black-700': 'rgba(0, 0, 0, 0.7)',
        'text-black-900': 'rgba(0, 0, 0, 0.9)',
        'text-white-800': 'rgba(255, 255, 255, 0.8)',
        'text-white-1000': 'rgba(255, 255, 255, 1)',
        'black': 'rgba(0, 0, 0, 1)',
        'white': 'rgba(255, 255, 255, 1)',
        'black-opacity': 'rgba(0, 0, 0, 0.5)',
      },
      fontFamily: {
        pretendard: ['Pretendard'],
      },
      fontSize: {
        'header': ['40px', '48px'], // lineheight - 48
        'title': ['28px', '34px'], // 34
        'sub-title': ['18px', '24px'], // 24
        'body': ['16px', '22px'], // 22
        'caption': ['14px', '18px'], // 18
      },
      fontWeight: {
        semibold: '600',
        regular: '400',
        medium: '500',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        round: '200px',
      },
    },
  },
  plugins: [],
};
export default config;
