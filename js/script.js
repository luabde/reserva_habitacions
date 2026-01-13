// Clases usadas en la aplicación
class Hotel {
    constructor(nombre, usuarios, tipoHabitaciones) {
        this.nombre = nombre;
        this.usuarios = usuarios;
        this.tipoHabitaciones = tipoHabitaciones;
    }

    obtenerTipoHabitacion(tipo) {
        const tipoHabitacion = this.tipoHabitaciones.filter(hab => hab._nombre === tipo);

        return tipoHabitacion;
    }

    obtenerHabDispo(tipo, checkin, checkout) {
        // Creamos el rango de fechas que se quiere reservar

        // Obtenemos las fechas que no estan disponibles de cada habitacion y nos aseguramos de que esa habitacion esta dispobible
        const tipoHab = this.obtenerTipoHabitacion(tipo);
        for (let habitacion of tipoHab[0]._habitaciones) {
            console.log("Habitacion: ", habitacion);
        }
    }

}

class TipoHabitacion {
    constructor(nombre, descripcion, capacidad, servicios, precioBase, habitaciones) {
        this._nombre = nombre;
        this._descripcion = descripcion;
        this._capacidad = capacidad;
        this._servicios = servicios;
        this._precioBase = precioBase;
        this._habitaciones = habitaciones;
    }

    // GETTERS
    get nombre() {
        return this._nombre;
    }

    get descripcion() {
        return this._descripcion;
    }

    get capacidad() {
        return this._capacidad;
    }

    get servicios() {
        return this._servicios;
    }

    get precioBase() {
        return this._precioBase;
    }

    // SETTERS
    set nombre(valor) {
        this._nombre = valor;
    }

    set descripcion(valor) {
        this._descripcion = valor;
    }

    set capacidad(valor) {
        this._capacidad = valor;
    }

    set servicios(valor) {
        this._servicios = valor;
    }

    set precioBase(valor) {
        this._precioBase = valor;
    }
}

class Habitacion {
    constructor(id, numero, urlFotos = []) {
        this.idHab = id;
        this.numero = numero;
        this.urlFotos = urlFotos;
        this.fechasNoDisponibles = [];
    }

    añadirFechaNoDisponible(fecha) {
        this.fechasNoDisponibles.push(fecha);
    }

    quitarFechaNoDisponible(fecha) {
        this.fechasNoDisponibles = this.fechasNoDisponibles.filter(f => f !== fecha);
    }
}

class Reserva {
    constructor(id, habitacion, checkin, checkout, diasTotales, precioTotal) {
        this.id = id;
        this.habitacion = habitacion;
        this.checkin = checkin;
        this.checkout = checkout;
        this.diasTotales = diasTotales;
        this.precioTotal = precioTotal;
    }

    calcularPrecioTotal(dias, precioBase) {
        this.precioTotal = dias * precioBase;
    }
}

class Usuario {
    constructor(id, nombreCompleto, email, contraseña, reservas) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.contraseña = contraseña;
        this.reservas = reservas;
    }
}

// Funciones principales de la aplicación
window.addEventListener("load", () => {

    // Si no existe el hotel en LocalStorage, lo creamos
    if (!localStorage.getItem("hotel")) {
        console.log("Generando datos iniciales del hotel...");
        inicializarDatos();
    }

    // Independientemente de si lo acabamos de crear o ya estaba, reconstruimos los objetos
    crearObjetosJSON();
});

function inicializarDatos() {

    // 1. Creamos los tipos de habitación con su array vacío
    const suite = new TipoHabitacion("Suite", "Lujo con vistas panorámicas", 2, ["Jacuzzi", "Vistas al mar", "Terraza"], 150, []);
    const doble = new TipoHabitacion("Doble", "Habitación estándar confortable", 2, ["TV", "Baño privado", "Escritorio"], 90, []);
    const individualPlus = new TipoHabitacion("Individual Plus", "Más espacio y confort individual", 1, ["Cama 105cm", "TV", "Mini nevera"], 70, []);
    const premium = new TipoHabitacion("Premium", "Experiencia para dos premium", 2, ["Cama king size", "Cafetera", "Vistas"], 110, []);

    tipoHabitaciones = [suite, doble, individualPlus, premium];

    // 2. Creamos las habitaciones físicas (SIN heredar del tipo)
    const habs = [

        // SUITES (101-105)
        new Habitacion(1, 101, null, ["img/suite1.jpg"]),
        new Habitacion(2, 102, null, ["img/suite2.jpg"]),
        new Habitacion(3, 103, null, ["img/suite1.jpg"]),
        new Habitacion(4, 104, null, ["img/suite2.jpg"]),
        new Habitacion(5, 105, null, ["img/suite1.jpg"]),

        // DOBLES (201-210)
        new Habitacion(6, 201, null, ["img/doble1.jpg"]),
        new Habitacion(7, 202, null, ["img/doble2.jpg"]),
        new Habitacion(8, 203, null, ["img/doble1.jpg"]),
        new Habitacion(9, 204, null, ["img/doble2.jpg"]),
        new Habitacion(10, 205, null, ["img/doble1.jpg"]),
        new Habitacion(11, 206, null, ["img/doble2.jpg"]),
        new Habitacion(12, 207, null, ["img/doble1.jpg"]),
        new Habitacion(13, 208, null, ["img/doble2.jpg"]),
        new Habitacion(14, 209, null, ["img/doble1.jpg"]),
        new Habitacion(15, 210, null, ["img/doble2.jpg"]),

        // INDIVIDUAL PLUS (301-305)
        new Habitacion(16, 301, null, ["img/ind1.jpg"]),
        new Habitacion(17, 302, null, ["img/ind1.jpg"]),
        new Habitacion(18, 303, null, ["img/ind1.jpg"]),
        new Habitacion(19, 304, null, ["img/ind1.jpg"]),
        new Habitacion(20, 305, null, ["img/ind1.jpg"]),

        // PREMIUM (401-405)
        new Habitacion(21, 401, null, ["img/premium1.jpg"]),
        new Habitacion(22, 402, null, ["img/premium1.jpg"]),
        new Habitacion(23, 403, null, ["img/premium1.jpg"]),
        new Habitacion(24, 404, null, ["img/premium1.jpg"]),
        new Habitacion(25, 405, null, ["img/premium1.jpg"])
    ];

    // 3. Asignamos cada habitación a su tipo correspondiente
    habs.forEach(h => {
        if (h.numero >= 101 && h.numero <= 105) suite._habitaciones.push(h);
        else if (h.numero >= 201 && h.numero <= 210) doble._habitaciones.push(h);
        else if (h.numero >= 301 && h.numero <= 305) individualPlus._habitaciones.push(h);
        else if (h.numero >= 401 && h.numero <= 405) premium._habitaciones.push(h);
    });

    // 4. Creamos los usuarios
    const usuarios = [
        new Usuario(1, "Lucía Martínez", "lucia@mail.com", "1234", []),
        new Usuario(2, "Carlos Gómez", "carlos@mail.com", "abcd", []),
        new Usuario(3, "María López", "maria.lopez@mail.com", "pass123", []),
        new Usuario(4, "Javier Ruiz", "javi.ruiz@mail.com", "qwerty", []),
        new Usuario(5, "Ana Torres", "ana.torres@mail.com", "hotel2024", [])
    ];

    // 5. Creamos el hotel
    const miHotel = new Hotel("Costa Dorada", usuarios, tipoHabitaciones);

    // 6. Guardamos todo como JSON stringificado
    localStorage.setItem("hotel", JSON.stringify(miHotel));
}

