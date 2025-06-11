<template>
  <div class="licencias-container">
    <h2>🔐 Licencias</h2>

    <button class="crear-btn">➕ Crear nueva licencia</button>

    <div class="licencias-lista">
      <div class="licencia-card" v-for="licencia in licencias" :key="licencia.codigo">
        <div class="licencia-header">
          <div>
            <h3>{{ licencia.codigo }}</h3>
            <p class="fecha">Creada el {{ formatearFecha(licencia.creado_en) }}</p>
          </div>

          <div class="menu-acciones">
            <button @click="toggleMenu(licencia.codigo)">⋮</button>
            <ul v-if="licencia.mostrarMenu" class="menu">
              <li @click="cancelarLicencia(licencia.codigo)">🛑 Cancelar licencia</li>
            </ul>
          </div>
        </div>

        <div class="clientes">
          <p><strong>Clientes asociados:</strong></p>
          <ul>
            <li v-for="cliente in licencia.clientes" :key="cliente.uuid">
              {{ cliente.hostname }} <small>({{ cliente.uuid.slice(0, 8) }}...)</small>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LicenciasView',
  data() {
    return {
      licencias: [
        {
          codigo: 'LIC-ABC123',
          creado_en: '2025-06-10T14:20:00',
          clientes: [
            { uuid: 'a1b2c3d4-e5f6', hostname: 'cliente-01' },
            { uuid: 'z9x8y7w6-v5u4', hostname: 'cliente-02' }
          ],
          mostrarMenu: false
        },
        {
          codigo: 'LIC-XYZ789',
          creado_en: '2025-05-30T09:00:00',
          clientes: [],
          mostrarMenu: false
        }
      ]
    }
  },
  methods: {
    toggleMenu(codigo) {
      this.licencias = this.licencias.map(l =>
        l.codigo === codigo ? { ...l, mostrarMenu: !l.mostrarMenu } : { ...l, mostrarMenu: false }
      )
    },
    cancelarLicencia(codigo) {
      console.log(`Cancelar licencia: ${codigo}`)
    },
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleString()
    }
  }
}
</script>

<style scoped>
.licencias-container {
  padding: 30px;
  color: white;
}

.crear-btn {
  background-color: #1abc9c;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: bold;
  margin-bottom: 20px;
  cursor: pointer;
}

.licencias-lista {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.licencia-card {
  background-color: #2c3e50;
  padding: 20px;
  border-radius: 8px;
  position: relative;
}

.licencia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fecha {
  font-size: 13px;
  color: #ccc;
}

.menu-acciones {
  position: relative;
}

.menu-acciones button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.menu {
  position: absolute;
  top: 28px;
  right: 0;
  background-color: #34495e;
  list-style: none;
  padding: 8px 0;
  margin: 0;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  z-index: 100;
}

.menu li {
  padding: 8px 14px;
  cursor: pointer;
  white-space: nowrap;
  color: #ecf0f1;
}

.menu li:hover {
  background-color: #3d566e;
}

.clientes ul {
  margin-top: 10px;
  padding-left: 20px;
}

.clientes li {
  margin-bottom: 6px;
}
</style>
