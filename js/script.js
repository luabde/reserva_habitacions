// Clases usadas en la aplicación
class Habitacion {
    constructor(idHabitacion, nombre, descripcion, num, noDisponible, servicios, reservada, precioDia, valoraciones){
        this.idHabitacion = idHabitacion;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.num = num;
        this.noDisponible = noDisponible;
        this.servicios = servicios;
        this.reservada = reservada;
        this.precioDia = precioDia;
        this.valoraciones = valoraciones;
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

function mostrarCalendari(){
    const div = document.getElementById("calendari");

    div.style.display = "block";
    const tabla = generarCalendari(0, 2025);

    div.innerHTML = "";
    div.appendChild(tabla);
}

function generarCalendari(mes, any){
    let tabla = document.createElement("div");

    // Retorna el primer dia del mes que se li pasa
    const primerDia = new Date(any, mes, 1).getDay();

    // Retorna el ultim dia del mes (es a dir que se li suma un al mes, per agafar el 0 que es el dia que va abans del primer dia del més seguent, es a dir l'ultim dia del mes)
    const diasMes = new Date(any, mes +1, 0).getDate();

    for(let i = 1; i <= diasMes; i++){
        tabla.innerHTML += `
            <div class="casilla" id="${i}">
            <p>${i}</p>
            </div>
        `;
    }

    return tabla;
}