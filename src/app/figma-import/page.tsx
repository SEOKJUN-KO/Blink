import type { NextPage } from 'next';

const IconPlay = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-white"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const IconReport = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-600"
  >
    <path d="M9 17v-4" />
    <path d="M12 17v-7" />
    <path d="M15 17v-1" />
    <path d="M5.2 12.3C4.4 11.5 4 10.3 4 9c0-2.8 2.2-5 5-5s5 2.2 5 5c0 1.3-.4 2.5-1.2 3.3" />
    <path d="M15 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
  </svg>
);

const IconSetting = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-600"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);


const FigmaImportPage: NextPage = () => {
  return (
    <div className="bg-white w-full h-full p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="py-4 flex justify-between items-center border-b">
          <h1 className="text-xl font-bold text-[#51aa55]">Blink</h1>
          <div className="flex items-center space-x-4">
            <IconReport />
            <IconSetting />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center text-center py-20 sm:py-32 md:py-40">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#51aa55]">Blink</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
              집중 속 잊기 쉬운 눈 깜빡임,<br />
              건강한 눈 습관을 되찾도록 도와드릴게요
            </p>
            <div className="bg-gray-100 rounded-lg px-4 py-2 inline-block">
              <p className="text-xs sm:text-sm text-gray-700">7초마다 • 시각 알림 ON • 소리 알림 OFF</p>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 flex flex-col items-center space-y-4">
            <button className="bg-[#51aa55] text-white font-semibold py-3 px-10 rounded-full flex items-center space-x-2 transition hover:bg-opacity-90">
              <IconPlay />
              <span>측정 시작</span>
            </button>
            <a href="#" className="text-sm text-gray-500 hover:underline">
              개인정보 수집 안내
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FigmaImportPage;
