<template>
  <div class="clientes-container">
    <h2>📊 Clientes registrados</h2>

    <!-- Buscador -->
    <input type="text" v-model="filtro" placeholder="🔍 Buscar por hostname, IP o SO..." class="buscador" />

    <!-- Control de cantidad por página -->
    <div class="control-pagina">
      <label>Mostrar:</label>
      <select v-model.number="porPagina">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      <span>por página</span>
    </div>

    <!-- Tabla -->
    <table>
      <thead>
        <tr>
          <th>🖥 Hostname</th>
          <th>📡 IPs</th>
          <th>🌐 Red / Ciudad</th>
          <th>💻 SO</th>
          <th>📶 Estado</th>
          <th>📅 Registro</th>
          <th>🧾 Historial</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientesPaginados" :key="cliente.uuid" :class="{ online: cliente.estado === 'online' }">
          <td>{{ cliente.hostname }}</td>
          <td>
            <div>Local: {{ cliente.ip_local }}</div>
            <div>Pública: {{ cliente.ip_publica }}</div>
          </td>
          <td>
            <div>{{ cliente.red_wifi || 'No disponible' }}</div>
            <div>{{ cliente.ciudad || '---' }}</div>
          </td>
          <td><span class="badge so">{{ cliente.sistema_operativo || 'N/A' }}</span></td>
          <td>
            <span class="badge online" v-if="cliente.estado === 'online'">🟢 En línea</span>
            <span class="badge offline" v-else>🔴 Desconectado</span>
          </td>
          <td>{{ formatearFechaLocal(cliente.ultima_info_registrada) }}</td>
          <td>
            <button class="ver-historial" @click="verHistorial(cliente.uuid)">📂 Ver</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <div class="paginacion">
      <button @click="pagina--" :disabled="pagina === 1">⬅ Anterior</button>
      <span>Página {{ pagina }} de {{ totalPaginas }}</span>
      <button @click="pagina++" :disabled="pagina >= totalPaginas">Siguiente ➡</button>
    </div>

    <!-- Modal Historial -->
    <div class="modal" v-if="historialVisible">
      <div class="modal-content">
        <h3>📜 Historial de {{ clienteSeleccionado }}</h3>
        <table>
          <thead>
            <tr>
              <th>IP Local</th>
              <th>IP Pública</th>
              <th>Red Wi-Fi</th>
              <th>Ubicación</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in historial" :key="item.registrado_en">
              <td>{{ item.ip_local }}</td>
              <td>{{ item.ip_publica }}</td>
              <td>{{ item.red_wifi }}</td>
              <td>{{ item.ciudad }}</td>
              <td>{{ formatearFechaLocal(item.registrado_en) }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="historialVisible = false">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ClientesView',
  data() {
    return {
      clientes: [],
      filtro: '',
      pagina: 1,
      porPagina: 10,
      historialVisible: false,
      historial: [],
      clienteSeleccionado: ''
    }
  },
  computed: {
    clientesFiltrados() {
      return this.clientes.filter(c =>
        c.hostname?.toLowerCase().includes(this.filtro.toLowerCase()) ||
        c.ip_local?.includes(this.filtro) ||
        c.sistema_operativo?.toLowerCase().includes(this.filtro.toLowerCase())
      )
    },
    totalPaginas() {
      return Math.ceil(this.clientesFiltrados.length / this.porPagina)
    },
    clientesPaginados() {
      const inicio = (this.pagina - 1) * this.porPagina
      return this.clientesFiltrados.slice(inicio, inicio + this.porPagina)
    }
  },
  watch: {
    porPagina() {
      this.pagina = 1
    }
  },
  mounted() {
    axios.get('http://symbolsaps.ddns.net:8000/api/clientes_info_all')
      .then(res => {
        this.clientes = res.data.map(c => ({
          ...c,
          estado: this.calcularEstado(c.conectado_en, c.desconectado_en)
        }))
      })
      .catch(err => console.error("❌ Error cargando clientes:", err))
  },
  methods: {
    formatearFechaLocal(ms) {
      if (!ms) return '---'
      const fecha = new Date(Number(ms));
      return fecha.toLocaleString()
    },
    calcularEstado(conectado, desconectado) {
      if (!conectado) return 'offline'
      if (!desconectado || conectado > desconectado) return 'online'
      return 'offline'
    },
    verHistorial(uuid) {
      this.clienteSeleccionado = uuid
      axios.get(`http://symbolsaps.ddns.net:8000/api/clientes_info/${uuid}/historial`)
        .then(res => {
          this.historial = res.data
          this.historialVisible = true
        })
        .catch(err => console.error("❌ Error cargando historial:", err))
    }
  }
}
</script>

<style scoped>
.clientes-container {
  padding: 20px;
  color: white;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: #2c3e50;
  color: white;
}

th {
  background-color: #1abc9c;
  color: black;
}

td, th {
  padding: 10px;
  border-bottom: 1px solid #444;
}

input.buscador {
  width: 100%;
  max-width: 400px;
  padding: 8px;
  margin-bottom: 15px;
  border-radius: 4px;
  border: none;
}

.control-pagina {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge {
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 0.85em;
}

.badge.online {
  background-color: #2ecc71;
  color: black;
}

.badge.offline {
  background-color: #e74c3c;
  color: white;
}

.badge.so {
  background-color: #9b59b6;
  color: white;
}

tr.online {
  background-color: #34495e;
}

.ver-historial {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #2c3e50;
  padding: 20px;
  border-radius: 6px;
  width: 90%;
  max-width: 900px;
  color: white;
}
</style>
