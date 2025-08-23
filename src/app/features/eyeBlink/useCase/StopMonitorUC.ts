import { DBGateway } from "@/app/interface/DBGateway";
import { ISensor } from "@/app/interface/ISensor";
import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { AdjustableMonitor } from "@/app/interface/IMonitor";
import { IWarningExecutor } from "@/app/interface/IWarning";
import { IDefaultPresenter } from "@/app/interface/IPresenter";
import { DI_TOKENS } from "@/app/di/DI_Token";
import { IResolver } from "@/app/interface/Resolver";

export class StopMonitorUC implements IUseCase<{ type: ServiceType}, boolean> {
    private sensor: ISensor
    private db: DBGateway<string, AdjustableMonitor>
    private warn: IWarningExecutor
    private presenter: IDefaultPresenter<any>
    constructor(
        private readonly resolve: IResolver
    ) {
        this.sensor = this.resolve.get<ISensor>(DI_TOKENS.Blink.Sensor);
        this.db = this.resolve.get<DBGateway<string, AdjustableMonitor>>(DI_TOKENS.Blink.DB);
        this.presenter = this.resolve.get<IDefaultPresenter<any>>(DI_TOKENS.Blink.Presenter);
        this.warn = this.resolve.get<IWarningExecutor>(DI_TOKENS.Blink.Warn);
    }

    async execute(req: {type: ServiceType}): Promise<boolean> {
        const ctx = this.db.get(req.type)
        if( ctx == undefined ) { return false }
        ctx.stopMonitoring()
        const dbStatus = this.db.set(req.type, ctx)
        if (!dbStatus) { return false }
        this.sensor.off(req.type)
        this.warn.endWarning()
        const data = ctx.snapshot()
        this.presenter.present(data)
        return true
    }
}