document.addEventListener('DOMContentLoaded', () => {

    let baseDeDatos = [
        { id: 1, nombre: "Lengua de Suegra", precio: 2000, imageUrl: "LenguaDeSuegra.png" },
        { id: 2, nombre: "Potus", precio: 1500, imageUrl: "potuss.jpg" },
        { id: 3, nombre: "Rosario Corazon", precio: 2500, imageUrl: "RosarioCorazon.png" },
        { id: 4, nombre: "Palmito", precio: 1000, imageUrl: "Palmito.png" },
        { id: 5, nombre: "Lirio de la Paz", precio: 2000, imageUrl: "lilirios.jpg" },
        { id: 6, nombre: "China del Dinero", precio: 2000, imageUrl: "ChinaDinero.png" },
        { id: 7, nombre: "Pluma Rosa", precio: 4000, imageUrl: "plumaRosa.png" },
        { id: 8, nombre: "Alocasia", precio: 6000, imageUrl: "alocasia.png" },
        { id: 9, nombre: "Monstera Deliciosa", precio: 6800, imageUrl: "MonsteraDeliciosa.png" },
        { id: 10, nombre: "Orquídea", precio: 4200, imageUrl: "orquidea.png" },
        { id: 11, nombre: "Begonia Rex", precio: 5000, imageUrl: "Rex.png" },
        { id: 12, nombre: "Lazo de Amor", precio: 3400, imageUrl: "LazoDeAmor.jpg" },
    ];

    let carrito = [];
    const divisa = '$';

    // ELEMENTOS DEL DOM
    const DOMitems = document.getElementById('items');
    const DOMcarrito = document.getElementById('carrito');
    const DOMtotal = document.getElementById('total');
    const DOMbtnVaciar = document.getElementById('boton-vaciar');
    const miLocalStorage = window.localStorage;


    // LISTA PRODUCTOS
    function generarProductos() {
        baseDeDatos.forEach((item) => {
            const card = document.createElement("div");
            card.classList.add("card", "col-sm-3", "fotosProductos");
            card.innerHTML = `
                  <img src="../assets/img/${item.imageUrl}" alt="${item.nombre}" class="tamañoImagen card-img-top">
                    <div class="card-body centrado"> 
                        <h6 class="card-title centrado">${item.nombre}</h6>
                        <p class="card-text centrado marginText"> ${divisa} ${item.precio}</p>
                       <button type="button" class="btn btn-primary btn-sm centrado" id="btnAgregar-${item.id}">Agregar al Carrito</button>
                    </div>
                  </div>
              `;
            DOMitems.append(card)
            const btnAgregar = document.getElementById('btnAgregar-' + item.id)
            btnAgregar.addEventListener("click", agregarProductos);
            btnAgregar.setAttribute('marcador', item.id);
        });
    }


    // AGREGAR PRODUCTOS AL CARRITO

    function agregarProductos(evento) {
        carrito.push(evento.target.getAttribute('marcador'))
        carritoCompra();
        guardarCarritoEnLocalStorage();
        DOMbtnVaciar.removeAttribute('disabled');
    }


    // CARRITO

    function carritoCompra() {
        DOMcarrito.innerHTML = '';
        const carritoSinDuplicados = [...new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const itemCarrito = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            const numUnidades = carrito.reduce((total, itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);

            // CARRITO LISTA
            const carritoLista = document.createElement('li');
            carritoLista.classList.add('list-group-item', 'text-right', 'mx-2');
            carritoLista.textContent = `${numUnidades} x ${itemCarrito[0].nombre} - ${itemCarrito[0].precio}${divisa}`;
            DOMcarrito.appendChild(carritoLista);

            // BOTON BORRAR ITEM
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'position-absolute', 'top-0', 'start-100');
            btnBorrar.textContent = 'X';
            btnBorrar.dataset.item = item;
            btnBorrar.addEventListener('click', borrarItemCarrito);
            carritoLista.appendChild(btnBorrar);
        });
        DOMtotal.textContent = calcularTotal();
    }


    // VACIAR CARRITO

    DOMbtnVaciar.onclick = () => {
        Swal.fire({
            title: 'Desea eliminar los items del carrito?',
            confirmButtonText: 'Aceptar',
            showCancelButton: true,
            cancelButtonText: 'Cancelarx'
        }).then((resultado) => {
            if (resultado.isConfirmed) {
                vaciarCarrito()
                Swal.fire({
                    title: 'Carrito vaciado!',
                    icon: 'success'
                });
            }
        });
    }




    // BORRAR 1 ELEMENTO
    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        carritoCompra();
        guardarCarritoEnLocalStorage();
    }

    //  CALCULAR TOTAL
    function calcularTotal() {
        return carrito.reduce((acum, elem) => {
            const itemCarrito = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(elem);
            });
            return acum + itemCarrito[0].precio;
        }, 0);
    }

    // BOTON DISABLED
    function disabledBtn() {
        carrito.length || DOMbtnVaciar.setAttribute('disabled', true);
    }


    // VACIAR CARRITO
    function vaciarCarrito() {
        carrito = [];
        carritoCompra();
        localStorage.clear();
        disabledBtn();
    }


    // FUNCTIONS LOCALSTORAGE
    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        carrito = (carrito !== null) ? carrito : [];
        disabledBtn()
    }


    // ......
    cargarCarritoDeLocalStorage();
    generarProductos();
    carritoCompra();
});



// ............. FETCH

// fetch('../baseDeDatos.json')
//     .then((response) => {
//         if (response.ok) {
//             return response.json();
//         } else{
//             throw new Error('Error en el servidor: ' +response.status);
//         }
//     })
//     .then((baseDeDatos) =>{
//         // que
//     })
//     .catch((error) =>{
//         Swal.fire({
//             title: 'Error!',
//             text: 'En este momento no podemos cargar la página. Disculpe las molestias!',
//             icon: 'error',
//             confirmButtonText: 'Cool'
//           })
//     })