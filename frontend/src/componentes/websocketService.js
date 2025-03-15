import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const URL_WEBSOCKET = "http://localhost:8080/ws";

let stompClient = null;
let onMessageCallback = null;

export const conectarWebSocket = () => {
  const socket = new SockJS(URL_WEBSOCKET);
  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log("🟢 STOMP Debug:", str),
    onConnect: () => {

      stompClient.subscribe('/topic/tareas', (mensaje) => {
        const tarea = JSON.parse(mensaje.body);
        if (onMessageCallback) {
          onMessageCallback(tarea);
        }
        
        if (tarea) {
          mostrarNotificacion(`Nueva tarea asignada: ${tarea.titulo}`);
        }
      });
    },
    onStompError: (error) => {
      console.error("Error en STOMP:", error);
    }
  });

  stompClient.activate();
};

export const setOnMessageCallback = (callback) => {
  onMessageCallback = callback;
};

export const desconectarWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};


const mostrarNotificacion = (mensaje) => {
  if (Notification.permission === "granted") {
    new Notification(mensaje);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(mensaje);
      }
    });
  }
};
