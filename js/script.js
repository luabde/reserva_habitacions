// Clases usadas en la aplicación
class Habitacion {
    constructor(idHabitacion, nombre, descripcion, num, noDisponible, servicios, reservada, precioDia, valoraciones, pais){
        this.idHabitacion = idHabitacion;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.num = num;
        this.noDisponible = noDisponible;
        this.servicios = servicios;
        this.reservada = reservada;
        this.precioDia = precioDia;
        this.valoraciones = valoraciones;
        this.pais = pais;
    }

    // Setters y getters

    set setNum(num){
        this.num = num;
    }

    set setReservada(param){
        this.reservada = param;
    }

    get getAll(){
        const all = [this.idHabitacion, this.nombre, this.descripcion, this.num, this.noDisponible, this.servicios, this.reservada, this.precioDia];

        return all;
    }


    // Metodos de la classe

    // Añadir fecha que la habitacion no esta disponible
    añadirFechaNoDisponible(fecha) {
        if (!this.noDisponible.includes(fecha)) {
            this.noDisponible.push(fecha);
        }
    }

    // Calcula el precio total que cuesta la habitacion segun el precio y los dias de la estancia
    calcularPrecioTotal( diasTotales){
        const total = this.precioDia * diasTotales;
        return total;
    }
}

class Usuario{
    // Habitaciones reservadas sera un objeto con la id de la habitacion con la fecha, precio total y total de dias.
    constructor(nombre, apellido, DNI, telefono, email, contraseña, habitacionesReservadas){
        this.nombre = nombre;
        this.apellido = apellido;
        this.DNI = DNI;
        this.telefono = telefono;
        this.email = email;
        this.contraseña = contraseña;
        this.habitacionesReservadas = habitacionesReservadas;
    }

    // Getters y setters

}


// Funciones principales de la aplicación


// Funciones para el calendario
function mostrarCalendari(){
    const div = document.getElementById("calendari");
    const tbody = document.getElementById("calendar-body");


    // Por defecto en el calendario, se mostrara el mes en el que nos encontramos por eso obtendremos la fecha de hoy
    const fecha = new Date();
    const any = fecha.getFullYear();
    const mes = fecha.getMonth();

    div.style.display = "block";
    const tabla = generarCalendari(mes, any);

    tbody.innerHTML = "";
    tbody.innerHTML = tabla;
}

function canviarMes(tipus){
    const meses = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Septembre", "Octubre", "Novembre", "Desembre"];

    let titulo = document.getElementById("title-month").innerText;

    let partes = titulo.split(" ");
    let mesActual = partes[0];
    let anyActual = parseInt(partes[1]);

    let indexActual = meses.indexOf(mesActual);

    let nouIndex = indexActual;
    let nouAny = anyActual;

    if (tipus === "davant") {
        if (indexActual === 11) {
            nouIndex = 0;
            nouAny++;
        } else {
            nouIndex++;
        }
    }

    if (tipus === "enrrere") {
        if (indexActual === 0) {
            nouIndex = 11;
            nouAny--;
        } else {
            nouIndex--;
        }
    }

    // Actualitzar els dies del calendari
    const tbody = document.getElementById("calendar-body");
    const tabla = generarCalendari(nouIndex, nouAny);
    tbody.innerHTML = "";
    tbody.innerHTML = tabla;
}

function generarCalendari(mes, any){
    // Primero, se actualiza el h3 con el mes que se le pasa
    const meses = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Septembre", "Octubre", "Novembre", "Desembre"];
    const h3 = document.getElementById("title-month");

    const mesActual = meses[mes];

    h3.innerHTML = "";
    h3.innerHTML = `${mesActual} ${any}`;

    // Retorna el primer dia del mes que se li pasa
    const primerDia = new Date(any, mes, 1).getDay();

    // Retorna el ultim dia del mes (es a dir que se li suma un al mes, per agafar el 0 que es el dia que va abans del primer dia del més seguent, es a dir l'ultim dia del mes)
    const diasMes = new Date(any, mes +1, 0).getDate();

    /*
        En getDay el domingo se trata como el primer dia, es por eso que como en el calendario se trata como el ultimo, se pondra en la ultima posicion que es 6. Y el reto de disas se le resta uno para que se ponga en la columna que queramos
    */
    const inicio = primerDia === 0 ? 6 : primerDia -1;
    let calendario = [];
    let dia = 1;

    // Primero se genera array bidimensional con todos los dias del mes, ordenados por semanas y dias
    for(let i = 0; i < 6; i++){
        // Esto significa las seis semanas de cada mes (maximo son seis semanas cada mes)ç
        let fila = [];
        for(let j = 0; j < 7; j++){
            if(i === 0 && j < inicio){
                // Cuando nos encontemos en la primera semana y a demás el dia es mas pequeño que el inicio (dia que empieza) se pondra vacio porque el mes aun no ha empezado
                fila.push("");
            }else if(dia > diasMes){
                /*
                    Cuando nos encontremos en la ultima semana, como puede veriar
                    el dia en el que finaliza el mes, lo que se hace es subir a la fila
                    un vacio porque el mes ya ha terminado
                */
                fila.push("");
            }else{
                // Para el resto de dias se sube el numero de dia
                fila.push(dia);
                dia++;
            }
        }

        calendario.push(fila);
    }


    let tabla = "";
    // Después en base al array bidimensional se va a generar el tbody donde se mostrara el calendario en la interfaz gráfica
    for(let semana of calendario){
        tabla += "<tr>";
        for(let dia of semana){
            if(dia === ""){
                tabla += `<td class='empty'></td>`;
            }else{
                tabla += `<td class='day' onclick="seleccionarDia(${dia})">${dia}</td>`;
            }
        }
        tabla += "</tr>";
    }
    return tabla;
}

