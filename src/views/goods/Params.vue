<template>
  <div class="params">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告文本 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children'}"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="dialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag 
                  v-for="(item, index) in scope.row.attr_vals" 
                  :key="index" 
                  closable 
                  @close="handleClose(index, scope.row)"
                  >
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
           <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="dialogVisible = true">添加属性</el-button>
           <!-- 静态属性表格 -->
           <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag 
                  v-for="(item, index) in scope.row.attr_vals" 
                  :key="index" 
                  closable 
                  @close="handleClose(index, scope.row)"
                  >
                  {{item}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数和属性的对话框 -->
    <el-dialog
      :title="activeName === 'many' ? `添加动态参数` : `添加静态属性`"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeForm"
      >
      <el-form :model="addAttrForm" :rules="addAttrRules" ref="addAttrFormRef" label-width="100px">
        <el-form-item :label="activeName === 'many' ? '参数名称' : '属性名称'" prop="attr_name">
          <el-input v-model="addAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttr">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数和属性的对话框 -->
    <el-dialog
      :title="activeName === 'many' ? `修改动态参数` : `修改静态属性`"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEditForm"
      >
      <el-form :model="editAttrForm" :rules="addAttrRules" ref="editAttrFormRef" label-width="100px">
        <el-form-item :label="activeName === 'many' ? '参数名称' : '属性名称'" prop="attr_name">
          <el-input v-model="editAttrForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttr">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getCateList, attrList, addAttr, getAttr, editAttr, deleteAttr} from 'network/category'

export default {
  name: 'Params',
  data() { 
    return {
      // 商品分类数据
      cateList: [],
      // 选中的分类
      selectedKeys: [],
      // 被激活的页签
      activeName: 'many',
      // 参数数据
      manyTableData: [],
      // 属性数据
      onlyTableData: [],
      // 添加属性或参数的表单对象
      addAttrForm : {
        attr_name: ''
      },
      // 修改属性或参数的表单对象
      editAttrForm: {
        attr_name: ''
      },
      // 对话框的显示
      dialogVisible: false,
      // 修改对话框的显示
      editDialogVisible: false,
      // 验证表单的规则对象
      addAttrRules: {
        attr_name: [{ required: true, message: '不得为空', trigger: 'blur' },]
      }
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
    // 获取分类参数
    async getAttr() {
      if(this.isBtnDisable) return
      const {data, status} = await attrList(this.selectedKeys[2], this.activeName)
      if(status !== 200) return this.$message.error('获取分类参数失败')
      data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 添加布尔值，控制文本框的显示隐藏
        item.inputVisible = false
        item.inputValue = ''
      })
      if(this.activeName === 'many') this.manyTableData = data
      else this.onlyTableData = data
    },
    // 添加参数属性
    addAttr() {
      this.$refs.addAttrFormRef.validate(async valid => {
        if(!valid) return 
        const {status} = await addAttr(this.selectedKeys[2], {
          attr_name: this.addAttrForm.attr_name,
          attr_sel:this.activeName
        })
        if(status !== 200) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.getAttr()
      })
    },
    // 显示修改对话框，并添加默认值
    async showEdit(attr_id) {
      const {data, status} = await getAttr(this.selectedKeys[2], attr_id, this.activeName)
      if(status !== 200) return this.$message.error('获取参数属性数据失败')
      this.editAttrForm = data
      this.editDialogVisible = true
    },
    // 修改参数属性
    editAttr() {
      this.$refs.editAttrFormRef.validate(async valid => {
        if(!valid) return 
        const {status} = await editAttr(this.selectedKeys[2], 
                                        this.editAttrForm.attr_id, 
                                        this.editAttrForm.attr_name, 
                                        this.activeName)
        if(status !== 200) return this.$message.error('修改参数属性数据失败')
        this.$message.success('修改参数属性数据成功')
        this.editDialogVisible = false
        this.getAttr()
      })
    },
    // 删除参数属性
    async deleteAttr(attr_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数或属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return
      } else {
        const {status} = await deleteAttr(this.selectedKeys[2], attr_id)
        if(status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getAttr()
      }
    },
    // 参数属性选项
    async saveAttr(row) {
      let vals = row.attr_vals.join(',')
      const {status} = await editAttr(row.cat_id, row.attr_id, row.attr_name, row.attr_sel, vals)
      if(status !== 200) return this.$message.error('修改参数属性选项失败')
      this.$message.success('修改参数属性选项成功')
    },


    // 功能
    // 选中分类改变
    async handleChange() {
      if(this.selectedKeys.length !== 3) {
        this.manyTableData = []
        this.onlyTableData = []
        return this.selectedKeys = []
      }
      this.getAttr()
    },
    // 页签改变
    handleClick() {
      this.getAttr()
    },
    // 关闭对话框
    closeForm() {
      this.$refs.addAttrFormRef.resetFields()
    },
    // 关闭修改的对话框
    closeEditForm() {
      this.$refs.editAttrFormRef.resetFields()
    },
    // 展示文本框
    showInput(row) {
      row.inputVisible = true;
      // 文本框自动获得焦点
      // 当元素渲染完成后，才会执行
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加属性参数选值
    handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''
        return row.inputVisible = false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttr(row)
    },
    // 删除属性参数选项
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttr(row)
    },
  },
  computed: {
    isBtnDisable() {
      return this.selectedKeys.length === 3 ? false : true
    },
    
  }
 }
</script>

<style lang='less' scoped>
  .cat_opt {
    margin: 15px 0;
  }

  .el-tag {
    margin: 5px;
  }

  .input-new-tag {
    width: 150px;
  }
</style>