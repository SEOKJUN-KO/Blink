import { Metadata } from 'next';
import Layout from './components/Layout';
import BlinkContainer from './features/eyeBlink/component/BlinkContainer';
import StaticContent from './features/eyeBlink/component/StaticContent';

export const metadata: Metadata = {
  title: 'Blink - 눈 건강 지킴이',
  description: '눈의 깜빡임을 모니터링하고 건강한 눈 사용 습관을 만들어주는 서비스입니다.',
  keywords: '눈 건강, 눈 깜빡임, 디지털 눈 피로, 눈 관리',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* 헤더 영역 */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
          Blink
        </h1>
        <p className="text-gray-600 text-sm">
          눈의 건강한 사용을 위한 첫걸음
        </p>
      </div>

      {/* 메인 콘텐츠 */}
      <BlinkContainer />
    </div>
  );
}
