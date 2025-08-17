import { ServiceType } from "../type/ServiceType"

export interface IWarningToolManager {
  addTool(type: WarningToolType, options: WarnOption): void
  deleteTool(type: WarningToolType): void
} 

export interface IWarningExecutor {
  setWarning(type: ServiceType, snapshot: monitorSnapshot): void
  endWarning(type: ServiceType): void
}

export type WarnOption = {
  volumn?: number;
  flickeringSpeed?: number;
}

export type monitorSnapshot = {
  lastBlinkAt?: Date | null;
  treshold?: number;
}

export type WarningToolType = 'PIP' | 'Sound';