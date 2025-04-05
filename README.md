# Aplicación de Gestión de Tareas
**Autor:** Jesús Alfredo Maza Sánchez

Aplicación web para gestionar tareas con autenticación, roles de usuario, notificaciones en tiempo real, paginación y más. Desarrollada con **Spring Boot** (backend), **React** (frontend) y **MySQL** (base de datos).

---

## Tecnologías Utilizadas

- **Backend:** Java 17, Spring Boot, Maven
- **Frontend:** React + Vite, TailwindCSS
- **Base de datos:** MySQL (XAMPP)
- **Autenticación:** JWT (jjwt 0.12.6)
- **Despliegue:** Heroku (backend), Vercel (frontend)

---

## Instrucciones para Ejecutar Localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tareas.git
cd tareas
```

---

## Configurar Backend (Spring Boot)

### 2. Configurar base de datos en XAMPP

1. Abrir **XAMPP**
2. Iniciar el servicio **MySQL**
3. Ingresar a **phpMyAdmin**
4. Crear una base de datos llamada:

```
gestion_tareas
```

> No crear tablas, Spring Boot lo hará automáticamente.

---

### 3. Configurar archivo `application.properties`

Ir a:  
`backend/src/main/resources/application.properties`  
y asegurarse de tener la siguiente configuración:

```properties
# Conexión a la base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/gestion_tareas
spring.datasource.username=root
spring.datasource.password=

# Configuración JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT
jwt.secret=mi_clave_secreta
jwt.expiration=3600000
```

---

### 4. Compilar y ejecutar el backend

Desde la carpeta `backend`, ejecutar:

```bash
mvn clean install
mvn spring-boot:run
```

Esto levanta el servidor en:  
`http://localhost:8080`

---

## Configurar Frontend (React)

### 5. Instalar dependencias

Desde la carpeta `frontend`:

```bash
cd frontend
npm install
```

---

### 6. Crear archivo `.env` en `frontend/`

Crear un archivo `.env` en la raíz del frontend con el siguiente contenido:

```env
VITE_API_URL=http://localhost:8080
```

---

### 7. Ejecutar el frontend

```bash
npm run dev
```

Esto abrirá la app en:  
`http://localhost:5173`

---

## Credenciales de Prueba

- **Administrador:**
  - Usuario: `admin@demo.com`
  - Contraseña: `admin123`

- **Usuario estándar:**
  - Usuario: `usuario@demo.com`
  - Contraseña: `usuario123`

> Si no existen usuarios, registrarlos manualmente primero o agregar datos en la base.

---

## Funcionalidades

Registro e inicio de sesión con JWT  
CRUD de usuarios y tareas  
Roles: administrador / usuario  
Notificaciones en tiempo real al asignar tareas  
Búsqueda avanzada por título, descripción y estado  
Paginación y ordenación  
Logs del backend  
Internacionalización del frontend  
Diseño responsivo  
Página de login con tu nombre abajo a la derecha  
Despliegue en Heroku / Vercel

---

## Despliegue

### Backend en Heroku

1. Crear app en [https://dashboard.heroku.com](https://dashboard.heroku.com)
2. Agregar `ClearDB` o configurar una base de datos externa
3. Subir el proyecto usando Git o GitHub
4. Configurar las variables de entorno:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET`
   - `JWT_EXPIRATION`

---

### Frontend en Vercel

1. Crear cuenta en [https://vercel.com](https://vercel.com)
2. Importar el proyecto desde GitHub
3. Configurar variable `VITE_API_URL` apuntando al backend en Heroku
4. Hacer deploy

---

## Autor

Desarrollado por **[Tu Nombre Aquí]**  
Contacto: [tu-email@ejemplo.com]

---

## Estado del Proyecto

Proyecto 100% funcional.  
Preparado para pruebas, despliegue y personalización.

---
