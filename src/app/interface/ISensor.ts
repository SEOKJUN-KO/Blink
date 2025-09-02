import { ServiceType } from "../type/ServiceType";

export interface ISensor {
  canUse(): boolean;
  getCurrentValue(): number;
  listen(event: ServiceType, callback: (value: any) => void): void;
  off(event: ServiceType): void;
} 