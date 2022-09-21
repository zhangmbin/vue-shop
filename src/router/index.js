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
import List from '@/components/Goods/List';
import Add from '@/components/Goods/Add';
import Order from '@/components/Order/Order';
import Report from '@/components/Report/Report';
import alarmStatus from '@/components/alarm/alarmStatus';
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
      }, {
        path: '/goods',
        component: List,
      }, {
        path: '/goods/add',
        component: Add
      }, {
        path: '/orders',
        component: Order
      }, {
        path: '/reports',
        component: Report
      },
      {
        path:'alarm',
        component:alarmStatus
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