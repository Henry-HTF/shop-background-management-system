<template>
  <div>
    <el-button type="info" @click="logoutClick">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  methods: {
    logoutClick() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
</style>