<template>
  <div class="login-container">
    <h2>Login to CP One-Stop</h2>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="username">Username:</label>
        <input id="username" v-model="username" type="text" required class="form-control">
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" required class="form-control">
      </div>
      <button type="submit" class="btn-login">Login</button>
    </form>
  </div>
</template>


<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      // 这里应该包括登录逻辑，比如调用API验证用户
      // 假设登录成功，我们直接使用Vuex进行状态管理和导航
      this.$store.dispatch('login', { username: this.username });
      this.$router.push('/'); // 导航到主页
    },
    navigateToRegister() {
      this.$router.push('/register'); // 导航到注册页面
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 95%;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}


.btn-login {
  display: block;
  padding: 0.5rem;
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-login:hover {
  background-color: #0056b3;
}
</style>
