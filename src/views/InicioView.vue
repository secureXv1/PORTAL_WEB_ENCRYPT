<template>
  <div class="inicio-container">
    <h2 class="titulo">Dashboard</h2>

    <div class="overview-cards">
      <div class="card"><h4>Cantidad archivos</h4><p>{{ archivos.length }}</p><small>Último mes</small></div>
      <div class="card"><h4>Cantidad Clientes</h4><p>{{ usuarios.length }}</p></div>
      <div class="card"><h4>Licencias por vencer próximamente</h4><p>1</p><small>xxxxx 15jun26</small></div>
    </div>

    <div class="grid">
      <!-- Gráfico -->
      <div class="card wide">
        <h3>📊 Cantidad de archivos</h3>
        <Bar :data="chartData" :options="chartOptions" />
      </div>

     <!-- Clientes online -->
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

      <!-- Túneles online -->
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

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  components: { Bar },
  data() {
    return {
      usuarios: [],
      archivos: [],
      tuneles: [],
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
    }
  },
  mounted() {
    axios.get('http://symbolsaps.ddns.net:8000/api/clientes')
      .then(res => this.usuarios = res.data)

    axios.get('http://symbolsaps.ddns.net:8000/api/files')
      .then(res => this.archivos = res.data)

    axios.get('http://symbolsaps.ddns.net:8000/api/tunnels')
      .then(res => this.tuneles = res.data)

    axios.get('http://symbolsaps.ddns.net:8000/api/estadisticas/archivos-por-dia')
      .then(res => {
        this.chartData.labels = res.data.map(r => r.fecha)
        this.chartData.datasets[0].data = res.data.map(r => r.total)
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


.info {
  flex: 1;
}
</style>
