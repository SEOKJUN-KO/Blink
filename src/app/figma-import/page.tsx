'use client'; 

import React, { useState } from 'react';
import Header from './Header';
import MainContent from './MainContent';

const BlinkPage = () => {
  const [isSettingVisible, setIsSettingVisible] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header onSettingClick={() => setIsSettingVisible(true)} />
      <MainContent isSettingVisible={isSettingVisible} onClose={() => setIsSettingVisible(false)} />
    </div>
  );
};

export default BlinkPage;