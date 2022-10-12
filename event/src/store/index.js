import Vue from "vue";
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        token: '' //保存token字符串
    },
    mutations: {
        //保存token
        updateToken(state, val) {
            state.token = val
        }
    },
    plugins: [
        createPersistedState() //注入持久化插件
    ]
})


// vuex默认保存在内存中，所以刷新浏览器所有的值会回归初始化（无法做到持久存储）
// 借助npm i vuex-persistedstate@3.2.1这个包可以让vuex做持久化存储