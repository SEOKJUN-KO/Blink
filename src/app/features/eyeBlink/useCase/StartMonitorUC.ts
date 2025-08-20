import { DBGateway } from "@/app/interface/DBGateway";
import { ISensor } from "@/app/interface/ISensor";
import { ServiceType } from "@/app/type/ServiceType";
import { IUseCase } from "@/app/interface/IUseCase"
import { IMonitor } from "@/app/interface/IMonitor";
import { BlinkMonitorContext } from "../entity/BlinkMonitorContext";
import { IWarningExecutor } from "@/app/interface/IWarning";
import { IDefaultPresenter } from "@/app/interface/IPresenter";

export class StartMonitorUC implements IUseCase<{ type: ServiceType}, boolean> {

    constructor(
        private sensor: ISensor,
        private db: DBGateway<string, IMonitor>,
        private warn: IWarningExecutor,
        private presenter: IDefaultPresenter<any>,
    ) {}

    async execute(req: {type: ServiceType}): Promise<boolean> {
        let context = this.db.get(req.type) ??  new BlinkMonitorContext('ENDED', new Date(), 5)
        context.startMonitoring()
        context.recordEvent(new Date())
        const dbStatus = this.db.set(req.type, context)
        if (!dbStatus) { return false }
        this.sensor.listen(req.type, this.eventCallback)
        const data = context.snapshot()
        this.presenter.present(data)
        return true
    }

    private eventCallback = (value: number): void => {
        const data = this.db.get('blink')?.snapshot()
        if (data == undefined || data.threshold == undefined) { return ; }
        const threshold = data.threshold
        this.warn.setWarning({threshold: threshold})
        this.presenter.present({lastBlinkAt: new Date()})
    };
}