const { createApp } = Vue;

createApp({

  /* =========================
        DATA
  ==========================*/
  data() {
    return {
      productos: [],
      carrito: [],
      busqueda: "",
      modoOscuro: false,
      mostrarCarrito: false,

      // ⭐ IMPORTANTE
      categoriaSeleccionada: "Todas"
    }
  },

  /* =========================
        COMPUTED
  ==========================*/
  computed: {

    productosFiltrados() {

      return this.productos.filter(p => {

        // filtro búsqueda
        const coincideBusqueda =
          p.nombre.toLowerCase()
          .includes(this.busqueda.toLowerCase());

        // filtro categoría
        const coincideCategoria =
          this.categoriaSeleccionada === "Todas" ||
          p.categoria === this.categoriaSeleccionada;

        return coincideBusqueda && coincideCategoria;
      });
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
      try {
        const response = await fetch("productos.json");

        if (!response.ok)
          throw new Error("No se pudo cargar productos.json");

        this.productos = await response.json();

        console.log("Productos cargados:", this.productos);

      } catch (error) {
        console.error(error);
      }
    },

    agregarAlCarrito(producto) {

      if (producto.stock <= 0) return;

      this.carrito.push({
        ...producto
      });

      producto.stock--;
    },

    toggleModo() {
      this.modoOscuro = !this.modoOscuro;
    },

    toggleCarrito() {
      this.mostrarCarrito = !this.mostrarCarrito;
    }

  },

  /* =========================
        MOUNTED
  ==========================*/
  mounted() {
    this.cargarProductos();
  },

  /* =========================
        COMPONENTE CARD
  ==========================*/
  components: {

    "producto-card": {
      props: ["producto"],

      template: `
        <div 
          class="card"
          :class="{ agotado: producto.stock === 0 }"
          :style="{ backgroundImage:'url(' + producto.imagen + ')' }"
        >

          <div class="overlay">

            <h3>{{ producto.nombre }}</h3>

            <p>{{ producto.categoria }}</p>

            <p>$ {{ producto.precio }}</p>

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