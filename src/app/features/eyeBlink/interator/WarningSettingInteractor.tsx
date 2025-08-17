import { MonitorContext } from "../entity/MonitorContext";
import { randomUUID } from "crypto";
import { IWarningToolManager, WarningToolType, WarnOption } from "@/app/interface/IWarning";

export class WarnInteractor {
    private context: MonitorContext = new MonitorContext(randomUUID(), "ENDED", new Date(), 5)
    
    constructor(
        private warning: IWarningToolManager,
    ) {}

    public setTreshold(treshold: number) {
        this.context.setThreshold(treshold)
    }

    public setWarning(type: WarningToolType, option: WarnOption) {
        this.warning.addTool(type, option)
    }

    public offWarning(type: WarningToolType) {
        this.warning.deleteTool(type)
    }
    
}