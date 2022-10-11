import Vue from 'vue'
import VueRouter from 'vue-router'
import '../assets/global.less'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueRouter)

const routes = []

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router