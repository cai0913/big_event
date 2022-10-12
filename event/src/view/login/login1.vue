<template>
    <!-- 登录页面整体的盒子 -->
  <div class="login_container">
    <!-- 登录的盒子 -->
    <div class="login-box">
        <!-- 标题的盒子 -->
        <div class="title-box">
            <!-- 登录表单区域 -->
            <el-form :model="loginForm" :rules="loginRules" ref="loginRef">
                <!-- 用户名 -->
                <el-form-item placeholder="请输入用户名" prop="username">
                    <el-input v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item placeholder="请输入密码" prop="password">
                    <el-input v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <button type="primary" class="btn-login">登录</button>
                    <el-link type="info">去注册</el-link>
                </el-form-item>
            </el-form>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name:'login',
    data(){
        return{
            loginForm:{
                username:'',
                password:''
            },
            loginRules:{
                username:[
                    {required:true,message:'请输入用户名',triggle:'blur'},
                    {pattern:/^[a-zA-Z0-9]{1,10}$/,message:'用户名必须是1-10的字母数字', trigger: 'blur'}
                ],
                password:[
                    {required:true,message:'请输入密码',triggle:'blur'},
                    {pattern:/^\S{6,15}$/,message: '密码必须是6-15的非空字符', trigger: 'blur' }
                ]
            }
        }
    }
}
</script>

<style lang="less" scoped>
.login-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .login-box {
    width: 25rem;
    height: 16.875rem;
    background-color: #fff;
    border-radius: .1875rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 1.875rem;
    box-sizing: border-box;

    .title-box {
      height: 3.75rem;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>