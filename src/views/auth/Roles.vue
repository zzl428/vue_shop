<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 权限展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, index1) in scope.row.children" 
                    :class="[index1 === 0 ? 'bdtop' : '', 'bdbottom', 'vcenter']"
                    :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row, item1.id)" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过嵌套渲染二级权限 -->
                <el-row v-for="(item2, index2) in item1.children" 
                        :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" 
                            @close="removeRightById(scope.row, item2.id)" 
                            closable>
                      {{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag v-for="(item3, index3) in item2.children" 
                            type="warning" 
                            :key="item3.id"
                            @close="removeRightById(scope.row, item3.id)"
                            closable>
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row> 
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" 
                      icon="el-icon-edit" 
                      size="mini" 
                      @click="showEdit(scope.row.id)">编辑</el-button>
            <!-- 删除 -->
            <el-button type="danger" 
                      icon="el-icon-delete" 
                      size="mini"
                      @click="removeRole(scope.row.id)">删除</el-button>
            <!-- 分配权限 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRight(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetAddForm">
      <el-form ref="addRoleFormRef" :rules="addFormRules" :model="addForm" label-width="80px" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAddForm('message')">重 置</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetEditForm">
      <el-form ref="editRoleFormRef" :rules="addFormRules" :model="editForm" label-width="80px" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetEditForm('message')">重 置</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置权限的对话框 -->
    <el-dialog
      title="设置权限"
      :visible.sync="setRightVisible"
      width="50%"
      @close="resetRight"
      >
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treetProps" ref="treeRef"
              show-checkbox default-expand-all
              node-key="id" :default-checked-keys="defaultKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetRight('message')">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { 
  getRolesList, 
  addRole, 
  searchRoleByRoleId, 
  editRole, 
  removeRole } from 'network/roles'
import { removeRoleRight, getRightsTree, setRights } from 'network/rights'

export default {
  name: 'Roles',
  data() { 
    return {
      // 用户列表
      roleList: [],
      // 权限树形列表
      rightsList: [],
      // 树形控件内容
      treetProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选择的节点id值
      defaultKeys: [],
      // 添加角色的对象
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      // 修改角色的对象
      editForm: {
        role_id: '',
        roleName: '',
        roleDesc: '',
      },
      // 验证角色添加的规则对象
      addFormRules: {
        roleName: [ { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }],
        roleDesc: [ { required: true, message: '请输入角色描述', trigger: 'blur' },
                    { min: 2, max: 30, message: '长度在 2 到 50 个字符', trigger: 'blur' }],
      },
      // 用户id,方便之后设置权限使用
      roleId: '',
      // 控制添加角色对话框显示与否
      dialogVisible: false,
      // 控制编辑角色的对话框显示
      editDialogVisible: false,
      // 分配权限对话的显示控制
      setRightVisible: false,
    }
  },
  created () {
    // 获得所有角色
    this.getRolesList()
  },
  methods: {
    // 网络请求
    // 获取角色列表
    async getRolesList() {
      const {data, status} = await getRolesList()
      if(status !== 200){
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = data
    },
    // 显示修改框，并添加默认信息
    async showEdit(id) {
       this.editDialogVisible = true
       const{data, status} = await searchRoleByRoleId(id)
       if(status !== 200) {
         this.$message.error('获取角色信息失败')
         return this.editDialogVisible = false
       }
      //  给编辑角色对象赋值
      this.editForm.roleName = data.roleName
      this.editForm.roleDesc = data.roleDesc
      this.editForm.role_id = data.role_id
    },
    // 显示设置权限
    async showSetRight(role){
      const {data, status} = await getRightsTree()
      if(status !== 200) return this.$message.error('获取权限信息失败')
      this.rightsList = data
      this.getDefaultKeys(role)
      this.setRightVisible = true
      this.roleId = role.id
    },
    // 重置设置权限
    resetRight(message) {
      this.setRightVisible = false
      this.defaultKeys = []
    },
    // 重置添加表单
    resetAddForm(message) {
      this.$refs.addRoleFormRef.resetFields()
      if(message) return this.$message('表单信息已重置');
    },
    // 重置修改表单
    resetEditForm(message) {
      this.$refs.editRoleFormRef.resetFields()
      if(message) return this.$message('表单信息已重置');
    },
    // 添加角色
    addRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if(!valid) return
        const {data, status} = await addRole(this.addForm)
        if(status !== 200) {
          return this.$message.error('添加角色失败')
        }
        this.$message({
            message: '添加角色成功',
            type: 'success',
            center: true
        })
        this.dialogVisible = false
        this.getRolesList()
      })
    },
    // 修改角色
    editRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if(!valid) return
        const {status} = await editRole(this.role_id, this.editForm)
        if(status !== 200) return this.$message.error('修改角色失败')
        this.$message({
            message: '修改角色信息成功',
            type: 'success',
            center: true
        })
        this.editDialogVisible = false
        return this.getRolesList()
      })
    },
    // 删除角色
    async removeRole(id) {
      // 弹框询问是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return
      } else {
        const {status} = await removeRole(id)
        if(status === 200) {
          this.$message({
            message: '删除用户信息成功',
            type: 'success',
            center: true
          })
          return this.getRolesList()
        } else {
          return this.$message.error('删除用户失败')
        }
      }
    },
    // 删除角色权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch((err) => err)
      if(confirmResult !== 'confirm') return
      const {data, status} = await removeRoleRight(role.id, rightId)
      if(status !== 200) return this.$message.error('删除角色权限失败')
      role.children = data.children
      this.$message.success('删除角色权限成功')
    },
    // 通过节点循环获得所有已有权限，保存到数组中
    getDefaultKeys(node) {
      // 如果存在一级权限
      if(node.children) {
        for(let i of node.children) {
          // 如果存在二级权限
          if(i.children) {
            for( let j of i.children) {
              // 如果存在三级权限
              if(j.children) {
                for(let k of j.children) {
                  this.defaultKeys.push(k.id)
                }
              }
            }
          }
        }
      }
    },
    // 分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ]
      const {status} = await setRights(this.roleId, keys)
      if(status !== 200) return this.$message.error('设置用户权限失败')
      this.$message.success('用户权限设置成功')
      this.getRolesList()
      this.setRightVisible = false
      this.defaultKeys = []
    },
  }
 }
</script>

<style lang='less' scoped>
  .el-tag {
    margin: 7px
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>