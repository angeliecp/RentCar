function logout(){
localStorage.removeItem("admin")
window.location="login.html"
}


function mostrarAutos(){

let tabla=document.querySelector("#tablaAutos tbody")
tabla.innerHTML=""

autos.forEach((auto,i)=>{

tabla.innerHTML+=`
<tr>
<td><img src="${auto.img}" width="60"></td>

<td contenteditable="true" onblur="editarAuto(${i},'nombre',this.innerText)">
${auto.nombre}
</td>

<td contenteditable="true" onblur="editarAuto(${i},'precio',this.innerText)">
${auto.precio}
</td>

<td>
${auto.stock}
<button onclick="sumarStock(${i})">+</button>
<button onclick="restarStock(${i})">-</button>
</td>

<td>
<button onclick="eliminarAuto(${i})">Eliminar</button>
</td>

</tr>
`
})

}

function editarAuto(i,campo,valor){
autos[i][campo]=valor
localStorage.setItem("autos", JSON.stringify(autos))
}

function sumarStock(i){
autos[i].stock++
localStorage.setItem("autos", JSON.stringify(autos))
mostrarAutos()
}

function restarStock(i){
if(autos[i].stock>0){
autos[i].stock--
localStorage.setItem("autos", JSON.stringify(autos))
mostrarAutos()
}
}

function eliminarAuto(i){
autos.splice(i,1)
localStorage.setItem("autos", JSON.stringify(autos))
mostrarAutos()
}

document.getElementById("formAuto")?.addEventListener("submit",function(e){

e.preventDefault()

let nombre=document.getElementById("nombreAuto").value
let precio=document.getElementById("precioAuto").value
let stock=document.getElementById("stockAuto").value
let file=document.getElementById("fotoAuto").files[0]

if(file){
let reader=new FileReader()
reader.onload=function(e){
autos.push({id:Date.now(),nombre,precio,stock,img:e.target.result})
localStorage.setItem("autos",JSON.stringify(autos))
mostrarAutos()
}
reader.readAsDataURL(file)
}else{
autos.push({id:Date.now(),nombre,precio,stock,img:"../Img/auto1.jpg"})
localStorage.setItem("autos",JSON.stringify(autos))
mostrarAutos()
}

this.reset()

})


function cargarEstadisticas(){

let reservas=JSON.parse(localStorage.getItem("reservas"))||[]

let total=reservas.length
let dinero=reservas.reduce((acc,r)=>acc+r.total,0)

document.getElementById("estadisticasAdmin").innerHTML=`
<div class="card">
<h3>Total Reservas</h3>
<p>${total}</p>
</div>

<div class="card">
<h3>Ingresos</h3>
<p>$${dinero}</p>
</div>
`

}


function cargarReservasAdmin(){

let reservas=JSON.parse(localStorage.getItem("reservas"))||[]
let tabla=document.querySelector("#tablaReservasAdmin tbody")

tabla.innerHTML=""

reservas.forEach(r=>{

tabla.innerHTML+=`
<tr>
<td>${r.nombre}</td>
<td>${r.auto}</td>
<td>${r.dias}</td>
<td>$${r.total}</td>
<td>${r.fecha}</td>
<td><button onclick="eliminarReserva(${r.id})">Eliminar</button></td>
</tr>
`

})

}

function eliminarReserva(id){

let reservas=JSON.parse(localStorage.getItem("reservas"))||[]
reservas=reservas.filter(r=>r.id!==id)

localStorage.setItem("reservas",JSON.stringify(reservas))

cargarReservasAdmin()
cargarEstadisticas()

}

mostrarAutos()
cargarEstadisticas()
cargarReservasAdmin()