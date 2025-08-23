import { WarningToolType, WarnOption } from "@/app/interface/IWarning";

import { StartMonitorUC } from "@/app/features/eyeBlink/useCase/StartMonitorUC";
import { StopMonitorUC } from "@/app/features/eyeBlink/useCase/StopMonitorUC";
import { SetWarnToolUC } from "../useCase/SetWarnToolUC";
import { SetThresholdUC } from "../useCase/SetThresholdUC";
import { DeleteWarnToolUC } from "../useCase/DeleteWarnToolUC";
import { IResolver } from "@/app/interface/Resolver";
import { rootDIContainer } from "@/app/di/RootDIContainer";
import { IWarnFactory } from "@/app/factory/WarnFactory";
import { DI_TOKENS } from "@/app/di/DI_Token";



export interface BlinkController {
    monitorStart(): void
    monitorStop(): void
    addWarnTool(toolType: WarningToolType, options: WarnOption): void
    deleteWarnTool(toolType: WarningToolType): void
    setThreshold(seconds: number): void;
}

export class BlinkViewController implements BlinkController{
    constructor(
        private resolve: IResolver
    ) {}
    
    public monitorStart(): void {
        new StartMonitorUC(this.resolve).execute({type: 'blink'})
    }

    public monitorStop(): void {
        new StopMonitorUC(this.resolve).execute({type: 'blink'})
    }

    public addWarnTool(toolType: WarningToolType, options: WarnOption): void {
        const warnClass = rootDIContainer.get<IWarnFactory>(DI_TOKENS.WarnFactory).create(toolType, options)
        new SetWarnToolUC(this.resolve).execute({type: 'blink', toolType: toolType, warn: warnClass})
    }

    public deleteWarnTool(toolType: WarningToolType): void {
        new DeleteWarnToolUC(this.resolve).execute({type: 'blink', toolType: toolType})
    }
    
    public setThreshold(threshold: number): void {
        new SetThresholdUC(this.resolve).execute({type: 'blink', threshold: threshold})
    }
}