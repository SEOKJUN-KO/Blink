import { IWarn, monitorSnapshot, WarnOption } from "../interface/IWarning";

export class SoundWarn implements IWarn {
    private audioContext: AudioContext | null = null;
    constructor(
        private options: WarnOption
    ){}
    
    execute(snapshot: monitorSnapshot): { stop: () => void } {
        console.log(snapshot)
        if (!this.audioContext) {
            console.warn('Web Audio API is not supported in this browser');
            return { stop: () => { /* 아무것도 안 함 */ } };
        }
        const timer = setTimeout(() => {
            this.playBlinkSound();
        }, snapshot.threshold);
        return { stop: () => { clearTimeout(timer); } };
    }

    private playBlinkSound(): void {
        if (!this.audioContext) return;

        // 오실레이터 생성 (깜빡임 소리)
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // 소리 설정
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);

        // 볼륨 설정 (페이드 인/아웃)
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05); // 페이드 인
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3); // 페이드 아웃

        // 연결 및 재생
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3); // 0.3초 재생

        // 두 번째 깜빡임 소리 (약간 지연)
        setTimeout(() => {
            const oscillator2 = this.audioContext!.createOscillator();
            const gainNode2 = this.audioContext!.createGain();

            oscillator2.type = 'sine';
            oscillator2.frequency.setValueAtTime(600, this.audioContext!.currentTime);
            oscillator2.frequency.exponentialRampToValueAtTime(300, this.audioContext!.currentTime + 0.08);

            gainNode2.gain.setValueAtTime(0, this.audioContext!.currentTime);
            gainNode2.gain.linearRampToValueAtTime(0.2, this.audioContext!.currentTime + 0.04);
            gainNode2.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.25);

            oscillator2.connect(gainNode2);
            gainNode2.connect(this.audioContext!.destination);
            
            oscillator2.start(this.audioContext!.currentTime);
            oscillator2.stop(this.audioContext!.currentTime + 0.25);
        }, 150); // 150ms 지연
    }
}