//Declaro variables globales de productos
//PF PESOS
const pf_peso = {
    mon_peso: 1
    , monto_pe_minimo: 1000
    , tasa_pe_30: 180
    , tasa_pe_60: 182
    , tasa_pe_90: 184
}

//PF DOLARES
const pf_dolar = {
    mon_dolar: 2
    , monto_do_minimo: 500
    , tasa_do_30: 2
    , tasa_do_60: 2.1
    , tasa_do_90: 2.2
}

//Declaro variables globales varias
const plazo_minimo = 30;
const salir = 0;
let saludo = '';
let despedida = '';
let Inst_PF_Peso = '';
let Inst_PF_Dolar = '';
let moneda = -1;
let monto = 0;
let plazo = 0;
let tasa = 0;
let reinvertir = 0;
let continuar = false;
let plazo_ok = false;
let reinvertir_ok = false;
let resultado = '';
let int_a_cobrar = 0;
let int_ganados = 0;
let saldo_a_cobrar = 0;
let array_capital = [];
let array_int_a_cobrar = [];
let array_saldo_a_cobrar = [];
let txt_a_cobrar = '';
let des_moneda = '';
let dolar_compra = '';
let dolar_venta = '';
let mensaje_dolar = '';

var toast = new Toasty();

//Funcion para hacer parpadear la cotizacion del dolar
function parpadeo() {
    let Cot_Dol = document.getElementById("Cot_Dol");
    if (Cot_Dol.style.visibility === "hidden") {
        Cot_Dol.style.visibility = "visible";
    } else {
        Cot_Dol.style.visibility = "hidden";
    }
}

//Funcion para obtener el valor del dolar
function obtengo_dolar() {
    fetch("https://dolarapi.com/v1/dolares/blue")
        .then(response => response.json())
        .then((data) => {
            dolar_compra = data.compra;
            dolar_venta = data.venta;
            mensaje_dolar = 'La cotización del Dólar para la compra es de $ ' + data.compra + '<br>';
            mensaje_dolar = mensaje_dolar + 'La cotización del Dólar para la venta es de $ ' + data.venta;
            let Cot_Dol = document.getElementById("Cot_Dol");
            Cot_Dol.innerHTML = mensaje_dolar;
        })
}

//Funcion para evaluar si el cliente
//ingreso un valor que supera el minimo
function supera_monto(monto_eval, moneda_eval) {
    switch (moneda_eval) {
        case 1:
            if (pf_peso.monto_pe_minimo <= monto_eval) {
                return true;
                break;
            } else {
                return false;
            }
        case 2:
            if (pf_dolar.monto_do_minimo <= monto_eval) {
                return true;
                break;
            } else {
                return false;
            }
    }
}

//Función para obtener la tasa a aplicar
function obtengo_tasa() {
    if (moneda == pf_peso.mon_peso) {
        switch (true) {
            case plazo < 60:
                tasa = pf_peso.tasa_pe_30;
                break;
            case plazo < 90:
                tasa = pf_peso.tasa_pe_60;
                break;
            default:
                tasa = pf_peso.tasa_pe_90;
        }
    } else {
        switch (true) {
            case plazo < 60:
                tasa = pf_dolar.tasa_do_30;
                break;
            case plazo < 90:
                tasa = pf_dolar.tasa_do_60;
                break;
            default:
                tasa = pf_dolar.tasa_do_90;
        }
    }
}

//Función que calcula los resultados
function calculo_pf() {
    saldo_a_cobrar = monto;
    int_ganados = 0;
    for (let i = reinvertir; i >= 0; i--) {
        array_capital.push(saldo_a_cobrar);
        int_a_cobrar = ((saldo_a_cobrar * tasa / 100) / 365) * plazo;
        int_ganados = int_ganados + int_a_cobrar;
        array_int_a_cobrar.push(int_a_cobrar);
        saldo_a_cobrar = saldo_a_cobrar + int_a_cobrar;
        array_saldo_a_cobrar.push(saldo_a_cobrar);
    }

    const set_JSON_int = JSON.stringify(int_ganados.toFixed(2));
    const set_JSON_mon = JSON.stringify(des_moneda);

    localStorage.setItem('int_ganados', set_JSON_int);
    localStorage.setItem('moneda', set_JSON_mon);

    let contador = 1;
    let fecha_inicio = new Date();
    let fecha_fin = new Date();

    fecha_fin.setDate(fecha_fin.getDate() + plazo);

    txt_a_cobrar = '';

    for (let elemento = 0; elemento < array_saldo_a_cobrar.length; elemento++) {
        txt_a_cobrar = txt_a_cobrar + 'El capital inicial al ' + fecha_inicio.toLocaleDateString() + ' es de $' + array_capital[elemento].toFixed(2) + '<br>';
        txt_a_cobrar = txt_a_cobrar + 'Los intereses generados al ' + fecha_fin.toLocaleDateString() + ' seran de $' + array_int_a_cobrar[elemento].toFixed(2) + '<br>';
        txt_a_cobrar = txt_a_cobrar + 'El saldo al finalizar el Plazo Fijo ' + contador + ' sera de $' + array_saldo_a_cobrar[elemento].toFixed(2) + '<br><br>';
        fecha_inicio.setDate(fecha_inicio.getDate() + plazo);
        fecha_fin.setDate(fecha_fin.getDate() + plazo);
        contador++;
    }

    let resultado = document.getElementById("resultado");
    resultado.innerHTML = txt_a_cobrar;
}

