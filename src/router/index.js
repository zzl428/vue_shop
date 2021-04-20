import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('views/login/Login.vue')
const Register = () => import('views/register/Register.vue')
const Home = () => import('views/home/Home.vue')

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/home', component: Home },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //to and from are Route Object,next() must be called to resolve the hook
  // 若跳转到登录或注册界面，直接放行，若到其他页面，先验证token
  if (to.path === '/login' || to.path == '/register') {
    return next()
  } else if (!window.sessionStorage.getItem('token')) {
    return next('/login')
  }
  next()
})

export default router
