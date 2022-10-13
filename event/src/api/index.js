// 封装的是具体的接口请求方法
// 注意：每个方法只负责请求一个url地址
import request from '../utils/request' //引入自定义axios函数
import store from '../store/index'


// 导出接口方法，为了在逻辑页面引入后调用
export const registerAPI = ({ username, password, repassword }) => {
    // 原地是一个Promise对象(内部包含原生ajax请求)
    // return这个Promise对象到逻辑页面，去那边对Promise对象提取结果
    return request({
        url: '/api/reg',
        method: 'POST',
        data: {
            username,
            password,
            repassword
        }
    })
}

/**
 * 登录接口
 * @param {*} param0 {username:用户名.password:密码}
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
    return request({
        url: '/api/login',
        method: 'POST',
        data: {
            username,
            password
        }
    })
}

export const getUserInfoAPI = ({}) => {
    return request({
        url: '/my/userinfo',
        // method默认不写就是get方式请求
        method: 'PUT',
        // 传参给后台：params（查询字符串query），data（请求体），headers（请求头）
        headers: {
            Authorization: store.state.token
        }
    })
}