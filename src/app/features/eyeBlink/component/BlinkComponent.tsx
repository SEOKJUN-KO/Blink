'use client'; 

import React, { useState } from 'react';
import MainContent from './MainContent';
import Header from './Header';

const BlinkComponent = () => {
  const [isSettingVisible, setIsSettingVisible] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header onSettingClick={() => setIsSettingVisible(true)} />
      <MainContent isSettingVisible={isSettingVisible} onClose={() => setIsSettingVisible(false)} />
    </div>
  );
};

export default BlinkComponent;