import { MonitorContext } from "../entity/BlinkMonitorContext";
import { randomUUID } from "crypto";
import { IWarningExecutor, IWarningToolManager, WarningToolType, WarnOption } from "@/app/interface/IWarning";

export class WarnInteractor {
    private context: MonitorContext = new MonitorContext(randomUUID(), "ENDED", new Date(), 5)
    
    constructor(
        private warningTool: IWarningToolManager,
        private warning: IWarningExecutor,
    ) {}

    public setTreshold(treshold: number) {
        this.context.setThreshold(treshold)
        this.warning.setWarning("blink", {lastBlinkAt: new Date(), treshold: treshold})
    }

    public setWarning(type: WarningToolType, option: WarnOption) {
        this.warningTool.addTool(type, option)
    }

    public offWarning(type: WarningToolType) {
        this.warningTool.deleteTool(type)
    }
}