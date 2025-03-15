package com.tareas.backend.servicio;

import com.tareas.backend.modelo.Tarea;
import com.tareas.backend.repositorio.TareaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TareaServicio {

    @Autowired
    private TareaRepositorio tareaRepositorio;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    
    public List<Tarea> obtenerTodasLasTareas() {
        return tareaRepositorio.findAll();
    }

    
    public Optional<Tarea> obtenerTareaPorId(Long id) {
        return tareaRepositorio.findById(id);
    }


    
    public Tarea crearTarea(Tarea tarea) {
        Tarea nuevaTarea = tareaRepositorio.save(tarea);

        
        messagingTemplate.convertAndSend("/notificaciones/nueva-tarea", nuevaTarea);

        return nuevaTarea;
    }

    
    

    
    public Tarea actualizarTarea(Long id, Tarea tareaActualizada) {
        if (tareaRepositorio.existsById(id)) {
            tareaActualizada.setId(id);
            return tareaRepositorio.save(tareaActualizada);
        }
        return null;
    }

    
    public void eliminarTarea(Long id) {
        tareaRepositorio.deleteById(id);
    }
}
