import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

class VideoProcessor {
  private faceLandmarker: FaceLandmarker | undefined;
  private animationFrameId: number | null = null;
  private modelPath: string = '/face_landmarker.task'; // 기본값
  private canvas: OffscreenCanvas | null = null; // OffscreenCanvas 재사용
  private ctx: OffscreenCanvasRenderingContext2D | null = null; // Context 재사용

  destructor() {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.faceLandmarker) {
      this.faceLandmarker.close();
      this.faceLandmarker = undefined;
    }
    
    // Canvas 정리
    if (this.canvas) {
      this.canvas.width = 0;
      this.canvas.height = 0;
      this.canvas = null;
      this.ctx = null;
    }
    
    this.results = undefined;
    this.lastVideoTime = 0;
  }

  setModelPath(path: string): void {
    this.modelPath = path;
  }

  public async makeDectector(): Promise<void> {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    
    const modelUrl = `${self.location.origin}${this.modelPath}`;
    
    this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: modelUrl,
        delegate: "GPU" // GPU 위임 사용 (성능 향상)
      },
      outputFaceBlendshapes: true, // 얼굴 블렌드셰이프 출력 활성화
      runningMode: "VIDEO",
      numFaces: 1 // 감지할 최대 얼굴 수
    });
  }

  private lastVideoTime = 0;
  private results: any = undefined;

  public async predictWebcam(videoData: ImageData, timestamp: number) {
    if (this.lastVideoTime !== timestamp) {
      this.lastVideoTime = timestamp;
      if (this.faceLandmarker) {
        // ImageData를 Canvas로 변환
        this.initCanvas(videoData.width, videoData.height);
        if (this.ctx && this.canvas) {
          this.ctx.putImageData(videoData, 0, 0);
          this.results = this.faceLandmarker.detectForVideo(this.canvas, timestamp);
        }
      } else {
        console.warn("FaceLandmarker가 초기화되지 않았습니다.");
      }
    }
    if(this.results) {
      return this.handleDetectionResults(this.results);
    }
    return -1;
  }

  private handleDetectionResults(results: any): number {
    let categories: any[] = [];
    if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
      categories = results.faceBlendshapes[0].categories;
    }
    const eyeBlinkLeftShape = categories.find((shape: any) => shape.categoryName === "eyeBlinkLeft");
    const eyeBlinkRightShape = categories.find((shape: any) => shape.categoryName === "eyeBlinkRight");

    if (!eyeBlinkLeftShape || !eyeBlinkRightShape) {
      console.warn("눈 깜빡임 데이터를 찾을 수 없습니다:", categories);
      return -1;
    }

    const eyeBlinkLeftScore = eyeBlinkLeftShape.score;
    const eyeBlinkRightScore = eyeBlinkRightShape.score;

    const nowBlinkScore = (eyeBlinkLeftScore + eyeBlinkRightScore) / 2;
    return nowBlinkScore;
  }

  // Canvas 초기화 (한 번만 생성)
  private initCanvas(width: number, height: number): void {
    if (!this.canvas || this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas = new OffscreenCanvas(width, height);
      this.ctx = this.canvas.getContext('2d');
    }
  }
}

// 워커 인스턴스 생성
const videoProcessor = new VideoProcessor();

// 메시지 핸들러
onmessage = async (e) => {
  let intervalId: ReturnType<typeof setInterval> | null = null;
  const { type, data } = e.data;
  try {
    switch (type) {
      case 'initialize':
        if (data && data.modelPath) {
          videoProcessor.setModelPath(data.modelPath);
        }
        await videoProcessor.makeDectector();
        intervalId = setInterval(() => {
          postMessage({type: 'requestVideoFrame'});
        }, 33);
        break;
      
      case 'getEyeStatus':
        const eyeStatus = await videoProcessor.predictWebcam(data.videoData, data.timestamp);
        postMessage({ type: 'eyeStatus', data: { status: eyeStatus } });
        break;

      case 'cleanup':
        videoProcessor.destructor();
        if (intervalId) {
          clearInterval(intervalId);
        }
        postMessage({ type: 'cleanup', success: true });
        break;

      default:
        postMessage({ type: 'error', message: '알 수 없는 메시지 타입입니다.' });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    console.error('워커 에러:', errorMessage);
    postMessage({ type: 'error', message: errorMessage });
  }
};

