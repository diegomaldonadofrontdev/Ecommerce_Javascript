// Llamado al json con async
const consultarProductos = async () => {
  const response = await fetch("./productos.json");
  const productos = await response.json();
  return productos;
};

const productos = consultarProductos();
const productosContainer = document.querySelector(".productos__container");
const countCarrito = document.querySelector("#countCarrito");
const btnFinalizar = document.querySelector("#btn-finalizar");

const catSamsung = document.querySelector("#samsung");
const catMotorola = document.querySelector("#motorola");
const catTlc = document.querySelector("#tlc");
const catApple = document.querySelector("#apple");
const catXiaomi = document.querySelector("#xiaomi");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/* FUNCIONES */

// Mostrar todos los productos:
consultarProductos().then((productos) => {
  productos.forEach((producto) => {
    productosContainer.innerHTML += `<div class="producto__card" >
    <h3>${producto.nombre.substring(0, 30)}...</h3>
    <img src="${producto.imagen}" />
    <div>
    <p class="curso__price">$${producto.precio}</p>
    <a href='#' class='btn-primary agregar-favorito' id='${
      producto.id
    }'>Comprar</a>
    </div>
  </div>`;
  });
  btnComprar(productos);
});

// Buscar por categoria:
function buscarCategoria(marca) {
  productosContainer.innerHTML = "";
  consultarProductos().then((productos) => {
    productos = productos.filter((x) => x.marca === marca);
    productos.forEach((y) => {
      productosContainer.innerHTML += `<div class="producto__card" >
      <h3>${y.nombre.substring(0, 30)}...</h3>
      <img src="${y.imagen}" />
      <div>
      <p class="curso__price">$${y.precio}</p>
      <a href='#' class='btn-primary agregar-favorito' id='${y.id}'>Comprar</a>
      </div>
      
    </div>`;
    });
    btnComprar(productos);
  });
}

// Poner funcion en los botones de comprar:
function btnComprar(productos) {
  const btnAgregar = document.querySelectorAll(".agregar-favorito");
  btnAgregar.forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      const productoSeleccionado = productos.find(
        (prod) => prod.id === parseInt(btn.id)
      );
      const productoCarrito = { ...productoSeleccionado, cantidad: 1 };
      const indexCarrito = carrito.findIndex(
        (prod) => prod.id === productoCarrito.id
      );
      if (indexCarrito === -1) {
        carrito.push(productoCarrito);
      } else {
        carrito[indexCarrito].cantidad++;
      }
      actualizarCarrito();
      imprimirCarrito();
      localStorage.setItem("carrito", JSON.stringify(carrito));
      btnFinalizar.style.display = "block";
    };
  });
}

// Mostrar el constador del carrito:
function actualizarCarrito() {
  countCarrito.innerHTML = carrito.length;
}

// Mostrar lista de carritos
function imprimirCarrito() {
  listaCarrito.innerHTML = "";
  carrito.forEach(
    (item) =>
      (listaCarrito.innerHTML += `<li><div><img src="${item.imagen}" /> ${
        item.nombre
      } x ${item.cantidad}</div> <div>$${
        item.cantidad * item.precio
      }<i class='bx bxs-trash' data-id='${item.id}'></i></div></li>`)
  );
  if (carrito !== []) {
    const btnEliminar = document.querySelectorAll(".bxs-trash");
    btnEliminar.forEach((btn) => {
      btn.onclick = (e) => {
        const productoId = e.target.getAttribute("data-id");
        carrito = carrito.filter((prod) => prod.id != productoId);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
        imprimirCarrito();
      };
    });
  }
  crearTotal();
}

// Crear el total de la compra
function crearTotal() {
  sumatotal = 0;
  carrito.forEach((producto) => {
    sumatotal += producto.precio * producto.cantidad;
  });
  const total = document.querySelector("#total");

  sumatotal !== 0 ? carritoLleno() : carritoVacio();
}

function finalizarCompra() {
  swal(
    "Compra realizada con exito",
    "Recibirá los datos de la compra por mail",
    "success"
  );
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();
  imprimirCarrito();
  btnFinalizar.style.display = "none";
}

function carritoLleno() {
  total.innerHTML = `<span>El total es de $${sumatotal}</span>`;
  btnFinalizar.style.display = "block";
}

function carritoVacio() {
  total.innerHTML = `El carrito esta vacio`;
  btnFinalizar.style.display = "none";
}

/* EVENTOS */

catSamsung.addEventListener("click", () => buscarCategoria("samsung"));
catMotorola.addEventListener("click", () => buscarCategoria("motorola"));
catTlc.addEventListener("click", () => buscarCategoria("tlc"));
catApple.addEventListener("click", () => buscarCategoria("apple"));
catXiaomi.addEventListener("click", () => buscarCategoria("xiaomi"));
btnFinalizar.addEventListener("click", finalizarCompra);
/* LLAMADO A FUNCIONES */

actualizarCarrito();
imprimirCarrito();

