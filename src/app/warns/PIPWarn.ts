import { IWarn, monitorSnapshot, WarnOption } from "../interface/IWarning";

export class PIPWarn implements IWarn {
    constructor(
        private option: WarnOption
    ){}

    execute(snapshot: monitorSnapshot): { stop: () => {}; } {
        throw new Error("Method not implemented.");
    }
}