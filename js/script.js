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
