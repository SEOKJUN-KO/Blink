'use client'; 

import React, { useState } from 'react';
import Header from './Header';
import MainContent from './MainContent';
import SettingScreen from './setting-screen/SettingScreen'; 

const BlinkPage = () => {
  const [isSettingVisible, setIsSettingVisible] = useState(false);
  const toggleSetting = () => {
    setIsSettingVisible(!isSettingVisible);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header onSettingClick={toggleSetting} />
      <MainContent />
      {isSettingVisible && (
        <div className="absolute top-0 left-0 w-full h-full bg-black-opacity flex items-center justify-center">
          <SettingScreen onClose={toggleSetting} />
        </div>
    )}
    </div>
  );
};

export default BlinkPage;