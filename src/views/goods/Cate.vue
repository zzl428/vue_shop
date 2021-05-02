<template>
  <div class="cate">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table border class="treeTable"
                  :show-index="true" index-text="#"
                  :selection-type="false" :data="cateList" :columns="columns" :expand-type="false" :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot-scope="scope" slot="isok">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 等级 -->
        <template slot-scope="scope" slot="order">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot-scope="scope" slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditForm(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加商品分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="closeAddCateForm"
      >
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children', 
                      checkStrictly: 'true' }"
            @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑商品分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEditCate">
      <el-form :model="editCateForm" :rules="addCateRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getCateList, addCate, editCate, searchById} from 'network/category'
import {deleteByField} from '../../network/home'

export default {
  name: 'Cate',
  data() { 
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据
      cateList: [],
      // 父级分类数据
      parentCateList: [],
      // 选中父级id
      selectedKeys: [],
      // 商品分类条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {label: '分类名称', prop: 'cat_name'},
        {label: '是否有效', type: 'template', template: 'isok'},
        {label: '排序', type: 'template', template: 'order'},
        {label: '操作', type: 'template', template: 'opt'}
      ],
      // 添加分类的表单对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      editCateForm: {
        cat_name: '',
        cat_id: 0
      },
      // 验证分类的规则对象
      addCateRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' },]
      },
      // 控制添加分类的对话框的显示
      addCateDialogVisible: false,
      // 控制编辑分类的对话框的显示
      editDialogVisible: false
    }
  },
  created () {
    // 获取商品分类数据
    this.getCateList()
  },
  methods: {
    // 网络请求
    // 获取商品分类数据
    async getCateList() {
      const {data, status} = await getCateList(this.queryInfo)
      if(status !== 200) return this.$message.error('获取商品分类信息失败')
      this.cateList = data.result
      this.total = data.total
    },
    // 获取父级分类数据
    async getParentCateList() {
      const {data, status} = await getCateList({type: 2})
      if(status !== 200) return this.$message.error('获取父级分类信息失败')
      this.parentCateList = data.result
    },
    // 添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return 
        const {status} = await addCate(this.addCateForm)
        if(status !== 200) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
      
    },
    // 编辑分类
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if(!valid) return 
        const {status} = await editCate(this.editCateForm)
        if(status !== 200) return this.$message.error('编辑分类失败')
        this.$message.success('编辑分类成功')
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    // 显示编辑分类表单
    async showEditForm(cat_id) {
      this.editCateForm.cat_id = cat_id
      const {data, status} = await searchById(cat_id)
      if(status !== 200) return this.$message.error('获取商品分类信息失败')
      this.editCateForm.cat_name = data
      this.editDialogVisible = true
    },
    // 删除分类
    async deleteCate(cat_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return
      } else {
        const {status} = await deleteByField('category', 'cat_id', cat_id)
        if(status !== 200) return this.$message.error('删除分类失败')
        this.$message.success('删除分类成功')
        this.getCateList()
      }
    },

    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听当前页码的改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 打开添加分类对话框
    showAddCate() {
      // 获取父级分类数据
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 父级id改变
    parentCateChange() {
      let len = this.selectedKeys.length
      if(len > 0) {
        this.addCateForm.cat_level = len
        this.addCateForm.cat_pid = this.selectedKeys[len - 1]
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    },
    // 关闭添加分类表单
    closeAddCateForm() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      this.addCateDialogVisible = false
    },
    // 关闭编辑分类表单
    closeEditCate() {
      this.$refs.editCateFormRef.resetFields()
      this.editCateForm.cat_name = ''
      this.editDialogVisible = false
    },
  }
 }
</script>

<style lang='less' scoped>
  .treeTable {
    margin-top:  15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>