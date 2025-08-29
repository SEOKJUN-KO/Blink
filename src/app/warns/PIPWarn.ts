import { IWarn, monitorSnapshot, WarnOption } from "../interface/IWarning";

export class PIPWarn implements IWarn {
    constructor(
        private option: WarnOption
    ){
        if (typeof window !== "undefined") {
            // 브라우저 호환성 체크
            const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
            if (AudioCtx) {
                this.audioContext = new AudioCtx();
            } else {
                this.audioContext = null;
            }
        }
    }

    execute(snapshot: monitorSnapshot): { stop: () => {}; } {
        throw new Error("Method not implemented.");
    }
}