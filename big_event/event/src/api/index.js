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


/**
 * 更新用户密码
 * @param {*} param0 old_pwd:原密码 new_pwd：新密码 re_pwd：确认密码
 * @returns Promise对象
 */
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
    return request({
        url: '/my/updatepwd',
        method: 'PATCH',
        data: {
            old_pwd,
            new_pwd,
            re_pwd
        }
    })
}

/**
 * 获取文章分类
 * @returns Promise对象
 */
export const getArtCateListAPI = () => {
    return request({
        url: '/my/cate/list',
    })
}


/**
 * 增加文章分类
 * @param {*} param0 ｛cate_name:分类名称，cate_alias:分类别名｝ 
 * @returns Promise对象
 */
export const addArtCateAPI = ({ cate_name, cate_alias }) => {
    return request({
        url: '/my/cate/add',
        method: 'POST',
        data: {
            cate_name,
            cate_alias
        }
    })
}

/**
 * 更新文章分类
 * @param {*} param0 ｛id：文章分类id，cate_name:分类名称，cate_alias:分类别名｝ 
 * @returns Promise对象
 */
export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
    return request({
        url: '/my/cate/info',
        method: 'PUT',
        data: {
            id,
            cate_name,
            cate_alias
        }
    })
}


/**
 * 删除文章分类
 * @param {*} param0 ｛id：文章分类id｝
 * @returns Promise对象
 */
export const deleteArtCateAPI = (id) => {
    return request({
        url: '/my/cate/del',
        method: 'DELETE',
        params: {
            id
        }
    })
}