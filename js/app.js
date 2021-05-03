const monedaSelect = document.querySelector('#moneda');
const criptomonedaSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda:'',
}

//crear PROMISE
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})


document.addEventListener('DOMContentLoaded', () =>{
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario )

    criptomonedaSelect.addEventListener('change', leerValor)
    monedaSelect.addEventListener('change', leerValor)
})

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function consultarCriptomonedas (){
    const URL = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(URL)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas) )
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const opcion = document.createElement('option');

        opcion.textContent = cripto.CoinInfo.FullName;
        opcion.value = cripto.CoinInfo.Name;
        criptomonedaSelect.appendChild(opcion);
    });
}

function submitFormulario(e){
    e.preventDefault();

    if (objBusqueda.moneda === '' || objBusqueda.criptomoneda ==='') {
        mostrarAlerta('Todos los camposo son necesarios');
        return;
    }

    consultarAPI();

}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.error');

    if(!existeAlerta) {
        const alerta = document.createElement('div');
        alerta.classList.add('error');
        alerta.textContent = mensaje;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }
}

function consultarAPI(){

    mostrarSpinner();
    const {moneda, criptomoneda} = objBusqueda;

    const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    fetch(URL)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda] ) 
        });

}

function mostrarCotizacionHTML(info) {

    limpiarHTML(resultado);
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = info;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `El precio mas alto del dia <span>${HIGHDAY}</span>`;
    
    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `El precio mas bajo del dia <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variacion en las ultimas 24 horas <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimasActualizacion = document.createElement('p');
    ultimasActualizacion.innerHTML = `Ultima actualizacion <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimasActualizacion);
}

function limpiarHTML(elemento) {
    while(elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML(resultado);

    const spinner = document.createElement('div');
    spinner.classList.add('spinner')

    resultado.appendChild(spinner);
}