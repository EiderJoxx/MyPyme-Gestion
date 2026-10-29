export function descargarCSV(nombre: string, filas: (string | number)[][]) {
  const texto = filas
    .map((fila) =>
      fila.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  // El BOM al inicio hace que Excel muestre bien las tildes
  const blob = new Blob(["\uFEFF" + texto], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}
