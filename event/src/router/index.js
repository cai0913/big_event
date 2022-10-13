import Vue from 'vue'
import VueRouter from 'vue-router'
import '../assets/global.less'
import { Aside, Button, Container, Footer, Form, FormItem, Header, Input, Link, Main, Menu, MenuItem, Message, MessageBox, Submenu } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import register from '../view/register/register.vue'
import login from '../view/login/Login.vue'
import layout from '../view/layout/index.vue'
import store from '@/store';
Vue.use(VueRouter)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Link)
Vue.use(Container)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

const routes = [{
        path: '/',
        component: layout,
        name: 'layout'
    },
    {
        path: '/reg',
        component: register,
        name: 'register'
    },
    {
        path: '/login',
        // component: () => ('@/view/login/Login.vue'),
        component: login,
        name: 'login'
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    const token = store.state.token
    if (token && !store.state.userinfo.username) {
        // store.state.userinfo.username为了防止vuex里已经有数据
        store.dispatch('getUserInfoActions')
    }
    next()
})

export default router