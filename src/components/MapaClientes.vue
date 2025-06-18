<template>
  <div ref="mapContainer" style="width: 100%; height: 100%; border-radius: 10px;"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'MapaClientes',
  props: {
    clientes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      map: null,
      markers: []
    }
  },
  mounted() {
    this.inicializarMapa()
    this.mostrarClientes(this.clientes)
  },
  watch: {
    clientes: {
      handler(nuevosClientes) {
        this.limpiarMarcadores()
        this.mostrarClientes(nuevosClientes)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    inicializarMapa() {
      this.map = L.map(this.$refs.mapContainer).setView([4.7, -74.1], 5)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map)
    },
    mostrarClientes(clientes) {
      clientes.forEach(c => {
        const lat = c.latitud || c.lat
        const lon = c.longitud || c.lon

        if (lat && lon) {
          const marker = L.marker([lat, lon]).addTo(this.map)
          marker.bindPopup(`<strong>${c.hostname}</strong><br>${c.sistema_operativo}`)
          this.markers.push(marker)
        }
      })
    },
    limpiarMarcadores() {
      this.markers.forEach(m => this.map.removeLayer(m))
      this.markers = []
    }
  }
}
</script>


<style scoped>
/* Ya aplicado en el template */
</style>
