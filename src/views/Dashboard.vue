<template>
  <div class="dashboard-wrapper">
    <div class="topbar">
      <div class="branding">
        <h1>Encrypt</h1>
        <p>Hola <strong>@user</strong></p>
      </div>
      <button class="logout" @click="logout">Cerrar sesión</button>
    </div>

    <div class="layout">
      <aside class="sidebar">
        <ul>
          <li v-for="item in menu" :key="item.label" :class="{ active: isActive(item.view) }" @click="navigate(item.view)">
            <span class="icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </aside>

      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [
        { view: 'inicio', label: 'Inicio', icon: '🏠' },
        { view: 'tuneles', label: 'Túneles', icon: '🛰️' },
        { view: 'multimedia', label: 'Archivos', icon: '🗂️' },
        { view: 'clientes', label: 'Clientes', icon: '👥' },
        { view: 'banco_pss', label: 'Banco pss', icon: '🔐' },
        { view: 'licencias', label: 'Licencias', icon: '📄' },
        { view: 'usuarios', label: 'Usuarios', icon: '👤' },
        { view: 'configuracion', label: 'Configuración', icon: '⚙️' }
      ]
    }
  },
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
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #0e0e0e;
  color: #fff;
  font-family: 'Segoe UI', sans-serif;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1f2c3a;
  padding: 10px 20px;
  color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.branding h1 {
  margin: 0;
  font-size: 20px;
}

.branding p {
  margin: 0;
  font-size: 12px;
  opacity: 0.7;
}

.logout {
  background: #000;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background-color: #1f2c3a;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

.sidebar ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar li {
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 4px solid transparent;
}

.sidebar li.active,
.sidebar li:hover {
  background-color: #2980b9;
  border-left: 4px solid #1abc9c;
}

.main-content {
  flex: 1;
  padding: 30px;
  background: #131313;
  overflow-y: auto;
}
</style>
