<template>
  <div class="usuarios-container">
    <h2>👤 Gestión de Usuarios</h2>

    <button class="crear-btn" @click="mostrarFormulario = true">➕ Crear nuevo usuario</button>

                      <!-- MODAL de creación de usuario -->
              <div v-if="mostrarFormulario" class="modal-overlay">
                <div class="modal">
                  <h3>➕ Crear nuevo usuario</h3>

                  <label>👤 Usuario</label>
                  <input v-model="nuevoUsuario.username" type="text" placeholder="Nombre de usuario" />

                  <label>🔒 Contraseña</label>
                  <input v-model="nuevoUsuario.password" type="password" placeholder="Contraseña" />

                  <label>✅ Confirmar contraseña</label>
                  <input v-model="nuevoUsuario.confirmar" type="password" placeholder="Repetir contraseña" />

                  <label>🎯 Rol</label>
                  <select v-model="nuevoUsuario.rol">
                    <option value="admin">Admin</option>
                    <option value="consulta">Consulta</option>
                  </select>

                  <div class="modal-error" v-if="error">{{ error }}</div>

                  <div class="modal-actions">
                    <button @click="crearUsuario">Crear</button>
                    <button @click="mostrarFormulario = false">Cancelar</button>
                  </div>
                </div>
              </div>


                        <!-- MODAL de cambio de contraseña -->
          <div v-if="mostrarResetModal" class="modal-overlay">
            <div class="modal">
              <h3>🔑 Cambiar contraseña de {{ usuarioSeleccionado?.nombre }}</h3>

              <label>Nueva contraseña</label>
              <input v-model="nuevaPassword" type="password" placeholder="Nueva contraseña" />

              <label>Confirmar contraseña</label>
              <input v-model="confirmarPassword" type="password" placeholder="Confirmar contraseña" />

              <div class="modal-error" v-if="error">{{ error }}</div>

              <div class="modal-actions">
                <button @click="confirmarResetPassword">Cambiar</button>
                <button @click="cerrarResetModal">Cancelar</button>
              </div>
            </div>
          </div>





    <!-- Resumen -->
    <div class="resumen">
      <div class="card admin">Admins: <strong>{{ contarPorRol('admin') }}</strong></div>
      <div class="card consulta">Consulta: <strong>{{ contarPorRol('consulta') }}</strong></div>
      <div class="card">Total: <strong>{{ usuarios.length }}</strong></div>
    </div>

    <!-- Lista de usuarios -->
    <div class="usuarios-lista">
      <div class="usuario-card" v-for="u in usuarios" :key="u.id" :class="u.rol">
        <div class="info">
          <h4>{{ u.nombre }}</h4>
          <p class="rol">Rol: <span :class="u.rol">{{ u.rol }}</span></p>
          <p class="fecha">Creado el {{ formatearFecha(u.creado_en) }}</p>
          <p class="estado" :class="{ inactivo: !u.activo }">
          Estado: <strong>{{ u.activo ? 'Activo' : 'Inactivo' }}</strong>
          </p>
        </div>

        <div class="acciones">
          <button @click="toggleMenu(u.id)">⋮</button>
          <ul v-if="u.menuAbierto" class="menu">
            <li @click="cambiarRol(u)">🔄 Cambiar rol</li>
            <li @click="toggleActivo(u)">
              {{ u.activo ? '🛑 Desactivar' : '✅ Activar' }}
            </li>
            <li @click="abrirResetPassword(u)">🔑 Cambiar contraseña</li>


          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UsuariosView',
  data() {
    return {
      usuarios: [],
      mostrarFormulario: false,
      mostrarResetModal: false,
      usuarioSeleccionado: null,
      nuevaPassword: '',
      confirmarPassword: '',
      username: localStorage.getItem('username') || '',
      error: '',
      nuevoUsuario: {
        username: '',
        password: '',
        confirmar: '',
        rol: 'consulta'
      }
    }
  },
  methods: {
    async cargarUsuarios() {
      try {
        const res = await axios.get('http://symbolsaps.ddns.net:8000/api/usuarios')
        this.usuarios = res.data.map(u => ({
          id: u.id,
          nombre: u.username,
          rol: u.rol,
          creado_en: u.creado_en || new Date().toISOString(),
          activo: u.activo === 1 || u.activo === true,
          menuAbierto: false
        }))
      } catch (err) {
        console.error('❌ Error al cargar usuarios:', err)
      }
    },
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
    async cambiarRol(usuario) {
      const nuevoRol = usuario.rol === 'admin' ? 'consulta' : 'admin'
      const confirmar = confirm(`¿Seguro que deseas cambiar el rol de ${usuario.nombre} a ${nuevoRol}?`)
      if (!confirmar) return

      try {
        const res = await axios.post(`http://symbolsaps.ddns.net:8000/api/usuarios/${usuario.id}/cambiar-rol`, {
          rol: nuevoRol
        })

        if (res.data.success) {
          usuario.rol = nuevoRol
          alert('✅ Rol actualizado correctamente')
        } else {
          alert('❌ No se pudo actualizar el rol')
        }
      } catch (err) {
        console.error('Error al cambiar rol:', err)
        alert('Error del servidor')
      }
    },
    async crearUsuario() {
      this.error = ''
      const { username, password, confirmar, rol } = this.nuevoUsuario

      if (!username || !password || !confirmar) {
        this.error = 'Todos los campos son obligatorios.'
        return
      }

      if (password !== confirmar) {
        this.error = 'Las contraseñas no coinciden.'
        return
      }

      try {
        const res = await axios.post('http://symbolsaps.ddns.net:8000/api/auth/register', {
          username,
          password,
          rol
        })

        if (res.data.success) {
          alert('✅ Usuario creado')
          this.mostrarFormulario = false
          this.nuevoUsuario = { username: '', password: '', confirmar: '', rol: 'consulta' }
          this.cargarUsuarios()
        } else {
          this.error = res.data.error || 'Ocurrió un error.'
        }
      } catch (err) {
        console.error('❌ Error al crear usuario:', err)
        this.error = 'No se pudo crear el usuario.'
      }
    },
    async toggleActivo(usuario) {
      try {
        const res = await axios.post(`http://symbolsaps.ddns.net:8000/api/usuarios/${usuario.id}/activar`, {
          activo: !usuario.activo
        })

        if (res.data.success) {
          usuario.activo = res.data.activo
        } else {
          alert('No se pudo actualizar el estado del usuario.')
        }
      } catch (err) {
        console.error('Error al actualizar estado:', err)
        alert('Error en el servidor')
      }
    },
    abrirResetPassword(usuario) {
      this.usuarioSeleccionado = usuario
      this.mostrarResetModal = true
      this.nuevaPassword = ''
      this.confirmarPassword = ''
      this.error = ''
    },
    cerrarResetModal() {
      this.mostrarResetModal = false
      this.usuarioSeleccionado = null
    },
    async confirmarResetPassword() {
      if (!this.nuevaPassword || !this.confirmarPassword) {
        this.error = 'Todos los campos son obligatorios.'
        return
      }

      if (this.nuevaPassword !== this.confirmarPassword) {
        this.error = 'Las contraseñas no coinciden.'
        return
      }

      try {
        const res = await axios.post(`http://symbolsaps.ddns.net:8000/api/usuarios/${this.usuarioSeleccionado.id}/reset-password`, {
          nueva: this.nuevaPassword,
          admin_username: this.username
        })

        if (res.data.success) {
          alert('✅ Contraseña actualizada correctamente')
          this.cerrarResetModal()
        } else {
          this.error = res.data.error || 'Ocurrió un error.'
        }
      } catch (err) {
        console.error('❌ Error al resetear contraseña:', err)
        this.error = 'Error del servidor.'
      }
    },
    handleClickOutside(event) {
      const menus = document.querySelectorAll('.acciones')
      let clickedInside = false
      menus.forEach(menu => {
        if (menu.contains(event.target)) {
          clickedInside = true
        }
      })

      if (!clickedInside) {
        this.usuarios = this.usuarios.map(u => ({ ...u, menuAbierto: false }))
      }
    }
  },
  mounted() {
    this.cargarUsuarios()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
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

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #2c3e50;
  padding: 20px 30px;
  border-radius: 8px;
  color: white;
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal input, .modal select {
  padding: 8px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.modal-error {
  color: #ff6666;
  font-size: 13px;
  margin-top: 5px;
  text-align: left;
}

.modal-actions button {
  padding: 8px 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.modal-actions button:first-child {
  background-color: #1abc9c;
  color: white;
}
.modal-actions button:last-child {
  background-color: #7f8c8d;
  color: white;
}

.estado.inactivo strong {
  color: #e74c3c;
}





</style>
