export const MAX_PLAN_SIDE = 2400;

export const MAX_DATA_URL_CHARS = 1900000;

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen. Usa un archivo PNG o JPG.'));
    };
    image.src = url;
  });

export const preparePlanImage = async (file) => {
  if (!file || !/^image\/(png|jpe?g|webp|gif|bmp)$/i.test(file.type)) {
    throw new Error('Elige una imagen PNG o JPG del plano.');
  }
  const image = await loadImage(file);
  let scale = Math.min(1, MAX_PLAN_SIDE / Math.max(image.naturalWidth, image.naturalHeight));

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const ancho = Math.max(1, Math.round(image.naturalWidth * scale));
    const alto = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = ancho;
    canvas.height = alto;
    const context = canvas.getContext('2d');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, ancho, alto);
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, ancho, alto);

    const candidates = [canvas.toDataURL('image/png'), canvas.toDataURL('image/jpeg', 0.9), canvas.toDataURL('image/jpeg', 0.75)];
    const best = candidates.reduce((smallest, current) => (current.length < smallest.length ? current : smallest));
    if (best.length <= MAX_DATA_URL_CHARS) {
      return { imagen: best, ancho, alto };
    }
    scale *= 0.8;
  }
  throw new Error('La imagen es demasiado pesada. Prueba con un plano más simple o de menor resolución.');
};
