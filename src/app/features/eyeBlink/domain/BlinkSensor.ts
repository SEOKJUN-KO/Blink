import { ISensor } from '../interface/ISensor';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

export class BlinkSensor implements ISensor {
  private faceLandmarker: FaceLandmarker | undefined;

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

  getCurrentValue(): number {
    throw new Error('Method not implemented.');
  }
  public async listen(event: string, listener: (value: number) => void): void {
    if (this.faceLandmarker === undefined) {
      await this.makeDectector();
    }
    throw new Error('Method not implemented.');
  }
  off(event: string, listener: (value: number) => void): void {
    throw new Error('Method not implemented.');
  }
} 