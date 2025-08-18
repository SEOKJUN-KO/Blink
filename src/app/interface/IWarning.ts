export interface IWarn {
  execute(snapshot: monitorSnapshot): {stop: () => {}}
}

export interface IWarningToolManager {
  addTool(type: WarningToolType, warn: IWarn): void
  deleteTool(type: WarningToolType): void
} 

export interface IWarningExecutor {
  setWarning(snapshot: monitorSnapshot): void
  endWarning(): void
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