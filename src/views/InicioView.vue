<template>
  <div class="inicio-container">
    <h2 class="titulo">Dashboard</h2>

    <div class="overview-cards">
      <!-- 📁 Cantidad de archivos con filtro -->
      <div class="card relative">
        <div class="card-header">
          <h4>Cantidad archivos</h4>
          <div class="dropdown">
            <i class="fa-solid fa-filter" @click="mostrarFiltro = !mostrarFiltro"></i>
            <ul v-if="mostrarFiltro" class="dropdown-menu">
              <li @click="setRango('hoy')">Hoy</li>
              <li @click="setRango('2dias')">Últimos 2 días</li>
              <li @click="setRango('semana')">Última semana</li>
              <li @click="setRango('mes')">Último mes</li>
              <li @click="setRango('personalizado')">Personalizado</li>
            </ul>
          </div>
        </div>
        <p>{{ archivosFiltrados.length }}</p>
        <small>{{ etiquetaRango }}</small>
        <div v-if="rangoSeleccionado === 'personalizado'" class="rango-personalizado">
          <label>Desde: <input type="date" v-model="fechaInicio" /></label>
          <label>Hasta: <input type="date" v-model="fechaFin" /></label>
          <button @click="aplicarRangoPersonalizado">Aplicar</button>
        </div>
      </div>

      <div class="card relative">
        <div class="card-header">
          <h4>Cantidad Clientes</h4>
          <div class="dropdown">
            <i class="fa-solid fa-filter" @click="mostrarFiltroClientes = !mostrarFiltroClientes"></i>
            <ul v-if="mostrarFiltroClientes" class="dropdown-menu">
              <li @click="setRangoClientes('hoy')">Hoy</li>
              <li @click="setRangoClientes('2dias')">Últimos 2 días</li>
              <li @click="setRangoClientes('semana')">Última semana</li>
              <li @click="setRangoClientes('mes')">Último mes</li>
              <li @click="setRangoClientes('personalizado')">Personalizado</li>
            </ul>
          </div>
        </div>
        <p>{{ usuariosFiltrados.length }}</p>
        <small>{{ etiquetaRangoClientes }}</small>
        <div v-if="rangoSeleccionadoClientes === 'personalizado'" class="rango-personalizado">
          <label>Desde: <input type="date" v-model="fechaInicioClientes" /></label>
          <label>Hasta: <input type="date" v-model="fechaFinClientes" /></label>
          <button @click="aplicarRangoPersonalizadoClientes">Aplicar</button>
        </div>
      </div>

      <div class="card">
        <h4>Licencias por vencer próximamente</h4>
        <p>1</p>
        <small>LIC-ABC123 15jun26</small>
      </div>
    </div>

    <div class="grid">
          <div class="card wide">
      <div class="card-header">
        <h3>📊 Cantidad de archivos</h3>
      </div>
      <Bar :data="chartData" :options="chartOptions" />
    </div>

      <div class="card scrollable-card">
        <h3><i class="fa-solid fa-user-group"></i> Clientes online ({{ usuarios.length }})</h3>
        <ul class="usuarios scrollable-list">
          <li v-for="u in usuarios" :key="u.uuid">
            <i class="fa-solid fa-user icono"></i>
            <div class="info">
              <strong>{{ u.hostname }}</strong><br />
              <small>{{ u.sistema_operativo }}</small>
            </div>
          </li>
        </ul>
      </div>

      <div class="card scrollable-card">
        <h3><i class="fa-solid fa-network-wired"></i> Túneles online ({{ tuneles.length }})</h3>
        <ul class="usuarios scrollable-list">
          <li v-for="t in tuneles" :key="t.id">
            <i class="fa-solid fa-link icono"></i>
            <div class="info">
              <strong>{{ t.name }}</strong><br />
              <small>Creado el {{ formatearFecha(t.created_at) }}</small>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 🗺️ Mapa de clientes -->
          <div class="card wide" style="margin-top: 20px; height: 400px;">
        <MapaClientes :clientes="usuarios" />
      </div>

  </div>
</template>




