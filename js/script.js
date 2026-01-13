// Clases usadas en la aplicación
class Hotel {
    constructor(nombre, usuarios, tipoHabitaciones) {
        this.nombre = nombre;
        this.usuarios = usuarios;
        this.tipoHabitaciones = tipoHabitaciones;
    }

    obtenerTipoHabitacion(tipo) {
        const tipoHabitacion = this.tipoHabitaciones.find(hab => hab._nombre === tipo);
        console.log("Tipo habitacion: ", tipoHabitacion);
        return tipoHabitacion;
    }

    obtenerHabDispo(tipo, checkin, checkout, cantPersonas) {
        // Obtenemos las fechas que no estan disponibles de cada habitacion y nos aseguramos de que esa habitacion esta dispobible
        const tipoHab = this.obtenerTipoHabitacion(tipo);

        // Validamos el numero de personas después de saber su tipo
        const resultado = this.validarNumPersonas(tipoHab, cantPersonas);

        if (!resultado) {
            alert("El numero de personas seleccionado, es demasiado para ese tipo de habitación");
            return;
        }

        // Creamos el rango de fechas que se quiere reservar
        let diasMeses = [];
        let any = 2026;
        for (let i = 1; i <= 12; i++) {
            diasMeses.push(new Date(any, i, 0).getDate());
        }

        console.log("DIAS MESES:", diasMeses);
        let [dIn, mIn, aIn] = checkin.split("/");
        let [dOut, mOut, aOut] = checkout.split("/");

        dIn = Number(dIn);
        dOut = Number(dOut);
        mIn = Number(mIn);
        mOut = Number(mOut);
        aIn = Number(aIn);
        aOut = Number(aOut);

        let rango = [];

        if (mIn != mOut && aIn === aOut) {
            // Cuando se cambia el mes pero no el año
            const diasMesActual = new Date(aIn, mIn + 1, 0).getDate(); // Se le suma 1 para pedir el dia 0 del mses anterior (hace referencia al ultimo dia del mes)

            // For para añadir el rango desde el checkin hasta final de mes
            for (let i = dIn; i <= diasMesActual; i++) {
                rango.push(`${i}/${mIn}/${aIn}`);
            }
            // For para añadir las fechas desde principios de mes del mes siguiente hasta la fecha seleciconada
            for (let i = 1; i <= dOut; i++) {
                rango.push(`${i}/${mOut}/${aIn}`);
            }

        }

        if (aIn != aOut) {
            // 1. Desde checkin hasta fin de año
            const diasMesActual = new Date(aIn, mIn + 1, 0).getDate();

            for (let i = dIn; i <= diasMesActual; i++) {
                rango.push(i + "/" + mIn + "/" + aIn);
            }

            // 2. Desde enero del nuevo año hasta checkout
            for (let i = 1; i <= dOut; i++) {
                rango.push(i + "/" + mOut + "/" + aOut);
            }
        }

        if (mIn === mOut) {
            // Cuando no se cambia ni el mes ni el año unicamente iremos sumando el dia hasta llega al del out
            for (let i = dIn; i <= dOut; i++) {
                rango.push(`${i}/${mIn}/${aIn}`);
            }

        }
        console.log("Rango: ", rango);

        let habitaciones = [];
        for (let habitacion of tipoHab._habitaciones) {
            const fechasNoDisponibles = habitacion.fechasNoDisponibles;
            console.log("Fechas no disponibles: ", fechasNoDisponibles);

            let disponible = true;
            for (let fecha of rango) {
                if (fechasNoDisponibles.includes(fecha)) {
                    disponible = false;
                }
            }

            // Cuando es true, es decir que esas fechas estan disponibles porque no se incluyen en fechas no dispo se suben a habitaciones
            if (disponible) {
                habitaciones.push(habitacion);
            }
        }

        localStorage.setItem("tipoSeleccionado", JSON.stringify(tipo));
        localStorage.setItem("habDispo", JSON.stringify(habitaciones));
    }

    validarNumPersonas(tipo, cantPersonas) {
        const capacidad = tipo._capacidad;
        const num = Number(cantPersonas);

        return num <= capacidad;
    }


