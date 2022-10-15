<template>
    <el-container class="main-container">
      <!-- 头部区域 -->
      <el-header>
        <!-- 左侧的 logo -->
        <img src="../../assets/images/logo.png" alt="" />
        <!-- 右侧的菜单 -->
        <el-menu
          class="el-menu-top"
          mode="horizontal"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <el-submenu index="1">
            <template slot="title">
              <!-- 头像 -->
              <img src="../../assets/images/logo.png" alt="" class="avatar" />
              <span>个人中心</span>
            </template>
            <el-menu-item index="1-1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
            <el-menu-item index="1-2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
            <el-menu-item index="1-3"><i class="el-icon-key"></i>重置密码</el-menu-item>
          </el-submenu>
          <el-menu-item index="2" @click="logoutFn"><i class="el-icon-switch-button"></i>退出</el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <!-- 侧边栏区域 -->
        <el-aside width="200px">
          <!-- 侧边栏-用户信息区域 -->
          <div class="user-box">
            <img :src="user_pic" alt="" v-if="user_pic" />
            <img src="../../assets/images/logo.png" alt="" v-else />
            <span>欢迎 {{ nickname || username }}</span>
          </div>
           <!-- 左侧导航菜单
            default-active:当前激活的菜单的index（el-submenu/el-menu-item的index的值），对应菜单就有激活样式
            @open:sub-menu展开的回调
            @close:sub-menu关闭的回调
            active-text-color:激活时的文字颜色，哪项index的值和default-active一致，就会被设置为动态文字颜色
            el-menu-item-group分组，可以在第一行显示title组名
            router:设置上（默认值为true）,就会当你点击某行菜单时，以index的值作为路由切换

            子标签：
            如果有嵌套，先写el-submenu（里面嵌套template#title的设置当前展示内容，子用el-menu-item显示）
            如果无嵌套，直接写el-menu-item
          -->
        <el-menu
          default-active="/home"
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
        >
        <template v-for="item in menus">
          <!-- 不包含子菜单的“一级菜单” -->
          <el-menu-item :index="item.indexPath" :key="item.indexPath" v-if="!item.children">
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </el-menu-item>
          <!-- 包含子菜单的“文章管理” -->
          <el-submenu :index="item.indexPath" :key="item.indexPath" v-else>
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item v-for="obj,index in item.children" :index="obj.indexPath" :key="index">
            <i :class="obj.icon"></i>
            <span>{{obj.title}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
        </el-menu>
        </el-aside>
        <el-container>
          <!-- 页面主体区域 -->
          <el-main>
            <!-- 二级路由的挂载点 -->
            <router-view></router-view>
          </el-main>
          <!-- 底部 footer 区域 -->
          <el-footer>© www.itheima.com - 黑马程序员</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </template>
  
  <script>
  import {mapGetters} from 'vuex'
  import {getMenusListAPI} from '@/api'
  export default {
    name: 'my-layout',
    data(){
      return{
        menus:[]//保存请求过来的侧边栏的数据
      }
    },
    computed:{
      ...mapGetters(['nickname', 'username', 'user_pic'])
    },
    created(){
      //请求侧边栏的数据
      this.getMenusListFn()
    },
    methods: {
        logoutFn () {
        // 询问用户是否退出登录
        this.$confirm('您确认退出登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            // TODO：执行退出登录的操作
            // 1. 清空 token
            this.$store.commit('updateToken', '')
            // 2. 跳转到登录页面
            this.$router.push('/login')
        }).catch((err) => err)
        },
        async getMenusListFn(){
          const res = await getMenusListAPI()
          this.menus = res.data.data
        }
    },
  }
  </script>
  
  <style lang="less" scoped>
  .main-container {
    height: 100%;
    .el-header,
    .el-aside {
      background-color: #23262e;
    }
    .el-header {
      padding: 0;
      display: flex;
      justify-content: space-between;
    }
    .el-main {
      overflow-y: scroll;
      height: 0;
      background-color: #F2F2F2;
    }
    .el-footer {
      background-color: #eee;
      font-size: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  
  .avatar {
    border-radius: 50%;
    width: 35px;
    height: 35px;
    background-color: #fff;
    margin-right: 10px;
    object-fit: cover;
  }

  // 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}

// 侧边栏菜单的样式
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
  </style>