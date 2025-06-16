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
      required: false,
      default: () => ([
        { hostname: 'PC-Bogotá', lat: 4.65, lon: -74.1, sistema_operativo: 'Windows 10' },
        { hostname: 'PC-Medellín', lat: 6.24, lon: -75.58, sistema_operativo: 'Ubuntu 22.04' },
        { hostname: 'PC-Cali', lat: 3.45, lon: -76.53, sistema_operativo: 'Windows 11' },
        { hostname: 'PC-Barranquilla', lat: 10.96, lon: -74.8, sistema_operativo: 'Debian 11' }
      ])
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
  methods: {
    inicializarMapa() {
      this.map = L.map(this.$refs.mapContainer).setView([4.7, -74.1], 5)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map)
    },
    mostrarClientes(clientes) {
      clientes.forEach(c => {
        if (c.lat && c.lon) {
          const marker = L.marker([c.lat, c.lon]).addTo(this.map)
          marker.bindPopup(`<strong>${c.hostname}</strong><br>${c.sistema_operativo}`)
          this.markers.push(marker)
        }
      })
    }
  }
}
</script>

<style scoped>
/* Ya aplicado en el template */
</style>
