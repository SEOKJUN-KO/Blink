import { IWarn, monitorSnapshot, WarnOption } from "../interface/IWarning";

export class PIPWarn implements IWarn {
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

    execute(snapshot: monitorSnapshot): { stop: () => void; } {
        return { stop: () => { /* 아무것도 안 함 */ } };
    }
}