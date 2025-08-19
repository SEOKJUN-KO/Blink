import { ISensor } from "@/app/interface/ISensor";
import { StartMonitorUC } from "@/app/features/eyeBlink/useCase/StartMonitorUC";
import { DBGateway } from "@/app/interface/DBGateway";
import { IMonitor } from "@/app/interface/IMonitor";
import { IWarningExecutor, IWarningToolManager, WarningToolType, WarnOption } from "@/app/interface/IWarning";
import { StopMonitorUC } from "@/app/features/eyeBlink/useCase/StopMonitorUC";
import { SetWarnToolUC } from "../useCase/SetWarnToolUC";
import { IWarnFactory } from "@/app/factory/WarnFactory";
import { IDefaultPresenter } from "@/app/interface/IPresenter";

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
        private warnFactory: IWarnFactory,
        private present: IDefaultPresenter<any>,
    ) {}
    
    public monitorStart(): void {
        new StartMonitorUC(this.sensor, this.db, this.warn, this.present).execute({type: 'blink'})
    }

    public monitorStop(): void {
        new StopMonitorUC(this.sensor, this.db, this.warn).execute({type: 'blink'})
    }

    public addWarnTool(toolType: WarningToolType, options: WarnOption): void {
        const warnClass = this.warnFactory.create(toolType, options)
        new SetWarnToolUC(this.warnTool).execute({type: 'blink', toolType: toolType, warn: warnClass})
    }
}