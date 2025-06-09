<template>
  <div class="inicio-container">
    <h2 class="titulo">Estadísticas Generales</h2>

    <div class="grid">
      <!-- Bloque de usuarios -->
      <div class="card">
        <h3>👤 Usuarios</h3>
        <ul>
          <li v-for="u in usuarios" :key="u.uuid">{{ u.hostname }} - {{ u.sistema }}</li>
        </ul>
      </div>

      <!-- Bloque de gráfica -->
      <div class="card">
        <h3>📊 Archivos por día</h3>
        <Bar :data="chartData" :options="chartOptions" />
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
  margin-bottom: 20px;
}
.grid {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}
.card {
  background: #2c3e50;
  padding: 20px;
  border-radius: 10px;
  flex: 1;
  min-width: 300px;
}
</style>
