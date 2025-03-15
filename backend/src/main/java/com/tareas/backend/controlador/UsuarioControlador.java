package com.tareas.backend.controlador;

import com.tareas.backend.modelo.Usuario;
import com.tareas.backend.servicio.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/usuarios")
public class UsuarioControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @GetMapping
    public List<Usuario> obtenerTodos() {
    List<Usuario> usuarios = usuarioServicio.obtenerTodos();
    System.out.println("Usuarios obtenidos: " + usuarios.size()); 
    return usuarios;
}

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        return usuarioServicio.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Usuario guardar(@RequestBody Usuario usuario) {
        return usuarioServicio.guardar(usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable Long id) {
        Optional<Usuario> usuarioOptional = usuarioServicio.obtenerPorId(id);
        
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El usuario no existe.");
        }
        
        usuarioServicio.eliminar(id);
        return ResponseEntity.ok("Usuario eliminado correctamente.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
        Optional<Usuario> usuarioOptional = usuarioServicio.obtenerPorId(id);

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El usuario no existe.");
        }

        Usuario usuarioExistente = usuarioOptional.get();
        usuarioExistente.setNombre(usuarioActualizado.getNombre());
        usuarioExistente.setCorreo(usuarioActualizado.getCorreo());
        usuarioExistente.setRol(usuarioActualizado.getRol());
        
        if (usuarioActualizado.getClave() != null && !usuarioActualizado.getClave().isEmpty()) {
            usuarioExistente.setClave(usuarioServicio.cifrarClave(usuarioActualizado.getClave()));
        }
        

        Usuario usuarioGuardado = usuarioServicio.guardar(usuarioExistente);
        return ResponseEntity.ok(usuarioGuardado);
        
    }
}

