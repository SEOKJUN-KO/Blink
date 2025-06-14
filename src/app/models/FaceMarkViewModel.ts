import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

/**
 * 웹캠 기반 얼굴 랜드마크 감지 및 블렌드셰이프 표시를 관리하는 ViewModel.
 */
export default function FaceMarkViewModel(onBlinkDetect?: (blinkValue: number) => void) {
    console.log("FaceMarkViewModel이 초기화되었습니다."); // 초기화 로그 복구
    // 얼굴 랜드마커 모델 인스턴스
    let faceLandmarker: FaceLandmarker | undefined;
    // 현재 실행 모드: 이미지 또는 비디오
    let runningMode: "IMAGE" | "VIDEO" = "IMAGE";
    // 웹캠 실행 상태 (활성/비활성)
    let webcamRunning: Boolean = false;
    // 비디오 너비 설정
    const videoWidth = 360;

    // 깜빡임 감지를 위한 상태 변수
    let isEyeClosed = false; // 현재 눈이 감겨있는지 여부
    let lastBlinkDetectedTime: number | null = null; // 마지막으로 깜빡임이 감지된 시간 (밀리초)
    const BLINK_THRESHOLD = 0.5; // 눈이 감겼다고 판단하는 임계값 (조정 가능) - 복구

    // FaceLandmarker 클래스를 사용하기 전에 로딩이 완료될 때까지 기다려야 합니다.
    // 머신러닝 모델은 크기가 커서 로드하는 데 시간이 걸릴 수 있습니다.
    async function createFaceLandmarker() {
      // 비전 작업을 위한 FilesetResolver를 초기화합니다.
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      // FaceLandmarker 모델을 옵션과 함께 생성합니다.
      faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `/face_landmarker.task`, // 모델 파일 경로
          delegate: "GPU" // GPU 위임 사용 (성능 향상)
        },
        outputFaceBlendshapes: true, // 얼굴 블렌드셰이프 출력 활성화
        runningMode, // 현재 실행 모드 (IMAGE 또는 VIDEO)
        numFaces: 1 // 감지할 최대 얼굴 수
      });
      console.log("얼굴 랜드마커가 업로드되었습니다."); // 업로드 로그 복구
    }
    // FaceLandmarker 모델 로드 함수를 호출합니다.
    createFaceLandmarker();

    // 웹캠 감지를 위한 내부 상태 변수들
    // 마지막 비디오 프레임 시간 (중복 처리 방지용)
    let lastVideoTime = -1;
    // 얼굴 감지 결과 저장 변수
    let results: any = undefined;

    // 웹캠 접근이 지원되는지 확인하는 헬퍼 함수
    function hasGetUserMedia() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    /**
     * 웹캠을 활성화/비활성화하고 얼굴 랜드마크 감지를 시작하는 함수.
     * @param videoElement 비디오 HTML 요소
     * @param canvasElement 캔버스 HTML 요소
     * @param webcamButton 웹캠 제어 버튼 HTML 요소
     * @param blendShapesElement 블렌드셰이프 결과를 표시할 HTML 요소
     */
    async function enableCam(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement, webcamButton: HTMLButtonElement, blendShapesElement: HTMLElement) {
      // 랜드마커 모델이 로드될 때까지 기다립니다.
      if (!faceLandmarker) {
        console.log("기다리세요! 얼굴 랜드마커가 아직 로드되지 않았습니다.");
        return;
      }

      // 웹캠 실행 상태를 토글하고 버튼 텍스트를 업데이트합니다.
      if (webcamRunning === true) {
        webcamRunning = false;
        webcamButton.innerText = "예측 활성화";
      } else {
        webcamRunning = true;
        webcamButton.innerText = "예측 비활성화";
      }

      // 웹캠 접근을 위한 제약 조건 설정
      const constraints = { video: true };

      // 웹캠 스트림을 활성화하고 비디오 요소에 연결합니다.
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        videoElement.srcObject = stream;
        // 비디오 데이터 로드 완료 시 예측 함수를 호출합니다.
        videoElement.addEventListener("loadeddata", () => predictWebcam(videoElement, canvasElement, blendShapesElement));
      });
    }

    /**
     * 웹캠 스트림에서 얼굴 랜드마크를 지속적으로 예측하는 함수.
     * @param videoElement 비디오 HTML 요소
     * @param canvasElement 캔버스 HTML 요소
     * @param blendShapesElement 블렌드셰이프 결과를 표시할 HTML 요소
     */
    async function predictWebcam(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement, blendShapesElement: HTMLElement) {
      // 랜드마커 모델이 로드될 때까지 기다립니다.
      if (!faceLandmarker) {
        console.log("기다리세요! predictWebcam에서 얼굴 랜드마커가 아직 로드되지 않았습니다.");
        window.requestAnimationFrame(() => predictWebcam(videoElement, canvasElement, blendShapesElement));
        return;
      }

      // 비디오 및 캔버스의 크기 조정 및 스타일 설정
      const radio = videoElement.videoHeight / videoElement.videoWidth;
      videoElement.style.width = videoWidth + "px";
      videoElement.style.height = videoWidth * radio + "px";
      canvasElement.style.width = videoWidth + "px";
      canvasElement.style.height = videoWidth * radio + "px";
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      // 캔버스 2D 컨텍스트 및 그리기 유틸리티 초기화
      const canvasCtx = canvasElement.getContext("2d") as CanvasRenderingContext2D;
      const drawingUtils = new DrawingUtils(canvasCtx);

      // 실행 모드가 'IMAGE'이면 'VIDEO'로 변경하고 옵션을 업데이트합니다.
      if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await faceLandmarker.setOptions({ runningMode: runningMode });
      }

      // 현재 비디오 시간과 마지막 처리 시간을 비교하여 새로운 프레임인지 확인합니다.
      let startTimeMs = performance.now();
      if (lastVideoTime !== videoElement.currentTime) {
        lastVideoTime = videoElement.currentTime;
        // 비디오 프레임에서 얼굴을 감지합니다.
        results = faceLandmarker.detectForVideo(videoElement, startTimeMs);
      }

      // 감지 결과를 처리합니다.
      handleDetectionResults(results, canvasCtx, drawingUtils, blendShapesElement, onBlinkDetect);

      // 웹캠이 실행 중이면 다음 애니메이션 프레임에 예측 함수를 다시 호출합니다.
      if (webcamRunning === true) {
        window.requestAnimationFrame(() => predictWebcam(videoElement, canvasElement, blendShapesElement));
      }
    }

    /**
     * 얼굴 감지 결과를 처리하는 함수.
     * 랜드마크를 그리고 블렌드셰이프를 처리합니다.
     * @param results 감지 결과 객체
     * @param canvasCtx 캔버스 2D 컨텍스트
     * @param drawingUtils 그리기 유틸리티
     * @param blendShapesElement 블렌드셰이프 결과를 표시할 HTML 요소
     * @param onBlinkDetectCallback 깜빡임 감지 시 호출될 콜백 함수
     */
    function handleDetectionResults(results: any, canvasCtx: CanvasRenderingContext2D, drawingUtils: DrawingUtils, blendShapesElement: HTMLElement, onBlinkDetectCallback?: (blinkValue: number) => void) {
      // 얼굴 특징 그리기 (랜드마크, 눈, 얼굴 윤곽 등)
      if (results.faceLandmarks) {
        drawFaceLandmarks(drawingUtils, results.faceLandmarks);
      }

      // 블렌드셰이프 결과가 있다면 처리 함수를 호출합니다.
      if (results.faceBlendshapes) {
        handleBlendShapes(blendShapesElement, results.faceBlendshapes, onBlinkDetectCallback);
      }
    }

    /**
     * 얼굴 랜드마크를 캔버스에 그리는 함수.
     * @param drawingUtils 그리기 유틸리티
     * @param faceLandmarks 얼굴 랜드마크 데이터
     */
    function drawFaceLandmarks(drawingUtils: DrawingUtils, faceLandmarks: any[]) {
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

    /**
     * 블렌드셰이프 데이터를 처리하고 UI에 표시하며 깜빡임을 감지하는 함수.
     * @param el 블렌드셰이프를 표시할 HTML 요소 (ul)
     * @param blendShapes 블렌드셰이프 데이터 배열
     * @param onBlinkDetectCallback 깜빡임 감지 시 호출될 콜백 함수
     */
    function handleBlendShapes(el: HTMLElement, blendShapes: any[], onBlinkDetectCallback?: (blinkValue: number) => void) {
      // 블렌드셰이프 데이터가 없으면 함수를 종료합니다.
      if (!blendShapes.length) {
        return;
      }

      // 첫 번째 블렌드셰이프 카테고리 데이터를 콘솔에 출력 (디버깅용)
      // console.log(blendShapes[0]); // 로그 제거

      let eyeBlinkLeftScore = 0;
      let eyeBlinkRightScore = 0;

      const eyeBlinkShapes = blendShapes[0].categories
        // 'eyeBlinkLeft'와 'eyeBlinkRight' 블렌드셰이프만 필터링합니다.
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

      // 눈 깜빡임 감지 로직을 처리합니다.
      processBlinkDetection(eyeBlinkLeftScore, eyeBlinkRightScore, onBlinkDetectCallback);
      
      // 눈 깜빡임 블렌드셰이프 값을 UI에 렌더링합니다.
      renderEyeBlinkShapes(el, eyeBlinkShapes);
    }

    /**
     * 눈 깜빡임 감지 로직을 수행하는 함수.
     * @param eyeBlinkLeftScore 왼쪽 눈 깜빡임 점수
     * @param eyeBlinkRightScore 오른쪽 눈 깜빡임 점수
     * @param onBlinkDetectCallback 깜빡임 감지 시 호출될 콜백 함수
     */
    function processBlinkDetection(eyeBlinkLeftScore: number, eyeBlinkRightScore: number, onBlinkDetectCallback?: (blinkValue: number) => void) {
      // 두 눈 깜빡임 점수 중 최대값을 사용하여 현재 눈 깜빡임 점수를 계산합니다.
      const currentBlinkScore = Math.max(eyeBlinkLeftScore, eyeBlinkRightScore);

      // 눈이 감겼다고 판단되는 경우
      if (currentBlinkScore > BLINK_THRESHOLD) {
        if (!isEyeClosed) { // 이전에 눈이 열려있었는데 이제 감겼다면
          isEyeClosed = true; // 눈 감김 상태로 전환
        }
      } else { // 눈이 열렸다고 판단되는 경우
        if (isEyeClosed) { // 이전에 눈이 감겨있었는데 이제 열렸다면 (깜빡임 감지)
          const currentTime = performance.now();
          if (lastBlinkDetectedTime !== null && onBlinkDetectCallback) {
            const blinkIntervalSeconds = (currentTime - lastBlinkDetectedTime) / 1000;
            onBlinkDetectCallback(parseFloat(blinkIntervalSeconds.toFixed(2)));
          }
          lastBlinkDetectedTime = currentTime; // 마지막 깜빡임 시간 업데이트
          isEyeClosed = false; // 눈 열림 상태로 전환
        }
      }
    }

    /**
     * 눈 깜빡임 블렌드셰이프 값을 HTML 요소에 표시하는 함수.
     * @param el 블렌드셰이프를 표시할 HTML 요소 (ul)
     * @param eyeBlinkShapes 필터링된 눈 깜빡임 블렌드셰이프 데이터 배열
     */
    function renderEyeBlinkShapes(el: HTMLElement, eyeBlinkShapes: any[]) {
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

    // 외부에서 접근 가능한 속성 및 함수들을 반환합니다.
    return {
        faceLandmarker,
        runningMode,
        webcamRunning,
        videoWidth,
        hasGetUserMedia,
        enableCam,
        // drawBlendShapes 제거, renderEyeBlinkShapes는 내부용
    }
}

