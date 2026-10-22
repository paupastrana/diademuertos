
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const maskImage = new Image();
maskImage.src = 'mascara.png';

let imageLoaded = false;

maskImage.onload = () => {
    imageLoaded = true;
};

function onResults(results) {
    canvasCtx.save();

    canvasCtx.clearRect(
        0, 0,
        canvasElement.width,
        canvasElement.height
    );

    canvasCtx.drawImage(
        results.image,
        0, 0,
        canvasElement.width,
        canvasElement.height
    );

    if (
        results.multiFaceLandmarks &&
        results.multiFaceLandmarks.length > 0
    ) {
        const landmarks = results.multiFaceLandmarks[0];

        const forehead = landmarks[10];
        const chin = landmarks[152];
        const leftCheek = landmarks[234];
        const rightCheek = landmarks[454];

        const fx = forehead.x * canvasElement.width;
        const fy = forehead.y * canvasElement.height;

        const cx = chin.x * canvasElement.width;
        const cy = chin.y * canvasElement.height;

        const lcx = leftCheek.x * canvasElement.width;
        const rcx = rightCheek.x * canvasElement.width;

        // Tamaño de la máscara
        const faceWidth = Math.abs(rcx - lcx) * 1.4;
        const faceHeight = Math.abs(cy - fy) * 1.2;

        // Centro de la cara
        const centerX = (fx + cx) / 2;

        // AJUSTE VERTICAL:
        // Un valor negativo sube la máscara.
        const offsetY = -faceHeight * 0.12;
        const centerY = (fy + cy) / 2 + offsetY;

        if (imageLoaded) {
            canvasCtx.save();

            canvasCtx.translate(centerX, centerY);

            // Rotación según la inclinación de la cabeza
            const leftEye = landmarks[33];
            const rightEye = landmarks[263];

            const dx =
                (rightEye.x - leftEye.x) * canvasElement.width;

            const dy =
                (rightEye.y - leftEye.y) * canvasElement.height;

            const angle = Math.atan2(dy, dx);

            canvasCtx.rotate(angle);

            canvasCtx.drawImage(
                maskImage,
                -faceWidth / 2,
                -faceHeight / 2,
                faceWidth,
                faceHeight
            );

            canvasCtx.restore();
        }
    }

    canvasCtx.restore();
}

const faceMesh = new FaceMesh({
    locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        await faceMesh.send({ image: videoElement });
    },
    width: 1280,
    height: 720
});

camera.start();
