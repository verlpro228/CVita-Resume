import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/Main.vue'

const routes = [
  {
    path: '/',
    component: Main,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'templates',
        name: 'templates',
        component: () => import('@/views/Templates.vue')
      },
      {
        path: 'editor',
        name: 'editor',
        component: () => import('@/views/Editor.vue')
      },
      {
        path: 'preview',
        name: 'preview',
        component: () => import('@/views/Preview.vue')
      }
    ]
  },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/create',
    redirect: to => ({ path: '/editor', query: to.query })
  },
  {
    path: '/dashboard',
    redirect: '/editor'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
