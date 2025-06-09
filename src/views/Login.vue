<template>
  <div class="login">
    <h2>Ingresar al portal</h2>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="Usuario" />
      <input type="password" v-model="password" placeholder="Contraseña" />
      <button type="submit">Entrar</button>
      <p v-if="error" style="color:red;">{{ error }}</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    login() {
      if (this.username === 'admin' && this.password === 'admin123') {
        localStorage.setItem('loggedIn', 'true')
        this.$router.push('/dashboard/inicio')
      } else {
        this.error = 'Credenciales incorrectas'
      }
    }
  }
}
</script>
