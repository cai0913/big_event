import request from '@/utils/request'

/**
 * 注册接口
 * @param {*} param0 { username: 用户名, password: 密码 }
 * @returns Promise对象
 */
export const registerAPI = ({ username, password, repassword }) => {
    return request({
        url: '/api/reg',
        method: 'post',
        data: {
            username,
            password,
            repassword
        }
    })
}

/**
 * 登录接口
 * @param {*} param0 { username: 用户名, password: 密码 }
 * @returns Promise对象
 */
export const loginAPI = ({ username, password }) => {
    return request({
        url: '/api/login',
        method: 'post',
        data: {
            username,
            password
        }
    })
}

/**
 * 获取-用户信息
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
    return request({
        url: '/my/userinfo',
    })
}


/**
 * 获取侧边栏数据
 * @returns Promise对象
 */
export const getMenusListAPI = () => {
    return request({
        url: '/my/menus',
    })
}


/**
 * 更新基本资料
 * @param {id,username,nickname,email,user_pic} param0 //id，用户名，用户昵称，邮箱，头像
 * @returns 
 */
export const updateUserInfoAPI = ({ id, username, nickname, email, user_pic }) => {
    return request({
        url: '/my/userinfo',
        method: 'PUT',
        data: {
            id,
            username,
            nickname,
            email,
            user_pic
        }
    })
}


/**
 * 
 * @param {*} avatar 头像图片base64字符串
 * @returns Promise对象
 */
export const updateUserAvatarAPI = (avatar => {
    return request({
        url: '/my/update/avatar',
        method: 'PATCH',
        data: {
            avatar //头像base64字符串
        }

    })
})