function seleccionarDia(dia){
    // Primero obtenemos el dia el mes y el año
    const title = document.getElementById("title-month").innerText;
    let partes = title.split(" ");
    let mes = partes[0];
    let año = partes[1];

    const meses = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Septembre", "Octubre", "Novembre", "Desembre"];

    mes = meses.indexOf(mes);

    const fechaSeleccionada = `${dia}/${mes}/${año}`;

    // Obtenir del localStorage el checkin i checkout
    let checkin = localStorage.getItem("checkin") ?? null
    let checkout = localStorage.getItem("checkout") ?? null

    // Abans de posar les dates, comprovar que la data seleccionada no sigui menor que la de avui

    if(checkin === null && checkout === null){
        // Seleccionar checkin
        localStorage.setItem("checkin", fechaSeleccionada);
        console.log("Checkin seleccionado: ", fechaSeleccionada);
    }else{
        const compararFechas = esAntes(fechaSeleccionada, checkin);

        // 1. Si es la misma fecha → borrar checkin y checkout
        if (compararFechas === 0) {
            localStorage.removeItem("checkin");
            localStorage.removeItem("checkout");
            console.log("Checkin eliminado");
            pintarSeleccion();
            actualizarInputFechas();
            return;
        }
        // 2. Si la fecha seleccionada es ANTES → reemplazar checkin
        else if (compararFechas < 0) {
            localStorage.setItem("checkin", fechaSeleccionada);
            localStorage.removeItem("checkout"); // Limpiar checkout al cambiar checkin
            console.log("Nuevo checkin:", fechaSeleccionada);
            pintarSeleccion();
            actualizarInputFechas();
            return;
        }
        // 3. Si la fecha seleccionada es DESPUÉS → guardar checkout
        else if (compararFechas > 0) {
            localStorage.setItem("checkout", fechaSeleccionada);
            console.log("Checkout seleccionado:", fechaSeleccionada);
            pintarSeleccion();
            actualizarInputFechas();
            return;
        }
    }

    pintarSeleccion();
    actualizarInputFechas();
}

function esAntes(fin, fout){
    // Funcion para saber si la fecha de inicio va antes que la fecha seleccionada
    const partes1 = fin.split("/");
    const partes2 = fout.split("/");

    const d1 = Number(partes1[0]);
    const m1 = Number(partes1[1]);
    const a1 = Number(partes1[2]);

    const d2 = Number(partes2[0]);
    const m2 = Number(partes2[1]);
    const a2 = Number(partes2[2]);

    // Comparar por mes año y dia, lo que se hace es restar, para ver si son iguales, mayor o menor
    if (a1 !== a2) return a1 - a2;
    if (m1 !== m2) return m1 - m2;
    return d1 - d2;
}

function pintarSeleccion(){
    // Funcion para marcar en el calendario el rango de fechas seleccionados
    let checkin = localStorage.getItem("checkin") ?? null;
    let checkout = localStorage.getItem("checkout") ?? null;

    const tbody = document.getElementById("calendar-body");

    // Obtener mes y año del calendario actual
    const title = document.getElementById("title-month").innerText;
    let partes = title.split(" ");
    let mesNombre = partes[0];
    let año = partes[1];

    const meses = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Septembre", "Octubre", "Novembre", "Desembre"];
    let mes = meses.indexOf(mesNombre);

    // Limpiar todas las selecciones primero
    for (let i = 0; i < tbody.rows.length; i++) {
        let fila = tbody.rows[i];
        for (let j = 0; j < fila.cells.length; j++) {
            let celda = fila.cells[j];
            celda.classList.remove("selected");
        }
    }

    // Si no hay checkin, no hay nada que pintar
    if (checkin === null) return;

    const [dIn, mIn, aIn] = checkin.split("/");

    // Pintar checkin
    for (let i = 0; i < tbody.rows.length; i++) {
        let fila = tbody.rows[i];
        for (let j = 0; j < fila.cells.length; j++) {
            let celda = fila.cells[j];
            if (celda.className === "empty") continue;

            let diaTd = celda.innerText;

            // Pintar checkin
            if (diaTd == dIn && mes == mIn && año == aIn) {
                celda.classList.add("selected");
            }
        }
    }

    // Si hay checkout, también pintarlo
    if (checkout !== null) {
        const [dOut, mOut, aOut] = checkout.split("/");

        for (let i = 0; i < tbody.rows.length; i++) {
            let fila = tbody.rows[i];
            for (let j = 0; j < fila.cells.length; j++) {
                let celda = fila.cells[j];
                if (celda.className === "empty") continue;

                let diaTd = celda.innerText;

                // Pintar checkout
                if (diaTd == dOut && mes == mOut && año == aOut) {
                    celda.classList.add("selected");
                }
            }
        }
    }
}

// Función para actualizar el input visual con las fechas seleccionadas
function actualizarInputFechas() {
    const inputFechas = document.getElementById('input-fechas');

    const checkin = localStorage.getItem("checkin");
    const checkout = localStorage.getItem("checkout");

    if (checkin && checkout) {
        inputFechas.value = `${checkin} - ${checkout}`;
    } else if (checkin) {
        inputFechas.value = checkin;
    } else {
        inputFechas.value = '';
    }
}


function cerrarCalendario(){
    const calendario = document.getElementById("calendari");
    calendario.style.display = "none";
}