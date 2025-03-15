package com.tareas.backend.servicio;

import com.tareas.backend.modelo.Usuario;
import com.tareas.backend.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServicio {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<Usuario> obtenerTodos() {
        return usuarioRepositorio.findAll();
    }

    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepositorio.findById(id);
    }

    public Usuario guardar(Usuario usuario) {
        if (usuario.getId() != null) {
            Optional<Usuario> usuarioExistente = usuarioRepositorio.findById(usuario.getId());
            if (usuarioExistente.isPresent()) {
                usuario.setClave(usuarioExistente.get().getClave());
            }
        } else if (usuario.getClave() != null && !usuario.getClave().isEmpty()) {
            usuario.setClave(cifrarClave(usuario.getClave()));
        }

        return usuarioRepositorio.save(usuario);
    }

    public void eliminar(Long id) {
        usuarioRepositorio.deleteById(id);
    }

    public Optional<Usuario> obtenerPorCorreo(String correo) {
        return usuarioRepositorio.findByCorreo(correo);
    }
    
    public String cifrarClave(String clave) {
        return passwordEncoder.encode(clave);
    }
}
