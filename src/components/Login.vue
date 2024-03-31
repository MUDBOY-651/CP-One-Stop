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
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <button type="submit" class="btn-login">Login</button>
    </form>
  </div>
</template>


<script>
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async login() {
      const loginData = {
        username: this.username,
        password: this.password,
      };

      try {
        const response = await axios.post('/api/login', loginData);
        if (response && response.data && response.data.success) {
          console.log('Login successful:', response.data.content);
          // 处理登录成功的逻辑，例如保存 token、更新用户状态等
          this.$store.dispatch('login', { username: this.username, user_id: response.data.content.user_id });
          this.$router.push('/');

          // 触发后端爬虫更新用户数据 
          // axios.post(`/py_api/crawler/platform-stats?user_id=${response.data.content.user_id}`)
          //   .then(response => {
          //     console.log("crawler success")
          //   })
          //   .catch(error => {
          //     console.error('crawler error:', error);
          //   });
        } else {
          console.error('Login failed:', response.data.message);
          this.errorMessage = response.data.message || 'Login failed. Please check your username and password.';
        }
      } catch (error) {
        console.error('Login error:', error.response || error.message);
        this.errorMessage = error.response.data.message || 'Network error. Please try again later.';
      }
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

.error-message {
  color: red;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
