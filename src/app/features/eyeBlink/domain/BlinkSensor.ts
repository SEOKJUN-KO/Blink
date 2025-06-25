import { ISensor } from '../interface/ISensor';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export class BlinkSensor implements ISensor {
  private faceLandmarker: FaceLandmarker | undefined;
  private animationFrameId: number | null = null;
  private listeners: Map<string, (value: number) => void> = new Map();
  private webcamRunning: boolean = false;
  constructor(
    private videoElement: HTMLVideoElement
  ) {}

  destructor() {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.srcObject = null;
    }

    if (this.faceLandmarker) {
      this.faceLandmarker.close();
      this.faceLandmarker = undefined;
    }
    this.webcamRunning = false;
    this.results = undefined;
    this.lastVideoTime = 0;
  }

  private async makeDectector(): Promise<void> {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    // FaceLandmarker 모델을 옵션과 함께 생성합니다.
    this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: `/face_landmarker.task`, // 모델 파일 경로
        delegate: "GPU" // GPU 위임 사용 (성능 향상)
      },
      outputFaceBlendshapes: true, // 얼굴 블렌드셰이프 출력 활성화
      runningMode: "VIDEO",
      numFaces: 1 // 감지할 최대 얼굴 수
    });
  }

  private startVideoStream(): void {
    const constraints = { video: true };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.videoElement.srcObject = stream;
      this.videoElement.play().then(() => {
        this.predictWebcam();
      }).catch((e) => {
        console.warn("비디오 재생 실패:", e);
      });
    });
  }

  private lastVideoTime = 0;
  private results: any = undefined;

  private async predictWebcam() {

    let startTimeMs = performance.now();
    if (this.lastVideoTime !== this.videoElement.currentTime) {
      this.lastVideoTime = this.videoElement.currentTime;
      if (this.faceLandmarker) {
        this.results = this.faceLandmarker.detectForVideo(this.videoElement, startTimeMs);
      } else {
        console.warn("FaceLandmarker가 초기화되지 않았습니다.");
      }
    }
    if(this.results) {
      this.handleDetectionResults(this.results);
    }
    if (this.webcamRunning === true) {
      this.animationFrameId = window.requestAnimationFrame(() => this.predictWebcam());
    }
  }

  private handleDetectionResults(results: any) {
    if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
      const categories = results.faceBlendshapes[0].categories;
      if (this.isBlink(categories)) {
        this.notifyListeners('blinkDetected', this.lastBlinkTime);
      }
    }
  }

  private eyeStatus: "open" | "close" = "open";
  private blinkLimitScore = 0.4;
  private lastBlinkTime = 0;
  private isBlink(eyeBlinkShapes: any[]): boolean {
    // eyeBlinkShapes는 blendShapes[0].categories 형태로 전달됨
    const eyeBlinkLeftShape = eyeBlinkShapes.find((shape: any) => shape.categoryName === "eyeBlinkLeft");
    const eyeBlinkRightShape = eyeBlinkShapes.find((shape: any) => shape.categoryName === "eyeBlinkRight");

    if (!eyeBlinkLeftShape || !eyeBlinkRightShape) {
      console.warn("눈 깜빡임 데이터를 찾을 수 없습니다:", eyeBlinkShapes);
      return false;
    }

    const eyeBlinkLeftScore = eyeBlinkLeftShape.score;
    const eyeBlinkRightScore = eyeBlinkRightShape.score;

    const nowBlinkScore = (eyeBlinkLeftScore + eyeBlinkRightScore) / 2;
    const nowEyeStatus: "open" | "close" = nowBlinkScore > this.blinkLimitScore ? "close" : "open";
    
    if (this.eyeStatus === "open" && nowEyeStatus === "close") {
      this.eyeStatus = "close";
    } 
    else if (this.eyeStatus === "close" && nowEyeStatus === "open") {
      this.eyeStatus = "open";
      this.lastBlinkTime = performance.now();
      return true; // 감았다 뜬 것
    }
    return false;
  }

  private notifyListeners(event: string, value: number): void {
    const listener = this.listeners.get(event);
    if (listener) {
      listener(value);
    }
  }

  getCurrentValue(): number {
    if (this.lastBlinkTime === 0) {
      return 0; // 아직 깜빡임이 감지되지 않았으면 0 반환
    }
    const currentTime = performance.now();
    const elapsedSeconds = (currentTime - this.lastBlinkTime) / 1000;
    return elapsedSeconds;
  }

  public async listen(event: string, listener: (value: number) => void): Promise<void> {
    this.listeners.set(event, listener);
    
    if (this.faceLandmarker === undefined) {
      await this.makeDectector();
    }
    this.webcamRunning = true;
    this.startVideoStream();
  }

  public async off(event: string): Promise<void> {
    this.listeners.delete(event);
    
    if (this.listeners.size === 0) {
      this.destructor();
    }
  }
} 