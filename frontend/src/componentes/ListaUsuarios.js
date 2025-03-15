import React, { useEffect, useState } from "react";
import { obtenerUsuarios } from "./ObtenerDatos";
import CrearUsuario from "./CrearUsuario";
import Menu from "./Menu";
import "../styles/App.css";

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const datos = await obtenerUsuarios();
        setUsuarios(datos);
      } catch (error) {
        console.error("Error al cargar las usuarios", error);
      }
    }
    cargarUsuarios();
  }, []);

  const agregarUsuario = async (nuevaUsuario) => {
    const nuevaUsuarioCorregida = {
      ...nuevaUsuario,
      usuarioAsignado: { id: nuevaUsuario.usuarioAsignado },
    };
    const response = await fetch("http://localhost:8080/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(nuevaUsuarioCorregida),
    });
    if (response.ok) {
      const usuarioCreada = await response.json();
      setUsuarios([...usuarios, usuarioCreada]);
      alert("Usuario registrado");
    } else {
      alert("No tienes permiso para crear usuarios");
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    const response = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setUsuarios(usuarios.filter((t) => t.id !== id));
    } else {
      alert("No tienes permiso para eliminar este usuario");
    }
  };

  const editarUsuario = async (usuarioActualizada) => {
    const usuarioCorregida = {
      ...usuarioActualizada,
      usuarioAsignado: { id: usuarioActualizada.usuarioAsignado },
    };
    const response = await fetch(
      `http://localhost:8080/api/usuarios/${usuarioActualizada.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuarioCorregida),
      }
    );

    if (response.ok) {
      const usuarioEditada = await response.json();
      setUsuarios(
        usuarios.map((t) => (t.id === usuarioEditada.id ? usuarioEditada : t))
      );
      setUsuarioEditando(null);
      alert("Usuario actualizado correctamente");
    } else {
      alert("No tienes permiso para editar este usuario");
    }
  };

  return (
    <div className="dashboard">
      <Menu />
      <div className="contenido">
        <header className="header">
          <h1>📋 Gestión de Usuarios</h1>
        </header>

        <main className="listados">
        <CrearUsuario agregarUsuario={usuarioEditando ? editarUsuario : agregarUsuario} usuarioEditando={usuarioEditando} setUsuarioEditando={setUsuarioEditando} />
          <h2 className="titulo">Lista de Usuarios</h2>
          {usuarios.length === 0 ? (
            <p>No hay usuarios disponibles.</p>
          ) : (
            <table className="tableros">
            <thead>
              <tr>
                <th>id</th>
                <th>Nombres y Apelidos</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.rol}</td>
                  <td className="botones-acciones">
                    <button onClick={() => setUsuarioEditando(usuario)} className="boton-editar">Editar</button>
                    <button onClick={() => eliminarUsuario(usuario.id)} className="boton-borrar">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </main>
      </div>
    </div>
  );
};

export default ListaUsuarios;
