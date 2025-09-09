import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: '%s | Blink',
    default: 'Blink - 눈 건강 지킴이',
  },
  description: '눈의 깜빡임을 모니터링하고 건강한 눈 사용 습관을 만들어주는 서비스입니다.',
  keywords: ['눈 건강', '눈 깜빡임', '디지털 눈 피로', '눈 관리'],
  authors: [{ name: 'Blink Team' }],
  openGraph: {
    title: 'Blink - 눈 건강 지킴이',
    description: '눈의 깜빡임을 모니터링하고 건강한 눈 사용 습관을 만들어주는 서비스입니다.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'your-google-site-verification',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`font-pretendard bg-White text-TextBlack-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
