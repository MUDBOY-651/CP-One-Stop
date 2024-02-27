import { createApp } from 'vue';
import App from './App.vue'; // 引入App组件
import router from './router'; // 引入路由配置
import store from './store'; // 引入Vuex store

// 创建Vue应用实例
const app = createApp(App);

// 使用Vue Router
app.use(router);

// 使用Vuex
app.use(store);

// 挂载Vue应用到#app元素
app.mount('#app');
