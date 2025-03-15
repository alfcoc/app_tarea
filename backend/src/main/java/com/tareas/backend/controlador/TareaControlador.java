package com.tareas.backend.controlador;

import com.tareas.backend.modelo.Tarea;
import com.tareas.backend.modelo.Usuario;
import com.tareas.backend.repositorio.TareaRepositorio;
import com.tareas.backend.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/tareas")
public class TareaControlador {

    private final TareaRepositorio tareaRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public TareaControlador(TareaRepositorio tareaRepositorio,
            UsuarioRepositorio usuarioRepositorio,
            SimpMessagingTemplate messagingTemplate) {
        this.tareaRepositorio = tareaRepositorio;
        this.usuarioRepositorio = usuarioRepositorio;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping
    public ResponseEntity<?> crearTarea(@RequestBody Tarea nuevaTarea) {
        if (nuevaTarea.getUsuarioAsignado() == null) {
            return ResponseEntity.badRequest().body("La tarea debe estar asignada a un usuario.");
        }

        Optional<Usuario> usuario = usuarioRepositorio.findById(nuevaTarea.getUsuarioAsignado().getId());
        if (usuario.isEmpty()) {
            return ResponseEntity.badRequest().body("El usuario asignado no existe.");
        }

        nuevaTarea.setUsuarioAsignado(usuario.get());
        tareaRepositorio.save(nuevaTarea);

        messagingTemplate.convertAndSend("/topic/tareas", nuevaTarea);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTarea);
    }

    @GetMapping
    public ResponseEntity<List<Tarea>> obtenerTareas() {
        return ResponseEntity.ok(tareaRepositorio.findAll());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Tarea>> obtenerTareasPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(tareaRepositorio.findByUsuarioAsignadoId(usuarioId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTarea(@PathVariable Long id) {
        if (!tareaRepositorio.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La tarea no existe.");
        }
        tareaRepositorio.deleteById(id);

        messagingTemplate.convertAndSend("/topic/tareas", "Tarea eliminada con ID: " + id);

        return ResponseEntity.ok("Tarea eliminada correctamente.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editarTarea(@PathVariable Long id, @RequestBody Tarea tareaActualizada) {
        Optional<Tarea> tareaOptional = tareaRepositorio.findById(id);
        if (tareaOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La tarea no existe.");
        }

        Tarea tareaExistente = tareaOptional.get();
        tareaExistente.setTitulo(tareaActualizada.getTitulo());
        tareaExistente.setEstado(tareaActualizada.getEstado());
        tareaExistente.setDescripcion(tareaActualizada.getDescripcion());

        if (tareaActualizada.getUsuarioAsignado() != null && tareaActualizada.getUsuarioAsignado().getId() != null) {
            Optional<Usuario> usuarioOptional = usuarioRepositorio
                    .findById(tareaActualizada.getUsuarioAsignado().getId());
            if (usuarioOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El usuario asignado no existe.");
            }
            tareaExistente.setUsuarioAsignado(usuarioOptional.get());
        }

        tareaRepositorio.save(tareaExistente);

        messagingTemplate.convertAndSend("/topic/tareas", tareaExistente);

        return ResponseEntity.ok(tareaExistente);
    }

    @PostMapping("/notificar")
    public ResponseEntity<String> enviarNotificacion(@RequestBody Map<String, String> mensaje) {
        messagingTemplate.convertAndSend("/topic/tareas", mensaje.get("mensaje"));
        return ResponseEntity.ok("Notificación enviada");
    }
}
