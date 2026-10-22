/* =========================================================
   Máscara de Día de Muertos sobre la malla 3D de la cara
   ---------------------------------------------------------
   En vez de pegar la imagen como un sticker plano, la imagen se
   "envuelve" sobre los 468 puntos de MediaPipe Face Mesh:
   cada triángulo de la cara lleva su pedazo de la máscara, así
   que al girar de perfil, inclinar o abrir la boca, la máscara
   se deforma igual que tu cara.
========================================================= */

const videoElement  = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx     = canvasElement.getContext('2d');
const container     = document.querySelector('.container');
const hint          = document.getElementById('hint');

/* ---------- Malla (triángulos de Face Mesh y contorno del rostro) ---------- */
const TRIS = [0,11,37,0,11,267,0,37,164,0,164,267,1,4,44,1,4,274,1,19,44,1,19,274,2,94,141,2,94,370,2,97,141,2,97,167,2,164,167,2,164,393,2,326,370,2,326,393,3,51,195,3,51,236,3,195,197,3,196,197,3,196,236,4,5,51,4,5,281,4,44,45,4,45,51,4,274,275,4,275,281,5,51,195,5,195,281,6,122,168,6,122,196,6,168,351,6,196,197,6,197,419,6,351,419,7,25,33,7,25,110,7,110,163,8,9,55,8,9,285,8,55,193,8,168,193,8,168,417,8,285,417,9,55,107,9,107,108,9,108,151,9,151,337,9,285,336,9,336,337,10,109,151,10,151,338,11,12,72,11,12,302,11,37,72,11,267,302,12,13,38,12,13,268,12,38,72,12,268,302,13,38,82,13,268,312,14,15,86,14,15,316,14,86,87,14,316,317,15,16,85,15,16,315,15,85,86,15,315,316,16,17,85,16,17,315,17,18,83,17,18,313,17,83,84,17,84,85,17,313,314,17,314,315,18,83,201,18,200,201,18,200,421,18,313,421,19,44,125,19,94,141,19,94,370,19,125,141,19,274,354,19,354,370,20,60,99,20,60,166,20,79,166,20,79,238,20,99,242,20,238,242,21,54,68,21,68,71,21,71,162,22,23,145,22,23,230,22,26,154,22,26,231,22,145,153,22,153,154,22,230,231,23,24,144,23,24,229,23,144,145,23,229,230,24,110,144,24,110,228,24,228,229,25,31,226,25,31,228,25,33,130,25,110,228,25,130,226,26,112,155,26,112,232,26,154,155,26,231,232,27,28,159,27,28,222,27,29,160,27,29,223,27,159,160,27,222,223,28,56,157,28,56,221,28,157,158,28,158,159,28,221,222,29,30,160,29,30,224,29,223,224,30,160,161,30,161,247,30,224,225,30,225,247,31,111,117,31,111,226,31,117,228,32,140,171,32,140,211,32,171,208,32,194,201,32,194,211,32,201,208,33,130,247,33,246,247,34,127,139,34,127,234,34,139,156,34,143,156,34,143,227,34,227,234,35,111,143,35,111,226,35,113,124,35,113,226,35,124,143,36,100,101,36,100,142,36,101,205,36,142,203,36,203,206,36,205,206,37,39,72,37,39,167,37,164,167,38,41,72,38,41,81,38,81,82,39,40,73,39,40,92,39,72,73,39,92,165,39,165,167,40,73,74,40,74,185,40,92,186,40,185,186,41,42,74,41,42,81,41,72,73,41,73,74,42,74,184,42,80,81,42,80,183,42,183,184,43,57,61,43,57,202,43,61,146,43,91,106,43,91,146,43,106,204,43,202,204,44,45,220,44,125,237,44,220,237,45,51,134,45,134,220,46,53,63,46,53,225,46,63,70,46,70,156,46,113,124,46,113,225,46,124,156,47,100,121,47,100,126,47,114,128,47,114,217,47,121,128,47,126,217,48,49,64,48,49,131,48,64,235,48,115,131,48,115,219,48,219,235,49,64,102,49,102,129,49,129,209,49,131,209,50,101,118,50,101,205,50,117,118,50,117,123,50,123,187,50,187,205,51,134,236,52,53,63,52,53,223,52,63,105,52,65,66,52,65,222,52,66,105,52,222,223,53,223,224,53,224,225,54,68,104,54,103,104,55,65,107,55,65,221,55,189,193,55,189,221,56,157,173,56,173,190,56,190,221,57,61,185,57,185,186,57,186,212,57,202,212,58,132,177,58,172,215,58,177,215,59,75,166,59,75,235,59,166,219,59,219,235,60,75,166,60,75,240,60,99,240,61,76,146,61,76,184,61,184,185,62,76,77,62,76,183,62,77,96,62,78,96,62,78,191,62,183,191,63,68,71,63,68,104,63,70,71,63,104,105,64,98,129,64,98,240,64,102,129,64,235,240,65,66,107,65,221,222,66,69,105,66,69,107,67,69,104,67,69,108,67,103,104,67,108,109,69,104,105,69,107,108,70,71,139,70,139,156,71,139,162,74,184,185,75,235,240,76,77,146,76,183,184,77,90,91,77,90,96,77,91,146,78,95,96,79,166,218,79,218,237,79,237,239,79,238,239,80,183,191,83,84,181,83,181,182,83,182,201,84,85,180,84,180,181,85,86,179,85,179,180,86,87,178,86,178,179,88,89,96,88,89,179,88,95,96,88,178,179,89,90,96,89,90,180,89,179,180,90,91,181,90,180,181,91,106,182,91,181,182,92,165,206,92,186,216,92,206,216,93,132,137,93,137,227,93,227,234,97,98,99,97,98,165,97,99,242,97,141,242,97,165,167,98,99,240,98,129,203,98,165,203,100,101,120,100,120,121,100,126,142,101,118,119,101,119,120,106,182,194,106,194,204,108,109,151,110,144,163,111,116,123,111,116,143,111,117,123,112,133,155,112,133,243,112,232,233,112,233,244,112,243,244,113,225,247,113,226,247,114,128,188,114,174,188,114,174,217,115,131,220,115,218,219,115,218,220,116,123,137,116,137,227,116,143,227,117,118,229,117,228,229,118,119,230,118,229,230,119,120,230,120,121,232,120,230,231,120,231,232,121,128,232,122,168,193,122,188,196,122,188,245,122,193,245,123,137,177,123,147,177,123,147,187,124,143,156,125,141,241,125,237,241,126,129,142,126,129,209,126,209,217,127,139,162,128,188,245,128,232,233,128,233,245,129,142,203,130,226,247,131,134,198,131,134,220,131,198,209,132,137,177,133,173,190,133,190,243,134,198,236,135,136,138,135,136,150,135,138,192,135,150,169,135,169,214,135,192,214,136,138,172,138,172,215,138,192,213,138,213,215,140,148,171,140,148,176,140,170,176,140,170,211,141,241,242,147,177,215,147,187,213,147,213,215,148,152,175,148,171,175,149,150,170,149,170,176,150,169,170,151,337,338,152,175,377,161,246,247,164,267,393,165,203,206,166,218,219,168,351,417,169,170,211,169,210,211,169,210,214,171,175,199,171,199,208,174,188,196,174,196,236,174,217,236,175,199,396,175,377,396,182,194,201,186,212,216,187,192,213,187,192,214,187,205,207,187,207,214,189,190,221,189,190,243,189,193,244,189,243,244,193,244,245,194,204,211,195,197,248,195,248,281,197,248,419,198,209,217,198,217,236,199,200,208,199,200,428,199,396,428,200,201,208,200,421,428,202,204,210,202,210,214,202,212,214,204,210,211,205,206,216,205,207,216,207,212,214,207,212,216,218,220,237,233,244,245,237,239,241,238,239,241,238,241,242,248,281,456,248,419,456,249,255,263,249,255,339,249,339,390,250,290,328,250,290,392,250,309,392,250,309,459,250,328,462,250,458,459,250,458,462,251,284,298,251,298,301,251,301,389,252,253,374,252,253,450,252,256,381,252,256,451,252,374,380,252,380,381,252,450,451,253,254,373,253,254,449,253,373,374,253,449,450,254,339,373,254,339,448,254,448,449,255,261,446,255,261,448,255,263,359,255,339,448,255,359,446,256,341,382,256,341,452,256,381,382,256,451,452,257,258,386,257,258,442,257,259,387,257,259,443,257,386,387,257,442,443,258,286,384,258,286,441,258,384,385,258,385,386,258,441,442,259,260,387,259,260,444,259,443,444,260,387,388,260,388,466,260,444,445,260,445,467,260,466,467,261,340,346,261,340,446,261,346,448,262,369,396,262,369,431,262,396,428,262,418,421,262,418,431,262,421,428,263,359,467,263,466,467,264,356,368,264,356,454,264,368,383,264,372,383,264,372,447,264,447,454,265,340,372,265,340,446,265,342,353,265,342,446,265,353,372,266,329,330,266,329,371,266,330,425,266,371,423,266,423,426,266,425,426,267,269,302,267,269,393,268,271,302,268,271,311,268,311,312,269,270,303,269,270,322,269,302,303,269,322,391,269,391,393,270,303,304,270,304,409,270,322,410,270,409,410,271,272,304,271,272,311,271,302,303,271,303,304,272,304,408,272,310,311,272,310,407,272,407,408,273,287,291,273,287,422,273,291,375,273,321,335,273,321,375,273,335,424,273,422,424,274,275,440,274,354,457,274,440,457,275,281,363,275,363,440,276,283,293,276,283,445,276,293,300,276,300,383,276,342,353,276,342,445,276,353,383,277,329,350,277,329,355,277,343,357,277,343,437,277,350,357,277,355,437,278,279,294,278,279,360,278,294,455,278,344,360,278,344,439,278,439,455,279,294,331,279,331,358,279,358,429,279,360,429,280,330,347,280,330,425,280,346,347,280,346,352,280,352,411,280,411,425,281,363,456,282,283,293,282,283,443,282,293,334,282,295,296,282,295,442,282,296,334,282,442,443,283,443,444,283,444,445,284,298,333,284,332,333,285,295,336,285,295,441,285,413,417,285,413,441,286,384,398,286,398,414,286,414,441,287,291,409,287,409,410,287,410,432,287,422,432,288,361,401,288,397,435,288,401,435,289,290,305,289,290,392,289,305,455,289,392,439,289,439,455,290,305,460,290,328,460,291,306,375,291,306,408,291,408,409,292,306,307,292,306,407,292,307,325,292,308,325,292,308,415,292,407,415,293,298,301,293,298,333,293,300,301,293,333,334,294,327,358,294,327,460,294,331,358,294,455,460,295,296,336,295,441,442,296,299,334,296,299,336,297,299,333,297,299,337,297,332,333,297,337,338,299,333,334,299,336,337,300,301,368,300,368,383,301,368,389,304,408,409,305,455,460,306,307,375,306,407,408,307,320,321,307,320,325,307,321,375,308,324,325,309,392,438,309,438,457,309,457,459,310,407,415,313,314,405,313,405,406,313,406,421,314,315,404,314,404,405,315,316,403,315,403,404,316,317,402,316,402,403,318,319,325,318,319,403,318,324,325,318,402,403,319,320,325,319,320,404,319,403,404,320,321,405,320,404,405,321,335,406,321,405,406,322,391,426,322,410,436,322,426,436,323,361,366,323,366,447,323,447,454,326,327,328,326,327,391,326,328,462,326,370,462,326,391,393,327,328,460,327,358,423,327,391,423,329,330,349,329,349,350,329,355,371,330,347,348,330,348,349,335,406,418,335,418,424,339,373,390,340,345,352,340,345,372,340,346,352,341,362,382,341,362,463,341,452,453,341,453,464,341,463,464,342,445,467,342,446,467,343,357,412,343,399,412,343,399,437,344,360,440,344,438,439,344,438,440,345,352,366,345,366,447,345,372,447,346,347,449,346,448,449,347,348,450,347,449,450,348,349,450,349,350,452,349,450,451,349,451,452,350,357,452,351,412,419,351,412,465,351,417,465,352,366,401,352,376,401,352,376,411,353,372,383,354,370,461,354,457,461,355,358,371,355,358,429,355,429,437,356,368,389,357,412,465,357,452,453,357,453,465,358,371,423,359,446,467,360,363,420,360,363,440,360,420,429,361,366,401,362,398,414,362,414,463,363,420,456,364,365,367,364,365,379,364,367,416,364,379,394,364,394,434,364,416,434,365,367,397,367,397,435,367,416,433,367,433,435,369,377,396,369,377,400,369,395,400,369,395,431,370,461,462,376,401,435,376,411,433,376,433,435,378,379,395,378,395,400,379,394,395,391,423,426,392,438,439,394,395,431,394,430,431,394,430,434,399,412,419,399,419,456,399,437,456,406,418,421,410,432,436,411,416,433,411,416,434,411,425,427,411,427,434,413,414,441,413,414,463,413,417,464,413,463,464,417,464,465,418,424,431,420,429,437,420,437,456,422,424,430,422,430,434,422,432,434,424,430,431,425,426,436,425,427,436,427,432,434,427,432,436,438,440,457,453,464,465,457,459,461,458,459,461,458,461,462];
const OVAL = [10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109];
const N_FACE = 468;

