<template>
  <el-breadcrumb-item :to="{ path: url }">
    
    <slot></slot>
  </el-breadcrumb-item>
</template>

<script>
export default {
  name: 'BreadCrumbItem',
  props: {
    url: {
      type: String,
    }
  },
  data() { 
    return {

    }
  },
 }
</script>

<style lang='less' scoped>

</style>