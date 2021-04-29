<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card >
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span='8'>
          <el-input placeholder="请输入内容" v-model="query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table
        :data="userList"
        style="width: 100%"
        border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch  v-model="scope.row.state" 
                        :active-value="1" :inactive-value="0" 
                        @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button  type="primary" 
                        icon="el-icon-edit" size="mini" 
                        @click="showEdit(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" 
                      icon="el-icon-delete" 
                      size="mini" 
                      @click="deleteUser(scope.row.id)"></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="allotRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetAddForm">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser">确 定</el-button>
        <el-button @click="resetAddForm('message')">重 置</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetEditForm"
      >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" status-icon>
        <el-form-item label="用户名">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editUser">确 定</el-button>
        <el-button @click="resetEditForm('message')">重置</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="selectRoleId = ''">
      <div>
        <p>当前用户： {{userInfo.name}}</p>
        <p>当前角色： {{userInfo.role}}</p>
        <p>
          分配新角色： 
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getUserList, alterUser, searchUserByName, searchUserById } from 'network/home'
import { register, setRole } from 'network/login_register'
import { deleteByField } from 'network/home.js'
import { getRolesList } from 'network/roles'
import { 
  validName, verifyNameNotNull, verifyNameSize, 
  verifyPwdNotNull, verifyPwdSize, 
  verifyEmailNotNull, validEmail, 
  verifyMobileNotNull, verifyMobileSize, validMobile,
  partValidEmail, partValidMobile
  } from 'common/utils'

export default {
  name: 'Users',
  data() { 
    // 验证修改邮箱的规则函数
    const validEditEmail = async (rule, value, callback) => {
      // 如果信息不变，直接返回
      if(value === this.checkEditForm.email) {
        return callback
      }
      const result = await partValidEmail(value)
      if(!result) {
        return callback()
      } else {
        return callback(result)
      }
    }
    // 验证修改手机的规则函数
    const validEditMobile = async (rule, value, callback) => {
      // 如果信息不变，直接返回
      if(value === this.checkEditForm.mobile) {
        return callback
      }
      const result = await partValidMobile(value)
      if(!result) {
        return callback()
      } else {
        return callback(result)
      }
    }
    return {
      query:'',
      pagenum: 1,
      pagesize: 5,
      userList: [],
      total:0,
      // 控制添加对话框的显示
      dialogVisible: false,
      // 控制修改对话框的显示
      editDialogVisible:false,
      // 分配角色对话框的显示
      setRoleDialogVisible: false,
      // 添加用户对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑用户对象
      editForm: {
        name: '',
        email: '',
        mobile: ''
      },
      // 设置权限时显示的用户信息
      userInfo: {},
      // 对比编辑用户对象
      checkEditForm: {
        email: '',
        mobile: '',
        id: ''
      },
      // 添加表单规则对象
      addFormRules: {
        username: [ verifyNameNotNull, verifyNameSize, { validator: validName, trigger: 'blur' } ],
        password: [ verifyPwdNotNull, verifyPwdSize ],
        email: [ verifyEmailNotNull, { validator: validEmail, trigger: 'blur' } ],
        mobile: [ verifyMobileNotNull, verifyMobileSize, { validator: validMobile, trigger: 'blur' } ]
      },
      // 修改表单规则对象
      editFormRules: {
        email: [ verifyEmailNotNull, { validator: validEditEmail, trigger: 'blur' } ],
        mobile: [ verifyMobileNotNull, verifyMobileSize, { validator: validEditMobile, trigger: 'blur' } ]
      },
      // 用户列表
      roleList: [],
      // 选择要分配的角色
      selectRoleId: '',
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const offst = (this.pagenum - 1) * this.pagesize
      const { data, status } = await getUserList(offst, this.pagesize)
      if(status !== 200) return this.$message.error('用户列表获取失败')
      const { result, len } = data
      this.userList = result
      this.total = len["COUNT(*)"]
    },
    // pagesize改变
    handleSizeChange(newSize) {
      this.pagesize = newSize
      this.getUserList()
    },
    // 当前页码改变
    handleCurrentChange(newPage) {
      this.pagenum = newPage
      this.getUserList()
    },
    // 改变用户状态
    async userStateChange(data) {
      const { id, state } = data
      const result = await alterUser(id ,{state})
      if(result.status !== 200) return this.$message.error('更改用户状态失败')
      this.$message.success('更新用户状态成功')
    },
    // 搜索用户
    async searchUser() {
      const {data, status} = await searchUserByName(this.query)
      if(status !== 200) return this.$message.error('搜索用户失败')
      this.userList = data
    },
    // 重置添加用户表单
    resetAddForm(message) {
      this.$refs.addFormRef.resetFields()
      if(message) return this.$message('表单信息已重置');
    },
    // 添加用户信息提交
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if(!valid) return
        const result = await register(this.addForm)
        if(result.status === 200) {
          this.$message({
            message: '恭喜你注册成功',
            type: 'success',
            center: true
          })
          this.$refs.addFormRef.resetFields()
        }
      })
    },
    // 显示编辑对话框，并自动填充默认数据
    async showEdit(id) {
      this.editDialogVisible = true
      const {data, status} = await searchUserById(id)
      if(status !== 200) {
        this.$message.error('获取用户数据失败')
        return this.editDialogVisible = false
      }
      // 给编辑用户对象赋值
      this.editForm.name = data[0].name
      this.editForm.email = data[0].email
      this.editForm.mobile = data[0].mobile
      // 给对比编辑用户对象赋值，方便之后验证规则
      this.checkEditForm.email = data[0].email
      this.checkEditForm.mobile = data[0].mobile
      // 给对比编辑用户对象复制id，方便之后更新数据
      this.checkEditForm.id = id
    },
    // 编辑用户信息提交
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        let flag = false
        if(!valid) return
        if(this.editForm.email === this.checkEditForm.email && 
            this.editForm.mobile === this.checkEditForm.mobile){
          flag = true
        } else {
          const result = await alterUser(this.checkEditForm.id, this.editForm)
          if(result.status === 200) flag = true
        }
        if(flag){
          this.$message({
            message: '修改用户信息成功',
            type: 'success',
            center: true
          })
          this.editDialogVisible = false
          return this.getUserList()
        } else return this.$message.error('修改用户信息失败')
      })
    },
    // 重置修改用户表单
    resetEditForm(message) {
      this.$refs.editFormRef.resetFields()
      if(message) return this.$message('表单信息已重置');
    },
    // 删除用户按钮
    async deleteUser(id) {
      // 弹框询问是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return
      } else {
        const result = await deleteByField('user', 'id', id)
        if(result.status === 200) {
          this.$message({
            message: '修改用户信息成功',
            type: 'success',
            center: true
          })
          return this.getUserList()
        } else {
          return this.$message.error('删除用户失败')
        }
      }
    },
    // 分配角色
    async allotRole(role) {
      this.userInfo = role
      // 获取角色列表
      const {data, status} = await getRolesList()
      if(status !== 200) return this.$message.error('获取角色列表数据失败')
      this.roleList = data

      this.setRoleDialogVisible = true
    },
    // 确认按钮完成角色分配
    async saveRoleInfo() {
      if(!this.selectRoleId) return this.$message.error('请选择要分配的角色')
      const {data, status} = await setRole(this.userInfo.id, this.selectRoleId)
      if(status !== 200) return this.$message.error('分配角色失败')
      this.setRoleDialogVisible = false
      this.$message.success('分配角色成功')
      this.getUserList()
      
    }
  }
 }
</script>

<style lang="less" scoped>
 .el-table {
   
 }
</style>