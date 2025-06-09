import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 👈 Importa las rutas

import './style.css'

createApp(App)
  .use(router) // 👈 Usa el router
  .mount('#app')
