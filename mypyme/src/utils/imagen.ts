// Reduce la foto para que ocupe poco espacio al guardarla
export function reducirImagen(archivo: File, maximo = 480): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error("No se pudo leer la imagen"));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Archivo de imagen no válido"));
      img.onload = () => {
        const escala = Math.min(1, maximo / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        canvas
          .getContext("2d")!
          .drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = lector.result as string;
    };
    lector.readAsDataURL(archivo);
  });
}