//Saludo inicial
saludo = '¡Bienvenido al simulador de Plazos Fijos! <br>';
saludo = saludo + 'Las condiciones son las siguientes:';

Inst_PF_Peso = 'Plazo Fijo en Pesos: <br>';
Inst_PF_Peso = Inst_PF_Peso + 'Plazo mínimo: ' + plazo_minimo + ' días <br>';
Inst_PF_Peso = Inst_PF_Peso + 'Monto mínimo: $' + pf_peso.monto_pe_minimo + ' <br>';
Inst_PF_Peso = Inst_PF_Peso + 'Plazo: 30 días // TEA: ' + pf_peso.tasa_pe_30 + '% <br>';
Inst_PF_Peso = Inst_PF_Peso + 'Plazo: 60 días // TEA: ' + pf_peso.tasa_pe_60 + '% <br>';
Inst_PF_Peso = Inst_PF_Peso + 'Plazo: 90 días // TEA: ' + pf_peso.tasa_pe_90 + '%';

Inst_PF_Dolar = 'Plazo Fijo en Dólares: <br>';
Inst_PF_Dolar = Inst_PF_Dolar + 'Plazo mínimo: ' + plazo_minimo + ' días <br>';
Inst_PF_Dolar = Inst_PF_Dolar + 'Monto mínimo: U$s' + pf_dolar.monto_do_minimo + ' <br>';
Inst_PF_Dolar = Inst_PF_Dolar + 'Plazo: 30 días // TEA: ' + pf_dolar.tasa_do_30 + '% <br>';
Inst_PF_Dolar = Inst_PF_Dolar + 'Plazo: 60 días // TEA: ' + pf_dolar.tasa_do_60 + '% <br>';
Inst_PF_Dolar = Inst_PF_Dolar + 'Plazo: 90 días // TEA: ' + pf_dolar.tasa_do_90 + '%';

despedida = 'En ambos productos puede reinvertir hasta 3 veces el capital y los intereses obtenidos.';

let local_ganados = localStorage.getItem('int_ganados');
let local_moneda = localStorage.getItem('moneda');

if (local_ganados != null) {
    local_ganados = JSON.parse(local_ganados);
    local_moneda = JSON.parse(local_moneda);
    let Int_Gan = document.getElementById("Int_Gan");
    let mensaje_int_full = 'En la última simulación ud. hubiese ganado ' + local_ganados + ' ' + local_moneda.toLowerCase() + '.';
    let mensaje_int_parc = ''

    let promise = new Promise((resolve, reject) => {
        for (let i = 0; i < mensaje_int_full.length; i++) {
            setTimeout(() => {
                mensaje_int_parc = mensaje_int_parc + mensaje_int_full[i];
                Int_Gan.innerHTML = mensaje_int_parc;
                if (i === mensaje_int_full.length - 1) {
                    resolve();
                }
            }, 50 * i);
        }
    });

    promise.then(() => {
        toast.info("Se notificó el resultado de la simulación anterior");
    }).catch((error) => {
        toast.error("Se produjo un error: " + error);
    });
}

obtengo_dolar();
setInterval(parpadeo, 1000);

let saludo_1 = document.getElementById("Saludo");
saludo_1.innerHTML = saludo;

let instrucciones_p = document.getElementById("Inst_PF_Peso");
instrucciones_p.innerHTML = Inst_PF_Peso;

let instrucciones_d = document.getElementById("Inst_PF_Dolar");
instrucciones_d.innerHTML = Inst_PF_Dolar;

let despedida_1 = document.getElementById("Despedida");
despedida_1.innerHTML = despedida;

