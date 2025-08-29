import { IWarn, monitorSnapshot, WarnOption } from "../interface/IWarning";

export class PIPWarn implements IWarn {
    private flick = false;
    
    constructor(
        private option: WarnOption
    ){}

    canUse(): boolean {
		if ( typeof window !== 'undefined' && 'documentPictureInPicture' in window ) {
            return true
        }
        alert('PIP를 지원하지 않는 브라우저입니다.\n[크롬, 엣지 추천]')
        return false
    }

    execute(snapshot: monitorSnapshot, present: (data: any) => void ): { stop: () => void } {
        const delay = typeof snapshot.threshold === "number" && snapshot.threshold < 1000
            ? snapshot.threshold * 1000
            : snapshot.threshold;
        let intervalId: NodeJS.Timeout | null = null;

        const timeoutId = setTimeout(() => {
            this.flick = !this.flick;
            present({ pipFlick: this.flick });
            intervalId = setInterval(() => {
                if (typeof present === "function") {
                    this.flick = !this.flick;
                    present({ pipFlick: this.flick });
                }
            }, 800); 
        }, delay);

        return { stop: () => { 
            clearTimeout(timeoutId);
            if (intervalId) {
                clearInterval(intervalId);
            }
        } };
    }
}