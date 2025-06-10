<template>
  <div class="archivos-container">
    <h2>📁 Archivos compartidos</h2>

    <table>
      <thead>
        <tr>
          <th>Archivo</th>
          <th>Fecha de subida</th>
          <th>Túnel</th>
          <th>Alias</th>
          <th>Cliente</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="archivo in archivos" :key="archivo.id">
          <td>{{ archivo.filename }}</td>
          <td>{{ archivo.uploaded_at }}</td>
          <td>{{ archivo.tunnel_id }}</td>
          <td>{{ archivo.sender_alias }}</td>
          <td>{{ archivo.client_uuid }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      archivos: []
    }
  },
  mounted() {
    axios.get('http://symbolsaps.ddns.net:8000/api/files')
      .then(res => {
        this.archivos = res.data
      })
      .catch(err => {
        console.error("❌ Error al cargar archivos:", err)
      })
  }
}
</script>

<style scoped>
.archivos-container {
  padding: 20px;
  color: white;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #2c3e50;
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
</style>
