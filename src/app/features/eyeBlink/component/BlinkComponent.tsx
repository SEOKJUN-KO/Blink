'use client'; 

import React, { useState } from 'react';
import MainContent from './MainContent';
import Header from './Header';

const BlinkComponent = () => {
  const [isSettingVisible, setIsSettingVisible] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header onSettingClick={() => {
        setIsSettingVisible(true);
        document.cookie = 'hasClickedSetting=true; max-age=' + (365 * 24 * 60 * 60) + '; path=/';
      }} />
      <MainContent 
        isSettingVisible={isSettingVisible} 
        onClose={() => setIsSettingVisible(false)} 
        setSettingVisible={() => {
          setIsSettingVisible(true)
          document.cookie = 'hasClickedSetting=true; max-age=' + (365 * 24 * 60 * 60) + '; path=/'
        }}
      />
    </div>
  );
};

export default BlinkComponent;