<template>
  <div class="clientes-container">
    <h2>👥 Clientes registrados</h2>

    <input type="text" v-model="filtro" placeholder="Buscar por hostname o sistema..." class="buscador" />

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
      porPagina: 5
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
