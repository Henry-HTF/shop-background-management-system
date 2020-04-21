import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/common/Login.vue'
import Home from '../views/home/Home.vue'
import Welcome from '../views/home/childComps/Welcome.vue'
import Users from '../views/home/childComps/Users.vue'

Vue.use(VueRouter)

const routes = [{
    path: '',
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
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取taken
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router