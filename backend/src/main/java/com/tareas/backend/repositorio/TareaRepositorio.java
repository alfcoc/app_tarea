package com.tareas.backend.repositorio;

import com.tareas.backend.modelo.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TareaRepositorio extends JpaRepository<Tarea, Long> {
    List<Tarea> findByUsuarioAsignadoId(Long usuarioId);
}
