import "../../css/Landing.css"; 

export default function Terminos() {
  return (
    <div className="container py-5">
      <div className="bg-white p-5 rounded-4 shadow-sm" style={{ maxWidth: "900px", margin: "0 auto", marginTop: "40px" }}>
        <h1 className="mb-4" style={{ color: "#003366", fontWeight: "bold" }}>Términos y Condiciones</h1>
        <p className="text-muted mb-4">Última actualización: {new Date().toLocaleDateString('es-CO')}</p>

        <p>Bienvenido a <strong>Playa Aescondidas</strong>. Al acceder y utilizar nuestros servicios de hospedaje, restaurante y eventos, usted acepta los siguientes términos y condiciones, los cuales rigen nuestra relación comercial.</p>

        <h4 className="mt-4" style={{ color: "#003366" }}>1. Reservas y Pagos</h4>
        <p>Todas las reservas están sujetas a disponibilidad. Para garantizar su reserva, es necesario realizar un abono (anticipo) según lo acordado con nuestro equipo de atención. El saldo restante deberá ser cancelado al momento del Check-in o Check-out, según se indique.</p>

        <h4 className="mt-4" style={{ color: "#003366" }}>2. Horarios de Check-in y Check-out</h4>
        <p>El Check-in se realiza a partir de las 11:00 a.m. El Check-out debe realizarse antes de las 10:30 a.m. Si requiere un ingreso anticipado o una salida posterior, por favor consulte con recepción; esto está sujeto a disponibilidad y podría generar un costo adicional.</p>

        <h4 className="mt-4" style={{ color: "#003366" }}>3. Políticas de Cancelación</h4>
        <p>Si el huésped cancela con más de 7 días de anticipación, se reembolsará el 100% del anticipo. Cancelaciones entre 3 y 7 días antes de la llegada tendrán un cargo del 50%. Cancelaciones con menos de 72 horas de anticipación no son reembolsables. Casos fortuitos o de fuerza mayor serán evaluados por la administración.</p>

        <h4 className="mt-4" style={{ color: "#003366" }}>4. Normas de Convivencia</h4>
        <p>Para garantizar el descanso de todos nuestros visitantes, no se permite el ingreso de equipos de sonido de gran magnitud, ni el ruido excesivo después de las 11:00 p.m. El consumo de sustancias psicoactivas está estrictamente prohibido dentro del establecimiento. El huésped es responsable de los daños ocasionados a las instalaciones o mobiliario, los cuales deberán ser resarcidos.</p>

        <h4 className="mt-4" style={{ color: "#003366" }}>5. Modificaciones</h4>
        <p>Playa Aescondidas se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán publicados en esta misma página y entrarán en vigencia inmediatamente.</p>
        
        <p className="mt-5 text-muted small">Para cualquier duda, contáctanos a reserva@aescondida.com o al WhatsApp +57 315 0000000.</p>
      </div>
    </div>
  );
}