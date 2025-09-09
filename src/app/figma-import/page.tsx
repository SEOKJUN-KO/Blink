
import React from 'react';
import Header from './Header';
import MainContent from './MainContent';

const BlinkPage = () => {
  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <MainContent />
    </div>
  );
};

export default BlinkPage;
