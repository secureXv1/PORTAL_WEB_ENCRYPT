<template>
  <div class="archivos-container">
    <h2>📁 Archivos compartidos</h2>

    <!-- FILTROS MULTIPLES -->

    
             <div class="filtros">
                <!-- Rango de fechas -->
                <div class="filtro-grupo">
                  <label>Desde:</label>
                  <input type="date" v-model="filtros.desde" />
                  <label>Hasta:</label>
                  <input type="date" v-model="filtros.hasta" />
                </div>

                <!-- Túneles -->
                <div class="filtro-grupo">
                  <label><strong>Túneles:</strong></label>
                  <label v-for="t in tunelesUnicos" :key="t">
                    <input type="checkbox" :value="t" v-model="filtros.tuneles" />
                    {{ t }}
                  </label>
                </div>

                <!-- Alias -->
                <div class="filtro-grupo">
                  <label><strong>Alias:</strong></label>
                  <label v-for="a in aliasUnicos" :key="a">
                    <input type="checkbox" :value="a" v-model="filtros.alias" />
                    {{ a }}
                  </label>
                </div>

                <!-- Clientes -->
                <div class="filtro-grupo">
                  <label><strong>Clientes:</strong></label>
                  <label v-for="c in clientesUnicos" :key="c">
                    <input type="checkbox" :value="c" v-model="filtros.clientes" />
                    {{ c }}
                  </label>
                </div>

                <!-- Limpiar -->
                <div class="filtro-grupo">
                  <button @click="limpiarFiltros">🧹 Limpiar</button>
                </div>
              </div>




    <!-- TABLA -->
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th @click="ordenarPor('filename')" style="cursor: pointer;">
            Archivo <span v-if="orden.campo === 'filename'">{{ orden.asc ? '↑' : '↓' }}</span>
          </th>
          <th @click="ordenarPor('uploaded_at')" style="cursor: pointer;">
            Fecha de subida <span v-if="orden.campo === 'uploaded_at'">{{ orden.asc ? '↑' : '↓' }}</span>
          </th>
          <th @click="ordenarPor('tunnel_name')" style="cursor: pointer;">
            Túnel <span v-if="orden.campo === 'tunnel_name'">{{ orden.asc ? '↑' : '↓' }}</span>
          </th>
          <th @click="ordenarPor('sender_alias')" style="cursor: pointer;">
            Alias <span v-if="orden.campo === 'sender_alias'">{{ orden.asc ? '↑' : '↓' }}</span>
          </th>
          <th @click="ordenarPor('client_uuid')" style="cursor: pointer;">
            Cliente <span v-if="orden.campo === 'client_uuid'">{{ orden.asc ? '↑' : '↓' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(archivo, index) in archivosFiltrados" :key="archivo.id">
          <td>{{ index + 1 }}</td>
          <td>
                <a
                  :href="`http://symbolsaps.ddns.net:8000/api/files/${archivo.id}/download?username=${username}`"
                  target="_blank"
                  class="archivo-link"
                >
                  <img :src="obtenerIcono(archivo.filename)" class="icono-archivo" alt="icono" />
                  <span class="nombre-archivo">{{ limpiarNombreArchivo(archivo.filename) }}</span>
                </a>
              </td>
          <td>{{ formatearFecha(archivo.uploaded_at) }}</td>

          
          <td>{{ archivo.tunnel_name || archivo.tunnel_id }}</td>
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
    archivos: [],
    username: "",
    filtros: {
      desde: '',
      hasta: '',
      tuneles: [],
      alias: [],
      clientes: []
    },
    orden: {
      campo: null,
      asc: true
    }
  }
},

      computed: {
        tunelesUnicos() {
          return [...new Set(this.archivos.map(a => a.tunnel_name).filter(Boolean))].sort()
        },
        aliasUnicos() {
          return [...new Set(this.archivos.map(a => a.sender_alias).filter(Boolean))].sort()
        },
        clientesUnicos() {
          return [...new Set(this.archivos.map(a => a.client_uuid).filter(Boolean))].sort()
        },
        archivosFiltrados() {
          return this.archivos.filter(a => {
            const fecha = new Date(a.uploaded_at)
            const desde = this.filtros.desde ? new Date(this.filtros.desde) : null
            const hasta = this.filtros.hasta ? new Date(this.filtros.hasta + 'T23:59:59') : null

            const fechaOk = (!desde || fecha >= desde) && (!hasta || fecha <= hasta)
            const tunelOk = this.filtros.tuneles.length === 0 || this.filtros.tuneles.includes(a.tunnel_name)
            const aliasOk = this.filtros.alias.length === 0 || this.filtros.alias.includes(a.sender_alias)
            const clienteOk = this.filtros.clientes.length === 0 || this.filtros.clientes.includes(a.client_uuid)

            return fechaOk && tunelOk && aliasOk && clienteOk
          })
        }

      },

  mounted() {

    this.username = localStorage.getItem("username")

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
        const iconos = ['pdf', 'docx', 'xlsx', 'ppt', 'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mp3', 'zip', 'rar', 'txt', 'json']
        return `/assets/icons/${iconos.includes(ext) ? ext : 'default'}.png`
      },
      ordenarPor(campo) {
        if (this.orden.campo === campo) {
          this.orden.asc = !this.orden.asc
        } else {
          this.orden.campo = campo
          this.orden.asc = true
        }

        this.archivos.sort((a, b) => {
          const valA = a[campo] || ''
          const valB = b[campo] || ''

          if (campo === 'uploaded_at') {
            return this.orden.asc
              ? new Date(valA) - new Date(valB)
              : new Date(valB) - new Date(valA)
          }

          return this.orden.asc
            ? valA.toString().localeCompare(valB.toString())
            : valB.toString().localeCompare(valA.toString())
        })
      },
      limpiarFiltros() {
        this.filtros.desde = ''
        this.filtros.hasta = ''
        this.filtros.tuneles = []
        this.filtros.alias = []
        this.filtros.clientes = []
      },

      limpiarNombreArchivo(nombre) {
        const partes = nombre.split('_')
        return partes.length >= 3 ? partes.slice(2).join('_') : nombre
      },
      formatearFecha(ms) {
        const fecha = new Date(ms)
        return fecha.toLocaleString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      }


    }

}
</script>

<style scoped>
.archivos-container {
  padding: 20px;
  color: white;
}

.filtros {
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  background: #2f2f2f;
  padding: 10px;
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
  min-width: 150px;
  color: white;
  font-size: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #2c3e50;
  color: white;
  table-layout: auto;
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
  cursor: pointer;
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
  display: inline-block;
  max-width: 400px;
  white-space: nowrap;
  overflow-x: auto;
  text-overflow: ellipsis;
}

.icono-archivo {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.filtro-grupo select,
.filtro-grupo input[type="date"] {
  background: #1e1e1e;
  color: white;
  border: 1px solid #666;
  border-radius: 4px;
  padding: 4px;
  margin-top: 4px;
}
.filtro-grupo {
  display: flex;
  flex-direction: column;
  background: #2f2f2f;
  padding: 10px;
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
  min-width: 150px;
}



</style>
