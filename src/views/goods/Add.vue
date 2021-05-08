<template>
  <div class="add_goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 警告文本 -->
      <el-alert
        title="添加商品信息" type="info" :closable="false" show-icon center >
      </el-alert>
      <!-- 进度条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- 左侧tab -->
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children'}"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item v-for="(item) in manyTableData" :key="item.attr_id" :label="item.attr_name">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(item2, index2) in item.attr_vals" :key="index2" :label="item2" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到的api地址 -->
            <el-upload  
              action="http://localhost:8006/data/upload"
              :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess"
              :headers="headerObj"
              list-type="picture"
              >
              <el-button size="small" type="primary">点击上传</el-button>
              
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"
              ref="">
            </quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      >
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import {getCateList, attrList} from 'network/category'
import {addGoods} from 'network/goods'

export default {
  name: 'Add',
  data() { 
    return {
      // 商品分类数据
      cateList: [],
      activeIndex: '0',
      // 动态参数数据对象
      manyTableData: [],
      // 静态属性数据对象
      onlyTableData: [],
      // 添加商品的表单对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品的描述
        goods_introduce: '',
        attrs: []
      },
      // 添加商品的表单验证对象
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ]
      },
      // 图片上传的请求头
      headerObj: {
        Authorization: 'Bearer ' + window.sessionStorage.getItem('token')
      },
      // 图片预览地址
      previewPath: '',
      // 图片预览对话框的显示
      dialogVisible: false
    }
  },
  created () {
    // 获取商品分类数据
    this.getCateList()
  },
  methods: {
    // 网络请求
    // 获取分类列表
    async getCateList() {
      const {data, status} = await getCateList({type: 3})
      if(status !== 200) return this.$message.error('获取商品分类信息失败')
      this.cateList = data.result
    },
    async tabClick() {
      if(this.activeIndex === '1') {
        const {data, status} = await attrList(this.addForm.goods_cat[2], `many`)
        if(status !== 200) return this.$message.error('获取动态参数失败')
        data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        })
        this.manyTableData = data
      } else if(this.activeIndex === '2') {
        const {data, status} = await attrList(this.addForm.goods_cat[2], `only`)
        if(status !== 200) return this.$message.error('获取静态属性失败')
        this.onlyTableData = data
      }
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return this.$message.error('请填写必要的表单项')
        // 处理动态参数和静态属性
        this.manyTableData.forEach(item => {
          let newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          let newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        // 发起请求,添加商品
        const {status} = await addGoods(this.addForm)
        if(status !== 200) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    },

    // 功能
    // 商品分类改变
    handleChange() {
      if(this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // tab页面切换
    beforeTabLeave(activeName, oldActiveName) {
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 图片上传成功的钩子函数
    handleSuccess(response) {
      let pic = {pic: response.temp_path}
      this.addForm.pics.push(pic)
      console.log(this.addForm);
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = 'http://' + file.response.url
      console.log(this.previewPath);
      this.dialogVisible = true
    },
    // 移出图片
    handleRemove(file) {
      // 获取将要删除的图片的临时路径
      const filePath = file.response.temp_path
      // 从Pics数组中找到对应的索引值
      let i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 删除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm);
    },
  }
 }
</script>

<style lang='less' scoped>
 .el-checkbox {
   margin: 0 10px 0 0 !important;
 }

 .previewImg {
   width: 100%;
 }

 .btnAdd {
   margin-top: 15px;
 }
</style>