/* ---------- Ajustes ---------- */
const MASK_SRC     = 'mascara.png';
const TEX_SIZE     = 1024;     // la imagen se reduce a esto para dibujar más rápido
const CALIB_FRAMES = 12;       // fotogramas de frente para calibrar
const SMOOTH       = 0.6;      // 0..1  (más alto = más rápido, más bajo = más suave)
const SEAM_PX      = 0.7;      // solapamiento entre triángulos para evitar líneas finas

/* Dónde cae cada parte de la cara dentro de mascara.png (coordenadas 0..1).
   Medido sobre tu imagen: ojos, nariz, línea de dientes y barbilla. */
const MASK_EYE_SEP = 0.418;    // distancia entre el centro de los dos huecos de ojos
const MASK_ROWS = {
    forehead: 0.045,           // punto 10  (frente)
    eyes:     0.474,           // línea de los ojos
    nose:     0.668,           // punta de la nariz (punto 1)
    mouth:    0.800,           // línea de la boca (puntos 13/14)
    chin:     0.955            // barbilla (punto 152)
};

/* ---------- Estado ---------- */
let texCanvas = null, alphaGrid = null, textureReady = false;
let P = null;                  // landmarks suavizados en píxeles [x,y,z]
let calibAcc = null, calibN = 0;
let mesh = null;               // malla calibrada (UV, matrices inversas, etc.)
let showWire = false;

