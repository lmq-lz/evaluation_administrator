import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Administrator from '../components/Administrator'
import Welcome from '../components/Welcome'
import Student from '../components/user/Student'
import Teachers from '../components/user/Teachers'
import Supervisor from '../components/user/Supervisor'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Course from '../components/class+course/Course'
import Class from '../components/class+course/Class'
import TeachingSituation from '../components/teachingSituation/teachingSituation'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/Administrator',
    component: Administrator,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
        // children: [
        //  { path: '/login', component: Login }
        // ]
      },
      { path: '/student', component: Student },
      { path: '/teachers', component: Teachers },
      { path: '/supervisor', component: Supervisor },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/course', component: Course },
      { path: '/class', component: Class },
      { path: '/teachingSituation', component: TeachingSituation }
    ]
    // meta:
    // {
    //  requiresAuth: true
    // }
  }
]

// 禁止在没有登录的情况下直接输入地址进行访问
// routes.beforeEach((to, from, next) => {
//   可以在路由元信息指定哪些页面需要登录权限
//   const islogin = false // 假设没有登录（这里应从接口获取）
//   if (to.meta.requiresAuth && !islogin) { // 需要登录授权，这里还需要判断是否登录
//     next('/login') // 跳转到登录
//     return
//   }
//   next()
// })

const router = new VueRouter({
  routes
})

// routes.addRoutes(router)

export default router
