import React from 'react';
import Title from './Title';
import InfoBadge from './InfoBadge';
import { PlayButton } from '../components/PlayButton';

const MainContent = () => {
  return (
    <main className="flex flex-col items-center justify-center flex-grow">
      <div className="flex flex-col items-center">
        <Title />
        <div className="mt-6">
          <InfoBadge />
        </div>
        <div className="mt-16 text-center">
          <PlayButton status={'Default'} label={'측정 시작'} />
          <p className="mt-4 font-pretendard text-Caption font-Medium text-TextBlack-500">
            개인정보 수집 안내
          </p>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
