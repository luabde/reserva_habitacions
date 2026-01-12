// Clases usadas en la aplicación
class Hotel {
    constructor(nombre, habitaciones, usuarios) {
        this.nombre = nombre;
        this.habitaciones = habitaciones;
        this.usuarios = usuarios;
    }
}

class TipoHabitacion {
    constructor(nombre, descripcion, capacidad, servicios, precioBase) {
        this._nombre = nombre;
        this._descripcion = descripcion;
        this._capacidad = capacidad;
        this._servicios = servicios;
        this._precioBase = precioBase;
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

class Habitacion extends TipoHabitacion {
    constructor(id, numero, tipo, urlFotos = []) {
        // Heredamos las propiedades del tipo
        super(tipo.nombre, tipo.descripcion, tipo.capacidad, tipo.servicios, tipo.precioBase);
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
    constructor(id, habitacion, checkin, checkout, diasTotales) {
        this.id = id;
        this.habitacion = habitacion;
        this.checkin = checkin;
        this.checkout = checkout;
        this.diasTotales = diasTotales;
        this.precioTotal = precioTotal;
    }

    calcularPrecioTotal(dias, precioBase){
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

window.addEventListener("load", () => {

    // Si no existe el hotel en LocalStorage, lo creamos
    if (!localStorage.getItem("hotel")) {
        console.log("Generando datos iniciales del hotel...");
        inicializarDatos();
    }
});

function inicializarDatos() {
    // 1. Definimos los 4 tipos de habitación originales
    const suite = new TipoHabitacion("Suite", "Lujo con vistas panorámicas", 2, ["Jacuzzi", "Vistas al mar", "Terraza"], 150);
    const doble = new TipoHabitacion("Doble", "Habitación estándar confortable", 2, ["TV", "Baño privado", "Escritorio"], 90);
    const individualPlus = new TipoHabitacion("Individual Plus", "Más espacio y confort individual", 1, ["Cama 105cm", "TV", "Mini nevera"], 70);
    const premium = new TipoHabitacion("Premium", "Experiencia para dos premium", 2, ["Cama king size", "Cafetera", "Vistas"], 110);

    // 2. Creamos las habitaciones físicas (heredando del tipo)
    const habs = [
        // SUITES (101-105)
        new Habitacion(1, 101, suite, ["img/suite1.jpg"]),
        new Habitacion(2, 102, suite, ["img/suite2.jpg"]),
        new Habitacion(3, 103, suite, ["img/suite1.jpg"]),
        new Habitacion(4, 104, suite, ["img/suite2.jpg"]),
        new Habitacion(5, 105, suite, ["img/suite1.jpg"]),

        // DOBLES (201-210)
        new Habitacion(6, 201, doble, ["img/doble1.jpg"]),
        new Habitacion(7, 202, doble, ["img/doble2.jpg"]),
        new Habitacion(8, 203, doble, ["img/doble1.jpg"]),
        new Habitacion(9, 204, doble, ["img/doble2.jpg"]),
        new Habitacion(10, 205, doble, ["img/doble1.jpg"]),
        new Habitacion(11, 206, doble, ["img/doble2.jpg"]),
        new Habitacion(12, 207, doble, ["img/doble1.jpg"]),
        new Habitacion(13, 208, doble, ["img/doble2.jpg"]),
        new Habitacion(14, 209, doble, ["img/doble1.jpg"]),
        new Habitacion(15, 210, doble, ["img/doble2.jpg"]),

        // INDIVIDUAL PLUS (301-305)
        new Habitacion(16, 301, individualPlus, ["img/ind1.jpg"]),
        new Habitacion(17, 302, individualPlus, ["img/ind1.jpg"]),
        new Habitacion(18, 303, individualPlus, ["img/ind1.jpg"]),
        new Habitacion(19, 304, individualPlus, ["img/ind1.jpg"]),
        new Habitacion(20, 305, individualPlus, ["img/ind1.jpg"]),

        // PREMIUM (401-405)
        new Habitacion(21, 401, premium, ["img/premium1.jpg"]),
        new Habitacion(22, 402, premium, ["img/premium1.jpg"]),
        new Habitacion(23, 403, premium, ["img/premium1.jpg"]),
        new Habitacion(24, 404, premium, ["img/premium1.jpg"]),
        new Habitacion(25, 405, premium, ["img/premium1.jpg"])
    ];

    // 3. Creamos los usuarios
    const usuarios = [
        new Usuario(1, "Lucía Martínez", "lucia@mail.com", "1234", []),
        new Usuario(2, "Carlos Gómez", "carlos@mail.com", "abcd", []),
        new Usuario(3, "María López", "maria.lopez@mail.com", "pass123", []),
        new Usuario(4, "Javier Ruiz", "javi.ruiz@mail.com", "qwerty", []),
        new Usuario(5, "Ana Torres", "ana.torres@mail.com", "hotel2024", [])
    ];

    // 5. Creamos el hotel
    const miHotel = new Hotel("Costa Dorada", habs, usuarios);

    // 6. Guardamos todo como JSON stringificado
    localStorage.setItem("hotel", JSON.stringify(miHotel));
}

// Funciones principales de la aplicación
