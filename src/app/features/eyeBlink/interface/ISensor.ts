export interface ISensor {
  getCurrentValue(): number;
  on(event: string, listener: (value: number) => void): void;
  off(event: string, listener: (value: number) => void): void;
} 