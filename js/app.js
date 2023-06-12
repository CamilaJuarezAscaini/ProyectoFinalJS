document.addEventListener('DOMContentLoaded', () => {

    let carrito = [];
    const divisa = '$';

    // ELEMENTOS DEL DOM
    const DOMitems = document.getElementById('items');
    const DOMcarrito = document.getElementById('carrito');
    const DOMtotal = document.getElementById('total');
    const DOMbtnVaciar = document.getElementById('boton-vaciar');
    const miLocalStorage = window.localStorage;


    // LISTA PRODUCTOS
    async function traerProductos() {
        return await fetch('../baseDeDatos.json')
            .then((baseDeDatos) => {
                if (baseDeDatos.ok) {
                    return baseDeDatos.json();
                }
            })
    }

    async function generarProductos() {
        const baseDeDatos = await traerProductos();
        baseDeDatos.forEach((item) => {
            const card = document.createElement("div");
            card.classList.add("card", "col-sm-3", "tamañoCard");
            card.innerHTML = `
                  <img src="../assets/img/${item.imageUrl}" alt="${item.nombre}" class="card-img-top">
                    <div class="card-body centrado"> 
                        <p><a href="#" class="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" data-bs-toggle="modal"
                            data-bs-target="#exampleModal${item.id}">${item.nombre}</a></p>
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

    async function carritoCompra() {
        const baseDeDatos = await traerProductos();
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

        // CALCULAR TOTAL

        function calcularTotal() {
            return carrito.reduce((acum, elem) => {
                const itemCarrito = baseDeDatos.filter((itemBaseDatos) => {
                    return itemBaseDatos.id === parseInt(elem);
                });
                return acum + itemCarrito[0].precio;
            }, 0);
        }
        DOMtotal.textContent = calcularTotal();
    }


    // VACIAR CARRITO

    DOMbtnVaciar.onclick = () => {
        Swal.fire({
            title: 'Desea eliminar los items del carrito?',
            confirmButtonText: 'Aceptar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
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

