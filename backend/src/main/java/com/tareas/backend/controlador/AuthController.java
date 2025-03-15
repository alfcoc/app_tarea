package com.tareas.backend.controlador;

import com.tareas.backend.modelo.Usuario;
import com.tareas.backend.repositorio.UsuarioRepositorio;
import com.tareas.backend.seguridad.JwtUtil;
import com.tareas.backend.seguridad.UserDetailsServiceImpl;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;
    private final UsuarioRepositorio usuarioRepositorio;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, UserDetailsServiceImpl userDetailsService,
            JwtUtil jwtUtil, UsuarioRepositorio usuarioRepositorio, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.usuarioRepositorio = usuarioRepositorio;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        if (!request.containsKey("correo") || !request.containsKey("clave")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan credenciales"));
        }

        String correo = request.get("correo");
        String clave = request.get("clave");

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(correo, clave));

        UserDetails userDetails = userDetailsService.loadUserByUsername(correo);
        String token = jwtUtil.generarToken(userDetails.getUsername());

        Usuario usuario = usuarioRepositorio.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(Map.of(
                "token", token,
                "rol", usuario.getRol()));
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario nuevoUsuario) {

        if (usuarioRepositorio.findByCorreo(nuevoUsuario.getCorreo()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
        }
        if (nuevoUsuario.getNombre() == null || nuevoUsuario.getNombre().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El nombre es obligatorio"));
        }

        nuevoUsuario.setClave(passwordEncoder.encode(nuevoUsuario.getClave()));

        usuarioRepositorio.save(nuevoUsuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("mensaje", "Usuario registrado exitosamente"));
    }
}
