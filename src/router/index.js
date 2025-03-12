import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CorsoView from '@/views/DashboardCorsoView.vue'
//import GestioneCorsoView from '@/views/GestioneCorsoView.vue'
import DettaglioCorsoView from '@/views/DettaglioCorsoView.vue'
import ModificaCorsoView from '@/views/ModificaCorsoView.vue'
import EsameView from '@/views/EsameView.vue'
import UtenteView from '@/views/UtenteView.vue'
import ClasseView from '@/views/classe/ClasseView.vue'
import ClasseList from '@/components/classe/ClasseList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/corso',
      name: 'corso',
      component: CorsoView,
    },
    {
      path: '/corso/:id',
      name: 'dettagli-corso',
      component: DettaglioCorsoView,
    },
    {
      path: '/corso/:id/modifica',
      name: 'modifica-corso',
      component: ModificaCorsoView,
    },
    {
      path: '/esame',
      name: 'esame',
      component: EsameView,
    },
    {
      path: '/utente',
      name: 'utente',
      component: UtenteView,
    },
    {
      path: '/classe',
      name: 'classe',
      component: ClasseView,
    },
    {
      path: '/classeform',
      name: 'classeform',
      component: ClasseList,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