<script>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale
} from 'chart.js'
import axios from 'axios'
import MapaClientes from '@/components/MapaClientes.vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  components: { Bar, MapaClientes },
  data() {
  return {
    usuarios: [],
    archivos: [],
    archivosFiltrados: [],
    tuneles: [],
    mostrarFiltro: false,
    rangoSeleccionado: 'mes',
    etiquetaRango: 'Último mes',
    fechaInicio: '',
    fechaFin: '',
    usuariosFiltrados: [],
    mostrarFiltroClientes: false,
    rangoSeleccionadoClientes: 'mes',
    etiquetaRangoClientes: 'Último mes',
    fechaInicioClientes: '',
    fechaFinClientes: '',
    filtroGrafico: 'mes',
    fechaInicioGrafico: '',
    fechaFinGrafico: '',
    mostrarFiltroGrafico: false,







    chartData: {
      labels: [],
      datasets: [{
        label: 'Archivos subidos',
        backgroundColor: '#42b983',
        data: []
      }]
    },
    chartOptions: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false }
      }
    }
  }
},
methods: {
  formatearFecha(fecha) {
    return new Date(fecha).toLocaleString()
  },
  formatoFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  },
  setRango(rango) {
  this.rangoSeleccionado = rango;
  this.mostrarFiltro = false;

  const ahora = new Date();
  let desde = new Date();

  switch (rango) {
    case 'hoy':
      desde.setHours(0, 0, 0, 0);
      this.etiquetaRango = 'Hoy';
      break;
    case '2dias':
      desde.setDate(ahora.getDate() - 1);
      this.etiquetaRango = 'Últimos 2 días';
      break;
    case 'semana':
      desde.setDate(ahora.getDate() - 6);
      this.etiquetaRango = 'Última semana';
      break;
    case 'mes':
      desde.setMonth(ahora.getMonth() - 1);
      this.etiquetaRango = 'Último mes';
      break;
    case 'personalizado':
      this.etiquetaRango = 'Seleccione fechas';
      return;
  }

  this.archivosFiltrados = this.archivos.filter(a => Number(a.uploaded_at) >= desde.getTime());
  this.filtrarGraficoArchivos();
},


aplicarRangoPersonalizado() {
  if (!this.fechaInicio || !this.fechaFin) {
    this.etiquetaRango = 'Fechas incompletas';
    return;
  }

  const desde = new Date(this.fechaInicio);
  const hasta = new Date(this.fechaFin);
  hasta.setHours(23, 59, 59, 999);

  this.archivosFiltrados = this.archivos.filter(a => {
    const ms = Number(a.uploaded_at);
    return ms >= desde.getTime() && ms <= hasta.getTime();
  });

  this.etiquetaRango = `Del ${this.formatoFecha(this.fechaInicio)} al ${this.formatoFecha(this.fechaFin)}`;
  this.filtrarGraficoArchivos();
},

  setRangoClientes(rango) {
  this.rangoSeleccionadoClientes = rango
  this.mostrarFiltroClientes = false

  const ahora = new Date()
  let desde = new Date()

  switch (rango) {
    case 'hoy':
      desde.setHours(0, 0, 0, 0)
      this.etiquetaRangoClientes = 'Hoy'
      break
    case '2dias':
      desde.setDate(ahora.getDate() - 2)
      this.etiquetaRangoClientes = 'Últimos 2 días'
      break
    case 'semana':
      desde.setDate(ahora.getDate() - 7)
      this.etiquetaRangoClientes = 'Última semana'
      break
    case 'mes':
      desde.setMonth(ahora.getMonth() - 1)
      this.etiquetaRangoClientes = 'Último mes'
      break
    case 'personalizado':
      this.etiquetaRangoClientes = 'Seleccione fechas'
      return
  }

  this.usuariosFiltrados = this.usuarios.filter(u => new Date(u.creado_en) >= desde)
},

aplicarRangoPersonalizadoClientes() {
  if (!this.fechaInicioClientes || !this.fechaFinClientes) {
    this.etiquetaRangoClientes = 'Fechas incompletas'
    return
  }

  const desde = new Date(this.fechaInicioClientes)
  const hasta = new Date(this.fechaFinClientes)
  hasta.setHours(23, 59, 59, 999)

  this.usuariosFiltrados = this.usuarios.filter(u => {
    const fecha = new Date(u.creado_en)
    return fecha >= desde && fecha <= hasta
  })

  this.etiquetaRangoClientes = `Del ${this.formatoFecha(this.fechaInicioClientes)} al ${this.formatoFecha(this.fechaFinClientes)}`
},


        filtrarGraficoArchivos() {
          const conteoPorFecha = {};

          this.archivosFiltrados.forEach(a => {
            const ms = Number(a.uploaded_at);
            const fecha = new Date(ms).toISOString().split("T")[0]; // YYYY-MM-DD
            conteoPorFecha[fecha] = (conteoPorFecha[fecha] || 0) + 1;
          });

          const fechasOrdenadas = Object.keys(conteoPorFecha).sort();

          this.chartData = {
            labels: fechasOrdenadas,
            datasets: [{
              label: 'Archivos subidos',
              backgroundColor: '#42b983',
              data: fechasOrdenadas.map(f => conteoPorFecha[f])
            }]
          };
        },




