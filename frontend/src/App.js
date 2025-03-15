import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./componentes/Login";
import ListaTareas from "./componentes/ListaTareas";
import ListaUsuarios from "./componentes/ListaUsuarios";


const App = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUsuario({ token });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUsuario={setUsuario} />} />
        <Route path="/tareas" element={ usuario ? (<ListaTareas />) : (<Navigate to="/login" />)}/>
        <Route path="/usuarios" element={ usuario ? (<ListaUsuarios />) : (<Navigate to="/login" />)}/>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
