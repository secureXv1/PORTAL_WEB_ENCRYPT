<template>
  <div class="configuracion-container">
    <h2>⚙️ Configuración</h2>

    <!-- Sección: Seguridad -->
    <section class="seccion">
      <h3>🔐 Seguridad</h3>
      <div class="form-group">
        <label>Contraseña actual</label>
        <input type="password" v-model="passwordActual" />
      </div>
      <div class="form-group">
        <label>Nueva contraseña</label>
        <input type="password" v-model="nuevaPassword" />
      </div>
      <div class="form-group">
        <label>Confirmar nueva contraseña</label>
        <input type="password" v-model="confirmarPassword" />
      </div>
      <button class="boton-principal" @click="cambiarPassword">Actualizar contraseña</button>
    </section>

    <!-- Sección: Perfil (desactivada visualmente si no se usa) -->
    <section class="seccion" style="opacity: 0.5; pointer-events: none;">
      <h3>🧑‍💻​ Perfil</h3>
      <div class="form-group">
        <label>Alias</label>
        <input type="text" v-model="alias" disabled />
      </div>
      <div class="form-group">
        <label>Tipo de perfil</label>
        <input type="text" :value="rol" disabled />
      </div>
      <button class="boton-principal" disabled>Actualizar perfil</button>
    </section>

    <!-- Sección: Sesión -->
    <section class="seccion">
      <h3>🔒 Sesión</h3>
      <p>Última sesión: {{ ultimaSesion }}</p>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      passwordActual: '',
      nuevaPassword: '',
      confirmarPassword: '',
      alias: localStorage.getItem("username") || "UsuarioDemo",
      rol: localStorage.getItem("rol") || "consulta",
      ultimaSesion: '2025-06-12 09:12 desde Bogotá'
    }
  },
  methods: {
    async cambiarPassword() {
      const username = localStorage.getItem("username")

      if (!this.passwordActual || !this.nuevaPassword || !this.confirmarPassword) {
        alert("⚠️ Todos los campos son obligatorios")
        return
      }

      if (this.nuevaPassword !== this.confirmarPassword) {
        alert("⚠️ La nueva contraseña no coincide con la confirmación")
        return
      }

      if (this.nuevaPassword.length < 6) {
        alert("⚠️ La nueva contraseña debe tener al menos 6 caracteres")
        return
      }

      try {
        const res = await fetch("http://symbolsaps.ddns.net:8000/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, anterior: this.passwordActual, nueva: this.nuevaPassword })
        })


        const data = await res.json()

        if (data.success) {
          alert("✅ Contraseña actualizada correctamente")
          this.passwordActual = ''
          this.nuevaPassword = ''
          this.confirmarPassword = ''
        } else {
          alert(`❌ Error: ${data.error}`)
        }
      } catch (e) {
        alert("❌ Error de red o del servidor")
        console.error(e)
      }
    }
  }
}
</script>

<style scoped>
.configuracion-container {
  padding: 30px;
  color: white;
}
.seccion {
  background: #2c3e50;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
}
.form-group {
  margin-bottom: 15px;
}
input, select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: none;
  background: #34495e;
  color: white;
}
input[disabled] {
  opacity: 0.7;
}
.boton-principal {
  background-color: #1abc9c;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
</style>
