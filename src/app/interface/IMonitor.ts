export interface IMonitor {
  startMonitoring(): void;
  stopMonitoring(): void;
  on(eventName: string, callback: (data: any) => void): void;
  off(eventName: string): void;
}
