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
    <div class="header-left">
      <h3>Tunel {{ tunelActivo?.name || '...' }}</h3>
      <p v-if="tunelActivo">Creado el {{ formatearFecha(tunelActivo.created_at) }}</p>
    </div>

    <div class="header-right">
      <!-- Botón de descarga -->
      <div class="dropdown">
        <button @click="mostrarOpciones = !mostrarOpciones" class="boton-principal">
          📥 Descargar
        </button>
        <ul v-if="mostrarOpciones" class="menu-opciones">
          <li @click="descargarChat('csv')">📄 Exportar como CSV</li>
          <li @click="descargarChat('xlsx')">📘 Exportar como Excel</li>
        </ul>
      </div>

      <!-- Filtros debajo del botón -->
      <div class="filtros-fecha-vertical">
        <select v-model="filtroFecha" @change="aplicarFiltroFecha">
          <option value="hoy">Hoy</option>
          <option value="2dias">Últimos 2 días</option>
          <option value="semana">Última semana</option>
          <option value="mes">Último mes</option>
          <option value="personalizado">Personalizado</option>
        </select>

        <div v-if="filtroFecha === 'personalizado'" class="rango">
          <input type="date" v-model="fechaDesde" />
          <input type="date" v-model="fechaHasta" />
          <button @click="aplicarFiltroFecha">Aplicar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ✅ Lista de mensajes -->
  <div class="mensajes" ref="contenedorMensajes">
    <div
      v-for="msg in mensajes"
      :key="msg.id"
      class="mensaje-wrapper externo"
    >
      <div class="alias">
        {{ msg.alias }} • {{ formatearFecha(msg.enviado_en) }}
      </div>

      <div :class="['burbuja', 'externo', getColorClass(msg.alias)]">
        {{ msg.contenido }}
      </div>
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
          <strong>{{ p.aliases.join(', ') }}</strong><br />
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
          <a
            :href="`http://symbolsaps.ddns.net:8000/api/files/${file.id}/download?username=${username}`"
            target="_blank"
            class="archivo-link"
          >
            {{ file.filename }}
          </a>
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
    filtroFecha: "hoy",
    fechaDesde: "",
    fechaHasta: "",
    mensajes: [],
    tunelActivo: null,
    tuneles: [],
    archivos: [],
    participantes: [],
    busqueda: '',
    mostrarOpciones: false,
    username: localStorage.getItem("username") || ""
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
    this.aplicarFiltroFecha()

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
    },

    aplicarFiltroFecha() {
  if (!this.tunelActivo) return;

  const hoy = new Date();
  let desde = null;
  let hasta = new Date().toISOString().split("T")[0] + "T23:59:59";

  if (this.filtroFecha === 'hoy') {
    desde = new Date().toISOString().split("T")[0] + "T00:00:00";
  } else if (this.filtroFecha === '2dias') {
    desde = new Date(hoy.setDate(hoy.getDate() - 1)).toISOString().split("T")[0] + "T00:00:00";
  } else if (this.filtroFecha === 'semana') {
    desde = new Date(hoy.setDate(hoy.getDate() - 6)).toISOString().split("T")[0] + "T00:00:00";
  } else if (this.filtroFecha === 'mes') {
    desde = new Date(hoy.setDate(hoy.getDate() - 29)).toISOString().split("T")[0] + "T00:00:00";
  } else if (this.filtroFecha === 'personalizado') {
    desde = this.fechaDesde ? this.fechaDesde + "T00:00:00" : null;
    hasta = this.fechaHasta ? this.fechaHasta + "T23:59:59" : null;
  }

  const params = {
    tunnel_id: this.tunelActivo.id,
    desde: desde ? new Date(desde).getTime() : null,
    hasta: hasta ? new Date(hasta).getTime() : null
  };

  axios.get('http://symbolsaps.ddns.net:8000/api/messages', { params })
    .then(res => {
      this.mensajes = res.data;
      this.scrollAlFinal();
    });
  },

   descargarChat(formato) {
    if (!this.tunelActivo) return;

    const params = new URLSearchParams({ formato })

    // Añadir filtros si existen
    if (this.filtroFecha === 'personalizado') {
    if (this.fechaDesde) params.append('desde', new Date(this.fechaDesde + 'T00:00:00').getTime())
    if (this.fechaHasta) params.append('hasta', new Date(this.fechaHasta + 'T23:59:59').getTime())

    } else {
      const hoy = new Date()
      let desde = ''
      let hasta = new Date().toISOString().split("T")[0]
      if (this.filtroFecha === 'hoy') {
        desde = hasta
      } else if (this.filtroFecha === '2dias') {
        desde = new Date(hoy.setDate(hoy.getDate() - 1)).toISOString().split("T")[0]
      } else if (this.filtroFecha === 'semana') {
        desde = new Date(hoy.setDate(hoy.getDate() - 6)).toISOString().split("T")[0]
      } else if (this.filtroFecha === 'mes') {
        desde = new Date(hoy.setDate(hoy.getDate() - 29)).toISOString().split("T")[0]
      }
      if (desde) {
      const desdeMs = new Date(desde + 'T00:00:00').getTime()
      const hastaMs = new Date(hasta + 'T23:59:59').getTime()
      params.append('desde', desdeMs)
      params.append('hasta', hastaMs)
      }

    }

    const username = localStorage.getItem('username')
    params.append('username', username)
    const url = `http://symbolsaps.ddns.net:8000/api/tunnels/${this.tunelActivo.id}/export?${params.toString()}`

    window.open(url, "_blank")
    this.mostrarOpciones = false
  },


  formatearFecha(fecha) {
  return new Date(fecha).toLocaleString()
  },


  getColorClass(alias) {
    const colores = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5']
    const hash = alias.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colores[hash % colores.length]
  },

  scrollAlFinal() {
  this.$nextTick(() => {
    const contenedor = this.$refs.contenedorMensajes
    if (contenedor) {
      contenedor.scrollTop = contenedor.scrollHeight
    }
  })
},


  

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

