import { createRouter, createWebHistory } from 'vue-router'
import ResumeView from '@/views/ResumeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: ResumeView,
    },
    {
      path: '/src',
      name: 'src',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/resume',
      name: 'resume',
      component: ResumeView,
    }
  ],
})

export default router
