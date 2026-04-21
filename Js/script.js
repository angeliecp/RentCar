function cargarAutos() {

    let contenedor = document.getElementById("listaAutos")
    if (!contenedor) return

    contenedor.innerHTML = ""

    let esIndex = document.querySelector(".hero") !== null


    if (esIndex) {

        let reservas = JSON.parse(localStorage.getItem("reservas")) || []


        let conteo = {}

        reservas.forEach(r => {
            if (r.autoId) {
                conteo[r.autoId] = (conteo[r.autoId] || 0) + 1
            }
        })


        let vendidos = [...autos]
            .sort((a, b) => (conteo[b.id] || 0) - (conteo[a.id] || 0))
            .slice(0, 2)


        let caros = [...autos].sort((a, b) => b.precio - a.precio).slice(0, 2)


        let baratos = [...autos].sort((a, b) => a.precio - b.precio).slice(0, 2)


        let disponibles = autos.filter(a => a.stock > 0).slice(0, 2)

        let destacados = [...new Map([...vendidos, ...caros, ...baratos, ...disponibles].map(a => [a.id, a])).values()]

        destacados.forEach(auto => {

            let estado = auto.stock > 0 ?
                "Disponibles: " + auto.stock :
                "AUTO AGOTADO"

            // FIX AQUÍ
            let veces = conteo[auto.id] || 0

            contenedor.innerHTML += `
<div class="card">

<img src="${auto.img}">

<h3>${auto.nombre}</h3>

<p>$${auto.precio} / día</p>

<p>${estado}</p>

<span class="mensaje ok">🔥 Reservado ${veces} veces</span>

<a class="btn" href="reservar.html">Reservar</a>

</div>
`
        })

        return
    }



    autos.forEach(auto => {

        let estado = auto.stock > 0 ?
            "Disponibles: " + auto.stock :
            "AUTO AGOTADO"

        contenedor.innerHTML += `

<div class="card">

<img src="${auto.img}">

<h3>${auto.nombre}</h3>

<p>$${auto.precio} / día</p>

<p>${estado}</p>

<a class="btn" href="reservar.html">
Reservar
</a>

</div>

`

    })

}


function llenarSelectAutos() {

    let select = document.getElementById("auto")
    if (!select) return

    select.innerHTML = '<option value="">Seleccione un auto</option>'

    autos.forEach((auto, index) => {

        let option = document.createElement("option")

        option.value = index
        option.text = auto.nombre + " - disponibles: " + auto.stock

        if (auto.stock === 0) {
            option.disabled = true
            option.text = auto.nombre + " - AGOTADO"
        }

        select.appendChild(option)

    })

}


function calcularPrecio() {

    let autoIndex = document.getElementById("auto").value ? parseInt(document.getElementById("auto").value) : 0;
    let fechaInicioVal = document.getElementById("fechaInicio")?.value;
    let fechaFinVal = document.getElementById("fechaFin")?.value;

    if (autoIndex === "" || !fechaInicioVal || !fechaFinVal) return

    let fechaInicio = new Date(fechaInicioVal + 'T00:00:00');
    let fechaFin = new Date(fechaFinVal + 'T00:00:00');
    let dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));

    if (dias === 0) dias = 1; // Minimum 1 day if same day

    let precio = document.getElementById("precioReserva")

    if (dias < 0) {
        if (precio) precio.innerHTML = "Fechas inválidas";
        return;
    }

    let auto = autos[autoIndex]

    let total = auto.precio * dias

    if (precio) {
        precio.innerHTML = "Total: $" + total + " (" + dias + " " + (dias === 1 ? "día" : "días") + ")"
    }

}



function mostrarPreviewAuto() {

    let index = document.getElementById("auto").value
    let cont = document.getElementById("previewAuto")

    if (index === "") {
        cont.innerHTML = ""
        return
    }

    let auto = autos[index]

    cont.innerHTML = `
<img src="${auto.img}" style="width:220px;height:150px;object-fit:contain;background:#f1f5f9;padding:8px;border-radius:10px;">
<h4>${auto.nombre}</h4>
<p>$${auto.precio} / día</p>
`
}



let tarjetaInput = document.getElementById("numeroTarjeta")
if (tarjetaInput) {
    tarjetaInput.addEventListener("input", function () {

        let numero = this.value.replace(/\D/g, "")

        let tipo = ""
        let mensaje = ""

        if (numero.startsWith("3")) {
            numero = numero.slice(0, 15)
            this.value = numero.replace(/(\d{4})(\d{6})(\d{0,5})/, "$1 $2 $3")
            tipo = "American Express"
            mensaje = "Formato: 15 dígitos"
        } else {
            numero = numero.slice(0, 16)
            this.value = numero.replace(/(\d{4})(?=\d)/g, "$1 ")

            if (numero.startsWith("4")) {
                tipo = "Visa"
                mensaje = "Formato: 16 dígitos"
            } else if (numero.startsWith("5")) {
                tipo = "MasterCard"
                mensaje = "Formato: 16 dígitos"
            }
        }

        let cont = document.getElementById("tipoTarjeta")

        if (cont) {
            cont.innerHTML = `
<p><strong>${tipo}</strong></p>
<p class="mensaje">${mensaje}</p>
`
        }

    })
}



let fechaInput = document.getElementById("fechaTarjeta")

