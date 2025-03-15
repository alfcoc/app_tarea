import { createContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { login, logout } from "../api/authService";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUsuario({ token });
    }
  }, []);

  const iniciarSesion = async (correo, clave) => {
    try {
      const data = await login(correo, clave);
      setUsuario({ token: data.token });
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const cerrarSesion = () => { logout(); setUsuario(null); localStorage.removeItem("token"); };
  const value = useMemo(() => ({ usuario, iniciarSesion, cerrarSesion }), [usuario]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
