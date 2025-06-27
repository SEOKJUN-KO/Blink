export interface ISensor {
  getCurrentValue(): number;
  listen(event: string, listener: (value: any) => void): void;
  off(event: string): void;
} 