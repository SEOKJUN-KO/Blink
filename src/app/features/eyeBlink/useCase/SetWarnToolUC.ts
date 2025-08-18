import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IWarningToolManager, WarningToolType, WarnOption } from "@/app/interface/IWarning";

export class SetWarnToolUC implements IUseCase<{ type: ServiceType}, boolean> {
    constructor(
        private warnTool: IWarningToolManager,
    ) {}

    async execute(req: { type: ServiceType, toolType: WarningToolType, options: WarnOption }): Promise<boolean> {
        this.warnTool.addTool(req.toolType, req.options);
        return true;
    }
}