<template>
  <div class="home">
    Home组件
    <button @click="logoff">退出</button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() { 
    return {

    }
  },
  methods: {
    logoff() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
 }
</script>

<style lang='less' scoped>

</style>