<template>
  <el-breadcrumb :separator="separator">
    <slot></slot>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: {
    separator: {
      type: String,
      default: '/'
    }
  },
  data() { 
    return {

    }
  },
 }
</script>

<style lang='less' scoped>
  .el-breadcrumb {
    margin-bottom: 15px;
    font-size: 12px;
  }
</style>