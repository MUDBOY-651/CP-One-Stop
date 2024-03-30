<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="username">Username:</label>
        <input id="username" v-model="username" type="text" required class="form-control">
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" required class="form-control">
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="email" required class="form-control">
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <button type="submit" class="btn-register">Register</button>
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
      email: '',
      errorMessage: '',
    };
  },
  methods: {
    async register() {
      // 模拟注册逻辑
      const userData = {
        username: this.username,
        password: this.password,
        email: this.email,
      };

      try {
        const response = await axios.post('/api/register', userData);
        if (response && response.data && response.data.success) {

          console.log('Register successful:', response.data.content);
          // 处理注册成功的逻辑，例如保存 token、更新用户状态等
          this.$store.dispatch('login', { username: this.username, user_id: response.data.content.user_id });
          this.$router.push('/');
        } else {
          console.error('Register failed:', response.data.message);
          this.errorMessage = response.data.message || 'Registration failed for an unknown reason.';
        }
      } catch (error) {
        console.log('Register error:', error.response || error.message);
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'Network error or server is unreachable.';
        }
      }

    },
  },
};
</script>


<style scoped>
.register-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.register-form {
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

.btn-register {
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

.btn-register:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
