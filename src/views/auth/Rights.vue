<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级权限</el-tag>
            <el-tag v-else-if="scope.row.level === '2'" type="warning">三级权限</el-tag>
            <el-tag v-else type="danger">暂无数据</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from '../../network/rights'

export default {
  name: 'Rights',
  data() { 
    return {
      rightList: []
    }
  },
  created () {
    // 获取所有权限
    this.getRightsList()
  },
  methods: {
    // 网络请求
    // 获取权限列表
    async getRightsList() {
      const {data, status} = await getRightsList()
      if(status !== 200){
        return this.$message.error('获取权限列表失败')
      }
      this.rightList = data
    }
  }
 }
</script>

<style lang='less' scoped>

</style>