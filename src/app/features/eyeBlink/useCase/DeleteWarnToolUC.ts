import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IWarningExecutor, IWarningToolManager, WarningToolType } from "@/app/interface/IWarning";
import { IDefaultPresenter } from "@/app/interface/IPresenter";
import { DBGateway } from "@/app/interface/DBGateway";
import { AdjustableMonitor } from "@/app/interface/IMonitor";
import { BlinkMonitorContext } from "../entity/BlinkMonitorContext";
import { IResolver } from "@/app/interface/Resolver";
import { DI_TOKENS } from "@/app/di/DI_Token";

export class DeleteWarnToolUC implements IUseCase<{ type: ServiceType}, boolean> {
    private db: DBGateway<ServiceType, AdjustableMonitor>
    private warn: IWarningExecutor
    private warnTools: IWarningToolManager
    private presenter: IDefaultPresenter<any>
    
    constructor( private readonly resolve: IResolver) {
        this.db = this.resolve.get<DBGateway<string, AdjustableMonitor>>(DI_TOKENS.Blink.DB);
        this.presenter = this.resolve.get<IDefaultPresenter<any>>(DI_TOKENS.Blink.Presenter);
        this.warnTools = this.resolve.get<IWarningToolManager>(DI_TOKENS.Blink.Warn);
        this.warn = this.resolve.get<IWarningExecutor>(DI_TOKENS.Blink.Warn);
    }

    async execute(req: { type: ServiceType, toolType: WarningToolType}): Promise<boolean> {
        let context = this.db.get(req.type) ?? new BlinkMonitorContext('ENDED', new Date, 5)
        context.resetEvent()
        let data = context.snapshot()
        if( data == undefined ) {  return false }

        this.warnTools.deleteTool(req.toolType);
        const threshold = data.threshold
        this.warn.setWarning({threshold: threshold}, this.presenter.present.bind(this.presenter))

        data['warnTools'] = this.warnTools.getTools()
        this.presenter.present(data)
        return true;
    }
}