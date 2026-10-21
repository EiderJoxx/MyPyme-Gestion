import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div>
      <h1>Iniciar sesión</h1>
      <p>Aqui iría el formulario de inicio de sesión</p>
      <Link to="/admin" className="btn btn-primario">
        Entrar al sistemas
      </Link>
    </div>
  );
}
