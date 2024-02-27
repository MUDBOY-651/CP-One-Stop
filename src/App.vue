<template>
  <div id="app">
    <!-- 导航栏 -->
    <Navbar />

    <!-- 路由视图：根据当前路由动态显示组件 -->
    <router-view />

    <!-- 你还可以添加其他全局组件，如页脚 -->
  </div>
</template>

<script>
// 导入Navbar组件
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar, // 注册Navbar组件，以便在模板中使用
  },
};
</script>

<style>
/* 全局样式 */
body,
#app {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
}

/* 其他全局样式 */
</style>
