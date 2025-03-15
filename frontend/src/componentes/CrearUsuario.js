import React, { useState, useEffect } from "react";
const CrearUsuario = ({ agregarUsuario, usuarioEditando }) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const [clave, setClave] = useState("");
  
  useEffect(() => {
    if (usuarioEditando) {
      setNombre(usuarioEditando.nombre);
      setCorreo(usuarioEditando.correo);
      setRol(usuarioEditando.rol);
      setClave("");
    }
  }, [usuarioEditando]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!nombre || !correo || !rol || (!usuarioEditando && !clave)) {
      alert("Todos los campos son obligatorios");
      return;
    }
    const nuevaUsuario = {
      id: usuarioEditando?.id,
      nombre,
      correo,
      rol,
      ...(usuarioEditando ? {} : { clave })
    };
    

    agregarUsuario(nuevaUsuario);
    setNombre("");
    setCorreo("");
    setRol("");
    setClave("");
  };

  return (
    <form onSubmit={manejarEnvio}>
      <h3 className="titulo">{usuarioEditando ? "Editar Usuario" : "Crear Nuevo Usuario"}</h3>
      <div className="formulario-fila">
        <div className="formulario-grupo">
          <label htmlFor="nombre" className="formulario-label">Nombres y Apellidos</label>
          <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="formulario-input" placeholder="Nombres y Apellidos" required />
        </div>
        <div className="formulario-grupo">
          <label htmlFor="correo" className="formulario-label">Email</label>
          <input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="formulario-input" placeholder="Email" required autoComplete="email" />
        </div>
        <div className="formulario-grupo">
          <label htmlFor="rol" className="formulario-label">Perfil</label>
          <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)} className="formulario-select" required >
            <option value="">Selecciona un perfil</option>
            <option value="ADMIN">ADMINISTRADOR</option>
            <option value="USER">USUARIO</option>
          </select>
        </div>
        {!usuarioEditando && (
          <div className="formulario-grupo">
            <label htmlFor="clave" className="formulario-label">Password</label>
            <input id="clave" type="password" value={clave} onChange={(e) => setClave(e.target.value)} className="formulario-input" placeholder="Password" autoComplete="new-password" />
          </div>
        )}
      </div>
      <button type="submit" className="formulario-boton">{usuarioEditando ? "Actualizar Usuario" : "Crear Usuario"}</button>
    </form>
  );
};
export default CrearUsuario;
