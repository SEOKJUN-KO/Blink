import { IWarn, IWarningExecutor, IWarningToolManager, monitorSnapshot, WarningToolType } from "../interface/IWarning";

export class WarningManager implements IWarningExecutor, IWarningToolManager {
    private tools: Map<WarningToolType, IWarn> = new Map();
    private stopFuncs: { stop: () => void }[] = []
    constructor() {}
    
    addTool(type: WarningToolType, warn: IWarn): void {
        this.tools.set(type, warn)
    } 
    deleteTool(type: WarningToolType): void {
        this.tools.delete(type)
    }
    getTools(): WarningToolType[] {
        return Array.from(this.tools.keys());
    }
    
    setWarning(snapshot: monitorSnapshot): void {
        this.stopFuncs.forEach((f) => {
            f.stop()
        })
        this.stopFuncs = []

        this.tools.forEach((tool) => {
            const stopF = tool.execute(snapshot)
            this.stopFuncs.push(stopF)
        })
    }
    endWarning(): void {
        this.stopFuncs.forEach((f) => {
            f.stop()
        })
        this.stopFuncs = []
    }
}