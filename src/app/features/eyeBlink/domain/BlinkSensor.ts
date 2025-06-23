import { ISensor } from '../interface/ISensor';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

export class BlinkSensor implements ISensor {
  private faceLandmarker: FaceLandmarker | undefined;
  private webcamRunning: boolean = false;

  constructor(
    private videoElement: HTMLVideoElement,
    private canvasElement: HTMLCanvasElement,
    private blendShapesElement: HTMLUListElement,
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

    const canvasCtx = this.canvasElement.getContext("2d") as CanvasRenderingContext2D;
    const drawingUtils = new DrawingUtils(canvasCtx);

    let startTimeMs = performance.now();
    if (this.lastVideoTime !== this.videoElement.currentTime) {
      this.lastVideoTime = this.videoElement.currentTime;
      if (this.faceLandmarker) {
        this.results = this.faceLandmarker.detectForVideo(this.videoElement, startTimeMs);
        console.log("Detection results:", this.results); // 전체 결과 로깅
      } else {
        console.warn("FaceLandmarker가 초기화되지 않았습니다.");
      }
    }
    this.handleDetectionResults(this.results, drawingUtils, this.blendShapesElement);
    if (this.webcamRunning === true) {
      window.requestAnimationFrame(() => this.predictWebcam());
    }
  }

  private handleDetectionResults(results: any, drawingUtils: DrawingUtils, blendShapesElement: HTMLElement) {
    // 얼굴 특징 그리기 (랜드마크, 눈, 얼굴 윤곽 등)
    if (results.faceLandmarks) {
      this.drawFaceLandmarks(drawingUtils, results.faceLandmarks);
    }
    
    if (results.faceBlendshapes && blendShapesElement) {
      this.handleBlendShapes(blendShapesElement, results.faceBlendshapes);
    }
  }

  private drawFaceLandmarks(drawingUtils: DrawingUtils, faceLandmarks: any[]) {
    for (const landmarks of faceLandmarks) {
      // 얼굴 메시 (tesselation) 연결선 그리기
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_TESSELATION,
        { color: "#C0C0C070", lineWidth: 1 }
      );
      // 오른쪽 눈 연결선 그리기
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
        { color: "#FF3030" }
      );
      // 왼쪽 눈 연결선 그리기
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
        { color: "#30FF30" }
      );
      // 얼굴 윤곽 연결선 그리기
      drawingUtils.drawConnectors(
        landmarks,
        FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
        { color: "#E0E0E0" }
      );
    }
  }

  private handleBlendShapes(el: HTMLElement, blendShapes: any[]) {
    // 요소가 없거나 블렌드셰이프 데이터가 없으면 함수를 종료합니다.
    if (!el || !blendShapes.length) {
      return;
    }

    let eyeBlinkLeftScore = 0;
    let eyeBlinkRightScore = 0;

    const eyeBlinkShapes = blendShapes[0].categories
      .filter((shape: any) => {
        const name = (shape.displayName || shape.categoryName);
        return name === "eyeBlinkLeft" || name === "eyeBlinkRight";
      });

    // 필터링된 블렌드셰이프 데이터를 HTML 문자열로 변환하고 점수를 추출합니다.
    eyeBlinkShapes.map((shape: any) => {
        if (shape.categoryName === "eyeBlinkLeft") {
          eyeBlinkLeftScore = +shape.score;
        } else if (shape.categoryName === "eyeBlinkRight") {
          eyeBlinkRightScore = +shape.score;
        }
    });

    this.renderEyeBlinkShapes(el, eyeBlinkShapes);
  }

  private renderEyeBlinkShapes(el: HTMLElement, eyeBlinkShapes: any[]) {
    // 요소가 없으면 함수를 종료합니다.
    if (!el) {
      return;
    }
    
    let htmlMaker = "";
    eyeBlinkShapes.map((shape: any) => {
        htmlMaker += `
          <li class="blend-shapes-item">
            <span class="blend-shapes-label">${
              shape.displayName || shape.categoryName
            }</span>
            <span class="blend-shapes-value" style="width: calc(${
              +shape.score * 100
            }% - 120px))">${(+shape.score).toFixed(4)}</span>
          </li>
        `;
      });

    // 생성된 HTML을 요소에 삽입하여 표시합니다.
    el.innerHTML = htmlMaker;
  }

  getCurrentValue(): number {
    throw new Error('Method not implemented.');
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