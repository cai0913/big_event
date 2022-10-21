import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/elementUI'
import dayjs from 'dayjs'

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor) //此方法内会用Vue.component注册quillEditor名字全局组件

// 基于dayjs封装一个全局函数来格式化时间（任意的组件可以直接使用$formatDate）
Vue.prototype.$formatDate = (dateobj) => {
    // 借助dayjs内置的方法把日期对象格式化成指定的格式，并把格式化好的字符串返回到调用处
    return dayjs(dateobj).format('YYYY-MM-DD HH:mm:ss')
}

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')