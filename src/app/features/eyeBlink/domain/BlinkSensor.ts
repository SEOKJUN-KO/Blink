import { ISensor } from '../interface/ISensor';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export class BlinkSensor implements ISensor {
  private faceLandmarker: FaceLandmarker | undefined;
  private webcamRunning: boolean = false;

  constructor(
    private videoElement: HTMLVideoElement,
    private canvasElement: HTMLCanvasElement,
  ) {}

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
  
  private lastVideoTime = -1;
  private results: any = undefined;

  private predictWebcam() {
    
    const radio = this.videoElement.videoHeight / this.videoElement.videoWidth;
    this.canvasElement.style.width = this.videoElement.videoWidth + "px";
    this.canvasElement.style.height = this.videoElement.videoWidth * radio + "px";
    this.canvasElement.width = this.videoElement.videoWidth;
    this.canvasElement.height = this.videoElement.videoHeight;

    let startTimeMs = performance.now();
    if (this.lastVideoTime !== this.videoElement.currentTime) {
      this.lastVideoTime = this.videoElement.currentTime;
      if (this.faceLandmarker) {
        this.results = this.faceLandmarker.detectForVideo(this.videoElement, startTimeMs);
      } else {
        console.warn("FaceLandmarker가 초기화되지 않았습니다.");
      }
    }
    this.handleDetectionResults(this.results);
    if (this.webcamRunning === true) {
      window.requestAnimationFrame(() => this.predictWebcam());
    }
  }

  private handleDetectionResults(results: any) {
    if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
      const categories = results.faceBlendshapes[0].categories;
      if (this.checkBlink(categories)) {
        alert("Blink detected");
      }
    }
  }

  private eyeStatus: "open" | "close" = "open";
  private blinkLimitScore = 0.4;
  private lastBlinkTime = 0;
  private checkBlink(eyeBlinkShapes: any[]): boolean {
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
      this.lastBlinkTime = performance.now(); // 깜빡임이 완료될 때 시간 업데이트
      return true; // 감았다 뜬 것
    }
    return false;
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
    if (this.faceLandmarker === undefined) {
      this.webcamRunning = true;
      await this.makeDectector();
    }

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

  public async off(event: string, listener: (value: number) => void): Promise<void> {
    if (this.webcamRunning === true) {
      this.videoElement.srcObject = null;
      this.webcamRunning = false;
    }
  }
} 