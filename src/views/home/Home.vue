<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~assets/img/logo.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isToggle ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleMenuList">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#489EFF"
          unique-opened
          :collapse="isToggle"
          :collapse-transition="false"
          router
          :default-active='$route.path'>
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconfont[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/' + subItem.path">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from 'network/home'

export default {
  name: "Home",
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconfont: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-grid',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-data'
      },
      isToggle:false
    };
  },
  created () {
    this.getMenuList()
  },
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取菜单栏文本
    async getMenuList() {
      const { data: res } = await getMenuList()
      // console.log(res);
      if(res.meta.status !== 200) return this.$message.error('获取菜单栏失败')
      this.menuList = res.data
    },
    // 控制菜单显示
    toggleMenuList() {
      this.isToggle = !this.isToggle
    }
  },
};
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  background-color: #373d41;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4A5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: .2em;
  cursor: pointer;
}
</style>