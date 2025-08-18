import { DBGateway } from "../interface/DBGateway";
import { IMonitor } from "../interface/IMonitor";

export class MonitorContextRepo implements DBGateway<string, IMonitor> {
    private map = new Map<string, IMonitor>();

    public get(key: string): IMonitor | null {
        return this.map.get(key) ?? null;
    }

    public set(key: string, data: IMonitor): boolean {
        this.map.set(key, data);
        return true;
    }

    public delete(key: string): boolean {
        return this.map.delete(key);
    }
}