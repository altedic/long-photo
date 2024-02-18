<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div class="page-home">
    <fireworks />
    <h2 class="title">我的相册</h2>
    <div class="empty" v-if="loading">
      <t-loading text="加载中..." />
    </div>

    <template v-else>
      <div class="user-name">
        <div v-if="userInfo.username">
          欢迎您：{{ userInfo.username }}
          <t-button theme="danger" size="mini" @click="handleLogout"
            >退出</t-button
          >
          <t-button theme="primary" size="mini" @click="jumpToUpload"
            >发布</t-button>
        </div>
        <div v-else>
          <t-button
            theme="primary"
            to="/login"
            size="small"
            @click="handleJumpToLogin"
            >请登录</t-button
          >
        </div>
      </div>

      <div class="waterfall-flow">
        <template v-if="images.length !== 0">
          <div
            class="item"
            v-for="(item, i) in images"
            :key="i"
            @click="handleOpenImage(i)"
          >
            <img :src="`${item.url}?imageMogr2/thumbnail/400x`" class="image" />
          </div>
        </template>
        <template v-else>
          <div
            class="item"
            v-for="item in defaultPhotoWallData.list"
            :key="item"
          >
            <img :src="`${item}?thumbnail/400x`" class="image" />
          </div>
          <div class="cover">
            <t-button theme="primary" @click="jumpToUpload">去发布</t-button>
          </div>
        </template>
      </div>
      <t-image-viewer
        v-model:images="imagesShow"
        v-model:visible="visible"
        show-index
        v-model:index="index"
        close-btn
      />
    </template>
  </div>
</template>

<script>
import photo1 from '@/assets/cj/cj1.jpg';
import photo2 from '@/assets/cj/cj2.jpg';
import photo3 from '@/assets/cj/cj3.jpg';
import photo4 from '@/assets/cj/cj4.jpg';
import photo5 from '@/assets/cj/cj5.jpg';
import photo6 from '@/assets/cj/cj6.jpg';
// import photo4 from '@/assets/photo4.png';
// import photo5 from '@/assets/photo5.png';
// import photo6 from '@/assets/photo6.png';
// import photo7 from '@/assets/photo7.png';

import Fireworks from '@/components/fireworks.vue';

export default {
  components: {
    Fireworks,
  },
  data() {
    return {
      defaultPhotoWallData: {
        list: [photo1, photo2, photo3, photo4, photo5, photo6],
      },
      photoWallData: {
        list: [],
      },
      visible: false,
      index: 0,
      loading: false,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    images() {
      let imageList = this.photoWallData?.list || [];
      return imageList.map((item) => {
        return {
          url: item,
        };
      });
    },
    imagesShow() {
      return this.images.map((item) => item.url);
    },
  },
  mounted() {
    this.getImages();
  },
  methods: {
    handleOpenImage(index) {
      console.log(index);
      this.visible = true;
      this.index = index;
    },
    handleLogout() {
      this.$store.commit('updateUserInfo', {});
      localStorage.removeItem('token');
      this.photoWallData = {
        list: [],
      };
    },
    handleJumpToLogin() {
      this.$router.push('/login');
    },
    /***
     * 获取相册数据
     */
    async getImages() {
      // 创建相册
      const res = await this.$http('/api/photo-wall', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.loading = false;
      if (res.code === 0) {
        this.photoWallData = res.data.list[0];
      } else {
        alert(res.message || '请求失败');
      }
    },
    jumpToUpload() {
      this.$router.push('/upload');
    },
  },
};
</script>

<style scoped>
.page-home {
  background: radial-gradient(ellipse at bottom, #d12f32 0, #53182a 100%);
  height: 100%;
  min-height: 100vh;
  margin: 0 auto;
  overflow: hidden;
  color: #fff;
}
.title {
  text-align: center;
  font-size: 18px;
  margin: 10px 0;
}
.user-name {
  font-size: 12px;
}
.user-name > div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.waterfall-flow {
  column-count: 2;
  column-gap: 10px;
  margin: 10px 5px;
  position: relative;
}
.waterfall-flow .cover {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.item {
  break-inside: avoid;
  margin-bottom: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  overflow: hidden;
}
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}

.image {
  width: 100%;
  height: auto;
  display: block;
}

/deep/ .t-loading__gradient-conic {
  transform: scale(1) !important;
}
/deep/ .t-image-viewer__content {
  transform: translate(-50%, -50%) scale(1);
}
/deep/ .t-button--size-mini {
  padding: 3px 5px;
  margin: 0 10px;
}
</style>
