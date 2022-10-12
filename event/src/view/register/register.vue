<template>
  <!-- 整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
        <!-- 注册表单区域 -->
        <div class="title-box">
            <el-form ref="formRef" :model="form" label-width="0px" class="mt" :rules="rulesObj">
                <el-form-item prop="username">
                    <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input placeholder="请再次输入密码" v-model="form.repassword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="btn-reg" @click="registerFn">注册</el-button>
                    <el-button type="info" class="btn-reg" @click="resetFn">重置</el-button>
                    <el-link type="info" @click="$router.push('/log')">去登录</el-link>
                </el-form-item>
            </el-form>
        </div>
    </div>
  </div>
</template>

<script>
import {registerAPI} from '../../api/index'
export default {
    name:'Register',
    data(){
        // 必须在data函数里定义此箭头函数，才能确保this.form使用
        const samePwdFn = (rule,value,callback)=>{
            if(value!==this.form.password){
                // 如果验证失败，则调用回调函数时，指定一个Error对象
                callback(new Error('两次输入的密码不一样！'))
                // 如果验证成功，则直接调用callback回调函数即可
            }
            else{
                callback()
            }
        }
        return {
            form:{
                username:'',
                password:'',
                repassword:''
            },
            // 表单验证规则对象
            rulesObj:{
                username:[
                    {required:true,message:'请输入用户名', triggle:'blur'},
                    {pattern:/^[a-zA-Z{0-9}]{3,10}$/,message:'请输入大小写英文字母或数字，长度在3~10个字符之间',triggle:'bulr'}
                ],
                password:[
                    {required:true,message:'请输入密码', triggle:'blur'},
                    {pattern:/^\S{6,10}$/,message:'长度在6~10个字符之间的非空字符',triggle:'bulr'}
                ],
                repassword:[
                    {required:true,message:'请再次输入密码', triggle:'blur'},
                    {validator:samePwdFn,triggle:'blur'}
                ]
            }
        }
    },
    methods:{
        // 注册的点击事件
        registerFn(){
            // js兜底校验
            this.$refs.formRef.validate(async valid=>{
                if(valid){
                    // 通过校验
                    const {data:res} = await registerAPI(this.form)
                    if(res.code!==0) return this.$message.error(res.message)
                    this.$message.success(res.message)
                    this.$router.push('/login')
                }
                else{
                    return false //阻止默认提交行为(表单下面红色提示会自动出现)
                }
            })
        },
        resetFn(){
            this.$refs.formRef.resetFields()
        }
    }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }

    .btn-reg {
      width: 48%;
    }
  }
}

.mt{
    padding-top: 16%;
}
</style>