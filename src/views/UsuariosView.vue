<template>
  <div class="usuarios-container">
    <h2>👤 Gestión de Usuarios</h2>

    <button class="crear-btn">➕ Crear nuevo usuario</button>

    <!-- Resumen -->
    <div class="resumen">
      <div class="card admin">Admins: <strong>{{ contarPorRol('admin') }}</strong></div>
      <div class="card consulta">Consulta: <strong>{{ contarPorRol('consulta') }}</strong></div>
      <div class="card proveedor">Proveedor: <strong>{{ contarPorRol('proveedor') }}</strong></div>
      <div class="card">Total: <strong>{{ usuarios.length }}</strong></div>
    </div>

    <!-- Lista de usuarios -->
    <div class="usuarios-lista">
      <div class="usuario-card" v-for="u in usuarios" :key="u.id" :class="u.rol">
        <div class="info">
          <h4>{{ u.nombre }}</h4>
          <p class="rol">Rol: <span :class="u.rol">{{ u.rol }}</span></p>
          <p class="fecha">Creado el {{ formatearFecha(u.creado_en) }}</p>
        </div>

        <div class="acciones">
          <button @click="toggleMenu(u.id)">⋮</button>
          <ul v-if="u.menuAbierto" class="menu">
            <li @click="cambiarRol(u)">🔄 Cambiar rol</li>
            <li @click="cancelarUsuario(u)">🛑 Cancelar usuario</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsuariosView',
  data() {
    return {
      usuarios: [
        { id: 1, nombre: 'admin@example.com', rol: 'admin', creado_en: '2025-06-09T10:00:00', menuAbierto: false },
        { id: 2, nombre: 'proveedor1@example.com', rol: 'proveedor', creado_en: '2025-06-08T14:00:00', menuAbierto: false },
        { id: 3, nombre: 'consulta@example.com', rol: 'consulta', creado_en: '2025-06-05T09:30:00', menuAbierto: false }
      ]
    }
  },
  methods: {
    formatearFecha(fecha) {
      return new Date(fecha).toLocaleString()
    },
    contarPorRol(rol) {
      return this.usuarios.filter(u => u.rol === rol).length
    },
    toggleMenu(id) {
      this.usuarios = this.usuarios.map(u =>
        u.id === id ? { ...u, menuAbierto: !u.menuAbierto } : { ...u, menuAbierto: false }
      )
    },
    cambiarRol(usuario) {
      console.log('Cambiar rol a:', usuario.nombre)
    },
    cancelarUsuario(usuario) {
      console.log('Cancelar usuario:', usuario.nombre)
    }
  }
}
</script>

<style scoped>
.usuarios-container {
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

.resumen {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  background-color: #2c3e50;
  padding: 15px 20px;
  border-radius: 8px;
  min-width: 160px;
  font-size: 15px;
}
.card.admin {
  background-color: #1abc9c;
}
.card.consulta {
  background-color: #3498db;
}
.card.proveedor {
  background-color: #e67e22;
}

.usuarios-lista {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.usuario-card {
  background-color: #34495e;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.usuario-card.admin {
  border-left: 6px solid #1abc9c;
}
.usuario-card.consulta {
  border-left: 6px solid #3498db;
}
.usuario-card.proveedor {
  border-left: 6px solid #e67e22;
}

.info h4 {
  margin: 0;
}

.rol span {
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: capitalize;
}
.rol .admin {
  background-color: #1abc9c;
}
.rol .consulta {
  background-color: #3498db;
}
.rol .proveedor {
  background-color: #e67e22;
}

.rol, .fecha {
  font-size: 13px;
  color: #ccc;
}

.acciones {
  position: relative;
}

.acciones button {
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
  background-color: #3d566e;
  list-style: none;
  padding: 8px 0;
  margin: 0;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.menu li {
  padding: 8px 14px;
  cursor: pointer;
  white-space: nowrap;
  color: #ecf0f1;
}

.menu li:hover {
  background-color: #2c3e50;
}
</style>
