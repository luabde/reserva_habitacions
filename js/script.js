// Clases usadas en la aplicación
class Hotel {
    constructor(nombre, habitaciones) {
        this.nombre = nombre;
        this.habitaciones = habitaciones; // Array de objetos Habitacion (que ya incluyen su tipo por herencia)
    }
}

class TipoHabitacion {
    constructor(id, nombre, descripcion, capacidad, servicios, precioBase) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.capacidad = capacidad;
        this.servicios = servicios;
        this.precioBase = precioBase;
    }
}

class Habitacion extends TipoHabitacion {
    constructor(id, numero, tipo, urlFotos = []) {
        // Heredamos las propiedades del tipo
        super(tipo.id, tipo.nombre, tipo.descripcion, tipo.capacidad, tipo.servicios, tipo.precioBase);
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
    constructor(id, usuario, habitacion, checkin, checkout, diasTotales, precioTotal) {
        this.id = id;
        this.usuario = usuario;         // Usuario que reserva (id)
        this.habitacion = habitacion;   // Habitación física (objeto o numero)
        this.checkin = checkin;
        this.checkout = checkout;
        this.diasTotales = diasTotales;
        this.precioTotal = precioTotal;
    }
}

class Usuario {
    constructor(id, nombreCompleto, email, contraseña) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.contraseña = contraseña;
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
    const suite = new TipoHabitacion(1, "Suite", "Lujo con vistas panorámicas", 4, ["Jacuzzi", "Vistas al mar", "Terraza"], 150);
    const doble = new TipoHabitacion(2, "Doble", "Habitación estándar confortable", 2, ["TV", "Baño privado", "Escritorio"], 90);
    const individualPlus = new TipoHabitacion(3, "Individual Plus", "Más espacio y confort individual", 1, ["Cama 105cm", "TV", "Mini nevera"], 70);
    const premium = new TipoHabitacion(4, "Premium", "Experiencia superior para dos", 2, ["Cama king size", "Cafetera", "Vistas"], 110);

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

    // 3. Creamos el hotel
    const miHotel = new Hotel("Costa Dorada", habs);

    // 4. Guardamos todo como JSON stringificado
    localStorage.setItem("hotel", JSON.stringify(miHotel));
}

// Funciones principales de la aplicación
