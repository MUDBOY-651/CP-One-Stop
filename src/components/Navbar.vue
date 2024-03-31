<template>
  <nav class="navbar">
    <h1 class="navbar-brand">CP One-Stop</h1>
    <div class="navbar-links">
      <!-- 导航链接 -->
      <router-link to="/" class="navbar-link">主页</router-link>
      <router-link v-if="isLoggedIn" to="/chat" class="navbar-link">专属助手</router-link>
      <router-link v-if="isLoggedIn" to="/mypost" class="navbar-link">个人专栏</router-link>
      <router-link v-if="isLoggedIn" :to="'/user/' + $store.state.user_id" class="navbar-link">个人主页</router-link>
      <router-link v-if="!isLoggedIn" to="/register" class="navbar-link">注册</router-link>
      <button v-if="isLoggedIn" @click="logout" class="navbar-button">退出登录</button>
      <button v-else @click="goToLogin" class="navbar-button">登录</button>
    </div>
  </nav>
</template>

<script>
export default {
  // 组件逻辑
  methods: {
    goToLogin() {
      // 导航到登录页面的逻辑
      this.$router.push('/login');
    },
    logout() {
      // 登出逻辑
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
  },
  computed: {
    isLoggedIn() {
      // 判断用户是否登录的逻辑
      return this.$store.state.username !== null && this.$store.state.user_id !== null;
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #4A5D4B;
  color: white;
}

.navbar-brand {
  font-size: 1.5rem;
}

.navbar-links {
  display: flex;
  align-items: center;
}

.navbar-link,
.navbar-button {
  margin-left: 1rem;
  text-decoration: none;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.navbar-link:hover,
.navbar-button:hover {
  text-decoration: underline;
}

/* 如果你使用的是Vue Router的active class来标记当前激活的链接，可以这样设置: */
.router-link-active {
  font-weight: bold;
}
</style>