function monedaClick() {
    //Ingreso de moneda
    let cbo_moneda = document.getElementById("cbo_moneda");
    let ind_moneda = cbo_moneda.selectedIndex;
    let opt_moneda = cbo_moneda.options[ind_moneda];
    des_moneda = opt_moneda.text;
    moneda = parseInt(cbo_moneda.value);
}

function montoClick() {
    //Ingreso de monto
    continuar = false;
    monto = parseFloat(txt_monto.value);
    if (txt_monto.value == '') {
        //El usuario presiono aceptar sin ingresar un valor
        toast.error('¡Ingrese un monto!');
        txt_monto.value = "";
        txt_monto.focus();
    } else if (Number.isNaN(monto)) {
        toast.error('¡El valor ingresado no es un monto!');
        txt_monto.value = "";
        txt_monto.focus();
    } else if (monto == 0) {
        toast.error('¡El monto ingresado no puede ser igual a cero!');
        txt_monto.value = "";
        txt_monto.focus();
    } else if (monto < 0) {
        toast.error('¡El monto ingresado es negativo!');
        txt_monto.value = "";
        txt_monto.focus();
    } else if (supera_monto(monto, moneda) == false) {
        toast.error('¡El monto ingresado no supera al mínimo!');
        txt_monto.value = "";
        txt_monto.focus();
    } else {
        continuar = true;
    }
}

function plazoClick() {
    //Ingreso de plazo
    if (continuar == true) {
        continuar = false;
        plazo = parseInt(txt_plazo.value);
        if (plazo == 0) {
            //El usuario puso plazo
            toast.error('¡El plazo ingresado no puede ser igual a cero!');
            txt_plazo.value = "";
            txt_plazo.focus();
        } else if (txt_plazo.value == '') {
            //El usuario presiono aceptar sin ingresar un plazo
            toast.error('¡Ingrese un plazo!');
            txt_plazo.value = "";
            txt_plazo.focus();
        } else if (Number.isNaN(plazo)) {
            toast.error('¡El valor ingresado no es un plazo!');
            txt_plazo.value = "";
            txt_plazo.focus();
        } else if (plazo < 0) {
            toast.error('¡El plazo ingresado es negativo!');
            txt_plazo.value = "";
            txt_plazo.focus();
        } else if (plazo < plazo_minimo) {
            toast.error('¡El plazo ingresado no supera al mínimo de ' + plazo_minimo + ' días!');
            txt_plazo.value = "";
            txt_plazo.focus();
        } else {
            continuar = true;
        }
    }
}

function reinvertirClick() {
    //Ingreso de plazo de reinversión
    if (continuar == true) {
        continuar = false;
        reinvertir = parseInt(txt_reinvertir.value);
        if (txt_reinvertir.value == '') {
            //El usuario presiono aceptar sin ingresar un plazo
            toast.error('¡Ingrese un número de reiversiones!');
            txt_reinvertir.value = "";
            txt_reinvertir.focus();
        } else if (Number.isNaN(reinvertir)) {
            toast.error('¡El valor ingresado no es un plazo de reinversión!');
            txt_reinvertir.value = "";
            txt_reinvertir.focus();
        } else if (reinvertir < 0) {
            toast.error('¡El valor ingresado es negativo!');
            txt_reinvertir.value = "";
            txt_reinvertir.focus();
        } else if (reinvertir > 3) {
            toast.error('¡La cantidad de reinversiones supera el límite máximo de 3!');
            txt_reinvertir.value = "";
            txt_reinvertir.focus();
        } else {
            continuar = true;
        }
    }
}

function calcularClick(event) {
    if (continuar == true) {
        //Recupero tasa
        obtengo_tasa();
        //Inicio el cálculo final
        calculo_pf();
        //Deshabilito botón
        cbo_moneda.disabled = true;
        enviar.disabled = true;
        txt_monto.disabled = true;
        txt_plazo.disabled = true;
        txt_reinvertir.disabled = true;
    }
    event.preventDefault();
}

let txt_monto = document.getElementById("txt_monto");
txt_monto.addEventListener("click", function () {
    //Limpiar el monto
    txt_monto.value = "";
});

let txt_plazo = document.getElementById("txt_plazo");
txt_plazo.addEventListener("click", function () {
    //Limpiar el plazo
    txt_plazo.value = "";
});

let txt_reinvertir = document.getElementById("txt_reinvertir");
txt_reinvertir.addEventListener("click", function () {
    //Limpiar reinvertir
    txt_reinvertir.value = "";
});

let enviar = document.getElementById("enviar");
enviar.addEventListener("click", monedaClick);
enviar.addEventListener("click", montoClick);
enviar.addEventListener("click", plazoClick);
enviar.addEventListener("click", reinvertirClick);
enviar.addEventListener("click", calcularClick);