/* ---------- Textura ---------- */
const maskImage = new Image();
maskImage.onload = () => {
    texCanvas = document.createElement('canvas');
    texCanvas.width = texCanvas.height = TEX_SIZE;
    const c = texCanvas.getContext('2d');
    c.drawImage(maskImage, 0, 0, TEX_SIZE, TEX_SIZE);

    // Cuadrícula 64x64 con el alfa máximo de cada celda: sirve para no
    // dibujar triángulos que caen en zonas vacías de la máscara.
    const G = 64, cell = TEX_SIZE / G;
    const data = c.getImageData(0, 0, TEX_SIZE, TEX_SIZE).data;
    alphaGrid = new Uint8Array(G * G);
    for (let y = 0; y < TEX_SIZE; y++) {
        const gy = Math.min(G - 1, (y / cell) | 0);
        for (let x = 0; x < TEX_SIZE; x++) {
            const a = data[(y * TEX_SIZE + x) * 4 + 3];
            const gi = gy * G + Math.min(G - 1, (x / cell) | 0);
            if (a > alphaGrid[gi]) alphaGrid[gi] = a;
        }
    }
    textureReady = true;
};
maskImage.src = MASK_SRC;

function hasContent(minU, minV, maxU, maxV) {
    const G = 64, cell = TEX_SIZE / G;
    const x0 = Math.max(0, (minU / cell) | 0), x1 = Math.min(G - 1, (maxU / cell) | 0);
    const y0 = Math.max(0, (minV / cell) | 0), y1 = Math.min(G - 1, (maxV / cell) | 0);
    for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++)
            if (alphaGrid[y * G + x] > 12) return true;
    return false;
}

