import { supportedVideoMimeTypes } from "./get-media-recorder-types";
import "./style.css";

async function startApp() {
  const cameraFeedCanvas = document.querySelector("canvas");
  const videoElement = document.querySelector("video");
  const startRectordingButton = document.querySelector("#start-recording");
  const stopRectordingButton = document.querySelector("#stop-recording");
  const timerElement = document.querySelector("#timer");

  cameraFeedCanvas.width = 1024;
  cameraFeedCanvas.height = 768;

  videoElement.width = 1024;
  videoElement.height = 768;

  let mediaRecorder;
  let videoLoadingStartTime;
  let stopped = false;

  startRectordingButton.disabled = true;
  stopRectordingButton.disabled = true;

  await initCamera();

  startRectordingButton.disabled = false;

  startRectordingButton.addEventListener("click", () => {
    mediaRecorder.start(250);
    startRectordingButton.disabled = true;
    stopRectordingButton.disabled = false;
  });
  stopRectordingButton.addEventListener("click", () => {
    videoLoadingStartTime = performance.now();

    mediaRecorder.stop();
    startRectordingButton.disabled = false;
    stopRectordingButton.disabled = true;
  });

  async function initCamera() {
    const videoStream = await requestUserMedia();
    mediaRecorder = new MediaRecorder(videoStream);
    const mediaChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      mediaChunks.push(e.data);
    };

    mediaRecorder.onstart = () => {
      const timerStartTime = performance.now();

      timerElement.style.color = "red";

      function calculateTimer() {
        timerElement.innerHTML = `${Math.floor(
          (performance.now() - timerStartTime) / 1000
        )}s`;

        if (stopped) return;
        requestAnimationFrame(calculateTimer);
      }
      requestAnimationFrame(calculateTimer);
    };

    mediaRecorder.onstop = () => {
      stopped = true;
      timerElement.style.color = "white";

      const blob = new Blob(mediaChunks, {
        type: supportedVideoMimeTypes[0]
      });

      videoElement.src = URL.createObjectURL(blob);
    };

    videoElement.addEventListener("loadeddata", () => {
      alert(`Video created in ${performance.now() - videoLoadingStartTime}ms`);

      stopped = false;
    });

    const cameraFeedVideo = document.createElement("video");
    cameraFeedVideo.srcObject = videoStream;
    cameraFeedVideo.play();

    function drawCameraFeedCanvas() {
      const context = cameraFeedCanvas.getContext("2d");

      context.drawImage(cameraFeedVideo, 0, 0);

      requestAnimationFrame(drawCameraFeedCanvas);
    }
    requestAnimationFrame(drawCameraFeedCanvas);
  }

  function requestUserMedia() {
    const constraints = {
      video: {
        width: 1024,
        height: 768,
        frameRate: { min: 30, ideal: 30 },
        facingMode: "user",
      },
      preferCurrentTab: true,
    };
    return window.navigator.mediaDevices.getUserMedia(constraints);
  }
}

startApp();
