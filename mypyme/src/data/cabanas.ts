import type { Habitacion } from "../types";

export const cabanas: Habitacion[] = [
  {
    id: 1,
    numero: "101",
    tipo: "Cabaña para parejas",
    capacidad: 2,
    precioNoche: 280000,
    estado: "Disponible",
    imagen: "/galeria/habitacion2.jpg",
    descripcion:
      "Cabaña acogedora y privada, ideal para parejas que desean disfrutar de una experiencia tranquila y romántica frente al mar, en un ambiente natural y relajado.",
    checkIn: "11:00 a.m.",
    checkOut: "10:30 a.m.",
  },
  {
    id: 2,
    numero: "102",
    tipo: "Cabaña familiar",
    capacidad: 4,
    precioNoche: 420000,
    estado: "Disponible",
    imagen: "/galeria/habitacion3.jpg",
    descripcion:
      "Espacio cómodo y funcional, perfecto para familias o grupos pequeños que buscan compartir momentos especiales y disfrutar del mar en un entorno tranquilo.",
    checkIn: "11:00 a.m.",
    checkOut: "10:30 a.m.",
  },
];