<template>
    <div>
      <!-- 预览文章分类 -->
      <el-card class="box-card">
        <div slot="header" class="clearfix header-box">
          <span>文章分类</span>
          <el-button type="primary" size="mini" @click="addCateShowDialogFn">添加分类</el-button>
        </div>
        <!-- 分类数据的表格 -->
        <el-table :data="cateList" style="width: 100%" border stripe>
          <!-- type是table-column内置属性，告诉他用index，意思就是第一个单元格用索引值 -->
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <!-- scope对象：｛row：行对象｝ -->
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="updateCateBtnFn(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="delCateFn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-card>
      <!-- 添加文章分类的对话框 -->
      <el-dialog :title="isEdit ? '编辑文章分类':'添加文章分类'" :visible.sync="dialogFormVisible" width="30%" @close="dialogCloseFn">
        <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
          <el-form-item label="分类名称" prop="cate_name">
            <el-input v-model="addForm.cate_name"></el-input>
          </el-form-item>
          <el-form-item label="分类别名" prop="cate_alias">
            <el-input v-model="addForm.cate_alias" ></el-input>
          </el-form-item>
        </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="concelFn">取 消</el-button>
    <el-button type="primary" @click="confirmFn">确 定</el-button>
  </div>
      </el-dialog>

    </div>
  </template>
  
  
  <script>
  // 经验：如果用同一个按钮，想要做状态区分
  // 1.定义一个标记变量isEdit（true编辑，false新增），还要定义本次要编辑的数据唯一id值，editId
  // 2.在点击修改时，isEdit改为true，editId保存要修改的数据id
  // 3.在点击新增按钮时，isEdit改为false，editId置空
  // 4.在点击保存按钮时（确定按钮时），就可以用isEdit变量区分了
  import {getArtCateListAPI,addArtCateAPI,updateArtCateAPI,deleteArtCateAPI} from '@/api'
  export default {
    name: 'ArtCate',
    data(){
      return{
        cateList:[], //文章分类数组
        dialogFormVisible : false, //增加文章分类对话框-出现(true)/隐藏(false)
        addForm:{
          cate_name:'',
          cate_alias:''
        },
        addRules:{
          cate_name:[
            {required:true,message:'请输入分类名称',triggle:'blur'},
            {min:1,max:10, pattern:/^\S{1,10}$/,message:'分类名称必须是1~10位的非空字符串'}
          ],
          cate_alias:[
            {required:true,message:'请输入分类别名',triggle:'blur'},
            {min:1,max:15,pattern:/^[a-zA-Z0-9]{1,15}$/,message:'分类别名必须是1~15位的字母数字',triggle:'blur'}
          ]
        },
        isEdit:false, //true为编辑状态，false为新增状态
        editId:'' //保存正在要编辑的数据id值
      }
    },
    methods:{
      // 获取文章分类列表
      async getArtCateFn(){
        // const {data:res} = await getArtCateListAPI()
        const res = await getArtCateListAPI()
        this.cateList = res.data.data
      },
      // // 添加分类按钮点击事件->为了让对话框出现
      addCateShowDialogFn(){
        this.isEdit = false //变回新增状态标记
        this.editId = ''
        this.dialogFormVisible = true
      },
      // // 对话框取消按钮->点击事件
      concelFn(){
        this.dialogFormVisible = false
      },
      // 对话框确定按钮点击事件->让对话框消失/调用保存分类文章分类接口
       confirmFn(){
        this.$refs.addRef.validate(async valid => {
          if(valid){
            // 通过校验
            if(this.editId){
              // 要修改
              this.addForm.id = this.editId //把要编辑的文章分类id添加到对象身上
              // const {data:res} = await updateArtCateAPI(this.addForm)
              // 把this.editId添加到新对象形成新属性id,再结构addForm获取到其中的属性也添加到该新对象上
              const {data:res} = await updateArtCateAPI({id:this.editId, ...this.addForm})
              if(res.code!==0) return this.$message.error(res.message)
              this.$message.success(res.message)
            }else{
              // 要新增
              const {data:res} = await addArtCateAPI(this.addForm)
              if(res.code!==0) return this.$message.error(res.message)
              this.$message.success(res.message)
            }
            this.getArtCateFn()
            this.dialogFormVisible = false
          }else{
            return false
          }
        })
      },
      // 对话框-关闭时的回调
      dialogCloseFn(){
        this.$refs.addRef.resetFields()
      },
    //   // 修改分类按钮->点击事件(先做数据的回显)
      updateCateBtnFn(obj){
        // obj的值：｛id：文章分类id，cate_name：文章分类名字，cate_alias：文章分类别名｝
        this.isEdit = true
        this.editId = obj.id
        this.dialogFormVisible = true

        // 让el-dialog第一次挂载el-form时，先用addForm空字符串初始值绑定到内部，后续用作resetFields重置
        // 所以让真实DOM先创建并在内部绑定好“复制”好的初始值

        // 接着我们真实DOM更新后绑定好了，咱们再给数据回显
        // 注意：我们给v-model对象赋值只是影响当前显示的值，不会影响到resetFields复制的初始值
        this.$nextTick(()=>{
            // 数据回显（回填）
            this.addForm.cate_name = obj.cate_name
            this.addForm.cate_alias = obj.cate_alias
        })
    },
    // 删除分类按钮->点击事件
    async delCateFn(obj){
      // obj:{id,cate_name,cate_alias}
      const {data:res} = await deleteArtCateAPI(obj.id)
      if(res.code!==0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 删除后，再调用方法去后台获取最新的数据列表
      this.getArtCateFn()
    }
  },
  created(){
        this.getArtCateFn()
      },

  }

  // 小bug：（el-form和el-dialog和数据回显 同时用，有bug）
  // 复现：第一次打开网页，先点击修改，再点击新增，发现输入框竟然有值
  // 原因：点击修改后，关闭对话框时，置空失效了
  // 具体分析：主人公resetFields()有问题
  // 线索：dialog的内容是懒渲染的，即在第一次被打开前，传入的默认slot不会被渲染到dom上，第二次后续只是做css隐藏和显示
  // 线索：vue数据改变（先执行同步所有）再去更新DOM（异步代码）
  // 无问题：第一次打开网页，先点击新增按钮 -> dialog出现 -> el-form组件第一次挂载（关联的addForm对象的属性的值为空字符串） el-form组件内绑定了初始值，所以后续调用resetFields的时候，他可以用到空字符串初始值来重置

  // 有问题：第一次打开网页，先点击修改按钮 -> 虽然dialog变量为true了但是同步代码把addForm对象里赋值了（默认值）-> DOM更新异步 -> dialog出现 -> el-form组件第一次挂载(使用addForm内置做回显然后第一次el-form内绑定了初始值（有值）) -> 以后做重置，他就用绑定的带值的做重置
  
  // 解决
  </script>
  
  <style lang="less" scoped>
  .header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  </style>