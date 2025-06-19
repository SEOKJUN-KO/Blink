import { ISensor } from './ISensor';
import { IWarning } from './IWarning';
import { IUserSettings } from './IUserSettings';

export interface IMonitor {
  startMonitoring(): void;
  stopMonitoring(): void;
}
