import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/components/Login';
import Home from '@/components/Home';

import Welcome from '@/components/Welcome';
import Users from '@/components/User';
import Rights from '@/components/Power/Rights';
import Roles from '@/components/Power/Roles';
import Cate from '@/components/Goods/Cate';
import Params from '@/components/Goods/Params';
Vue.use(VueRouter)

const routes = [

  // 重定向到login
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      }
    ]
  },

]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to:将要访问的路劲； from：从哪个路径来； next：是一个函数，表示放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router