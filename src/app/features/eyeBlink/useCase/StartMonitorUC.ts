import { DBGateway } from "@/app/interface/DBGateway";
import { IMonitor } from "@/app/interface/IMonitor";
import { IWarningExecutor } from "@/app/interface/IWarning";
import { ServiceType } from "@/app/type/ServiceType";

export class StartMonitorUC {
  constructor(
    private binder: SensorBinder,
    private contextF: MonitorContextFactory,
    private warn: IWarningExecutor,
    private db: DBGateway<string, IMonitor>,
    private policy: WarningPolicy, // ← 서비스별 로직은 여기
  ) {}

  async execute(req: { type: ServiceType; initial?: any }): Promise<{ stop(): void }> {
    const context = this.contextF.create(req.type, req.initial);
    if (!this.db.set(req.type, context)) throw new Error("DB set failed");

    context.startMonitoring();

    const unbind = await this.binder.bind(req.type, (raw: any) => {
      this.policy.onEvent(req.type, context, raw, this.warn);
    });

    return {
      stop: () => {
        unbind();
        context.stopMonitoring();
        this.db.delete(req.type);
      },
    };
  }
}