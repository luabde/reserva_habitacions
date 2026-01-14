# Hotel Costa Dorada - Reserva de Habitaciones

Este proyecto es una aplicación web para la gestión de reservas del "Hotel Costa Dorada". Permite a los usuarios explorar habitaciones, registrarse, iniciar sesión y realizar reservas.

## Autores
- **Pau Soldevilla**
- **Lucia Abellán**

## Características Principales

### Gestión del Hotel
- **Visualización de Habitaciones**: Catálogo de habitaciones disponibles (Suite, Doble con Vistas, Individual Plus, Premium).
- **Detalles de Habitación**: Páginas de detalle con información específica, servicios incluidos y fotos.
- **Búsqueda Dinámica**: Buscador por fechas y número de personas.
- **Resultados de Búsqueda**: Filtrado de habitaciones disponibles según los criterios del usuario.

### Gestión de Usuarios
- **Registro y Login**: Sistema de autenticación de usuarios.
- **Persistencia de Datos**: Uso de `LocalStorage` para guardar usuarios, sesiones y el estado del hotel.
- **Restricción de Reservas**: Solo los usuarios logueados pueden realizar reservas.

### Sistema de Reservas
- **Calendario Interactivo**: Selección visual de fechas de entrada y salida.
- **Validación de Fechas**: El sistema comprueba la disponibilidad de las habitaciones para las fechas seleccionadas.
- **Cálculo de Precios**: Cálculo automático del coste total basado en el precio por noche, número de noches y personas.

## Tecnologías Utilizadas
- **HTML5**: Estructura semántica de las páginas.
- **CSS3**: Estilos personalizados (sin frameworks externos de CSS), diseño responsive y uso de variables CSS.
- **JavaScript (Vanilla)**: Lógica de negocio (clases `Hotel`, `Habitacion`, `Reserva`, `Usuario`), manipulación del DOM y gestión del `LocalStorage`.

## Estructura del Proyecto

```text
/
├── css/                  # Hojas de estilo
│   ├── style.css         # Estilos generales
│   ├── habitacion.css    # Estilos de detalle de habitación
│   ├── login.css         # Estilos de login/registro
│   └── resultadoBuscar.css # Estilos de resultados de búsqueda
├── html/                 # Páginas secundarias
│   ├── habitacion.html
│   ├── habitacionDetalles.html
│   ├── login.html
│   ├── register.html
│   └── resultadoBuscar.html
├── img/                  # Imágenes del proyecto
├── js/                   # Lógica JavaScript
│   ├── script.js         # Lógica principal y clases
│   ├── calendario.js     # Lógica del calendario
│   └── resultadoBusqueda.js
└── index.html            # Página principal
```

## Cómo ejecutar el proyecto
1. Clona o descarga el repositorio.
2. Abre el archivo `index.html` en tu navegador web preferido.
3. ¡Navega y prueba la aplicación!
   - *Nota: Al ser una aplicación puramente frontend con LocalStorage, no requiere instalación de servidor backend ni base de datos.*