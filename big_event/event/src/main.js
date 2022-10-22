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

// 后端返回图片链接地址的经验：
// 后端为何返回图片链接地址是半截的？
// 原因，因为服务器的域名可能会来回变化，所以数据库里只有相对路径
// 要求：前端请求此图片时，后端会告诉你图片文件真身所在的服务器域名，前端自己拼接前缀

// 积累知识：
// 组件创建时，会用data里的默认值，让template里标签先渲染一次
// 你的网络请求数据回来，data里变量发生了变化，会让template里使用此变量的地方再次更新dom
// 小问题：第一次渲染的时候无值可能会导致一些报错，但是效果还是出来了
// 解决1：v-if先不让template里会报错的哪个代码先屏蔽执行
// 解决2：可以先给哪个对象属性一个空字符串，别让报错就行

// 打包相关问题：
// 1.默认打包，index.html引入其他打包文件使用的是绝对地址
// 地址是以/开头（要找到当前index.html打开时所在服务器的根地址（文件夹））
// 就得确保你的vscode+liserver插件打开时，vscode根目录得直接是dist文件夹
// 你如果把dist文件夹交给后台运维工程师部署到服务器上，dist下内容就得在服务器根目录才行
// 但是服务器一般会有多个项目，不让你用根目录直接放一个项目，很乱
// 解决：webpack让你写一个配置项publicPath（控制index.html引入其他资源前缀地址）
// vue.config.js(脚手架配置文件，也是webpac配置文件)
// publicPath：默认值'/'确保开发环境下，是这个值，因为开发服务器会把所有打包在内存里而且作为服务器的根目录文件夹
// 生产环境上线了，这个时候，就得用相对地址，publicPath:'./'
// 路径不以'/'开头，默认就是相对路径