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

function mostrarCalendari(){
    const div = document.getElementById("calendari");
    const tbody = document.getElementById("calendar-body");

    div.style.display = "block";
    const tabla = generarCalendari(0, 2025);

    tbody.innerHTML = "";
    tbody.innerHTML = tabla;
}

function generarCalendari(mes, any){
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
    
    console.log("Calendario: ", calendario);

    let tabla = "";
    // Después en base al array bidimensional se va a generar el tbody donde se mostrara el calendario en la interfaz gráfica
    for(let semana of calendario){
        tabla += "<tr>";
        for(let dia of semana){
            if(dia === ""){
                tabla += `<td class='empty'></td>`;
            }else{
                tabla += `<td class='day'>${dia}</td>`;
            }
        }
        tabla += "</tr>";
    }
    return tabla;
}