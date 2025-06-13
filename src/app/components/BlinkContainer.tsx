'use client';

import { useState, useCallback } from 'react';
import BlinkTimer from './BlinkTimer';
import Settings from './Settings';

export default function BlinkContainer() {
  const [recentBlinkTime, setRecentBlinkTime] = useState(0);
  const [blinkInterval, setBlinkInterval] = useState(5);
  const [warningSoundEnabled, setWarningSoundEnabled] = useState(false);

  const handleBlinkIntervalChange = useCallback((value: number) => {
    setBlinkInterval(value);
  }, []);

  const handleWarningSoundChange = useCallback((value: boolean) => {
    setWarningSoundEnabled(value);
  }, []);

  return (
    <>
      <BlinkTimer recentBlinkTime={recentBlinkTime} />
      <Settings
        blinkInterval={blinkInterval}
        warningSoundEnabled={warningSoundEnabled}
        onBlinkIntervalChange={handleBlinkIntervalChange}
        onWarningSoundChange={handleWarningSoundChange}
      />
    </>
  );
} 