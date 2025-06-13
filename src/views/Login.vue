<template>
  <div class="login-container">
    <div class="login-box">
      <img class="logo" src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" />
      <h2>Ingresar al portal</h2>
      <form @submit.prevent="login">
        <input type="text" v-model="username" placeholder="Usuario" />
        <input type="password" v-model="password" placeholder="Contraseña" />
        <button type="submit">Entrar</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
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
          localStorage.setItem('username', res.data.username)
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

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Fondo con degradado */
  background: linear-gradient(to bottom right, #0f2027, #203a43, #2c5364);
}

.login-box {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
  color: white;
}

.logo {
  width: 80px;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

/* Animación suave tipo zoom */
@keyframes pulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
}

input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #ffffff22;
  color: white;
  font-size: 16px;
}

input::placeholder {
  color: #ccc;
}

button {
  background-color: #00bcd4;
  color: white;
  border: none;
  padding: 12px 24px;
  margin-top: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0097a7;
}

.error {
  color: #ff6b6b;
  margin-top: 12px;
}
</style>

