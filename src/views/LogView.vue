<template>
  <div class="log-view">
    <h2>🧾 Historial de Logs</h2>

    <div class="filters">
      <input type="date" v-model="desde" />
      <input type="date" v-model="hasta" />
      <button @click="cargarLogs">Filtrar</button>
    </div>

    <table class="log-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Usuario</th>
          <th>Acción</th>
          <th>Módulo</th>
          <th>IP</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logs" :key="log.id">
          <td>{{ formatFecha(log.timestamp) }}</td>
          <td>{{ log.usuario }}</td>
          <td>{{ log.accion }}</td>
          <td>{{ log.modulo }}</td>
          <td>{{ log.ip }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logs: [],
      desde: '',
      hasta: '',
      username: localStorage.getItem('username') || ''
    };
  },
  methods: {
    async cargarLogs() {
      try {
        const params = new URLSearchParams();
        if (this.desde) params.append('desde', this.desde);
        if (this.hasta) params.append('hasta', this.hasta);
        if (this.username) params.append('username', this.username);

        const res = await fetch(`http://symbolsaps.ddns.net:8000/api/logs?${params}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }

        this.logs = await res.json();
      } catch (err) {
        console.error("❌ Error al cargar logs:", err);
        alert("No autorizado o error al obtener logs.");
      }
    },
    formatFecha(timestamp) {
      return new Date(timestamp).toLocaleString();
    }
  },
  mounted() {
    this.cargarLogs();
  }
};
</script>

<style scoped>
.log-view {
  color: white;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.log-table {
  width: 100%;
  border-collapse: collapse;
}
.log-table th, .log-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #444;
}
</style>
