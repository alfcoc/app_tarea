import React, { useState, useEffect } from "react";
const CrearTarea = ({ agregarTarea, tareaEditando }) => {
  const [titulo, setTitulo] = useState("");
  const [estado, setEstado] = useState("");
  const [usuarioAsignado, setUsuarioAsignado] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/usuarios")
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error("Error al obtener usuarios:", error));
  }, []);

  useEffect(() => {
    if (tareaEditando) {
      setTitulo(tareaEditando.titulo);
      setEstado(tareaEditando.estado);
      setDescripcion(tareaEditando.descripcion);
      setUsuarioAsignado(tareaEditando.usuarioAsignado.id);
    }
  }, [tareaEditando]);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!titulo || !estado || !descripcion || !usuarioAsignado) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const nuevaTarea = {
      id: tareaEditando?.id,
      titulo,
      estado,
      descripcion,
      usuarioAsignado,
    };

    agregarTarea(nuevaTarea);
    setTitulo("");
    setEstado("");
    setDescripcion("");
    setUsuarioAsignado("");
  };

  return (
    <form onSubmit={manejarEnvio}>
      <h3 className="titulo">{tareaEditando ? "Editar Tarea" : "Crear Nueva Tarea"}</h3>
      <div className="formulario-fila">
        <div className="formulario-grupo">
          <label htmlFor="titulo" className="formulario-label">Título</label>
          <input id="titulo" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="formulario-input" placeholder="Título de la tarea" required />
        </div>
        <div className="formulario-grupo">
          <label htmlFor="estado" className="formulario-label">Estado</label>
          <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} className="formulario-select" required>
            <option value="">Selecciona un estado</option>
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En Progreso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
        <div className="formulario-grupo">
          <label htmlFor="usuarioAsignado" className="formulario-label">Usuario Asignado</label>
          <select id="usuarioAsignado" value={usuarioAsignado} onChange={(e) => setUsuarioAsignado(e.target.value)} className="formulario-select" required>
            <option value="">Selecciona un usuario</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre} {/* Muestra el nombre en la lista */}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="formulario-grupo">
        <label htmlFor="descripcion" className="formulario-label">Descripción</label>
        <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="formulario-textarea" placeholder="Descripción detallada de la tarea" required />
      </div>
      <button type="submit" className="formulario-boton">
        {tareaEditando ? "Actualizar Tarea" : "Crear Tarea"}
      </button>
    </form>
  );
};

export default CrearTarea;
