
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
        'BrandGreen': '#51aa55',
        'GrayScale-50': 'rgba(243, 243, 246, 1)',
        'GrayScale-100': 'rgba(233, 233, 239, 1)',
        'GrayScale-200': 'rgba(202, 202, 211, 1)',
        'GrayScale-500': 'rgba(140, 140, 147, 1)',
        'GrayScale-700': 'rgba(91, 91, 95, 1)',
        'Primary-100': 'rgba(185, 218, 186, 1)',
        'Primary-300': 'rgba(116, 197, 119, 1)',
        'Primary-500': 'rgba(81, 170, 85, 1)',
        'Primary-700': '#418844',
        'Secondary-100': 'rgba(197, 205, 242, 1)',
        'Secondary-300': 'rgba(129, 143, 213, 1)',
        'Secondary-500': 'rgba(68, 85, 170, 1)',
        'TextBlack-300': 'rgba(0, 0, 0, 0.3)',
        'TextBlack-500': 'rgba(0, 0, 0, 0.5)',
        'TextBlack-700': 'rgba(0, 0, 0, 0.7)',
        'TextBlack-900': 'rgba(0, 0, 0, 0.9)',
        'TextWhite-800': 'rgba(255, 255, 255, 0.8)',
        'TextWhite-1000': 'rgba(255, 255, 255, 1)',
        'Black': 'rgba(0, 0, 0, 1)',
        'White': 'rgba(255, 255, 255, 1)',
      },
      fontFamily: {
        pretendard: ['Pretendard'],
      },
      fontSize: {
        'Header': '40px',
        'Title': '28px',
        'SubTitle': '18px',
        'Body': '16px',
        'Caption': '14px',
      },
      fontWeight: {
        'SemiBold': '600',
        'Regular': '400',
        'Medium': '500',
      },
      borderRadius: {
        SM: '6px',
        MD: '8px',
        LG: '12px',
        Round: '200px',
      },
    },
  },
  plugins: [],
};
export default config;
