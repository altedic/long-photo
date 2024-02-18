import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import TDesignMobileVue from 'tdesign-mobile-vue';
import 'tdesign-mobile-vue/es/style/index.css';
import { createStore } from 'vuex';
import { http } from './utils/http';
import request from "./utils/request"
const store = createStore({
  state() {
    // 在这里定义你的全局数据
    return {
      userInfo: {},
    };
  },
  mutations: {
    // 在这里定义修改全局数据的方法
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo || {};
    },
  },
  actions: {
    async getUserInfo(state) {
      /**
       * 获取用户信息
       */
      try {
        const res = await http('/api/user-info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(res);
        if (res.code === 0) {
          console.log(res.data.userInfo);
          // this.$store.commit('updateUserInfo', res.data.userInfo);
          state.commit('updateUserInfo', res.data.userInfo);
        } else {
          alert(res.message || '请求失败');
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  getters: {
    // 在这里定义获取全局数据的方法
    doubleCount(state) {
      return state.count * 2;
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(store);
app.use(TDesignMobileVue);
app.use(request);
app.mount('#app');
