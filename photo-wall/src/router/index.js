import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Upload from '../views/Upload.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/upload',
    name: 'Upload',
    component: Upload,
  },

  // 添加其他路由配置
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
