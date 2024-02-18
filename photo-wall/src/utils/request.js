import { http } from '@/utils/http';
export default {
  install(app) {
    app.config.globalProperties.$http = async function (url, options) {
      let res;
      try {
        res = await http(url, options);
        return res;
      } catch (e) {
        console.log(e);
        if (e.message === 'Unauthorized') {
          app.config.globalProperties.$router.push('/login');
          return {
            code: 1,
            message: '请登录',
          };
        } else {
          throw e;
        }
      }
    };
  },
};
