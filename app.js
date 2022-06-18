
let carritoGlobal;

$(document).ready(function () {

  function chequearCarritoEnStorage() {
    let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage"));
    console.log("contenido en chequear Carrito en ls ", contenidoEnStorage);


    if (contenidoEnStorage) {
      let array = [];
      contenidoEnStorage.forEach(element => {
        let producto = new Producto(
          element,
          element.cantidad
        );
        producto.actualizarPrecioTotal();
        array.push(producto);
      });

      return array;
    }
    return [];
  }

  function imprimirProductosEnHTML(productosAImprimir) {
    let contenedor = document.getElementById("contenedor");

    for (const producto of productosAImprimir) {

      let card = document.createElement("div");

      card.classList.add('col-lg-3')

      card.innerHTML = `      
        <div class="card-body">
          <img src="${producto.img}" id="" class="card-img-top img-fluid" style="max-height:270px !important;" alt="">
          <h2 class="card-title" class="titulosDescripcion">${producto.marca}</h2>
          <h5 class="card-subtitle mb-2 text-muted" class="titulosDescripcion">${producto.descripcion}</h5>
          <p class="card-text" class="titulosDescripcion">$${producto.precio}</p>
        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
            <button id="agregar${producto.id}" type="button" onclick="" class="btn btn-dark">Agregar</button>
        </div>
        </div>      
      `;
      contenedor.appendChild(card);

      let boton = document.getElementById(`agregar${producto.id}`);
      boton.onclick = () => agregarAlCarrito(producto);
    }
  }

  function dibujarTabla(array) {
    let contenedor = document.getElementById("carrito");
    contenedor.innerHTML = "";

    let precioTotal = obtenerPrecioTotal(array);

    let tabla = document.createElement("div");

    tabla.innerHTML = `
      <table id="tablaCarrito" class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Item</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Precio Parcial</th>
            <th scope="col">Accion</th>
          </tr>
        </thead>
        <tbody id="bodyTabla">         
        </tbody>
        <tfooter>
          <tr>
            <td colspan="5">Total: $${precioTotal}</td>
          </tr>
        </tfooter>
      </table>
      `;

    contenedor.appendChild(tabla);

    let bodyTabla = document.getElementById("bodyTabla");

    for (let producto of array) {
      let datos = document.createElement("tr");
      datos.innerHTML = `        
            <th scope="row"></th>
            <td>${producto.descripcion}</td>
            <td>${producto.cantidad}</td>
            <td>$${producto.precioTotal}</td>
            <td><button id="eliminar${producto.id}" type="button" class="btn btn-dark">Eliminar</button></td>        
      `;

      bodyTabla.appendChild(datos);


      let boton = document.getElementById(`eliminar${producto.id}`);
      boton.onclick = () => eliminarDelCarrito(producto.id);
    }
  }

  function agregarAlCarrito(producto) {
    console.log(producto);
    let productoEnCarrito = carritoGlobal.find((elemento) => {
      if (elemento.id == producto.id) {
        return true;
      }
    });

    if (productoEnCarrito) {
      let index = carritoGlobal.findIndex((elemento) => {
        if (elemento.id === productoEnCarrito.id) {
          return true;
        }
      });

      carritoGlobal[index].agregarUnidad();
      carritoGlobal[index].actualizarPrecioTotal();
    } else {

      carritoGlobal.push(new Producto(producto, 1));
    }


    localStorage.setItem("carritoEnStorage", JSON.stringify(carritoGlobal));
    dibujarTabla(carritoGlobal);
  }

  function eliminarDelCarrito(id) {
    let producto = carritoGlobal.find((producto) => producto.id === id);

    let index = carritoGlobal.findIndex((element) => {
      if (element.id === producto.id) {
        return true;
      }
    });


    if (producto.cantidad > 1) {
      carritoGlobal[index].eliminarUnidad();
      carritoGlobal[index].actualizarPrecioTotal();
    } else {

      carritoGlobal.splice(index, 1);

      if (carritoGlobal.lenght === 0) {
        carritoGlobal = [];
      }
    }

    localStorage.setItem("carritoEnStorage", JSON.stringify(carritoGlobal));
    dibujarTabla(carritoGlobal);
  }

  function obtenerPrecioTotal(array) {
    let precioTotal = 0;

    for (const producto of array) {
      precioTotal += producto.precioTotal;
    }

    return precioTotal;

  }

  function obtenerProductos(callback) {
    $.ajax({
      type: "GET",
      url: 'data.json',
      success: function (response) {
        return callback(response);
      }
    });
  }

  obtenerProductos(function (productos) {
    $('#banner-bienvenida').fadeOut(3000, function () {
      $('#header').fadeIn('slow');
      $('#cart').fadeIn('slow');
      $('#footer').fadeIn('slow');
    });
    carritoGlobal = chequearCarritoEnStorage();
    dibujarTabla(carritoGlobal);
    imprimirProductosEnHTML(productos);
  });


  $('#vaciarCarrito').click(function () {
    localStorage.setItem("carritoEnStorage", JSON.stringify([]));
    let carrito = chequearCarritoEnStorage();
    dibujarTabla(carrito);
    carritoGlobal = [];
  });

});