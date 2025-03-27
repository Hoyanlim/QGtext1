<template>
  <div>
    <h1>欢迎来到首页</h1>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'LayoutPage',
}
</script>

<style scoped>
/* 添加你的样式 */
h1 {
  color: blue;
  font-size: 24px;
  text-align: center;
}
</style>