var usuarios = [];
var tipoHabitaciones = [];
var hotel;

function crearObjetosJSON() {
    const datos = JSON.parse(localStorage.getItem("hotel"));

    // 1. Reconstruir Usuarios (y sus reservas)
    usuarios = datos.usuarios.map(u => {
        // Reconstruimos las reservas en caso de que hayan, sino pues sera array vacio
        const reservasReconstruidas = u.reservas ? u.reservas.map(r => {
            const reserva = new Reserva(r.id, r.habitacion, r.checkin, r.checkout, r.diasTotales, r.precioTotal);
            return reserva;
        }) : [];
        return new Usuario(u.id, u.nombreCompleto, u.email, u.contraseña, reservasReconstruidas);
    });

    // 2. Reconstruir tipo de habitacion y habitaciones de cada tipo
    tipoHabitaciones = datos.tipoHabitaciones.map(tipo => {
        const habitacionesReconstruidas = tipo._habitaciones ? tipo._habitaciones.map(hab => {
            return habit = new Habitacion(hab.idHab, hab.numero, hab.urlFotos);
        }) : [];

        return new TipoHabitacion(tipo._nombre, tipo._descripcion, tipo._capacidad, tipo._servicios, tipo._precioBase, habitacionesReconstruidas);
    });

    // 3. Reconstruir el Hotel
    hotel = new Hotel(datos.nombre, usuarios, tipoHabitaciones);
}


// Funcions per les habitacions

function buscarHabitacio() {
    const fechas = document.getElementById("input-fechas").value;
    const tipo = document.getElementById("select-habitacion").value;
    const personas = document.getElementById("select-personas").value;

    // separar fechas
    const [checkin, checkout] = fechas.split(" - ");

    // personas viene como "2 personas" → nos quedamos con el número
    const numPersonas = personas.split(" ")[0];

    console.log("Check in:", checkin, "checkout:", checkout);
    console.log("TIPO:", tipo);
    console.log("personas:", numPersonas);

    // Nos aseguramos de que todos los campos de la búsqueda esten completos
    if (!checkin || !checkout || !tipo || !numPersonas || tipo === "Selecciona una opción" || numPersonas === "Escoge personas") {
        alert("Es obligatorio seleccionar todos los campos para la búsqueda");
        return;
    }

    hotel.obtenerHabDispo(tipo, checkin, checkout);
}

// Login
function loginUsuario(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Buscar el usuario en los objetos reales
    const usuario = usuarios.find(
        u => u.email === email && u.contraseña === password
    );

    if (!usuario) {
        alert("Email o contraseña incorrectos");
        return;
    }

    // Guardamos solo el id del usuario logueado
    localStorage.setItem("usuarioLogueado", JSON.stringify({ id: usuario.id }));
    window.location.href = "index.html";
}

// Registro
function registrarUsuario(e) {
    e.preventDefault();

    const nombre = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();
    const pass2 = document.getElementById("confirm-password").value.trim();

    if (pass !== pass2) {
        alert("Las contraseñas no coinciden");
        return;
    }

    // Comprobar si ya existe el email
    if (usuarios.some(u => u.email === email)) {
        alert("Email ya registrado");
        return;
    }

    // Crear objeto Usuario
    const nuevoUsuario = new Usuario(
        usuarios.length + 1,
        nombre,
        email,
        pass,
        []
    );

    // Añadir al array de usuarios y actualizar el hotel
    usuarios.push(nuevoUsuario);
    hotel.usuarios = usuarios;

    // Guardar en localStorage
    localStorage.setItem("hotel", JSON.stringify(hotel));

    alert("Usuario registrado correctamente");
    window.location.href = "login.html";
}

// Obtener usuario logueado
function obtenerUsuarioLogueado() {
    const data = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (!data) return null;

    return usuarios.find(u => u.id === data.id);
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "login.html";
}
