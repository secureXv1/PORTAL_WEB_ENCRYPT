<template>
  <div class="inicio-container">
    <h2 class="titulo">Dashboard</h2>

    <div class="overview-cards">
      <div class="card"><h4>Cantidad archivos</h4><p>{{ archivos.length }}</p><small>Último mes</small></div>
      <div class="card"><h4>Cantidad Clientes</h4><p>{{ usuarios.length }}</p></div>
      <div class="card"><h4>Licencias por vencer próximamente</h4><p>1</p><small>xxxxx 15jun26</small></div>
    </div>

    <div class="grid">
      <!-- Gráfico de archivos -->
      <div class="card wide">
        <h3>📊 Cantidad de archivos</h3>
        <Bar :data="chartData" :options="chartOptions" />
      </div>

      <!-- Usuarios online -->
      <div class="card">
        <h3>👥 Clientes online</h3>
        <ul class="usuarios">
          <li v-for="u in usuarios" :key="u.uuid">
            <strong>{{ u.hostname }}</strong><br />
            <small>{{ u.sistema }}</small>
          </li>
        </ul>
      </div>

      <!-- Túneles online -->
      <div class="card">
        <h3>🛰️ Túneles online</h3>
        <ul class="usuarios">
          <li>Túnel: 1006 <br /><small>Hace 5 minutos</small></li>
          <li>Túnel: Gatico <br /><small>Hace 1 minuto</small></li>
          <li>Túnel: Gorro <br /><small>Hace 7 minutos</small></li>
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
  mounted() {
    axios.get('http://symbolsaps.ddns.net:8000/api/usuarios')
      .then(res => this.usuarios = res.data)

    axios.get('http://symbolsaps.ddns.net:8000/api/files')
      .then(res => this.archivos = res.data)

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
  height: 100%;
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
}
.card p {
  font-size: 32px;
  margin: 10px 0;
}
.grid {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}
.card.wide {
  flex: 2;
}
.usuarios li {
  margin-bottom: 10px;
  line-height: 1.3;
}
</style>
