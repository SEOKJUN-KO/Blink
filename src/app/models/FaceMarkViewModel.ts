import { FaceLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

export default function FaceMarkViewModel() {
    console.log("FaceMarkViewModel이 초기화되었습니다.");
    let faceLandmarker: FaceLandmarker | undefined;
    let runningMode: "IMAGE" | "VIDEO" = "IMAGE";
    let webcamRunning: Boolean = false;
    const videoWidth = 480;

    // Before we can use HandLandmarker class we must wait for it to finish
    // loading. Machine Learning models can be large and take a moment to
    // get everything needed to run.
    async function createFaceLandmarker() {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `/face_landmarker.task`,
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode,
        numFaces: 1
      });
      console.log("얼굴 랜드마커가 업로드되었습니다.");
    }
    createFaceLandmarker();

    // Internal state for webcam detection
    let lastVideoTime = -1;
    let results: any = undefined;

    // Helper function to check if webcam access is supported.
    function hasGetUserMedia() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    // Function to enable/disable webcam and start detection
    async function enableCam(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement, webcamButton: HTMLButtonElement, blendShapesElement: HTMLElement) {
      if (!faceLandmarker) {
        console.log("기다리세요! 얼굴 랜드마커가 아직 로드되지 않았습니다.");
        return;
      }

      if (webcamRunning === true) {
        webcamRunning = false;
        webcamButton.innerText = "예측 활성화";
      } else {
        webcamRunning = true;
        webcamButton.innerText = "예측 비활성화";
      }

      const constraints = { video: true };

      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        videoElement.srcObject = stream;
        videoElement.addEventListener("loadeddata", () => predictWebcam(videoElement, canvasElement, blendShapesElement));
      });
    }

    async function predictWebcam(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement, blendShapesElement: HTMLElement) {
      if (!faceLandmarker) {
        console.log("기다리세요! predictWebcam에서 얼굴 랜드마커가 아직 로드되지 않았습니다.");
        window.requestAnimationFrame(() => predictWebcam(videoElement, canvasElement, blendShapesElement));
        return;
      }

      const radio = videoElement.videoHeight / videoElement.videoWidth;
      videoElement.style.width = videoWidth + "px";
      videoElement.style.height = videoWidth * radio + "px";
      canvasElement.style.width = videoWidth + "px";
      canvasElement.style.height = videoWidth * radio + "px";
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      const canvasCtx = canvasElement.getContext("2d") as CanvasRenderingContext2D;
      const drawingUtils = new DrawingUtils(canvasCtx);

      if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await faceLandmarker.setOptions({ runningMode: runningMode });
      }

      let startTimeMs = performance.now();
      if (lastVideoTime !== videoElement.currentTime) {
        lastVideoTime = videoElement.currentTime;
        results = faceLandmarker.detectForVideo(videoElement, startTimeMs);
      }

      if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            { color: "#C0C0C070", lineWidth: 1 }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
            { color: "#FF3030" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
            { color: "#FF3030" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
            { color: "#30FF30" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
            { color: "#30FF30" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
            { color: "#E0E0E0" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LIPS,
            { color: "#E0E0E0" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
            { color: "#FF3030" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
            { color: "#30FF30" }
          );
        }
      }
      if (results.faceBlendshapes) {
        drawBlendShapes(blendShapesElement, results.faceBlendshapes);
      }

      if (webcamRunning === true) {
        window.requestAnimationFrame(() => predictWebcam(videoElement, canvasElement, blendShapesElement));
      }
    }

    function drawBlendShapes(el: HTMLElement, blendShapes: any[]) {
      if (!blendShapes.length) {
        return;
      }

      console.log(blendShapes[0]);

      let htmlMaker = "";
      blendShapes[0].categories
        .filter((shape: any) => {
          const name = (shape.displayName || shape.categoryName).toLowerCase();
          return name.includes("eye") || name.includes("blink") || name.includes("brow") || name.includes("squint") || name.includes("gaze");
        })
        .map((shape: any) => {
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

      el.innerHTML = htmlMaker;
    }

    return {
        faceLandmarker,
        runningMode,
        webcamRunning,
        videoWidth,
        hasGetUserMedia,
        enableCam,
        drawBlendShapes
    }
}

