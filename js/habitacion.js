window.addEventListener("load", () => {
    // 1. Reconstruir datos (esto ya lo hace script.js, pero nos aseguramos de que el hotel esté listo)
    // El hotel se reconstruye en el listener de 'load' de script.js, 
    // por lo que al llegar aquí ya debería estar disponible la variable global 'hotel'.

    // Si por alguna razón 'hotel' no está, lo intentamos cargar nosotros
    if (!hotel && localStorage.getItem("hotel")) {
        crearObjetosJSON();
    }

    mostrarInformacion();
});

function mostrarInformacion() {
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
    if (habId) {
        habitacionActual = tipo._habitaciones.find(h => h.idHab == habId);
    } else {
        habitacionActual = tipo._habitaciones[0];
    }

    // 5. Rellenar Información General
    document.getElementById("habitacion-titulo").innerText = habitacionActual ? `${tipo.nombre} ${habitacionActual.numero}` : tipo.nombre;
    document.getElementById("breadcrumb-tipo").innerText = tipo.nombre;
    document.getElementById("habitacion-capacidad").querySelector("span").innerText = `Hasta ${tipo.capacidad} personas`;
    document.getElementById("habitacion-descripcion").innerText = tipo.descripcion;
    document.getElementById("reserva-precio").innerText = `${tipo.precioBase}€`;

    // 6. Cargar Galería
    const contenedorPrincipal = document.getElementById("foto-principal");
    const contenedorSecundarias = document.getElementById("fotos-secundarias");

    if (habitacionActual && habitacionActual.urlFotos && habitacionActual.urlFotos.length > 0) {
        contenedorPrincipal.innerHTML = `<img src="${habitacionActual.urlFotos[0]}" alt="${tipo.nombre}">`;

        contenedorSecundarias.innerHTML = "";
        for (let i = 1; i < habitacionActual.urlFotos.length; i++) {
            const img = document.createElement("img");
            img.src = habitacionActual.urlFotos[i];
            img.alt = `Vista ${i + 1}`;
            contenedorSecundarias.appendChild(img);
        }
    } else {
        // Placeholder si no hay fotos
        contenedorPrincipal.innerHTML = `<img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop" alt="Habitación">`;
    }

    // 7. Cargar Servicios
    const contenedorServicios = document.getElementById("contenedor-servicios");
    contenedorServicios.innerHTML = "";
    tipo.servicios.forEach(ser => {
        const div = document.createElement("div");
        div.className = "servicio-item";
        div.innerHTML = `<div><h3>${ser}</h3><p>Servicio premium incluido</p></div>`;
        contenedorServicios.appendChild(div);
    });

    // 8. Autocompletar Reserva (si hay datos de búsqueda)
    const spanFechas = document.getElementById("reserva-fechas-texto");
    const spanHuespedes = document.getElementById("reserva-huespedes-texto");
    const resumenPrecio = document.querySelector(".resumen-precio");
    const btnReserva = document.querySelector(".btn-reservar");

    const fIn = localStorage.getItem("fechaEntrada");
    const fOut = localStorage.getItem("fechaSalida");
    const nPers = localStorage.getItem("numPersonasSeleccionadas");

    if (fIn && fOut && habId) {
        // Mode Reserva (desde búsqueda)
        spanFechas.innerText = `${fIn} - ${fOut}`;
        spanHuespedes.innerText = `${nPers} Persona${nPers > 1 ? 's' : ''}`;

        // Calcular y mostrar resumen
        actualizarCalculo(tipo.precioBase, fIn, fOut);
        resumenPrecio.style.display = "block";
        btnReserva.style.display = "block";
    } else {
        // Mode Info (desde index)
        spanFechas.innerText = "Seleccione fechas en el inicio";
        spanHuespedes.innerText = "Capacidad máx: " + tipo.capacidad;
        resumenPrecio.style.display = "none";
        btnReserva.style.display = "none";
    }
}

function actualizarCalculo(precio, fIn, fOut) {
    const partsIn = fIn.split("/");
    const partsOut = fOut.split("/");
    const d1 = new Date(partsIn[2], partsIn[1] - 1, partsIn[0]);
    const d2 = new Date(partsOut[2], partsOut[1] - 1, partsOut[0]);

    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Asignamos los valores al resumen (buscando los spans correspondientes)
    const lineas = document.querySelectorAll(".linea-precio");
    if (lineas.length >= 3) {
        lineas[0].children[0].innerText = `${precio}€ × ${diffDays} noche${diffDays > 1 ? 's' : ''}`;
        lineas[0].children[1].innerText = `${precio * diffDays}€`;

        // El total (última línea)
        const lineaTotal = document.querySelector(".linea-precio.total");
        lineaTotal.children[1].innerText = `${precio * diffDays + 30}€`; // Añadimos 30 de servicio como en el diseño original
    }
}