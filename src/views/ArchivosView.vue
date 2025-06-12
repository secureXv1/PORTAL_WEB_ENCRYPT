<template>
  <div class="archivos-container">
    <h2>📁 Archivos compartidos</h2>

    <table>
      <thead>
        <tr>
          <th style="width: 5px">#</th>
          <th style="width: 400px">Archivo</th>
          <th style="width: 160px">Fecha de subida</th>
          <th style="width: 100px">Túnel</th>
          <th style="width: 120px">Alias</th>
          <th style="width: 150px">Cliente</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(archivo, index) in archivos" :key="archivo.id">
          <td>{{ index + 1 }}</td>
          <td>
            <a
              :href="`http://symbolsaps.ddns.net:8000/api/files/${archivo.id}/download`"
              target="_blank"
              class="archivo-link"
            >
              <img
                :src="obtenerIcono(archivo.filename)"
                class="icono-archivo"
                alt="icono"
              />
              <span class="nombre-archivo">{{ archivo.filename }}</span>
            </a>
          </td>
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
  },
  methods: {
    obtenerIcono(filename) {
      const ext = filename.split('.').pop().toLowerCase()
      const iconos = [
        'pdf', 'docx', 'xlsx', 'ppt', 'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mp3', 'zip', 'rar', 'txt', 'json'
      ]
      return `/assets/icons/${iconos.includes(ext) ? ext : 'default'}.png`
    }
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
  table-layout: fixed;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #444;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

th {
  background-color: #1abc9c;
}

tbody tr:hover {
  background-color: #34495e;
}

.archivo-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #ecf0f1;
  gap: 10px;
  max-width: 100%;
  overflow: hidden;
}

.archivo-link:hover {
  color: #1abc9c;
}

.nombre-archivo {
  overflow-x: auto;
  white-space: nowrap;
  display: inline-block;
  max-width: 400px;
}

.icono-archivo {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
</style>
