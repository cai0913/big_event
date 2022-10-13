import Vue from "vue";
import Vuex from 'vuex'
import { Getter } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '../api/index'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        token: '', //保存token字符串
        userinfo: {} //保存用户信息（id，username，nickname，email，user_pic）
    },
    getters: {
        nickname: state => state.userInfo.nickname, // 昵称
        username: state => state.userInfo.username, // 用户名
        user_pic: state => state.userInfo.user_pic // 用户头像
    },
    mutations: {
        //保存token
        updateToken(state, val) {
            state.token = val
        },
        // 保存用户信息
        updateUserInfo(state, val) {
            state.userinfo = val
        }
    },
    actions: {
        async getUserInfoActions(store) {
            const res = await getUserInfoAPI()
            store.commit('updateUserInfo', res.data.data)
            console.log(res);
        }
    },
    plugins: [
        createPersistedState() //注入持久化插件
    ]
})


// vuex默认保存在内存中，所以刷新浏览器所有的值会回归初始化（无法做到持久存储）
// 借助npm i vuex-persistedstate@3.2.1这个包可以让vuex做持久化存储