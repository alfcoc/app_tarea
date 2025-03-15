package com.tareas.backend.servicio;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificacionServicio {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificacionServicio(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void enviarNotificacion(String mensaje) {
        messagingTemplate.convertAndSend("/topic/notificaciones", mensaje);
    }
}