.mensajes {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding: 10px 15px;
}

.mensaje-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  align-self: flex-start;
  text-align: left;
}

.burbuja {
  padding: 12px 16px;
  border-radius: 16px;
  color: #fff;
  word-break: break-word;
  line-height: 1.4;
  font-size: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.alias {
  font-size: 13px;
  color: #bbb;
  margin-bottom: 4px;
}

.externo.color-1 { background-color: var(--color-1); }
.externo.color-2 { background-color: var(--color-2); }
.externo.color-3 { background-color: var(--color-3); }
.externo.color-4 { background-color: var(--color-4); }
.externo.color-5 { background-color: var(--color-5); }

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

.dropdown {
  position: relative;
  display: block; /* <-- cambia de inline-block a block */
  margin-top: 10px;
  width: 100%; /* <-- asegura que ocupe todo el ancho disponible */
}


.boton-principal {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.menu-opciones {
  position: absolute;
  top: 110%;
  left: 0;
  background-color: #2c3e50;
  border: 1px solid #444;
  border-radius: 6px;
  min-width: 180px;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 5px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.menu-opciones li {
  padding: 10px 14px;
  cursor: pointer;
  color: #ecf0f1;
}

.menu-opciones li:hover {
  background-color: #3d566e;
}


.filtros-fecha {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}

.filtros-fecha select,
.filtros-fecha input {
  padding: 6px;
  border-radius: 4px;
  border: none;
  background-color: #34495e;
  color: white;
}

.filtros-fecha button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #1abc9c;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.filtros-fecha button:hover {
  background-color: #16a085;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* <-- cambia de flex-end a flex-start */
  gap: 10px;
  width: 250px; /* o 100% si prefieres full width */
}


/* Filtros debajo del botón */

.filtros-fecha-vertical {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 10px;
}

.filtros-fecha-vertical select {
  width: 160px;
  padding: 6px 8px;
  border-radius: 4px;
  border: none;
  background-color: #34495e;
  color: white;
}


.filtros-fecha-vertical .rango {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.filtros-fecha-vertical input[type="date"] {
  width: 160px;
  padding: 6px 8px;
  border-radius: 4px;
  border: none;
  background-color: #34495e;
  color: white;
}

.filtros-fecha-vertical button {
  align-self: center;
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  background-color: #1abc9c;
  color: white;
  font-weight: bold;
  cursor: pointer;
  min-width: 100px;
}



.filtros-fecha-vertical input[type="date"] {
  background-color: #34495e;
  color: white;
}


.filtros-fecha-vertical button:hover {
  background-color: #16a085;
}




</style>
