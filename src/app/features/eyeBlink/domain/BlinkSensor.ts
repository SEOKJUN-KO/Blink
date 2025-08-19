import { ServiceType } from '@/app/type/ServiceType';
import { ISensor } from '../../../interface/ISensor';

export class BlinkSensor implements ISensor {
  private animationFrameId: number | null = null;
  private listeners: Map<string, (value: number) => void> = new Map();
  private worker: Worker | null = null;
  private isWorkerMode: boolean = false;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  
  constructor(
    private videoElement: HTMLVideoElement
  ) {}

  public getCurrentValue(): number {
    // 워커에서 처리하므로 0 반환 (필요시 워커에서 요청)
    return 0;
  }

  public async listen(event: string, listener: (value: number) => void): Promise<void> {
    this.listeners.set(event, listener);
    
    if (!this.isWorkerMode) {
      await this.startWorkerMode();
    }
  }

  public async off(event: string): Promise<void> {
    this.listeners.delete(event);
    
    if (this.listeners.size === 0) {
      this.destructor();
    }
  }

  private async startWorkerMode(): Promise<void> {
    if (this.isWorkerMode) {
      console.warn('워커 모드가 이미 활성화되어 있습니다.');
      return;
    }
    
    try {
      this.startVideoStream();
      this.worker = await this.createWorker();
      this.isWorkerMode = true;
    } catch (error) {
      this.destructor();
      throw error;
    }
  }

  private startVideoStream(): void {
    const constraints = { video: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.videoElement.srcObject = stream;
      this.videoElement.play().then(() => {
      }).catch((e) => {
        console.warn("비디오 재생 실패:", e);
      });
    });
  }

  private async createWorker(): Promise<Worker> {
    try {
      const worker = new Worker(
        new URL('../worker/blinkDetectWorker.ts', import.meta.url),
        { type: 'module' }
      );
      
      worker.onmessage = (event) => this.handleWorkerMessage(event);
      
      worker.onerror = (error) => {
        console.error('워커 에러:', error);
      };
      
      worker.postMessage({ 
        type: 'initialize',
        data: {
          modelPath: '/face_landmarker.task'
        }
      });
      
      return worker;
    } catch (error) {
      console.error('워커 생성 실패:', error);
      throw error;
    }
  }

  private handleWorkerMessage(event: MessageEvent): void {
    const { type, data } = event.data;
    switch (type) {
      case 'requestVideoFrame':
        this.sendingVideoFrame();
        break;
      case 'eyeStatus':
        if(this.isBlink(data.status)) {
          this.notifyListeners('blink', this.lastBlinkTime);
        }
        break;
      case 'error':
        console.error('워커 오류:', data.message);
        break;
    }
  }

  private sendingVideoFrame(): void {
    if (!this.worker) return;
    
    if (!this.canvas) {
      this.initCanvas();
    }
    this.updateCanvasSize();
    
    if (this.canvas && this.ctx) {
      this.ctx.drawImage(this.videoElement, 0, 0);
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      
      // 워커에 ImageData와 timestamp 전달
      this.worker.postMessage({
        type: 'getEyeStatus',
        data: {
          videoData: imageData,
          timestamp: performance.now()
        }
      });
    }
  }

  private initCanvas(): void {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  // Canvas 크기 업데이트
  private updateCanvasSize(): void {
    if (this.canvas && this.videoElement.videoWidth > 0) {
      this.canvas.width = this.videoElement.videoWidth;
      this.canvas.height = this.videoElement.videoHeight;
    }
  }

  private eyeStatus: "open" | "close" = "open";
  private blinkLimitScore = 0.4;
  private lastBlinkTime = 0;
  private isBlink(eyeScore: number): boolean {
    const nowBlinkScore = eyeScore;
    const nowEyeStatus: "open" | "close" = nowBlinkScore > this.blinkLimitScore ? "close" : "open";
    
    if (this.eyeStatus === "open" && nowEyeStatus === "close") {
      this.eyeStatus = "close";
    } 
    else if (this.eyeStatus === "close" && nowEyeStatus === "open") {
      this.eyeStatus = "open";
      this.lastBlinkTime = performance.now();
      console.log('blink')
      return true; // 감았다 뜬 것
    }
    return false;
  }

  destructor() {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.srcObject = null;
    }

    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    // Canvas 정리
    if (this.canvas) {
      this.canvas.width = 0;
      this.canvas.height = 0;
      this.canvas = null;
      this.ctx = null;
    }

    this.isWorkerMode = false;
  }

  private notifyListeners(event: ServiceType, value: number): void {
    const listener = this.listeners.get(event);
    if (listener) {
      listener(value);
    }
  }
} 