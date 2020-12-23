//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const listadoGastos = document.querySelector('#gastos ul');

//Eventos
eventListener();
function eventListener(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);
    formulario.addEventListener('submit',agregarGasto);
};

//clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    };

    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto];
        this.calcularRestante();
    };

    calcularRestante(){
        const gastado = this.gastos.reduce( (acc,gasto) => acc + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    };

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }

};

class UI{
    insertarPresupuesto(cantidad){
        const { presupuesto,restante } = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    };

    imprimirAlerta(mensaje,tipo){
        //crear div
        const divMsj = document.createElement('div');
        divMsj.classList.add('text-center','alert');
        
        if(tipo === 'error'){
            divMsj.classList.add('alert-danger');
        }else{
            divMsj.classList.add('alert-success');
        };

        divMsj.textContent = mensaje;
        document.querySelector('.primario').insertBefore(divMsj,formulario);
        setTimeout(() => {
            divMsj.remove();
        }, 3000);
    };

    mostrarGastos(gastos){
         //limpiar html
        this.limpiarHtml();
        //iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad,nombre, id } = gasto;

            //crear li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;//es lo mismo que nuevoGasto.setAttribute('data-id',id);
            
            //agregar html del gasto
            nuevoGasto.innerHTML = `${nombre}<span class ="badge badge-primary badge-pill">$ ${cantidad}</span>`;

            //agregar btn borrar
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //agregar al html
            listadoGastos.appendChild(nuevoGasto);
        });
    };

    limpiarHtml(){
        while (listadoGastos.firstChild) {
            listadoGastos.removeChild(listadoGastos.firstChild);
        };
    };

    actualizaRestante(restante){
        document.querySelector('#restante').textContent = restante;
    };

    comprobarPresupuesto({ presupuesto,restante }){
        //const { presupuesto,restante } = presupuestoObj;
        const divRestante = document.querySelector('.restante');
        //si ya gaso el 75% o mas cambia de color
        if((presupuesto * 0.25) > restante){
            divRestante.classList.remove('alert-success','alert-warning');
            divRestante.classList.add('alert-danger');
        }else if((presupuesto * 0.50) > restante){
            divRestante.classList.remove('alert-success');
            divRestante.classList.add('alert-warning');
        }else{
            divRestante.classList.remove('alert-danger','alert-warning');
            divRestante.classList.add('alert-success');
            formulario.querySelector('button[type="submit"]').disabled = false;
        }

        //si el total es cero
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
       
    };

};
//instanciar
const ui = new UI();
let presupuesto;

//funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('Cual es tu presupuesto');

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    };

    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);

};

function agregarGasto(e){
    e.preventDefault();
    
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value); 

    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios','error');
        return;
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    const gasto = {
        nombre,
        cantidad,
        id: Date.now()
    };

    //agregar e imprimir gasto
    presupuesto.nuevoGasto(gasto);
    ui.imprimirAlerta('Gasto agregado correctamente!');//como el if no evalua otro que no sea error no hace falta pasarlo
    //limpiar formulario
    formulario.reset();

      
    //imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    //actualizar restante
    ui.actualizaRestante(restante);
    //
    ui.comprobarPresupuesto(presupuesto);
};

function eliminarGasto(id){

    //elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    //elimina los gasots del html
    const { gastos,restante } = presupuesto;
    ui.mostrarGastos(gastos); 
    //actualizar restante
    ui.actualizaRestante(restante);
    //
    ui.comprobarPresupuesto(presupuesto); 
}
