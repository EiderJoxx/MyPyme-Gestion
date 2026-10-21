import Carrusel from "../../components/Carrusel";

const servicios = [
  {
    titulo: "Hospedaje",
    texto: "Reservas, check-in y disponibilidad de habitaciones.",
  },
  {
    titulo: "Restaurante y bar",
    texto: "Órdenes, mesas e inventario de productos.",
  },
  { titulo: "Contabilidad", texto: "Gastos, facturas y reportes del negocio." },
];

export default function Landing() {
  return (
    <>
      <Carrusel />

      <section id="servicios" className="container py-5">
        <h2 className="text-center mb-4">Qué puedes gestionar</h2>
        <div className="row g-4">
          {servicios.map((s) => (
            <div key={s.titulo} className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{s.titulo}</h5>
                  <p className="card-text text-secondary">{s.texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
