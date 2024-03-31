import { createApp } from 'vue';
import "../public/css/reset.css";
// import 'normalize.css';
import App from './App.vue'; // 引入App组件
import router from './router'; // 引入路由配置
import store from './store'; // 引入Vuex store
import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus'


// 创建Vue应用实例
const app = createApp(App);

app.use(ElementPlus)


// 使用Vue Router
app.use(router);

// 使用Vuex
app.use(store);

// 挂载Vue应用到#app元素
app.mount('#app');
