<template>
  <div class="order">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column label="是否发货">
          <template slot-scope="scope">
            {{scope.row.is_send}}
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time * 1000 | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeBox"
      >
      <el-form :model="addRessForm" :rules="addRessFormRules" ref="addRessFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addRessForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addRessForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getOrderList} from 'network/order'
import cityData from './citydata.js'

export default {
  name: 'Order',
  data() { 
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 订单数据对象
      orderList: [],
      total: 0,
      // 修改地址对话框的显示
      dialogVisible: false,
      // 修改地址的数据对象
      addRessForm: {
        address1: [],
        address2: ''
      },
      // 表单验证对象
      addRessFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ]
      },
      cityData,
    }
  },
  created () {
    // 获取订单列表
    this.getOrderList()
  },
  methods: {
    // 网络请求
    // 获取订单数据
    async getOrderList() {
      const {data, status} = await getOrderList(this.queryInfo)
      if(status !== 200) return this.$message.error('获取订单列表数据失败')
      this.$message.success('获取订单列表数据成功')
      this.orderList = data.orders
      this.total = data.total
    },

    // 功能
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 显示省市区数据对话框
    showBox() {
      this.dialogVisible = true
    },
    // 关闭对话框,重置表单
    closeBox() {
      this.$refs.addRessFormRef.resetFields()
    }
  }
 }
</script>

<style lang='less' scoped>
  .el-cascader {
    width: 100%;
  }
</style>