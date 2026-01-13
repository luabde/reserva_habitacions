document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("contenedor-habitaciones");
    const titulo = document.getElementById("titulo-resultados");
    const sinResultados = document.getElementById("sin-resultados");

    // 1. Recuperar datos de búsqueda
    const habsDispo = JSON.parse(localStorage.getItem("habDispo")) || [];
    const tipoNombre = JSON.parse(localStorage.getItem("tipoSeleccionado")) || "";
    const hotelData = JSON.parse(localStorage.getItem("hotel"));

    if (!hotelData || habsDispo.length === 0) {
        titulo.innerText = "No hay resultados";
        sinResultados.style.display = "block";
        return;
    }

    // 2. Obtener detalles del tipo de habitación seleccionado
    const tipoDetalles = hotelData.tipoHabitaciones.find(t => t._nombre === tipoNombre);

    if (tipoDetalles) {
        titulo.innerText = tipoDetalles._nombre;
        // Opcional: actualizar subtítulo con descripción del tipo
        const subtitulo = document.getElementById("subtitulo-resultados");
        if (subtitulo) subtitulo.innerText = tipoDetalles._descripcion;
    }

    // 3. Mostrar habitaciones
    contenedor.innerHTML = "";

    habsDispo.forEach(hab => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-habitacion result-card";

        // Usamos la primera foto o un placeholder
        const foto = (hab.urlFotos && hab.urlFotos.length > 0) ? `${hab.urlFotos[0]}` : "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop";

        tarjeta.innerHTML = `
            <img src="${foto}" alt="Habitación ${hab.numero}">
            <div class="tarjeta-contenido">
                <div class="header-card">
                    <h3>Habitación ${hab.numero}</h3>
                    <span class="badget-precio">${tipoDetalles._precioBase}€ / noche</span>
                </div>
                <p>Capacidad: ${tipoDetalles._capacidad} personas</p>
                <div class="servicios-tags">
                    ${tipoDetalles._servicios.map(s => `<span>${s}</span>`).join("")}
                </div>
                <button class="btn-reserva-card" onclick="reservarHabitacion(${hab.idHab})">Reservar ahora</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
});

function reservarHabitacion(id) {
    localStorage.setItem("habitacionSeleccionada", id);
    window.location.href = "habitacion.html";
}