    validarNumPersonas(tipo, cantPersonas) {
        const capacidad = tipo._capacidad;
        const num = Number(cantPersonas);

        return num <= capacidad;
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

    // Verificamos estado del login para el botón del header
    checkLoginState();

    // En el caso de que la pagina se la de la habitacion, se llama a la funcion de renderizar resultado para mostrar dinamicamente la habitacion
    let pagina = window.location.href.split("/");
    pagina = pagina[pagina.length - 1];

    if (pagina === "habitacion.html" || pagina === "habitacionDetalles.html") {
        // Cuando sea la pagina sea habitaicon.html o habitacionDetalles se renderiza resultados, que es todo lo de la pagina
        renderizarResultados();
    }

    if (pagina === "habitacion.html") {
        // Cuando solo sea habitacion.html es que es el html que se abre cuando se busca el hotel, y como no solo son detalles se tiene que completar la info para reservar
        actualizaerDetallesReserva();
    }
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
        new Habitacion(1, 101, ["../img/suite1.jpg", "../img/suite2.jpg", "../img/suite3.jpg"]),
        new Habitacion(2, 102, ["../img/suite1.jpg", "../img/suite2.jpg", "../img/suite3.jpg"]),
        new Habitacion(3, 103, ["../img/suite1.jpg", "../img/suite2.jpg", "../img/suite3.jpg"]),
        new Habitacion(4, 104, ["../img/suite1.jpg", "../img/suite2.jpg", "../img/suite3.jpg"]),
        new Habitacion(5, 105, ["../img/suite1.jpg", "../img/suite2.jpg", "../img/suite3.jpg"]),

        // DOBLES (201-210)
        new Habitacion(6, 201, ["../img/doble1.jpg", "../img/doble2.jpg", "../img/doble3.jpg"]),
        new Habitacion(7, 202, ["../img/doble1.jpg", "../img/doble2.jpg", "../img/doble3.jpg"]),
        new Habitacion(8, 203, ["../img/doble1.jpg", "../img/doble2.jpg", "../img/doble3.jpg"]),
        new Habitacion(9, 204, ["../img/doble1.jpg", "../img/doble2.jpg", "../img/doble3.jpg"]),
        new Habitacion(10, 205, ["../img/doble1.jpg", "../img/doble2.jpg", "../img/doble3.jpg"]),
        new Habitacion(11, 206, ["../img/doble1.jpg", "../img/doble2.jpg", "../img/doble3.jpg"]),
        new Habitacion(12, 207, ["../img/doble1.jpg", "../img/doble2.jpg", "../img/doble3.jpg"]),
        new Habitacion(13, 208, ["../img/doble1.jpg", "../img/doble2.jpg", "../img/doble3.jpg"]),
        new Habitacion(14, 209, ["../img/doble1.jpg", "../img/doble2.jpg", "../img/doble3.jpg"]),
        new Habitacion(15, 210, ["../img/doble1.jpg", "../img/doble2.jpg", "../img/doble3.jpg"]),

        // INDIVIDUAL PLUS (301-305)
        new Habitacion(16, 301, ["../img/ind1.jpg", "../img/ind2.jpg", "../img/ind3.jpg"]),
        new Habitacion(17, 302, ["../img/ind1.jpg", "../img/ind2.jpg", "../img/ind3.jpg"]),
        new Habitacion(18, 303, ["../img/ind1.jpg", "../img/ind2.jpg", "../img/ind3.jpg"]),
        new Habitacion(19, 304, ["../img/ind1.jpg", "../img/ind2.jpg", "../img/ind3.jpg"]),
        new Habitacion(20, 305, ["../img/ind1.jpg", "../img/ind2.jpg", "../img/ind3.jpg"]),

        // PREMIUM (401-405)
        new Habitacion(21, 401, ["../img/premium1.jpg", "../img/premium2.jpg", "../img/premium3.jpg"]),
        new Habitacion(22, 402, ["../img/premium1.jpg", "../img/premium2.jpg", "../img/premium3.jpg"]),
        new Habitacion(23, 403, ["../img/premium1.jpg", "../img/premium2.jpg", "../img/premium3.jpg"]),
        new Habitacion(24, 404, ["../img/premium1.jpg", "../img/premium2.jpg", "../img/premium3.jpg"]),
        new Habitacion(25, 405, ["../img/premium1.jpg", "../img/premium2.jpg", "../img/premium3.jpg"])
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

    // Guardamos los parámetros de búsqueda para rellenar el formulario después
    const params = {
        checkin: checkin,
        checkout: checkout,
        personas: numPersonas,
        tipo: tipo
    };
    localStorage.setItem("busquedaParams", JSON.stringify(params));

    hotel.obtenerHabDispo(tipo, checkin, checkout, numPersonas);

    window.location.href = "html/resultadoBuscar.html";
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado");
    const esSub = window.location.pathname.includes("/html/");
    window.location.href = esSub ? "login.html" : "html/login.html";
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

    const esSub = window.location.pathname.includes("/html/");
    window.location.href = esSub ? "../index.html" : "index.html";
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
    const esSub = window.location.pathname.includes("/html/");
    window.location.href = esSub ? "login.html" : "html/login.html";
}

// Obtener usuario logueado
function obtenerUsuarioLogueado() {
    const data = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (!data) return null;

    return usuarios.find(u => u.id === data.id);
}

function checkLoginState() {
    const btnLogin = document.getElementById("btn-login");
    // Si no estamos en una página con el botón de login (ej: login.html), no hacemos nada
    if (!btnLogin) return;

    const usuario = obtenerUsuarioLogueado();

    if (usuario) {
        btnLogin.textContent = "Logout";
        btnLogin.href = "#";
        btnLogin.addEventListener("click", (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    } else {
        btnLogin.textContent = "Login";
        const esSub = window.location.pathname.includes("/html/");
        btnLogin.href = esSub ? "login.html" : "html/login.html";
    }
}

// Renderizar pagina habitacion.html
function renderizarResultados() {
    // 2. Recuperar ID de habitación y Tipo seleccionado
    const habId = localStorage.getItem("habitacionSeleccionada");
    let tipoNombre = JSON.parse(localStorage.getItem("tipoSeleccionado"));

    if (!tipoNombre) {
        console.error("No hay tipo de habitación seleccionado.");
        return;
    }

    // 3. Buscar el tipo de habitación en el hotel
    const tipo = hotel.tipoHabitaciones.find(t => t._nombre === tipoNombre);
    if (!tipo) return;

    // 4. Buscar la habitación específica (si viene de búsqueda) o la primera (si viene de index)
    let habitacionActual = null;
    habitacionActual = tipo._habitaciones.find(h => h.idHab == habId);


    // 5. Rellenar Información General
    const titulo = document.getElementById("habitacion-titulo");
    const cant = document.getElementById("cantidadPersonas");
    const descr = document.getElementById("descr");

    titulo.innerHTML = tipo._nombre;
    cant.innerHTML = tipo._capacidad;
    descr.innerHTML = tipo._descripcion;

    // 6. Cargar Galería
    const fotoPrincipal = document.getElementById("foto-principal");
    const fortosecundaria1 = document.getElementById("foto-secundaria1");
    const fortosecundaria2 = document.getElementById("foto-secundaria2");

    if (habitacionActual && habitacionActual.urlFotos && habitacionActual.urlFotos.length > 0) {
        fotoPrincipal.src = habitacionActual.urlFotos[0];
        fortosecundaria1.src = habitacionActual.urlFotos[1];
        fortosecundaria2.src = habitacionActual.urlFotos[2];
    } else {
        // Placeholder si no hay fotos
        fotoPrincipal.src = `<img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop" alt="Habitación">`;
    }

    // 7. Cargar Servicios
    const contenedorServicios = document.getElementById("contenedor-servicios");
    contenedorServicios.innerHTML = "";
    tipo._servicios.forEach(ser => {
        const div = document.createElement("div");
        div.className = "servicio-item";
        div.innerHTML = `<div><h3>${ser}</h3><p>Servicio incluido</p></div>`;
        contenedorServicios.appendChild(div);
    });
}

function actualizaerDetallesReserva() {
    const habId = localStorage.getItem("habitacionSeleccionada");
    let tipoNombre = JSON.parse(localStorage.getItem("tipoSeleccionado"));

    if (!tipoNombre) {
        console.error("No hay tipo de habitación seleccionado.");
        return;
    }

    // 3. Buscar el tipo de habitación en el hotel
    const tipo = hotel.tipoHabitaciones.find(t => t._nombre === tipoNombre);
}