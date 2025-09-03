import { DBGateway } from "@/app/interface/DBGateway";
import { ISensor } from "@/app/interface/ISensor";
import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { AdjustableMonitor } from "@/app/interface/IMonitor";
import { BlinkMonitorContext } from "../entity/BlinkMonitorContext";
import { IWarningExecutor } from "@/app/interface/IWarning";
import { IDefaultPresenter } from "@/app/interface/IPresenter";
import { IResolver } from "@/app/interface/Resolver";
import { DI_TOKENS } from "@/app/di/DI_Token";

export class StartMonitorUC implements IUseCase<{ type: ServiceType }, boolean> {
    private readonly sensor: ISensor;
    private readonly db: DBGateway<string, AdjustableMonitor>;
    private readonly presenter: IDefaultPresenter<any>;
    private readonly warn: IWarningExecutor;

    constructor(
        private readonly resolve: IResolver
    ) {
        this.sensor = this.resolve.get<ISensor>(DI_TOKENS.Blink.Sensor);
        this.db = this.resolve.get<DBGateway<string, AdjustableMonitor>>(DI_TOKENS.Blink.DB);
        this.presenter = this.resolve.get<IDefaultPresenter<any>>(DI_TOKENS.Blink.Presenter);
        this.warn = this.resolve.get<IWarningExecutor>(DI_TOKENS.Blink.Warn);
    }
    
    async execute(req: {type: ServiceType}): Promise<boolean> {
        let context = this.db.get(req.type) ??  new BlinkMonitorContext('ENDED', new Date(), 5)
        context.startMonitoring()
        context.resetEvent()
        const dbStatus = this.db.set(req.type, context)
        if (!dbStatus) { return false }
        if ( this.sensor.canUse() ) {
            this.sensor.listen(req.type, this.eventCallback)
            const data = context.snapshot()
            this.presenter.present(data)
            return true
        }
        alert('카메라 사용 불가능합니다. \n[노트북, 데스크탑의 크롬, 엣지 추천]')
        return false
    }

    private eventCallback = (value: number): void => {
        const ctx = this.db.get('blink')
        if (ctx == undefined || ctx.snapshot().threshold == undefined) { return ; }
        const data = ctx.snapshot()
        ctx.recordEvent(new Date())
        this.db.set('blink', ctx)
        const threshold = data.threshold
        this.warn.setWarning({threshold: threshold}, this.presenter.present.bind(this.presenter))
        this.presenter.present({lastBlinkAt: ctx.snapshot().lastBlinkAt})
    };
}