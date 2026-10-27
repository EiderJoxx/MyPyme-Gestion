import type { Habitacion, Plato } from "../types";

export const habitaciones: Habitacion[] = [
  {
    id: 1,
    numero: "101",
    tipo: "Sencilla",
    capacidad: 1,
    precioNoche: 120000,
    estado: "Disponible",
  },
  {
    id: 2,
    numero: "102",
    tipo: "Doble",
    capacidad: 2,
    precioNoche: 180000,
    estado: "Ocupada",
  },
  {
    id: 3,
    numero: "201",
    tipo: "Familiar",
    capacidad: 4,
    precioNoche: 250000,
    estado: "Limpieza",
  },
];

export const platos: Plato[] = [
  {
    id: 1,
    nombre: "Ceviche de camarón",
    categoria: "Entradas",
    precio: 28000,
    descripcion: "Camarón fresco con limón y cilantro.",
    foto: "",
  },
  {
    id: 2,
    nombre: "Pescado frito",
    categoria: "Platos fuertes",
    precio: 42000,
    descripcion: "Con patacones, arroz de coco y ensalada.",
    foto: "",
  },
  {
    id: 3,
    nombre: "Arroz con mariscos",
    categoria: "Mariscos",
    precio: 48000,
    descripcion: "Camarones, calamar y pulpo.",
    foto: "",
  },
  {
    id: 4,
    nombre: "Flan de coco",
    categoria: "Postres",
    precio: 12000,
    descripcion: "Con salsa de caramelo.",
    foto: "",
  },
];
