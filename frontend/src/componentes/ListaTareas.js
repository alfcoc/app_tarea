import React, { useEffect, useState } from "react";
import { conectarWebSocket, setOnMessageCallback } from "./websocketService";
import { obtenerTareas } from "./ObtenerDatos";
import CrearTarea from "./CrearTarea";
import Menu from "./Menu";
import ReactPaginate from "react-paginate";
import "../styles/App.css";

const ListaTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [tareaEditando, setTareaEditando] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [tituloFiltro, setTituloFiltro] = useState("");
  const [descripcionFiltro, setDescripcionFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "titulo", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function cargarTareas() {
      try {
        const datos = await obtenerTareas();
        setTareas(datos);
      } catch (error) {
        console.error("Error al cargar las tareas", error);
      }
    }
    cargarTareas();
  }, []);

  const agregarTarea = async (nuevaTarea) => {
    const nuevaTareaCorregida = {
      ...nuevaTarea,
      usuarioAsignado: { id: nuevaTarea.usuarioAsignado },
    };
    const response = await fetch("http://localhost:8080/api/tareas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevaTareaCorregida),
    });

    if (response.ok) {
      const tareaCreada = await response.json();
      setTareas([...tareas, tareaCreada]);
      alert("Tarea registrada");
      setNotificaciones((prev) => [
        ...prev,
        `Tarea creada: ${tareaCreada.titulo}`,
      ]);
    } else {
      alert("No tienes permiso para crear tareas");
    }
  };

  useEffect(() => {
    conectarWebSocket();
    setOnMessageCallback((mensaje) => {
    });
  }, []);

  const eliminarTarea = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta tarea?")) return;
    const response = await fetch(`http://localhost:8080/api/tareas/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setTareas(tareas.filter((t) => t.id !== id));
    } else {
      alert("No tienes permiso para eliminar esta tarea");
    }
  };

  const editarTarea = async (tareaActualizada) => {
    const tareaCorregida = {
      ...tareaActualizada,
      usuarioAsignado: { id: tareaActualizada.usuarioAsignado },
    };
    const response = await fetch(
      `http://localhost:8080/api/tareas/${tareaActualizada.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tareaCorregida),
      }
    );
    if (response.ok) {
      const tareaEditada = await response.json();
      setTareas(
        tareas.map((t) => (t.id === tareaEditada.id ? tareaEditada : t))
      );
      setTareaEditando(null);
      alert("Tarea actualizada correctamente");
    } else {
      alert("No tienes permiso para editar esta tarea");
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const itemsPerPage = 5;
  const offset = currentPage * itemsPerPage;
  const filteredTareas = tareas.filter((tarea) => {
    const tituloCoincide = tarea.titulo.toLowerCase().includes(tituloFiltro.toLowerCase());
    const descripcionCoincide = tarea.descripcion.toLowerCase().includes(descripcionFiltro.toLowerCase());
    const estadoCoincide = tarea.estado.toLowerCase().includes(estadoFiltro.toLowerCase());
    return tituloCoincide && descripcionCoincide && estadoCoincide;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTareas = filteredTareas.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const paginatedTareas = sortedTareas.slice(offset, offset + itemsPerPage);

  return (
    <div className="dashboard">
      <Menu />
      <div className="contenido">
        <header className="header">
          <h1>📋 Gestión de Tareas</h1>
        </header>
        <main className="listados">
          {notificaciones.length > 0 && (
            <div className="notificaciones">
              <h3>Notificaciones:</h3>
              <ul>
                {notificaciones.map((notificacion, index) => (
                  <li key={index}>{notificacion}</li>
                ))}
              </ul>
            </div>
          )}
          <CrearTarea agregarTarea={tareaEditando ? editarTarea : agregarTarea} tareaEditando={tareaEditando} setTareaEditando={setTareaEditando} />
          <h2 className="titulo">Lista de Tareas</h2>
          <div className="filtros">
            <input type="text" placeholder="Buscar por Título" value={tituloFiltro} onChange={(e) => setTituloFiltro(e.target.value)} />
            <input type="text" placeholder="Buscar por Estado" value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} />
            <input type="text" placeholder="Buscar por Descripción" value={descripcionFiltro} onChange={(e) => setDescripcionFiltro(e.target.value)} />
          </div>

          {paginatedTareas.length === 0 ? (
            <p>No hay tareas disponibles.</p>
          ) : (
            <table className="tableros">
              <thead>
                <tr>
                  <th><button onClick={() => requestSort("titulo")}> Título{" "} {sortConfig.key === "titulo" && (sortConfig.direction === "asc" ? "▲" : "▼")} </button></th>
                  <th><button onClick={() => requestSort("estado")}> Estado{" "} {sortConfig.key === "estado" && (sortConfig.direction === "asc" ? "▲" : "▼")} </button></th>
                  <th>Descripción</th>
                  <th>Usuario Asignado</th>
                  <th>Fecha de Creación</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedTareas.map((tarea) => (
                  <tr key={tarea.id}>
                    <td>{tarea.titulo}</td>
                    <td>{tarea.estado}</td>
                    <td>{tarea.descripcion}</td>
                    <td>{tarea.usuarioAsignado?.nombre || "No asignado"}</td>
                    <td>{new Date(tarea.fechaCreacion).toLocaleDateString()}</td>
                    <td className="botones-acciones">
                      <button onClick={() => setTareaEditando(tarea)} className="boton-editar">Editar</button>
                      <button onClick={() => eliminarTarea(tarea.id)} className="boton-borrar">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <ReactPaginate
            previousLabel={"< Anterior"}
            nextLabel={"Siguiente >"}
            pageCount={Math.ceil(filteredTareas.length / itemsPerPage)}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </main>
      </div>
    </div>
  );
};

export default ListaTareas;
