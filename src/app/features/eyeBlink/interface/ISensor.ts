export interface ISensor {
  getCurrentValue(): number;
  listen(event: string, listener: (value: number) => void): void;
  off(event: string, listener: (value: number) => void): void;
} 