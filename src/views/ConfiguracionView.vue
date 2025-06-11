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
      <h3>🧑 Perfil</h3>
      <div class="form-group">
        <label>Nombre / Alias</label>
        <input type="text" v-model="alias" />
      </div>
      <div class="form-group">
        <label>Correo electrónico</label>
        <input type="email" v-model="email" />
      </div>
      <button class="boton-principal">Actualizar perfil</button>
    </section>

    <!-- Sección: Apariencia -->
    <section class="seccion">
      <h3>🎨 Apariencia</h3>
      <div class="form-group">
        <label>Tema</label>
        <select v-model="tema">
          <option value="oscuro">Modo oscuro</option>
          <option value="claro">Modo claro</option>
        </select>
      </div>
      <div class="form-group">
        <label>Idioma</label>
        <select v-model="idioma">
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>
      </div>
    </section>

    <!-- Sección: Preferencias -->
    <section class="seccion">
      <h3>📄 Preferencias</h3>
      <div class="form-group">
        <label>Resultados por página</label>
        <select v-model="resultadosPagina">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="notificaciones" />
          Activar notificaciones
        </label>
      </div>
    </section>

    <!-- Sección: Sesión -->
    <section class="seccion">
      <h3>🔒 Sesión</h3>
      <p>Última sesión: 2025-06-08 09:12 desde Bogotá</p>
      <button class="boton-secundario">Cerrar sesión en todos los dispositivos</button>
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
      alias: '',
      email: '',
      tema: 'oscuro',
      idioma: 'es',
      resultadosPagina: '20',
      notificaciones: true
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
.boton-principal {
  background-color: #1abc9c;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
.boton-secundario {
  background-color: #e74c3c;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
</style>
