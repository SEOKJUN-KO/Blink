import { ISensor } from "@/app/interface/ISensor";
import { StartMonitorUC } from "@/app/features/eyeBlink/useCase/StartMonitorUC";
import { DBGateway } from "@/app/interface/DBGateway";
import { IMonitor } from "@/app/interface/IMonitor";
import { IWarningExecutor, IWarningToolManager, WarningToolType, WarnOption } from "@/app/interface/IWarning";
import { StopMonitorUC } from "@/app/features/eyeBlink/useCase/StopMonitorUC";
import { SetWarnToolUC } from "../useCase/SetWarnToolUC";

export interface BlinkController {
    monitorStart(): void
    monitorStop(): void
    addWarnTool(toolType: WarningToolType, options: WarnOption): void
}

export class BlinkViewController implements BlinkController{
    constructor(
        private sensor: ISensor,
        private db: DBGateway<string, IMonitor>,
        private warn: IWarningExecutor,
        private warnTool: IWarningToolManager,
    ) {}
    
    public monitorStart(): void {
        new StartMonitorUC(this.sensor, this.db, this.warn).execute({type: 'blink'})
    }

    public monitorStop(): void {
        new StopMonitorUC(this.sensor, this.db, this.warn).execute({type: 'blink'})
    }

    public addWarnTool(toolType: WarningToolType, options: WarnOption): void {
        new SetWarnToolUC(this.warnTool).execute({type: 'blink', toolType: toolType, options: options})
    }
}