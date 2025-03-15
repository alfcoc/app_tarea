package com.tareas.backend.seguridad;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String CLAVE_SECRETA = "claveSecretaSuperSeguraClaveSecretaSuperSegura";
    private static final long TIEMPO_EXPIRACION = 1000 * 60 * 60 * 10;

    private Key getClaveFirma() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(CLAVE_SECRETA));
    }

    public String generarToken(String correo) {
        return Jwts.builder()
                .setSubject(correo)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + TIEMPO_EXPIRACION))
                .signWith(getClaveFirma(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String obtenerCorreo(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getClaveFirma())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getClaveFirma())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
