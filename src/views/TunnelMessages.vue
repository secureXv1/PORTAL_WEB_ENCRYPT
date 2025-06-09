<template>
  <div>
    <h2>Mensajes del túnel #{{ tunnelId }}</h2>

    <router-link to="/dashboard">← Volver al Dashboard</router-link>

    <table v-if="mensajes.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Alias</th>
          <th>Contenido</th>
          <th>Tipo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="msg in mensajes" :key="msg.id">
          <td>{{ msg.id }}</td>
          <td>{{ msg.alias }}</td>
          <td>
            <!-- Si es un archivo (contenido es JSON válido con type: "file") -->
            <span v-if="isJsonFile(msg.contenido)">
              <a :href="getDownloadLink(msg)" target="_blank">
                📎 {{ parseFile(msg.contenido).filename }}
              </a>
            </span>

            <!-- Si es texto normal -->
            <span v-else>
              {{ msg.contenido }}
            </span>
          </td>
          <td>{{ msg.tipo }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No hay mensajes en este túnel.</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      mensajes: [],
      tunnelId: this.$route.params.id
    }
  },
  methods: {
    isJsonFile(str) {
      try {
        const parsed = JSON.parse(str)
        return parsed && parsed.type === "file"
      } catch {
        return false
      }
    },
    parseFile(str) {
      try {
        return JSON.parse(str)
      } catch {
        return {}
      }
    },
    getDownloadLink(msg) {
      const parsed = this.parseFile(msg.contenido)
      // Aquí suponemos que el archivo ya fue subido al backend y accesible en /uploads/
      return `http://symbolsaps.ddns.net:8000/uploads/${parsed.filename}`
    }
  },
  mounted() {
    axios.get(`http://symbolsaps.ddns.net:8000/api/messages?tunnel_id=${this.tunnelId}`)
      .then(res => {
        this.mensajes = res.data
      })
      .catch(err => {
        console.error("❌ Error al obtener mensajes:", err)
      })
  }
}
</script>