if (fechaInput) {
    fechaInput.addEventListener("input", function () {

        let valor = this.value.replace(/\D/g, "").slice(0, 4)

        if (valor.length >= 3) {
            valor = valor.slice(0, 2) + "/" + valor.slice(2)
        }

        this.value = valor

        let mes = parseInt(valor.split("/")[0])

        let cont = document.getElementById("tipoTarjeta")

        if (mes > 12) {
            cont.innerHTML += `<p class="mensaje error">Mes inválido</p>`
        }

    })
}



let cvv = document.getElementById("cvv")

if (cvv) {
    cvv.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 3)
    })
}


let form = document.getElementById("formReserva")

if (form) {
    form.addEventListener("submit", function (e) {

        e.preventDefault()

        let nombre = document.getElementById("nombre").value
        let autoIndex = document.getElementById("auto").value
        let fechaInicioVal = document.getElementById("fechaInicio").value
        let fechaFinVal = document.getElementById("fechaFin").value

        if (autoIndex === "") {
            alert("Seleccione un auto")
            return
        }

        let fechaInicio = new Date(fechaInicioVal + 'T00:00:00');
        let fechaFin = new Date(fechaFinVal + 'T00:00:00');
        
        let hoyStr = new Date().toISOString().split('T')[0];
        let hoyDate = new Date(hoyStr + 'T00:00:00');

        if (fechaInicio < hoyDate) {
            alert("La fecha de inicio no puede ser en el pasado.");
            return;
        }

        let dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
        if (dias === 0) dias = 1; // Minimum 1 day if same day

        if (dias < 0) {
            alert("La fecha de fin debe ser igual o posterior a la fecha de inicio.");
            return;
        }

        let auto = autos[autoIndex]

        if (auto.stock <= 0) {
            alert("Auto agotado")
            return
        }

        let total = auto.precio * dias

        autos[autoIndex].stock--
        localStorage.setItem("autos", JSON.stringify(autos))

        let reservas = JSON.parse(localStorage.getItem("reservas")) || []

        let nuevaReserva = {
            id: Date.now(),
            nombre,
            autoId: auto.id,
            auto: auto.nombre,
            dias,
            total,
            fecha: fechaInicio.toLocaleDateString(),
            fin: fechaFin.toLocaleDateString()
        }

        reservas.push(nuevaReserva)

        localStorage.setItem("reservas", JSON.stringify(reservas))

        alert("Reserva realizada")

        this.reset()

        document.getElementById("previewAuto").innerHTML = ""
        document.getElementById("precioReserva").innerHTML = "Total a pagar : $0"

        llenarSelectAutos()
        cargarAutos()

    })
}


function buscarReservas() {

    let nombre = document.getElementById("buscarCliente").value.toLowerCase()

    let reservas = JSON.parse(localStorage.getItem("reservas")) || []

    let tabla = document.querySelector("#tablaReservas tbody")

    tabla.innerHTML = ""

    let resultados = reservas.filter(r =>
        r.nombre.toLowerCase().includes(nombre)
    )

    if (resultados.length === 0) {
        tabla.innerHTML = `<tr><td colspan="6">Reserva no encontrada</td></tr>`
        return
    }

    resultados.forEach(r => {

        let hoy = new Date()
        let finFecha = r.fin ? new Date(r.fin) : null
        let estado = finFecha && finFecha < hoy ? "Finalizada" : "Activa"

        tabla.innerHTML += `
<tr>
<td>${r.nombre}</td>
<td>${r.auto}</td>
<td>${r.dias}</td>
<td>$${r.total}</td>
<td>
Inicio: ${r.fecha}<br>
Fin: ${r.fin || "N/A"}<br>
Estado: <strong>${estado}</strong>
</td>
<td><button onclick="eliminarReserva(${r.id})">Eliminar</button></td>
</tr>
`

    })

}



function eliminarReserva(id) {

    let reservas = JSON.parse(localStorage.getItem("reservas")) || []

    reservas = reservas.filter(r => r.id !== id)

    localStorage.setItem("reservas", JSON.stringify(reservas))

    buscarReservas()

}



document.addEventListener("DOMContentLoaded", function () {
    debugger;
    cargarAutos()
    var btnBuscarReservas = document.getElementById("btnBuscarReservas");
    if (btnBuscarReservas) {
        btnBuscarReservas.click();
    }
    llenarSelectAutos()

    let auto = document.getElementById("auto")
    let fechaInicio = document.getElementById("fechaInicio")
    let fechaFin = document.getElementById("fechaFin")

    if (fechaInicio && fechaFin) {
        let hoy = new Date().toISOString().split('T')[0];
        fechaInicio.setAttribute('min', hoy);
        fechaInicio.value = hoy;
        
        let manana = new Date();
        manana.setDate(manana.getDate() + 1);
        let mananaStr = manana.toISOString().split('T')[0];
        fechaFin.setAttribute('min', hoy);
        fechaFin.value = mananaStr;
    }

    if (auto) {
        auto.addEventListener("change", function () {
            calcularPrecio()
            mostrarPreviewAuto()
        })
    }
    if (fechaInicio) {
        fechaInicio.addEventListener("change", function() {
            fechaFin.setAttribute('min', this.value);
            calcularPrecio();
        });
    }
    if (fechaFin) {
        fechaFin.addEventListener("change", calcularPrecio);
    }

})