cambiarFiltroGrafico(filtro) {
  this.filtroGrafico = filtro
  this.mostrarFiltroGrafico = false
  if (filtro !== 'personalizado') this.filtrarGraficoArchivos()
}






},
        mounted() {
          // 🟢 Mostrar datos dummy de clientes antes de cargar desde backend
          this.usuarios = [
            {
              hostname: 'PC-Bogotá',
              lat: 4.65,
              lon: -74.1,
              sistema_operativo: 'Windows 10',
              creado_en: '2025-06-15T12:00:00'
            },
            {
              hostname: 'PC-Medellín',
              lat: 6.24,
              lon: -75.58,
              sistema_operativo: 'Ubuntu 22.04',
              creado_en: '2025-06-13T08:30:00'
            },
            {
              hostname: 'PC-Cali',
              lat: 3.45,
              lon: -76.53,
              sistema_operativo: 'Windows 11',
              creado_en: '2025-06-12T16:20:00'
            },
            {
              hostname: 'PC-Barranquilla',
              lat: 10.96,
              lon: -74.8,
              sistema_operativo: 'Debian 11',
              creado_en: '2025-06-10T10:10:00'
            }
          ]
          this.setRangoClientes('mes') // Filtro inicial con dummy

          // 🔵 Cargar archivos reales
          axios.get('http://symbolsaps.ddns.net:8000/api/files')
            .then(res => {
              this.archivos = res.data.filter(a => {
                const ms = Number(a.uploaded_at)
                return ms > 1000000000000 && ms < Date.now() + 86400000
              })
              this.setRango('mes')
            })

          // 🔵 Cargar túneles
          axios.get('http://symbolsaps.ddns.net:8000/api/tunnels')
            .then(res => this.tuneles = res.data)

          this.filtrarGraficoArchivos()

          // 🔵 Cargar clientes reales y actualizar
          axios.get('http://symbolsaps.ddns.net:8000/api/clientes')
            .then(res => {
              this.usuarios = res.data
              this.setRangoClientes('mes')
            })
        }


}
</script>


<style scoped>
.inicio-container {
  padding: 30px;
  background: #1e1e1e;
  color: white;
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}
.titulo {
  font-size: 28px;
  margin-bottom: 30px;
}
.overview-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}
.card {
  background: #2c3e50;
  padding: 20px;
  border-radius: 10px;
  flex: 1;
  min-width: 250px;
  display: flex;
  flex-direction: column;
}
.card p {
  font-size: 32px;
  margin: 10px 0;
}
.grid {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  align-items: stretch; /* 🔹 fuerza igual altura entre tarjetas */
}
.card.wide {
  flex: 1; /* 🔹 igual ancho a los otros */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.scrollable-card {
  max-height: 300px;
  overflow-y: auto;
}
.scrollable-list {
  max-height: 220px;
  overflow-y: auto;
}
.usuarios {
  list-style: none;
  padding: 0;
  margin: 0;
}

.usuarios li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #3a3a3a;
}

.icono {
  color: #1abc9c;
  font-size: 20px;
  min-width: 24px;
  text-align: center;
}

.relative {
  position: relative;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dropdown {
  position: relative;
  cursor: pointer;
}
.dropdown-menu {
  position: absolute;
  top: 25px;
  right: 0;
  background: #34495e;
  list-style: none;
  padding: 6px 0;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  z-index: 10;
}
.dropdown-menu li {
  padding: 8px 15px;
  cursor: pointer;
  white-space: nowrap;
}
.dropdown-menu li:hover {
  background-color: #3d566e;
}

.rango-personalizado {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.rango-personalizado label {
  font-size: 14px;
}
.rango-personalizado input {
  margin-left: 8px;
  background-color: #34495e;
  border: none;
  padding: 6px;
  color: white;
  border-radius: 5px;
}
.rango-personalizado button {
  align-self: flex-start;
  padding: 6px 12px;
  background-color: #1abc9c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}



.info {
  flex: 1;
}
</style>
