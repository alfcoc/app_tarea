import axiosInstance from "./axiosConfig";
export const login = async (correo, clave) => {
  try {
    const response = await axiosInstance.post("/auth/login", { correo, clave });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("id", response.data.id);

    return response.data;
  } catch (error) {
    const mensajeError = error.response?.data?.mensaje || "Error al iniciar sesión. Por favor, inténtelo más tarde.";
    throw new Error(mensajeError);
  }
};
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioId");
};
