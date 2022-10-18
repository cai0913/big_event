<template>
    <div>
        <!-- 内容区域 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                    <span>文章列表</span>
            </div>
            <!-- 搜索区域 -->
            <div class="search-box">
                <el-form :inline="true" :model="q">
                <el-form-item label="文章列表">
                    <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布状态" style="margin-left: 15px;">
                    <el-select v-model="q.state" placeholder="请选择状态" size="small">
                        <el-option label="已发布" value="已发布"></el-option>
                        <el-option label="未发布" value="草稿"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small">筛选</el-button>
                    <el-button type="info" size="small">重置</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
            </div>
        </el-card>

        <!-- 发表文章的 Dialog 对话框 -->
        <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose">
        <span>这是一段信息</span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'ArtList',
    data(){
        return{
            q:{
                pagenum:1,
                pagesize:2,
                cate_id:'',
                state:''
            },
            pubDialogVisible:false //控制发布文章对话框出现/隐藏(true/false)
        }
    },
    methods:{
        // 发表文章按钮点击事件->让对话框出现
        showPubDialogFn(){
            this.pubDialogVisible = true
        },
        // 发表文章-> 对话框-关闭前的回调
        // 注意：只有dialog自带的点右上角的x，和按下esc按键，和点击半透明蒙层关闭才会走这里
        async handleClose(done){ //done的作用：调用才会放行让对话框关闭
            const confirmResult = await this.$confirm('此操作将导致文章信息丢失，是否继续？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            }).catch(err => err) //捕获确认框Promise对象里选择取消时，拒绝状态结果'cancel'字符串
            // $confirm内部虽然是一个确认提示框，但是它借用了Promise语法来管理，点击确定他的状态为兑现成功状态返回'confirm',如果用户点击了取消按钮，此Promise对象状态为拒绝状态，返回'cancel'字符串

            // 知识点：
            // 1.await只能用在async修饰的函数内
            // async修饰：就是当前函数名左边加async关键字，如果没有函数名，在形参的左边加async
            // 原因：async修饰的函数就是异步函数，如果此函数被调用，总是返回一个全新Promise对象，而且本次函数调用因为是异步函数，所以外面的同步代码继续执行，而await暂停代码只能暂停async函数内的，等待await后面异步结果
            // 2.await只能拿到成功的结果并放行往下走，如果失败内部会向浏览器控制台抛出错误并不会让await往下走代码
            // 3.await后面的Promise对象的拒绝状态（错误）如何捕获呢？
            // 方法1：try{} catch(err){}
            // 方法2：Promise对象的链式调用，而且在catch里return的非Promise拒绝状态的对象值，都会当作成功的结果返回给原地的Promise对象结果

            // 取消了关闭-阻止住，什么都不干，对话框不能关闭，提前return不让下面的done执行
            if(confirmResult==='cancel') return
            // 确认关闭
            done()
        },

    }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
</style>