/* ---------- Vectores 3D mínimos ---------- */
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = a => Math.hypot(a[0], a[1], a[2]);
const norm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

/* Sistema de coordenadas de la cabeza en este fotograma:
   origen entre los ojos, eje X de mejilla a mejilla, eje Y de frente a barbilla.
   Escala = distancia entre ojos (así no depende de qué tan cerca estés). */
function headFrame(P) {
    const eyeL = mid(P[33], P[133]), eyeR = mid(P[263], P[362]);
    const O = mid(eyeL, eyeR);
    const s = len(sub(eyeR, eyeL));
    const ex = norm(sub(P[454], P[234]));
    const yRaw = sub(P[152], P[10]);
    const k = dot(yRaw, ex);
    const ey = norm([yRaw[0] - ex[0] * k, yRaw[1] - ex[1] * k, yRaw[2] - ex[2] * k]);
    return { O, s, ex, ey };
}

/* Coordenadas "de frente" (x,y) de todos los puntos, en unidades de distancia entre ojos */
function alignedCoords(P, F) {
    const A = new Float32Array(N_FACE * 2);
    for (let i = 0; i < N_FACE; i++) {
        const d = sub(P[i], F.O);
        A[i * 2]     = dot(d, F.ex) / F.s;
        A[i * 2 + 1] = dot(d, F.ey) / F.s;
    }
    return A;
}

