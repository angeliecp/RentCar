let autosBase = [

    { id: 1, nombre: "Toyota Corolla", precio: 100, stock: 8, img: "../Img/auto1.jpg" },
    { id: 2, nombre: "Honda Civic", precio: 150, stock: 6, img: "../Img/auto2.jpg" },
    { id: 3, nombre: "Chevrolet Camaro", precio: 200, stock: 5, img: "../Img/auto3.jpg" },
    { id: 4, nombre: "Mercedes Benz", precio: 450, stock: 3, img: "../Img/auto4.jpg" },
    { id: 5, nombre: "BMW X5", precio: 550, stock: 2, img: "../Img/auto5.jpg" },
    { id: 6, nombre: "Mercedes Benz 450bk", precio: 700, stock: 2, img: "../Img/auto6.jpg" },
    { id: 7, nombre: "Mercedes Benz G-Class", precio: 2000, stock: 1, img: "../Img/auto7.jpg" }

];



let autos = JSON.parse(localStorage.getItem("autos")) || autosBase;


localStorage.setItem("autos", JSON.stringify(autos));

autos = autos.map(a => ({
    ...a,
    precio: Number(a.precio),
    stock: Number(a.stock)
}))