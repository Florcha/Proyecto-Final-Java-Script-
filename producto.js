class Producto {
  constructor(producto, cantidad) {
    this.id = producto.id;
    this.marca = producto.marca;
    this.precio = producto.precio;
    this.cantidad = cantidad;
    this.precioTotal = producto.precio;
    this.descripcion = producto.descripcion;
  }

  agregarUnidad() {
    this.cantidad++;
  }

  eliminarUnidad() {
    this.cantidad--;
  }

  actualizarPrecioTotal() {
    this.precioTotal = this.precio * this.cantidad;
  }
}