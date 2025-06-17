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
      required: true
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
    this.actualizarClientes(this.clientes)
  },
  watch: {
    clientes: {
      handler(nuevosClientes) {
        this.actualizarClientes(nuevosClientes)
      },
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
    actualizarClientes(clientes) {
      this.limpiarMarcadores()
      const bounds = []

      clientes.forEach(c => {
        const lat = parseFloat(c.lat || c.latitud)
        const lon = parseFloat(c.lon || c.longitud)

        if (!isNaN(lat) && !isNaN(lon)) {
          const marker = L.marker([lat, lon]).addTo(this.map)
          marker.bindPopup(`<strong>${c.hostname}</strong><br>${c.sistema_operativo}`)
          this.markers.push(marker)
          bounds.push([lat, lon])
        }
      })

      if (bounds.length > 0) {
        this.map.fitBounds(bounds, { padding: [20, 20] })
      }
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
