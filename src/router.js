import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import InicioView from './views/InicioView.vue'
import TunelesView from './views/TunelesView.vue'
import ArchivosView from './views/ArchivosView.vue'
import ClientesView from './views/ClientesView.vue' 
import BancoPssView from './views/BancoPssView.vue'
import LicenciasView from './views/LicenciasView.vue'
import UsuariosView from './views/UsuariosView.vue'
import ConfiguracionView from './views/ConfiguracionView.vue'




const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: 'inicio' },
      { path: 'inicio', component: InicioView },
      { path: 'tuneles', component: TunelesView }, 
      { path: 'multimedia', component: ArchivosView },
      { path: 'clientes', component: ClientesView },
      { path: 'banco_pss', component: BancoPssView },
      { path: 'Licencias', component: LicenciasView },
      { path: 'Usuarios', component: UsuariosView },
      { path: 'Configuracion', component: ConfiguracionView },

      // puedes agregar más aquí
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔒 Protección de rutas: requiere estar logueado
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true'

  if (to.path.startsWith('/dashboard') && !loggedIn) {
    next('/login') // redirige al login si no está autenticado
  } else {
    next() // permite la navegación
  }
})

export default router