/* ---------- Calibración -> UV de cada vértice ---------- */
function pieceLinear(knotsIn, knotsOut) {
    const f = v => {
        let i = 0;
        while (i < knotsIn.length - 2 && v > knotsIn[i + 1]) i++;
        const t = (v - knotsIn[i]) / (knotsIn[i + 1] - knotsIn[i]);
        return knotsOut[i] + t * (knotsOut[i + 1] - knotsOut[i]);   // extrapola con la pendiente del tramo
    };
    const inv = u => {
        let i = 0;
        while (i < knotsOut.length - 2 && u > knotsOut[i + 1]) i++;
        const t = (u - knotsOut[i]) / (knotsOut[i + 1] - knotsOut[i]);
        return knotsIn[i] + t * (knotsIn[i + 1] - knotsIn[i]);
    };
    return { f, inv };
}

function inv3(m) {      // inversa de matriz 3x3 [a b c; d e f; g h i]
    const [a, b, c, d, e, f, g, h, i] = m;
    const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
    const det = a * A + b * B + c * C;
    if (Math.abs(det) < 1e-9) return null;
    const r = 1 / det;
    return [A * r, -(b * i - c * h) * r, (b * f - c * e) * r,
            B * r,  (a * i - c * g) * r, -(a * f - c * d) * r,
            C * r, -(a * h - b * g) * r, (a * e - b * d) * r];
}

