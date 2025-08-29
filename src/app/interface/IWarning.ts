export interface IWarn {
  canUse(): boolean
  execute(snapshot: monitorSnapshot): {stop: () => void }
}

export interface IWarningToolManager {
  addTool(type: WarningToolType, warn: IWarn): void
  deleteTool(type: WarningToolType): void
  getTools(): WarningToolType[]
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
  threshold?: number;
}

export type WarningToolType = 'PIP' | 'Sound';