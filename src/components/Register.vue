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
      <button type="submit" class="btn-register">Register</button>
    </form>
  </div>
</template>


<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      email: '',
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

      console.log("Registering user:", userData);

      // TODO: 在这里发送userData到后端API
      // 示例: axios.post('/api/register', userData)

      // 假设注册成功，导航到登录页面或其他操作
      this.$router.push('/login');
      
      // 清空表单
      this.username = '';
      this.password = '';
      this.email = '';
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
</style>
