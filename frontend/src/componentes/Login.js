import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = ({ setUsuario }) => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();
  const manejarLogin = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correo, clave: clave })
      });

      if (!respuesta.ok) {
        alert("Error en el login, revisa tus credenciales.");
        console.error("Error en la respuesta del servidor:", respuesta);
        return;
      }

      const datos = await respuesta.json();
      localStorage.setItem("token", datos.token);
      setUsuario({ token: datos.token });
      navigate("../tareas");
    } catch (error) {
      console.error("Error en el login:", error);
    }
  };

  return (
    <div className="login-contenedor">
      <div className="login-caja">
        <h1 className="login-titulo">Gestión de Tareas</h1>
        <h2 className="login-subtitulo">Iniciar Sesión</h2>
        <form onSubmit={manejarLogin} className="login-formulario">
          <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} className="login-input" autoComplete="email" />
          <input type="password" placeholder="Clave" value={clave} onChange={(e) => setClave(e.target.value)} className="login-input" autoComplete="current-password" />
          <button type="submit" className="login-boton">INGRESAR</button>
        </form>
      </div>
      <footer className="login-footer">Creado por Jesús Alfredo Maza</footer>
    </div>
  );
};
export default Login;
