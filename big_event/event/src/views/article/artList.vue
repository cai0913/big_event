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
                <el-form-item label="文章分类">
                    <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
                        <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布状态" style="margin-left: 15px;">
                    <el-select v-model="q.state" placeholder="请选择状态" size="small">
                        <el-option label="已发布" value="已发布"></el-option>
                        <el-option label="未发布" value="草稿"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="choseFn">筛选</el-button>
                    <el-button type="info" size="small" @click="resetFn">重置</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
            </div>

            <!-- 文章表格区域 -->
            <!-- 文章表格区域 -->
            <el-table :data="artList" style="width: 100%;" border stripe>
                <el-table-column label="文章标题" prop="title"></el-table-column>
                <el-table-column label="分类" prop="cate_name"></el-table-column>
                <el-table-column label="发表时间" prop="pub_date">
                    <template v-slot="scope">
                        <span>{{$formatDate(scope.row.pub_date)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="state"></el-table-column>
                <el-table-column label="操作"></el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
            @size-change="handleSizeChangeFn"
            @current-change="handleCurrentChangeFn"
            :current-page.sync="q.pagenum"
            :page-sizes="[2, 3, 5, 10]"
            :page-size.sync="q.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            >
            </el-pagination>
        </el-card>

        <!-- 发表文章的 Dialog 对话框 -->
        <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose">
            <!-- 发布文章的对话框 -->
        <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
            <el-form-item label="文章标题" prop="title">
                    <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="cate_id">
                <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
                    <!-- 因为整个表单要发给后台，去提前看眼vue代码里绑定的值需要什么，发现接口文档里需要分类的id -->
                    <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <quill-editor v-model="pubForm.content" @blur="contentChangeFn"></quill-editor>
            </el-form-item>
            <el-form-item label="文章封面" prop="cover_img">
                    <!-- 用来显示封面的图片 -->
                    <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
                    <br />
                    <!-- 文件选择框，默认被隐藏 -->
                    <input type="file" style="display: none;" accept="image/*" ref="iptFileRef" @change="changeCoverFn"/>
                    <!-- 选择封面的按钮 -->
                    <el-button type="text" @click="selCoverFn">+ 选择封面</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
                <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
            </el-form-item>
        </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {getArtCateListAPI,uploadArticleAPI,getArtListAPI} from '@/api'
// 标签和样式中，引入图片文件直接写“静态路径”（把路径放在js的vue变量里再赋予是不行的）
// 原因：webpack分析标签时，如果src的值是一个相对路径，他会去帮我们找到哪个路径的文件并一起打包，打包时，会分析文件的大小，小图转成base64字符串再赋予给src，如果是大图拷贝图片换个路径给img的src显示（运行中）

// Vue变量中路径，赋予给标签，都会当作普通的字符串使用
// 以前：我们写的路径是在vscode看着文件夹写的（以前好用的原因：用live server/磁盘双击打开，都能通过你的相对路径，在指定路径文件夹下，找到图片文件真身）
// 现在：写的模版代码，是要被webpack翻译处理转换的，你vscode里的代码，转换打包到内存中/dist下，相对路径就会变化，运行时，你写的固定路径字符串就找不到哪个文件真身了

// 注意：只有相对路径本地图片需要注意，如果是一个https://外链图片地址，就可以随便用
// 直接在标签里写也行，或者在js用变量保存后赋予给标签 都ok，因为运行时，浏览器发现src地址是外链就不找本地文件夹了
import imgObj from '../../assets/images/cover.jpg'
export default {
    name:'ArtList',
    data(){
        return{
            q:{
                pagenum:1, //默认拿第一页的数据
                pagesize:2, //默认当前页面需要几条数据（传递给后台，后台就返回几个数据）
                cate_id:'',
                state:''
            },
            pubDialogVisible:false, //控制发布文章对话框出现/隐藏(true/false)
            pubForm:{ //表单的数据对象
                title:'', //文章标题
                cate_id:'', //文章分类id
                content:'', //文章内容
                cover_img:'', //文章封面（保存的是个文件）
                state: '' // 文章的发布状态，可选值有两个：草稿、已发布
            },
            pubFormRules:{//验证规则对象
                title:[
                    {required:true,message:'请输入文章标题',triggle:'blur'},
                    {min:1,max:30,message:'文章标题的长度为1~30个字符',triggle:'blur'}
                ],
                cate_id:[
                    {required:true,type:'number',message:'请选择文章分类',triggle:'change'}
                ],
                content:[
                    // content对应quill-editor富文本编辑器，他不是el提供的表单标签
                    // 原因：
                    // el-input等输入框在blur事件时进行校验
                    // 下拉菜单，单选框，复选框，是在change事件时进行校验
                    // quill-editor2个事件都没有，所以你输入内容也不会自动走校验
                    // 解决:
                    // 自己给quill-editor绑定change事件(在文档里查到的他支持change事件内容改变事件)
                    // 在事件处理函数中用el-form组件对象内，调用某个校验规则再重新执行
                    {required:true,message:'请输入文章内容',triggle:'blur'}
                ],
                cover_img:[
                    {required:true,type:'object',message:'请选择文章封面',triggle:'blur'},
                ]
            },
            cateList:[], //保存文章分类列表
            artList:[], //保存文章列表
            total:0, //保存文章总数
        }
    },
    created(){
        // 请求分类数据
        this.getCateFn()
        // 请求文章列表
        this.getArtListFn()
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
        // 获取所有的分类
        async getCateFn(){
            const {data:res} = await getArtCateListAPI()
            this.cateList = res.data
        },
        //选择封面点击事件 -> 让文件选择的窗口出现
        selCoverFn(){
            this.$refs.iptFileRef.click() //用js来模拟一次点击事件动作（让图片选择窗口出现）
        },
        // 用户选择了封面文件
        changeCoverFn(e){
            // e.target 拿到触发事件的那个标签（input标签对象本身）
            // e.target.files 拿到选择的文件数组
            const files = e.target.files //获取用户选择的文件列表
            if(files.length === 0){
                // 用户没有选择封面，把cover_img置空
                this.pubForm.cover_img = null
                // img要显示回默认图片
                this.$refs.imgRef.setAttribute('src', imgObj)
            }else{
                // 用户选择了封面
                this.pubForm.cover_img = files[0]
                // 把图片文件，要显示到img标签里
                const url = URL.createObjectURL(files[0])
                this.$refs.imgRef.setAttribute('src', url)
            }
            // 让表单单独校验封面的值
            this.$refs.pubFormRef.validateField('cover_img')
        },
        // 表单里(点击发布/存为草稿)按钮点击事件-> 准备调用后端接口
        pubArticleFn(str){
            // str的值“已发布”，或者“草稿”（后端要求的参数值）
            this.pubForm.state = str //保存到统一表单对象上
            // 兜底校验
            this.$refs.pubFormRef.validate(async valid => {
                if(valid){
                    // 都通过
                    const fd = new FormData() //准备一个表单数据对象的容器 FormData类是html5新出的专门为了装文件内容和其他参数的一个容器
                    // fd.append('参数名',值)
                    fd.append('title',this.pubForm.title)
                    fd.append('cate_id',this.pubForm.cate_id)
                    fd.append('content',this.pubForm.content)
                    fd.append('cover_img',this.pubForm.cover_img)
                    fd.append('state',this.pubForm.state)
                    const {data:res} = await uploadArticleAPI(fd)
                    if(res.code !== 0) return this.$message.error(res.message)
                    this.$message.success(res.message)
                    this.pubDialogVisible = false
                    // this.$refs.pubFormRef.restFields()
                    // this.$refs.imgRef.setAttribute('src',imgObj)
                    // 刷新文章列表，再次请求文章列表数据
                    this.getArtListFn()
                }else{
                    return false //阻止默认行为（按钮有默认的提交行为）
                }
            })
        },
        // 富文本编辑器内容改变触发此事件方法
        contentChangeFn(){
            this.$refs.pubFormRef.validateField('content')
        },
        // 获取文章列表
        async getArtListFn(){
            const {data:res} = await getArtListAPI(this.q)
            this.artList = res.data //保存当前获取的文章列表（注意：有分页不是所有数据）
            this.total = res.total //保存文章总数
        },
        // 分页->每页条数改变触发
        // 核心思想：根据选择的页码/条数，影响q对象对应属性的值，再重新发一次请求让后台重新返回数据
        handleSizeChangeFn(sizes){
            // sizes:当前需要每页显示的条数
            // 因为Pagination的标签上已经加了.sync，子组件内会双向绑定到右侧vue变量上（q对象里pagesize已经改变了）
            // 如果不放心,可以在写一遍
            this.q.pagesize = sizes

            // 问题：先点击最后一个页码，切换每页显示条数2->3，总数不够，分页只能分到2
            // 每页条数改变了，页码从3到2改变了，2给事件都会触发
            // 偶发性的bug：有的时候自动回到第二页有的时候有数据，有的时候没有
            // 知识点：个网络请求一起发，谁先回来不一定
            // 原因：所以可能第2页3条数据回来有值铺设，紧接着第三页的3条数据回来了，空数组所以页面就是空的
            // 解决：当切换每页显示的条数，我们就把当前页码设置为1，而且标签里要设置
            this.getArtListFn()
        },
        // 当前页码改变时触发
        handleCurrentChangeFn(nowPage){
            // 当前要看的第几页的页数
            this.q.pagenum = nowPage
            this.getArtListFn()
        },
        // 筛选按钮点击事件
        choseFn(){
            // 目的：当有了筛选的条件，想让页码回归1，每页的条数回归2
            this.q.pagenum = 1
            this.q.pagesize = 2

            this.getArtListFn()
        },
        // 重置按钮点击事件
        resetFn(){
            this.q.pagenum = 1
            this.q.pagesize = 2
            this.q.cate_id = ''
            this.q.state = '' //对象改变，v-model关联的表单标签也会改变
            this.getArtListFn()
        }

    }
}
</script>

<style lang="less" scoped>
// scoped属性作用：让style里的选择器，只能选中当前组件的标签（为了保证样式的独立性，不影响别的组件）
// scoped原理：webpack打包时，会给组件标签上添加相同data-v-hash值，然后也会给所有选择器后面加上一个[data-v-hash]值的属性选择器
// 例：<标签 data-v-390246 calss="my_a"></标签> 选择器会变成.my_a[data-v-390246]
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}

// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了


// ******重要注意事项：
    // scoped只会给当前组件所有原生标签加上data-v-hash值属性，还会给组件根标签添加data-v-hash值属性，组件内标签不会添加


// .ql-editor{
//     min-height: 300px;
// }

// 这样写选不中富文本组件内的标签的原因：
// 写在这里会被后面加上[data-v-hash]属性选择器，而他对应的哪个标签组件内标签，scoped不会给他加上data-v-hash值属性，所以属性选择器选不中
// 解决：Vue提供了一个::v-deep样式语法，设置后，可以把属性选择器被自动添加到左侧
// 例：[data-v-hash值] .ql-editor
::v-deep .ql-editor {
    // 最小高度：标签本身的高度考内容撑开，但是内容没有300高度，标签会设置最小高度300px，若内容大于300px，标签高度也会随着撑开（比300px大）
    // 直接给height：无论容器内的内容有多少，超出300高度的内容会溢出到外面而不是撑开此容器
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}

// 总结：scoped不会给组件内标签添加data-v属性，所以要用::v-deep穿透选择组件内标签设置样式
</style>