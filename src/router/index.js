import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import BuryDataTest1 from '../components/BuryDataTest1'

import Administrator from '../components/Administrator'
import Welcome from '../components/Welcome'
import Student from '../components/user/Student'
import StudentInfo from '../components/info/StudentInfo'
import Teachers from '../components/user/Teachers'
import Supervisor from '../components/user/Supervisor'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Course from '../components/class+course/Course'
import Class from '../components/class+course/Class'
import ClassCourseInfo from '../components/info/ClassCourseInfo'
import CourseTeacherInfo from '../components/info/CourseTeacherInfo'
import TeachingSituation from '../components/teachingSituation/teachingSituation'

//密码相关页面
import ChangePwd from '../components/pwd/ChangePwd.vue'
import ForgetPwd from '../components/pwd/ForgetPwd.vue'
//查看评价详情页面
import TeacherCourseCheck from '../components/teachingSituation/TeacherCourseCheck.vue'
//查看埋点数据
import ShowBurailData from '../components/showData/ShowBurailData'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/buryDataTest1', name: 'buryDataTest1', component: BuryDataTest1 },
  //初始化密码 (忘记密码)页面
  { path: '/initpwd', component: ForgetPwd },
  {
    path: '/Administrator',
    component: Administrator,
    redirect: '/student',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      { path: '/student',
        component: Student
      },
      { path: '/studentInfo', name: 'studentInfo', component: StudentInfo },
      { path: '/classCourseInfo', name: 'classCourseInfo', component: ClassCourseInfo },
      { path: '/courseTeacherInfo', name: 'courseTeacherInfo', component: CourseTeacherInfo },
      { path: '/teachers', component: Teachers },
      { path: '/supervisor', component: Supervisor },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/course', component: Course },
      { path: '/class', component: Class },
      { path: '/teachingSituation', component: TeachingSituation },
      { path: '/teacherCourseCheck', component: TeacherCourseCheck},
      //修改密码页面
      { path: '/changepwd', component: ChangePwd},
      //展示埋点数据页面
      { path: '/showBurailData',name: 'showBurailData', component: ShowBurailData}
    ]
    // meta:
    // {
    //  requiresAuth: true
    // }
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
	// to 将要访问的路径
	// from 从哪个路径跳转而来
	// next 是一个函数，表示放行 next()放行、next('/login') 强制跳转
	if (to.path === '/login' || to.path === '/initpwd' || to.path === '/roleerr') return next() // 登录页直接放行
	// 获取token
	const tokenStr = window.sessionStorage.getItem('token')
	if (!tokenStr) return next('/login')

	//不同角色访问守卫
	const role_id = window.sessionStorage.getItem('role_id')
	if(role_id !== '1'){
    return next('/login')
  }
	next()
})
// routes.addRoutes(router)

export default router
