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
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-card>
      <!-- 添加文章分类的对话框 -->
      <el-dialog title="添加文章分类" :visible.sync="dialogFormVisible" width="30%" @close="dialogCloseFn">
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
  import {getArtCateListAPI,addArtCateAPI} from '@/api'
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
        }
      }
    },
    methods:{
      // 获取文章分类列表
      async getArtCateFn(){
        // const {data:res} = await getArtCateListAPI()
        const res = await getArtCateListAPI()
        this.cateList = res.data.data
      },
      // 添加分类按钮点击事件->为了让对话框出现
      addCateShowDialogFn(){
        this.dialogFormVisible = true
      },
      // 对话框取消按钮->点击事件
      concelFn(){
        this.dialogFormVisible = false
      },
      // 对话框确定按钮点击事件->让对话框消失/调用保存分类文章分类接口
       confirmFn(){
        this.$refs.addRef.validate(async valid => {
          if(valid){
            const {data:res} = await addArtCateAPI(this.addForm)
            if(res.code!==0) return this.$message.error(res.message)
            this.$message.success(res.message)
            this.getArtCateFn()
          }else{
            return false
          }
        })
        this.dialogFormVisible = false
      },
      // 对话框-关闭时的回调
      dialogCloseFn(){
        this.$refs.addRef.resetFields()
      },
      // 修改分类按钮->点击事件(先做数据的回显)
      updateCateBtnFn(obj){
        // obj的值：｛id：文章分类id，cate_name：文章分类名字，cate_alias：文章分类别名｝
        this.dialogFormVisible = true
        // 数据回显（回填）
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      }
    },
    created(){
      this.getArtCateFn()
    }

  }
  </script>
  
  <style lang="less" scoped>
  .header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  </style>