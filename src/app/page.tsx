import { Metadata } from 'next';
import BlinkComponent from './features/eyeBlink/component/BlinkComponent';

export const metadata: Metadata = {
  title: 'Blink - 눈 건강 지킴이',
  description: '눈의 깜빡임을 모니터링하고 건강한 눈 사용 습관을 만들어주는 서비스입니다.',
  keywords: '눈 건강, 눈 깜빡임, 디지털 눈 피로, 눈 관리',
};

export default function Home() {
  return (
    <BlinkComponent />
  );
}
