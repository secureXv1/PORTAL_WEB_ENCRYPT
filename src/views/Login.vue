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
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async login() {
      this.error = ''
      try {
        const res = await axios.post('http://symbolsaps.ddns.net:8000/api/auth/login', {
          username: this.username,
          password: this.password
        })

        if (res.data.success) {
          localStorage.setItem('loggedIn', 'true')
          localStorage.setItem('rol', res.data.rol)
          this.$router.push('/dashboard/inicio')
        } else {
          this.error = res.data.error || 'Credenciales incorrectas'
        }
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al conectar con el servidor'
      }
    }
  }
}
</script>

