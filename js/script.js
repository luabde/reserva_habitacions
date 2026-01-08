
function mostrarCalendari(){
    const div = document.getElementById("calendari");

    div.style.display = "block";
    const tabla = generarCalendari(0, 2025);

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