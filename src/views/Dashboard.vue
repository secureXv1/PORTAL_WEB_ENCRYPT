<template>
  <div class="dashboard">
    <!-- Top bar -->
    <div class="topbar">
      <h2>Portal Encrypt</h2>
      <button @click="logout">Cerrar sesión</button>
    </div>

    <!-- Layout -->
    <div class="layout">
      <!-- Sidebar -->
      <div class="sidebar">
        <ul>
          <li @click="navigate('inicio')" :class="{ active: isActive('inicio') }">Inicio</li>
          <li @click="navigate('tuneles')" :class="{ active: isActive('tuneles') }">Túneles</li>
          <li @click="navigate('usuarios')" :class="{ active: isActive('usuarios') }">Usuarios</li>
          <li @click="navigate('multimedia')" :class="{ active: isActive('multimedia') }">Multimedia</li>
          <li @click="navigate('licencias')" :class="{ active: isActive('licencias') }">Licencias</li>
        </ul>
      </div>

      <!-- Main content -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('loggedIn')
      this.$router.push('/login')
    },
    navigate(view) {
      this.$router.push(`/dashboard/${view}`)
    },
    isActive(view) {
      return this.$route.path.includes(view)
    }
  }
}
</script>

<style scoped>
.dashboard {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  background-color: #1e1e1e;
  color: white;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2c3e50;
  color: white;
  padding: 15px 20px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.topbar button {
  background: #111;
  border: none;
  color: white;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
}

.topbar button:hover {
  background: #444;
}

.layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

.sidebar {
  width: 200px;
  background: #2c3e50;
  display: flex;
  flex-direction: column;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar li.active,
.sidebar li:hover {
  background: #1abc9c;
}

.content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}
</style>


