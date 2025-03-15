import axios from "axios";
const API_URL_USARIOS = "http://localhost:8080/api/usuarios"; 
export const obtenerUsuarios = async () => {
  try {
    const respuesta = await axios.get(API_URL_USARIOS);
    return respuesta.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};


const API_URL_TAREAS = "http://localhost:8080/api/tareas"; 
export const obtenerTareas = async () => {
  try {
    const respuesta = await axios.get(API_URL_TAREAS);
    return respuesta.data;
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    throw error;
  }
  
};






