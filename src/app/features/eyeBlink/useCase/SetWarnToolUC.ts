import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IWarn, IWarningToolManager, WarningToolType } from "@/app/interface/IWarning";

export class SetWarnToolUC implements IUseCase<{ type: ServiceType}, boolean> {
    constructor(
        private warnTool: IWarningToolManager,
    ) {}

    async execute(req: { type: ServiceType, toolType: WarningToolType, warn: IWarn }): Promise<boolean> {
        this.warnTool.addTool(req.toolType, req.warn);
        return true;
    }
}