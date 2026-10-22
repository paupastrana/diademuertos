
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const maskImage = new Image();
maskImage.src = 'mascara.png';

let imageLoaded = false;

maskImage.onload = () => {
    imageLoaded = true;
};

// Ajustes de la máscara
const SCALE_WIDTH = 1.4;
const SCALE_HEIGHT = 1.2;
const OFFSET_Y = -0.12;

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
        results.multiFaceLandmarks.length > 0 &&
        imageLoaded
    ) {
        const lm = results.multiFaceLandmarks[0];

        // Puntos de referencia
        const forehead = lm[10];
        const chin = lm[152];
        const leftCheek = lm[234];
        const rightCheek = lm[454];

        const leftEye = lm[33];
        const rightEye = lm[263];

        // Conversión a píxeles
        const px = p => p.x * canvasElement.width;
        const py = p => p.y * canvasElement.height;

        // Centro facial
        const centerX = (px(forehead) + px(chin)) / 2;
        const centerY =
            (py(forehead) + py(chin)) / 2;

        // Ancho facial visible
        const cheekWidth = Math.hypot(
            px(rightCheek) - px(leftCheek),
            py(rightCheek) - py(leftCheek)
        );

        // Tamaño de la máscara
        const faceWidth = cheekWidth * SCALE_WIDTH;
        const faceHeight = faceWidth *
            (maskImage.height / maskImage.width);

        // Inclinación de la cabeza
        const dx = px(rightEye) - px(leftEye);
        const dy = py(rightEye) - py(leftEye);
        const angle = Math.atan2(dy, dx);

        // Desplazamiento vertical
        const adjustedY = centerY + faceHeight * OFFSET_Y;

        canvasCtx.save();

        canvasCtx.translate(centerX, adjustedY);
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

    canvasCtx.restore();
}

const faceMesh = new FaceMesh({
    locateFile: file =>
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
