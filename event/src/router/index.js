import Vue from 'vue'
import VueRouter from 'vue-router'
import '../assets/global.less'
import { Button, Form, FormItem, Input, Link, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import register from '../view/register/register.vue'
import login from '../view/login/Login.vue'
Vue.use(VueRouter)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Link)
Vue.prototype.$message = Message

const routes = [{
        path: '/',
        redirect: '/log'
    },
    {
        path: '/reg',
        component: register,
        name: 'register'
    },
    {
        path: '/log',
        // component: () => ('@/view/login/Login.vue'),
        component: login,
        name: 'login'
    }
]

const router = new VueRouter({
    routes
})

export default router