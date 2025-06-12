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
      <button class="boton-principal">Actualizar contraseña</button>
    </section>

    <!-- Sección: Perfil -->
    <section class="seccion">
      <h3>🧑‍💻​ Perfil</h3>
      <div class="form-group">
        <label>Alias</label>
        <input type="text" v-model="alias" />
      </div>
      <div class="form-group">
        <label>Tipo de perfil</label>
        <input type="text" :value="rol" disabled />
      </div>
      <button class="boton-principal">Actualizar perfil</button>
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
      alias: 'UsuarioDemo',
      rol: 'admin', // Este valor puede venir del backend o localStorage
      ultimaSesion: '2025-06-12 09:12 desde Bogotá'
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
