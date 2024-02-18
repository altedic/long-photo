<template>
  <div class="upload-container">
    <h2 class="title">新建相册</h2>
    <div>
      <div class="upload-title">选择照片上传</div>
      <t-upload
        multiple
        :max="10"
        v-model="files"
        :grid-config="gridConfig"
        :requestMethod="requestMethod"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        placeh
      >
      </t-upload>
    </div>
    <div class="button-group">
      <t-button theme="primary" block @click="submit">提交</t-button>
    </div>
  </div>
</template>

<script>
import fileUpload from '@/utils/file-upload';

export default {
  data() {
    return {
      gridConfig: {
        column: 4,
      },
      files: [],
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    onClickUpload(e) {
      console.log('====onClickUpload', e);
    },
    onSelectChange(e) {
      console.log('====onSelectChange', e);
    },
    onRemove(e) {
      console.log('====onRemove', e);
    },
    onSuccess(e) {
      console.log('====onRemove', e);
    },
    onPreview(e) {
      console.log('====onRemove', e);
    },
    onChange(e) {
      console.log('====onRemove', e);
    },
    onProgress(e) {
      console.log('====onRemove', e);
    },
    onFail({ file, e }) {
      console.log('---onFail', file, e);
      return null;
    },
    async requestMethod(e) {
      // const cosBaseUrl = '//';
      const file = e[0];
      console.log(file, 3333);
      try {
        let res = await fileUpload(file.raw, this.userInfo.username);
        console.log(res);
        return {
          status: 'success',
          response: { url: `//${res.Location}` },
        };
      } catch (e) {
        if (e) {
          console.log(e);
          let { message = '' } = e;
          if (message.startsWith('getAuthorization callback params missing')) {
            alert('获取签名失败，请检查是否登录');
          }
        }
        return {
          status: 'fail',
          response: { url: '' },
        };
      }
    },
    async submit() {
      let list = this.files.map((item) => {
        return item.response.url;
      });

      // 创建相册
      const res = await this.$http('/api/photo-wall', {
        method: 'POST',
        body: JSON.stringify({
          list,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.code === 0) {
        this.$router.push({
          path: '/',
        });
      } else {
        alert(res.message || '请求失败');
      }

      // console.log('待提交数据', list);
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
  padding: 0 10px;
}
.upload-title{
  text-align: left;
  margin: 10px 16px;
}
</style>
