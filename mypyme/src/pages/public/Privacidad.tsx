import "../../css/Landing.css";

export default function Privacidad() {
  return (
    <div className="container py-5">
      <div className="bg-white p-5 rounded-4 shadow-sm" style={{ maxWidth: "900px", margin: "0 auto", marginTop: "40px" }}>
        <h1 className="mb-4" style={{ color: "#003366", fontWeight: "bold" }}>Política de Tratamiento de Datos Personales</h1>
        <p className="text-muted mb-4">Última actualización: {new Date().toLocaleDateString('es-CO')}</p>

        <p>En cumplimiento de la <strong>Ley Estatutaria 1581 de 2012</strong> y el Decreto 1377 de 2013 de la República de Colombia, <strong>Playa Aescondidas</strong> informa a sus usuarios la política de tratamiento de sus datos personales.</p>

        <h4 className="mt-4" style={{ color: "#003366" }}>1. Finalidad de la Recopilación de Datos</h4>
        <p>Los datos personales que usted nos proporciona (Nombre, Documento de Identidad, Teléfono y Correo Electrónico) a través de nuestros formularios de reservas, pasadías o eventos, serán utilizados exclusivamente para:</p>
        <ul>
          <li>Gestionar y confirmar sus reservas de hospedaje y eventos.</li>
          <li>Contactarlo en caso de emergencias o cambios en su reserva.</li>
          <li>Cumplir con las obligaciones legales de registro de huéspedes exigidas por las autoridades colombianas.</li>
          <li>Enviar promociones y ofertas (solo si el usuario lo autoriza explícitamente).</li>
        </ul>

        <h4 className="mt-4" style={{ color: "#003366" }}>2. Manejo y Seguridad de la Información</h4>
        <p>Sus datos son almacenados en servidores seguros y están bajo estrictas medidas de confidencialidad. Playa Aescondidas no vende, alquila ni comparte su información personal con terceros ajenos a la operación del negocio.</p>

        <h4 className="mt-4" style={{ color: "#003366" }}>3. Derechos del Titular (Habeas Data)</h4>
        <p>Como titular de sus datos personales, usted tiene derecho a:</p>
        <ul>
          <li><strong>Conocer, actualizar y rectificar</strong> su información personal.</li>
          <li><strong>Solicitar prueba de la autorización</strong> otorgada para el tratamiento de sus datos.</li>
          <li><strong>Revocar la autorización y/o solicitar la supresión</strong> de los datos, siempre y cuando no exista un deber legal o contractual de permanecer en nuestra base de datos.</li>
        </ul>

        <h4 className="mt-4" style={{ color: "#003366" }}>4. Canales de Atención</h4>
        <p>Para ejercer sus derechos, realizar consultas o reclamos, puede comunicarse con nosotros a través de:</p>
        <ul>
          <li><strong>Correo electrónico:</strong> reserva@aescondida.com</li>
          <li><strong>WhatsApp:</strong> +57 315 0000000</li>
          <li><strong>Dirección Física:</strong> Riohacha – km 3 vía Santa Marta (La Cachaca II)</li>
        </ul>
      </div>
    </div>
  );
}