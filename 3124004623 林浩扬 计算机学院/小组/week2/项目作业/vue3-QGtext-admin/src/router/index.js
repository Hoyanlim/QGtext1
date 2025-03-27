import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login', component: () => import('@/views/login/loginPage.vue'),//登录页
    },
    {
      path: '/', component: () => import('@/views/layout/layoutPage.vue'),//首页
    }
  ],
})

//登录访问拦截
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') {
    next('/login') // 未登录时重定向到登录页
  } else if (userStore.token && to.path === '/login') {
    next('/') // 已登录时避免进入登录页
  } else {
    next() // 正常放行
  }
})
export default router
