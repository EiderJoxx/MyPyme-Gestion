export interface FotoGaleria {
  src: string;
  alt: string;
  titulo?: string;
  subtitulo?: string;
}

export const GALERIA: FotoGaleria[] = [
  {
    src: "/galeria/foto1.jpg", // Foto de las cabañas con techo rojo y cielo azul
    alt: "Cabañas rústicas frente al mar",
    titulo: "Despierta frente al mar",
    subtitulo: "Descansa en nuestras cabañas con vista espectacular.",
  },
  {
    src: "/galeria/foto2.jpg", // Foto de la piscina iluminada de noche
    alt: "Piscina iluminada de noche",
    titulo: "Relájate en nuestra piscina",
    subtitulo: "Disfruta de noches mágicas bajo las estrellas.",
  },
  {
    src: "/galeria/foto3.jpg", // Foto del atardecer en la playa
    alt: "Atardecer en la playa",
    titulo: "Atardeceres inolvidables",
    subtitulo: "A solo unos pasos de la arena y el sonido de las olas.",
  },
  {
    src: "/galeria/foto4.jpg", // Foto de la cabaña por dentro (chica leyendo)
    alt: "Interior de cabaña acogedora",
    titulo: "Tu refugio perfecto",
    subtitulo: "Espacios cómodos y tranquilos para desconectarte.",
  },
  {
    src: "/galeria/foto5.jpg", // Foto de la cama con pétalos y "te amo"
    alt: "Habitación decorada para parejas",
    titulo: "Momentos inolvidables",
    subtitulo: "Celebra tu aniversario o escápate en pareja.",
  },
  {
    src: "/galeria/foto6.jpg", // Foto del bar de noche
    alt: "Bar al aire libre iluminado",
    titulo: "Disfruta de la noche",
    subtitulo: "El mejor ambiente, música y cócteles de la región.",
  },
  {
    src: "/galeria/foto7.jpg", // Foto del cóctel rojo con la piscina atrás
    alt: "Cóctel frente a la piscina",
    titulo: "Sabores únicos",
    subtitulo: "Prueba nuestras bebidas de autor mientras te refrescas.",
  },
  {
    src: "/galeria/foto8.jpg", // Foto de las mesas con sombrillas al aire libre
    alt: "Mesas al aire libre de noche",
    titulo: "Cenas bajo las estrellas",
    subtitulo: "Disfruta de un ambiente cálido y especial.",
  },
  {
    src: "/galeria/foto9.jpg", // Foto del cóctel verde en la barra
    alt: "Cóctel en la barra de madera",
    titulo: "Reserva por WhatsApp",
    subtitulo: "Todo lo que necesitas para unas vacaciones perfectas.",
  },
];