function buildMesh(A) {
    const ay = i => A[i * 2 + 1], ax = i => A[i * 2];

    // Filas clave de la cara (ya alineada de frente) -> filas de la máscara
    const eyeY = (ay(33) + ay(133) + ay(263) + ay(362)) / 4;
    const mouthY = (ay(13) + ay(14)) / 2;
    let knotsIn = [ay(10), eyeY, ay(1), mouthY, ay(152)];
    for (let i = 1; i < knotsIn.length; i++)               // por seguridad: siempre creciente
        if (knotsIn[i] <= knotsIn[i - 1] + 0.02) knotsIn[i] = knotsIn[i - 1] + 0.02;
    const R = MASK_ROWS;
    const mapY = pieceLinear(knotsIn, [R.forehead, R.eyes, R.nose, R.mouth, R.chin]);

    const eyeLx = (ax(33) + ax(133)) / 2, eyeRx = (ax(263) + ax(362)) / 2;
    const kx = MASK_EYE_SEP / (eyeRx - eyeLx);
    const xc = (ax(234) + ax(454)) / 2;                     // eje de simetría de la cara
    const mapX = x => 0.5 + (x - xc) * kx;
    const invX = u => xc + (u - 0.5) / kx;

    const nV = N_FACE + OVAL.length;
    const U = new Float32Array(nV * 2), AA = new Float32Array(nV * 2);
    for (let i = 0; i < N_FACE; i++) {
        AA[i * 2] = ax(i); AA[i * 2 + 1] = ay(i);
        U[i * 2] = mapX(ax(i)); U[i * 2 + 1] = mapY.f(ay(i));
    }

    // Anillo exterior: prolonga la malla hasta el borde de la imagen para que
    // no se corten los adornos de la frente, las sienes y la barbilla.
    const ringOff = new Float32Array(OVAL.length * 2);
    const M = 0.006;
    for (let k = 0; k < OVAL.length; k++) {
        const i = OVAL[k], u = U[i * 2], v = U[i * 2 + 1];
        const du = u - 0.5, dv = v - 0.5;
        const f = Math.max(1, Math.min((0.5 - M) / (Math.abs(du) || 1e-6), (0.5 - M) / (Math.abs(dv) || 1e-6)));
        const ur = 0.5 + du * f, vr = 0.5 + dv * f;
        const j = N_FACE + k;
        U[j * 2] = ur; U[j * 2 + 1] = vr;
        const axr = invX(ur), ayr = mapY.inv(vr);
        AA[j * 2] = axr; AA[j * 2 + 1] = ayr;
        ringOff[k * 2] = axr - ax(i); ringOff[k * 2 + 1] = ayr - ay(i);
    }

    // Lista de triángulos: cara + franja del anillo
    const list = [];
    for (let t = 0; t < TRIS.length; t += 3) list.push([TRIS[t], TRIS[t + 1], TRIS[t + 2]]);
    for (let k = 0; k < OVAL.length; k++) {
        const kn = (k + 1) % OVAL.length;
        list.push([OVAL[k], OVAL[kn], N_FACE + kn], [OVAL[k], N_FACE + kn, N_FACE + k]);
    }

    const tris = [];
    for (const [i0, i1, i2] of list) {
        const u0 = U[i0 * 2] * TEX_SIZE, v0 = U[i0 * 2 + 1] * TEX_SIZE;
        const u1 = U[i1 * 2] * TEX_SIZE, v1 = U[i1 * 2 + 1] * TEX_SIZE;
        const u2 = U[i2 * 2] * TEX_SIZE, v2 = U[i2 * 2 + 1] * TEX_SIZE;
        const area = (u1 - u0) * (v2 - v0) - (u2 - u0) * (v1 - v0);
        if (Math.abs(area) < 1) continue;                    // hueco de la boca/ojos: nada que dibujar
        const minU = Math.min(u0, u1, u2), maxU = Math.max(u0, u1, u2);
        const minV = Math.min(v0, v1, v2), maxV = Math.max(v0, v1, v2);
        if (maxU < 0 || maxV < 0 || minU > TEX_SIZE || minV > TEX_SIZE) continue;
        if (!hasContent(minU, minV, maxU, maxV)) continue;   // zona transparente de la máscara
        const inv = inv3([u0, u1, u2, v0, v1, v2, 1, 1, 1]);
        if (!inv) continue;
        // Orientación de referencia (de frente): sirve para saber si el triángulo
        // quedó "de espaldas" cuando giras la cabeza y ocultarlo.
        const refA = (AA[i1 * 2] - AA[i0 * 2]) * (AA[i2 * 2 + 1] - AA[i0 * 2 + 1]) -
                     (AA[i2 * 2] - AA[i0 * 2]) * (AA[i1 * 2 + 1] - AA[i0 * 2 + 1]);
        const sx = Math.max(0, Math.floor(minU) - 1), sy = Math.max(0, Math.floor(minV) - 1);
        const sw = Math.min(TEX_SIZE, Math.ceil(maxU) + 1) - sx, sh = Math.min(TEX_SIZE, Math.ceil(maxV) + 1) - sy;
        tris.push({ i0, i1, i2, inv, sign: refA >= 0 ? 1 : -1, sx, sy, sw, sh });
    }
    return { tris, ringOff };
}

/* ---------- Dibujo ---------- */
function drawMask(ctx, P, F, m) {
    const n = N_FACE + OVAL.length;
    const X = new Float32Array(n), Y = new Float32Array(n);
    for (let i = 0; i < N_FACE; i++) { X[i] = P[i][0]; Y[i] = P[i][1]; }
    for (let k = 0; k < OVAL.length; k++) {
        const dx = m.ringOff[k * 2], dy = m.ringOff[k * 2 + 1], i = OVAL[k];
        X[N_FACE + k] = X[i] + F.s * (dx * F.ex[0] + dy * F.ey[0]);
        Y[N_FACE + k] = Y[i] + F.s * (dx * F.ex[1] + dy * F.ey[1]);
    }

    for (const t of m.tris) {
        const x0 = X[t.i0], y0 = Y[t.i0], x1 = X[t.i1], y1 = Y[t.i1], x2 = X[t.i2], y2 = Y[t.i2];
        const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
        if (area * t.sign <= 0.05) continue;                 // triángulo de espaldas o aplastado

        const cx = (x0 + x1 + x2) / 3, cy = (y0 + y1 + y2) / 3;
        const grow = (x, y) => {
            const dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy) || 1;
            return [x + dx / l * SEAM_PX, y + dy / l * SEAM_PX];
        };
        const a = grow(x0, y0), b = grow(x1, y1), c = grow(x2, y2);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]);
        ctx.closePath();
        ctx.clip();

        const I = t.inv;       // pantalla = [x0 x1 x2; y0 y1 y2] * inversa(UV)
        ctx.setTransform(
            x0 * I[0] + x1 * I[3] + x2 * I[6],  y0 * I[0] + y1 * I[3] + y2 * I[6],
            x0 * I[1] + x1 * I[4] + x2 * I[7],  y0 * I[1] + y1 * I[4] + y2 * I[7],
            x0 * I[2] + x1 * I[5] + x2 * I[8],  y0 * I[2] + y1 * I[5] + y2 * I[8]);
        ctx.drawImage(texCanvas, t.sx, t.sy, t.sw, t.sh, t.sx, t.sy, t.sw, t.sh);
        ctx.restore();
    }

    if (showWire) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0,255,120,.55)'; ctx.lineWidth = 1;
        for (let t = 0; t < TRIS.length; t += 3) {
            ctx.beginPath();
            ctx.moveTo(X[TRIS[t]], Y[TRIS[t]]);
            ctx.lineTo(X[TRIS[t + 1]], Y[TRIS[t + 1]]);
            ctx.lineTo(X[TRIS[t + 2]], Y[TRIS[t + 2]]);
            ctx.closePath(); ctx.stroke();
        }
        ctx.restore();
    }
}

