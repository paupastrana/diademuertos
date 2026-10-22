const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

// Cargamos tu textura de Krita
const maskImage = new Image();
maskImage.src = 'mascara_textura.png';
let imageLoaded = false;
maskImage.onload = () => {
    imageLoaded = true;
};

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Dibujamos el video de la cámara en vivo
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        // Obtenemos puntos clave para calcular el tamaño y posición exacta de tu cara
        // Punto 10: Frente, Punto 152: Mentón, Punto 234: Pómulo izq, Punto 454: Pómulo der
        const forehead = landmarks[10];
        const chin = landmarks[152];
        const leftCheek = landmarks[234];
        const rightCheek = landmarks[454];

        // Calculamos coordenadas en pixeles sobre el canvas
        const fx = forehead.x * canvasElement.width;
        const fy = forehead.y * canvasElement.height;
        const cx = chin.x * canvasElement.width;
        const cy = chin.y * canvasElement.height;
        const lcx = leftCheek.x * canvasElement.width;
        const rcx = rightCheek.x * canvasElement.width;

        // Ancho y alto de la cara detectada
        const faceWidth = Math.abs(rcx - lcx) * 1.4; // Factor de escala para que cubra bien los bordes
        const faceHeight = Math.abs(cy - fy) * 1.2;
        
        // Centro de la máscara basado en la nariz/frente
        const centerX = (fx + cx) / 2;
        const centerY = (fy + cy) / 2;

        // Si tu textura ya cargó, la dibujamos exactamente sobre tu cara en tiempo real
        // Si tu textura ya cargó, la rotamos y dibujamos sobre tu cara en tiempo real
        if (imageLoaded) {
            canvasCtx.save(); // Guardamos el estado actual del canvas

            // Trasladamos el punto de origen al centro de tu rostro
            canvasCtx.translate(centerX, centerY);

            // Calculamos el ángulo de inclinación usando la diferencia entre tu ojo izquierdo y derecho
            const leftEye = landmarks[33];   // Ojo izquierdo de referencia
            const rightEye = landmarks[263]; // Ojo derecho de referencia
            const dx = (rightEye.x - leftEye.x) * canvasElement.width;
            const dy = (rightEye.y - leftEye.y) * canvasElement.height;
            const angle = Math.atan2(dy, dx);

            // Aplicamos la rotación según hacia dónde gires la cabeza
            canvasCtx.rotate(angle);

            // Dibujamos la máscara centrada (con los factores de tamaño ajustados que prefieras)
            canvasCtx.drawImage(
                maskImage, 
                -faceWidth / 2, 
                -faceHeight / 2.2, 
                faceWidth, 
                faceHeight
            );

            canvasCtx.restore(); // Restauramos el canvas para los siguientes fotogramas
        }
    }
    
    canvasCtx.restore();
}

const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
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