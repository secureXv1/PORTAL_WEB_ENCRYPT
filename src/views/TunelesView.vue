<template>
  <div class="tuneles-chat">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h3>🛰️ Túneles</h3>
      <input v-model="busqueda" type="text" placeholder="Buscar túnel..." />
      <ul>
        <li
          v-for="tunel in tunelesFiltrados"
          :key="tunel.id"
          :class="{ activo: tunel.id === tunelActivo?.id }"
          @click="seleccionarTunel(tunel)"
        >
          <strong>{{ tunel.name }}</strong>
          <p class="fecha">{{ formatearFecha(tunel.created_at) }}</p>
        </li>
      </ul>
    </aside>

    <!-- Conversación -->
    <main class="chat-area">
      <div class="chat-header">
        <h3>Tunel {{ tunelActivo?.name || '...' }}</h3>
        <p v-if="tunelActivo">Creado el {{ formatearFecha(tunelActivo.created_at) }}</p>
      </div>

      <div class="mensajes">
        <div v-for="msg in mensajes" :key="msg.id" :class="['burbuja', msg.alias === 'yo' ? 'propio' : 'externo']">
          <p>{{ msg.contenido }}</p>
        </div>
      </div>
    </main>

    <!-- Participantes y Archivos -->
    <aside class="archivos">
  <div class="panel-contenedor">
    <!-- Participantes -->
    <h4>&nbsp;&nbsp;👥 Participantes ({{ participantes.length }})</h4>
    <div class="participantes">
      <ul>
        <li v-for="p in participantes" :key="p.client_uuid">
          <strong>{{ p.alias }}</strong><br />
          <small>{{ p.hostname }}</small><br />
          <code>{{ p.client_uuid }}</code>
        </li>
      </ul>
    </div>

    <!-- Archivos -->
    <h4>&nbsp;&nbsp;📁 Archivos ({{ archivos.length }})</h4>
    <div class="archivos-lista">
      <ul>
        <li v-for="file in archivos" :key="file.id">
          {{ file.filename }}
        </li>
      </ul>
    </div>
  </div>
</aside>


  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
  return {
    tuneles: [],
    tunelActivo: null,
    mensajes: [],
    archivos: [],
    participantes: [],
    busqueda: ''
  }
}
,
  computed: {
    tunelesFiltrados() {
      return this.tuneles.filter(t => t.name.toLowerCase().includes(this.busqueda.toLowerCase()))
    }
  },
  mounted() {
    this.cargarTuneles()
  },
  methods: {
    cargarTuneles() {
      axios.get('http://symbolsaps.ddns.net:8000/api/tunnels')
        .then(res => {
          this.tuneles = res.data
          if (res.data.length) {
            this.seleccionarTunel(res.data[0])
          }
        })
    },
    seleccionarTunel(tunel) {
  this.tunelActivo = tunel

  axios.get(`http://symbolsaps.ddns.net:8000/api/messages?tunnel_id=${tunel.id}`)
    .then(res => this.mensajes = res.data.reverse())

  axios.get('http://symbolsaps.ddns.net:8000/api/files')
    .then(res => {
      this.archivos = res.data.filter(f => f.tunnel_id == tunel.id)
    })

  axios.get(`http://symbolsaps.ddns.net:8000/api/tunnels/${tunel.id}/participantes`)
    .then(res => {
      this.participantes = res.data
    })
    .catch(err => {
      console.error('❌ Error cargando participantes:', err)
      this.participantes = []
    })
}
,
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleString()
    }
  }
}
</script>

<style scoped>
.tuneles-chat {
  display: flex;
  height: 100vh;
  background: #1e1e1e;
  color: white;
  font-family: sans-serif;
}

.sidebar {
  width: 230px;
  background: #2c3e50;
  padding: 20px;
  overflow-y: auto;
}

.sidebar input {
  width: 100%;
  padding: 6px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: none;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  background: #34495e;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
}

.sidebar li.activo {
  background: #1abc9c;
}

.sidebar .fecha {
  font-size: 12px;
  opacity: 0.7;
  margin: 4px 0 0;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
}

.chat-header {
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.mensajes {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.burbuja {
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
}

.propio {
  align-self: flex-end;
  background: #1abc9c;
}

.externo {
  align-self: flex-start;
  background: #34495e;
}

.archivos {
  width: 250px;
  background: #2c3e50;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.archivos ul {
  list-style: none;
  padding: 0;
}

.archivos li {
  background: #3b5164;
  padding: 8px;
  margin-bottom: 6px;
  border-radius: 4px;
}

.participantes {
  max-height: 400px; /* altura aprox. para 4 elementos */
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #444;
}


.participantes h4,
.archivos-lista h4 {
  margin: 0 0 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #444;
}

.participantes ul,
.archivos-lista ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.participantes li,
.archivos-lista li {
  background: #3b5164;
  padding: 8px;
  margin-bottom: 6px;
  border-radius: 4px;
}

.panel-contenedor {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.archivos-lista {
  padding: 20px;
  border-top: 1px solid #444;
}



</style>
