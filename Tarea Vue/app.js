const { createApp } = Vue;

createApp({

  data() {
    return {
      productos: [],
      carrito: [],
      busqueda: "",
      modoOscuro: false,
      mostrarCarrito: false   // ✅ nuevo estado carrito
    }
  },

  /* =========================
        COMPUTED
  ==========================*/
  computed: {

    productosFiltrados() {
      return this.productos.filter(p =>
        p.nombre.toLowerCase()
        .includes(this.busqueda.toLowerCase())
      );
    },

    total() {
      return this.carrito.reduce(
        (sum, item) => sum + item.precio,
        0
      );
    }

  },

  /* =========================
        METHODS
  ==========================*/
  methods: {

    async cargarProductos() {
      const response = await fetch("productos.json");
      this.productos = await response.json();
    },

    agregarAlCarrito(producto) {
      if (producto.stock > 0) {
        this.carrito.push(producto);
        producto.stock--;
      }
    },

    toggleModo() {
      this.modoOscuro = !this.modoOscuro;
    },

    // ✅ abrir / cerrar carrito
    toggleCarrito() {
      this.mostrarCarrito = !this.mostrarCarrito;
    }

  },

  /* =========================
        CICLO DE VIDA
  ==========================*/
  mounted() {
    this.cargarProductos();
  },

  /* =========================
        COMPONENTES
  ==========================*/
  components: {

    "producto-card": {
      props: ["producto"],

      template: `
        <div 
          class="card"
          :class="{ agotado: producto.stock === 0 }"
          :style="{ backgroundImage: 'url(' + producto.imagen + ')' }"
        >

          <div class="overlay">

            <p class="text head">
              {{ producto.nombre }}
            </p>

            <span>
              {{ producto.categoria }}
            </span>

            <p class="text price">
              $ {{ producto.precio }}
            </p>

            <p v-if="producto.stock > 0">
              Stock: {{ producto.stock }}
            </p>

            <p v-else>
              Agotado
            </p>

            <button
              @click="$emit('agregar', producto)"
              :disabled="producto.stock === 0"
            >
              Agregar
            </button>

          </div>

        </div>
      `
    }

  }

}).mount("#app");