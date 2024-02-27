<template>
  <nav class="navbar">
    <h1 class="navbar-brand">CP One-Stop</h1>
    <div class="navbar-links">
      <!-- 导航链接 -->
      <router-link to="/" class="navbar-link">Home</router-link>
      <router-link v-if="isLoggedIn" to="/chat" class="navbar-link">Chat</router-link>
      <router-link v-if="isLoggedIn" to="/user" class="navbar-link">User Profile</router-link>
      <router-link v-if="!isLoggedIn" to="/register" class="navbar-link">Register</router-link>
      <button v-if="isLoggedIn" @click="logout" class="navbar-button">Logout</button>
      <button v-else @click="goToLogin" class="navbar-button">Login</button>
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
      return this.$store.state.user !== null;
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
  background-color: #060ae7;
  color: white;
}

.navbar-brand {
  font-size: 1.5rem;
}

.navbar-links {
  display: flex;
  align-items: center;
}

.navbar-link, .navbar-button {
  margin-left: 1rem;
  text-decoration: none;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.navbar-link:hover, .navbar-button:hover {
  text-decoration: underline;
}

/* 如果你使用的是Vue Router的active class来标记当前激活的链接，可以这样设置: */
.router-link-active {
  font-weight: bold;
}
</style>
