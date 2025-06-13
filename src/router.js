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
import LogView from './views/LogView.vue'

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
      { path: 'licencias', component: LicenciasView },
      { path: 'usuarios', component: UsuariosView },
      { path: 'configuracion', component: ConfiguracionView },
      { path: 'log', component: LogView }, 
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔐 Protección de rutas
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true'
  const rol = localStorage.getItem('rol') || 'consulta'

  if (to.path.startsWith('/dashboard') && !loggedIn) {
    return next('/login')
  }

  // Rutas restringidas a admin
  const soloAdmin = [
    '/dashboard/licencias',
    '/dashboard/usuarios',
    '/dashboard/log' // 👈 agregamos aquí la vista de logs
  ]

  if (soloAdmin.includes(to.path.toLowerCase()) && rol !== 'admin') {
    alert('🔒 Acceso restringido a administradores')
    return next('/dashboard/inicio')
  }

  next()
})

export default router
