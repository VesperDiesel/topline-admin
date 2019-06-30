import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
import { getUser } from '@/utils/auth'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'layout',
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article',
          path: '/article',
          component: () => import('@/views/article')
        },
        {
          name: 'publish-edit',
          path: '/publish/:id',
          component: () => import('@/views/publish')
        },
        {
          name: 'comment',
          path: '/comment',
          component: () => import('@/views/comment')
        },
        {
          name: 'account',
          path: '/account',
          component: () => import('@/views/account')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
router.beforeEach((to, from, next) => {
  // 路由导航前，开启进度条
  nprogress.start()
  const userInfo = getUser()
  if (to.path !== '/login') {
    // 非登录页面
    // 如果没有登录，跳转到登陆页面，登录了，允许通过
    if (!userInfo) {
      if (from.path === '/login') {
        nprogress.done()
      }
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    // 登录页面，没登录，允许访问，登录了，不能跳到登录页面
    if (!userInfo) {
      next()
    } else {
      next({ name: 'home' })
      window.location.reload()
    }
  }
})
router.afterEach((to, from) => {
  // 路由导航完成，结束进度条
  nprogress.done()
})
export default router
