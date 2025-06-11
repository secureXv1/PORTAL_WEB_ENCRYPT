<template>
  <div class="clientes-container">
    <h2>👥 Clientes registrados</h2>

    <!-- Buscador -->
    <input type="text" v-model="filtro" placeholder="Buscar por hostname o sistema..." class="buscador" />

    <!-- Control de cantidad por página -->
    <div class="control-pagina">
      <label>Mostrar:</label>
      <select v-model.number="porPagina">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
      <span>por página</span>
    </div>

    <!-- Tabla -->
    <table>
      <thead>
        <tr>
          <th>UUID</th>
          <th>Hostname</th>
          <th>Sistema Operativo</th>
          <th>Registrado en</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientesPaginados" :key="cliente.uuid">
          <td>{{ cliente.uuid }}</td>
          <td>{{ cliente.hostname }}</td>
          <td>{{ cliente.sistema_operativo }}</td>
          <td>{{ cliente.creado_en }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación -->
    <div class="paginacion">
      <button @click="pagina--" :disabled="pagina === 1">Anterior</button>
      <span>Página {{ pagina }} de {{ totalPaginas }}</span>
      <button @click="pagina++" :disabled="pagina >= totalPaginas">Siguiente</button>
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
      porPagina: 10 // valor inicial
    }
  },
  computed: {
    clientesFiltrados() {
      return this.clientes.filter(c =>
        c.hostname.toLowerCase().includes(this.filtro.toLowerCase()) ||
        c.sistema_operativo.toLowerCase().includes(this.filtro.toLowerCase())
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
      this.pagina = 1 // reinicia a la primera página si cambia el tamaño
    }
  },
  mounted() {
    axios.get('http://symbolsaps.ddns.net:8000/api/clientes')
      .then(res => this.clientes = res.data)
      .catch(err => console.error("❌ Error cargando clientes:", err))
  }
}
</script>

<style scoped>
.clientes-container {
  padding: 20px;
  color: white;
}

.buscador {
  padding: 8px;
  margin-bottom: 10px;
  width: 300px;
}

.control-pagina {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: white;
}

.control-pagina select {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #34495e;
  color: white;
  border: none;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #2c3e50;
  color: white;
}

th, td {
  padding: 12px;
  border-bottom: 1px solid #444;
  text-align: left;
}

th {
  background-color: #1abc9c;
}

.paginacion {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
