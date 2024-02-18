<template>
  <div class="login-container">
    <h2 class="title">登录</h2>
    <t-form
      ref="form"
      :data="formData"
      :rules="rules"
      @submit="submit"
      show-error-message
    >
      <t-form-item label="用户名" name="username" :label-width="80">
        <t-input
          v-model="formData.username"
          placeholder="请输入用户名"
          required
        ></t-input>
      </t-form-item>
      <t-form-item label="密码" name="password" :label-width="80">
        <t-input
          v-model="formData.password"
          placeholder="请输入密码"
          type="password"
          required
        ></t-input>
      </t-form-item>

      <div class="button-group">
        <t-button theme="primary" type="submit">登录</t-button>
      </div>
      <div class="button-group">
        还没有账号，<t-link theme="primary" @click="handleJumpToRegister"
          >立即注册</t-link
        >
      </div>
    </t-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // 现在字符串至少6位
          {
            validator: (val) => {
              if ((val || '').length < 6) {
                return false;
              }
              return true;
            },
            message: '用户名至少6位',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // 密码限制为6位以上，有大写，小写和数字
          {
            validator: (val) => {
              if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{6,}$/.test(val)) {
                return false;
              }
              return true;
            },
            message: '6位以上，包含大写、小写和数字',
          },
        ],
      },
    };
  },
  methods: {
    async submit() {
      // 用fetch提交数据到 /api/login
      const res = await this.$http('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          username: this.formData.username,
          password: this.formData.password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(res);
      if (res.code === 0) {
        //  本地存储 res.data.token
        localStorage.setItem('token', res.data.token);
        this.$store.dispatch('getUserInfo');
        this.$router.push({
          path: '/',
        });
      } else {
        alert(res.message || '请求失败');
      }
    },
    handleJumpToRegister() {
      this.$router.push('/register');
    },
  },
};
</script>

<style scoped>
.title {
  text-align: center;
  font-size: 18px;
  margin: 10px 0;
}
.button-group {
  margin-top: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  font-size: 14px;
}
/deep/ .t-input--border::after{
    display: none;
}
</style>
