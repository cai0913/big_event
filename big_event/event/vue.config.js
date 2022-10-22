const { defineConfig } = require('@vue/cli-service')
    // 需要排除的包对象
let externals = {}
    // 需要配置CDN链接
let CDN = { css: [], js: [] }
    // 判断是否是生产环境
const isProduction = process.env.NODE_ENV === 'production'
    // 如何是生产环境，需要执行以下逻辑
if (isProduction) {
    externals = {
            /**
             * externals 对象属性解析：
             * '包名': '在项目中引入的名字'
             * 以 element-ui 举例 我再 main.js 里是以
             * import ELEMENT from 'element-ui'
             * Vue.use(ELEMENT)
             * 这样引入的，所以我的 externals 的属性值应该是 ELEMENT
             * 一定要去main.js设置
             */
            'echarts': 'echarts',
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'dayjs': 'dayjs',
            'element-ui': 'ELEMENT',
            'vue-quill-editor': 'VueQuillEditor',
            'vuex-persistedstate': 'createPersistedState'
        },
        CDN = {
            css: [
                'https://unpkg.com/element-ui@2.15.8/lib/theme-chalk/index.css',
                'https://unpkg.com/quill@1.3.7/dist/quill.core.css"',
                'https://unpkg.com/quill@1.3.7/dist/quill.snow.css',
                'https://unpkg.com/quill@1.3.7/dist/quill.bubble.css'
            ],
            js: [
                'https://unpkg.com/echarts@5.3.2/dist/echarts.min.js',
                'https://unpkg.com/vue@2.6.14/dist/vue.js',
                'https://unpkg.com/vue-router@3.5.1/dist/vue-router.js',
                'https://unpkg.com/vuex@3.6.2/dist/vuex.js',
                'https://unpkg.com/axios@0.27.2/dist/axios.min.js',
                'https://unpkg.com/dayjs@1.11.3/dayjs.min.js',
                'https://unpkg.com/element-ui@2.15.8/lib/index.js',
                'https://unpkg.com/quill@1.3.7/dist/quill.js',
                'https://unpkg.com/vue-quill-editor@3.0.6/dist/vue-quill-editor.js',
                'https://unpkg.com/vuex-persistedstate@3.2.1/dist/vuex-persistedstate.umd.js'
            ]
        }
}
module.exports = defineConfig({
    transpileDependencies: true,
    // 影响打包时，index.html引入其他资源的前缀地址
    // ./可以让开发环境和生产环境都可以正常使用
    // 为了严谨一些
    // 开发环境：'/'
    // 生产环境：'./'
    // 问题：有无代码可以让脚手架自己识别当前运行环境？
    // node里有个内置的环境变量process.env.NODE_ENV
    // process.env.NODE_ENV他会根据你敲击的命令，来使用不同的值
    // 解决：
    // 如果你敲击npm run serve，process.env.NODE_ENV的值就是'development'字符串
    // 如果你敲击npm run build，process.env.NODE_ENV的值就是'production'字符串
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        // name: name,
        externals: externals,
        // resolve: {
        //   alias: {
        //     '@': resolve('src')
        //   }
        // }
    },
    chainWebpack(config) {
        // 注入cdn变量（打包时会执行）
        config.plugin('html').tap(args => {
            // 参数对象添加属性叫cdn，值就是上面CDN对象
            args[0].cdn = CDN //配置cdn给插件
            return args
        })
    }

})

// 我们虽然排除了第三方包
// 打包dist和开发环境都会使用这套配置，并排除掉第三方
// 生产环境，打包时会以public/index.html作为模版生成dist/index.html，index.html中就有了哪些cdn链接地址
// 开发环境，public/index.html，也有了哪些第三方的cdn地址，所以也能正常运行
// 但是第一次的速度有点慢，所以开发环境还是想用webpack引入本地下的node_modules哪些第三方包
// process.env.NODE_ENV 可以根据敲击的命令不同，值也不同，能够一个代码区分不同环境