import { JSX } from 'react';
import { IMonitor } from '../interface/IMonitor';
import { ISensor } from '../interface/ISensor';

export class BlinkMonitor implements IMonitor {
  private isMonitoring: boolean = false;

  constructor(
    private sensor: ISensor,
    // private warning: IWarning,
    // private userSettings: IUserSettings
  ) {}

  startMonitoring(): void {
    if (this.isMonitoring) {
      console.log("Monitoring is already active.");
      return;
    }

    this.isMonitoring = true;
    console.log("Starting monitoring...");
    
    this.sensor.listen('blinkValueChange', this.handleSensorValueChange);
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) {
      console.log("Monitoring is not active.");
      return;
    }

    this.isMonitoring = false;
    console.log("Stopping monitoring...");

    this.sensor.off('blinkValueChange', this.handleSensorValueChange);
  }

  private handleSensorValueChange = (value: number): void => {
    // TODO: 여기에 센서 값 변화에 따른 경고 로직 추가
    console.log(`Sensor value changed: ${value}`);
  };
} 