import { ISensor } from "@/app/interface/ISensor";
import { DBGateway } from "@/app/interface/DBGateway";
import { AdjustableMonitor } from "@/app/interface/IMonitor";
import { IWarningExecutor, IWarningToolManager, WarningToolType, WarnOption } from "@/app/interface/IWarning";
import { IWarnFactory } from "@/app/factory/WarnFactory";
import { IDefaultPresenter } from "@/app/interface/IPresenter";

import { StartMonitorUC } from "@/app/features/eyeBlink/useCase/StartMonitorUC";
import { StopMonitorUC } from "@/app/features/eyeBlink/useCase/StopMonitorUC";
import { SetWarnToolUC } from "../useCase/SetWarnToolUC";
import { SetThresholdUC } from "../useCase/SetThresholdUC";
import { DeleteWarnToolUC } from "../useCase/DeleteWarnToolUC";



export interface BlinkController {
    monitorStart(): void
    monitorStop(): void
    addWarnTool(toolType: WarningToolType, options: WarnOption): void
    deleteWarnTool(toolType: WarningToolType): void
    setThreshold(seconds: number): void;
}

export class BlinkViewController implements BlinkController{
    constructor(
        private sensor: ISensor,
        private db: DBGateway<string, AdjustableMonitor>,
        private warn: IWarningExecutor,
        private warnTools: IWarningToolManager,
        private warnFactory: IWarnFactory,
        private presenter: IDefaultPresenter<any>,
    ) {}
    
    public monitorStart(): void {
        new StartMonitorUC(this.sensor, this.db , this.warn, this.warnTools, this.presenter).execute({type: 'blink'})
    }

    public monitorStop(): void {
        new StopMonitorUC(this.sensor, this.db, this.warn, this.warnTools, this.presenter).execute({type: 'blink'})
    }

    public addWarnTool(toolType: WarningToolType, options: WarnOption): void {
        const warnClass = this.warnFactory.create(toolType, options)
        new SetWarnToolUC(this.db, this.warnTools, this.presenter).execute({type: 'blink', toolType: toolType, warn: warnClass})
    }

    public deleteWarnTool(toolType: WarningToolType): void {
        new DeleteWarnToolUC(this.db, this.warnTools, this.presenter).execute({type: 'blink', toolType: toolType})
    }
    
    public setThreshold(threshold: number): void {
        new SetThresholdUC( this.sensor, this.db, this.warn, this.warnTools, this.presenter).execute({type: 'blink', threshold: threshold})
    }
}