/* ---------- Calibración (unos segundos mirando de frente) ---------- */
function recalibrate() {
    mesh = null; calibAcc = null; calibN = 0; P = null;
}

function tryCalibrate(F, P) {
    // Solo cuenta si estás casi de frente (poco giro y poca inclinación)
    if (Math.abs(F.ex[2]) > 0.14 || Math.abs(F.ey[2]) > 0.32) {
        setHint('Mira de frente a la cámara para ajustar la máscara');
        return;
    }
    const A = alignedCoords(P, F);
    if (!calibAcc) calibAcc = new Float32Array(A.length);
    for (let i = 0; i < A.length; i++) calibAcc[i] += A[i];
    calibN++;
    setHint('Ajustando máscara a tu cara... ' + calibN + '/' + CALIB_FRAMES);
    if (calibN >= CALIB_FRAMES) {
        for (let i = 0; i < calibAcc.length; i++) calibAcc[i] /= calibN;
        mesh = buildMesh(calibAcc);
        setHint('');
    }
}

function setHint(text) {
    hint.textContent = text;
    hint.style.display = text ? 'block' : 'none';
}

/* ---------- Resultados de MediaPipe ---------- */
function onResults(results) {
    const W = results.image.width, H = results.image.height;
    if (canvasElement.width !== W || canvasElement.height !== H) {
        canvasElement.width = W; canvasElement.height = H;
        container.style.setProperty('--ar', W / H);
    }

    canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
    canvasCtx.clearRect(0, 0, W, H);
    canvasCtx.drawImage(results.image, 0, 0, W, H);

    if (!textureReady || !results.multiFaceLandmarks || !results.multiFaceLandmarks.length) {
        P = null;
        if (textureReady && !mesh) setHint('No veo tu cara, acércate a la cámara');
        return;
    }

    // Landmarks en píxeles (z usa la misma escala que x) y suavizado anti-temblor
    const lm = results.multiFaceLandmarks[0];
    const raw = new Array(N_FACE);
    for (let i = 0; i < N_FACE; i++) raw[i] = [lm[i].x * W, lm[i].y * H, lm[i].z * W];
    if (!P) P = raw;
    else for (let i = 0; i < N_FACE; i++)
        for (let k = 0; k < 3; k++) P[i][k] += (raw[i][k] - P[i][k]) * SMOOTH;

    const F = headFrame(P);
    if (!mesh) { tryCalibrate(F, P); return; }
    drawMask(canvasCtx, P, F, mesh);
}

/* ---------- MediaPipe + cámara ---------- */
const faceMesh = new FaceMesh({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});
faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.6
});
faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => { await faceMesh.send({ image: videoElement }); },
    width: 1280,
    height: 720
});
camera.start();
setHint('Mira de frente a la cámara para ajustar la máscara');

/* ---------- Controles ---------- */
document.getElementById('recal').addEventListener('click', recalibrate);
document.addEventListener('keydown', e => {
    if (e.key === 'r' || e.key === 'R') recalibrate();
    if (e.key === 'm' || e.key === 'M') showWire = !showWire;     // ver la malla (depuración)
});
