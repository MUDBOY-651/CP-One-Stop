<template>
  <div class="profile-container">
    <div v-if="canEditProfile" class="user-header-top"
      :style="{ backgroundImage: 'url(' + getUserBackgroundImageUrl() + ')' }" @click="openBackgroundImageFilePicker">
      <input type="file" ref="backgroundImageFilePicker" style="display: none"
        @change="handleBackgroundImageFileChange">
    </div>
    <div v-else class="user-header-top" :style="{ backgroundImage: 'url(' + getUserBackgroundImageUrl() + ')' }">
    </div>
    <div class="user-info-container">
      <div class="user-info user-sub-info">
        <div class="info-card">
          <div class="info-rows">
            <div>
              <h3>用户信息</h3>
            </div>
            <div v-for="(field, index) in immutable_fields" :key="index" class="info-row">
              <span class="left-span">
                <span>{{ getFieldDisplayName(field) }}</span>
              </span>
              <span class="right-span">
                <span v-if="field == 'user_type'" class="info-content">{{ getUserType(user[field]) }}</span>
                <span v-else class="info-content">{{ user[field] }}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="info-card">
          <div class="info-rows">
            <div>
              <h3>教育经历</h3>
            </div>
            <div v-for="(field, index) in mutable_fields" :key="index" class="info-row">
              <span class="left-span">
                <span>{{ getFieldDisplayName(field) }}</span>
              </span>
              <span class="right-span">
                <div v-if="canEditProfile">
                  <span v-if="this.edit_message[field]" class="edit-message">{{ this.edit_message[field] }}</span>
                  <div v-else>
                    <span v-if="!this.editing_state[field]"
                      @click="this.editing_state[field] = true; this.resetEditMessage(field)" class="info-content">{{
      user[field] ||
      '暂未填写' }}</span>

                    <input v-else v-model="this.temp_field_value[field]" @blur="saveUserData(field)"
                      class="info-content" :placeholder="'请输入' + getFieldDisplayName(field)">
                  </div>

                </div>
                <span v-else class="info-content">{{ user[field] || '暂未填写' }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>


      <div class="user-info user-main-info">
        <div v-if="canEditProfile">
          <img :src="getUserAvatarUrl()" alt="User avatar" class="avatar" @click="openAvatarFilePicker">
          <h1>{{ user.username }}</h1>
          <p>{{ user.bio }}</p>
        </div>
        <div v-else>
          <img :src="getUserAvatarUrl()" alt="User avatar" class="avatar">
          <h1>{{ user.username }}</h1>
          <p>{{ user.bio }}</p>
        </div>
        <input type="file" ref="avatarFilePicker" style="display: none" @change="handleAvatarFileChange">
      </div>


      <div class="user-info data-display">

        <div class="platform" v-for="(item, index) in platforms" :key="index">
          <h3>
            <img :src="getPlatformIcon(item.platform_name)" class="platform-icon" alt="Platform Icon">
            <span class="platform-name">{{ getFieldDisplayName(item.platform_name) }}</span>
          </h3>

          <div class="platform-inforow">
            <p class="platform-field">
              {{ getPlatformUsernameShow(item) }}
            </p>
            <div v-if="canEditProfile">
              <span v-if="this.edit_message[item.platform_name]" class="edit-message">{{
      this.edit_message[item.platform_name] }}</span>
              <div v-else>
                <p v-if="!this.editing_state[item.platform_name]" @click="this.editing_state[item.platform_name] = true"
                  class="platform-field">
                  {{ item.platform_username || '暂未填写' }}
                </p>

                <input v-else v-model="temp_field_value[item.platform_name]" @blur="saveUserPlatformData(item)"
                  class="platform-field platform-input">

                <span v-if="this.edit_message[field]" class="edit-message">{{ this.edit_message[field] }}</span>
              </div>
            </div>
            <p v-else class="platform-field">{{ item.platform_username || '暂未填写' }}</p>
          </div>

          <div class="platform-inforow">
            <p v-if="item.platform_username && platformShowRating(item.platform_name)" class="platform-field">Rating：{{
      item.rating }}</p>
          </div>

          <div class="platform-inforow">
            <p v-if="item.platform_username">通过题目数：{{ item.ac_count }}</p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { VueElement } from 'vue';

const CONSTS = {
  EDIT_MESSAGE_SHOW_TIME: 1500,
}

export default {
  data() {
    return {
      immutable_fields: ['user_id', 'user_type', 'username', 'register_date'],
      mutable_fields: ['university', 'high_school', 'middle_school', 'primary_school', 'location'],
      fields: [
        'username', 'email', 'university', 'high_school', 'middle_school',
        'primary_school', 'avatar', 'background_img_url', 'bio', 'location',
        'Codeforces', 'Luogu', 'AtCoder', 'LeetCode', 'Vjudge', 'NowCoder', 'POJ'
      ],
      platforms: [],

      user: {
        user_id: '',
        username: '',
        email: '',
        register_date: '',
        university: '',
        high_school: '',
        middle_school: '',
        primary_school: '',
        avatar: '',
        background_image_url: '',
        bio: '',
        location: '',
        user_type: '',
      },
      editing_state: {},
      edit_message: {},
      temp_field_value: {},
      current_user: {
        user_id: ''
      },
      target_user: {
        user_id: ''
      },
    };
  },
  methods: {
    initFieldData() {
      // 将每个字段添加到各个字段对象中，并初始化为空字符串
      this.fields.forEach(field => {
        this.user[field] = ''
        this.editing_state[field] = ''
        this.edit_message[field] = ''
        this.temp_field_value[field] = ''
      });
    },
    getUserInfo() {
      // 获取用户信息的逻辑
      console.log("Getting user info: user_id=", this.$route.params.userId);

      axios.post('/api/user/' + this.$route.params.userId)
        .then(response => {
          console.log("get user data: ", response.data.user)
          console.log("get platform data: ", response.data.platforms)
          this.user = response.data.user;
          this.platforms = response.data.platforms;
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
        });
    },
    getUserAvatarUrl() {
      // 如果 user.avatar 不为空，则返回 user.avatar；否则返回默认图片路径
      return this.user.avatar || require('../assets/default_avatar.jpg');
    },
    getUserBackgroundImageUrl() {
      return this.user.background_image_url || require('../assets/default_bg.jpg');
    },
    getUserType() {
      if (this.user.user_type == 1) {
        return "管理员"
      } else {
        return "普通用户"
      }
    },
    getPlatformIcon(platform_name) {
      switch (platform_name) {
        case 'Codeforces':
          return require('../assets/codeforces.png');
        case 'AtCoder':
          return require('../assets/atcoder.png');
        case 'Luogu':
          return require('../assets/luogu.png');
        case 'LeetCode':
          return require('../assets/leetcode.png');
        case 'Vjudge':
          return require('../assets/vjudge.png');
        case 'NowCoder':
          return require('../assets/nowcoder.png');
        case 'POJ':
          return require('../assets/poj.png')
        // default:
        //   return require('../assets/default_platform.png');
      }
    },
    getPlatformUsernameShow(item) {
      switch (item.platform_name) {
        case 'Codeforces':
          return `用户名称：`
        case 'AtCoder':
          return `用户名称：`
        case 'Luogu':
          return `用户编号： `
        case 'LeetCode':
          return `用户名称：`
        case 'Vjudge':
          return `用户名称：`
        case 'NowCoder':
          return `用户编号： `
        case 'POJ':
          return `用户名称：`
      }
    },
    resetEditMessage(field) {
      this.edit_message[field] = '';
    },
    saveUserData(field) {
      this.editing_state[field] = false
      if (this.temp_field_value[field] == '' || this.temp_field_value[field] == this.user[field]) {
        return
      }
      axios.post(`/api/update/user?user_id=${this.user.user_id}&name=${field}&value=${this.temp_field_value[field]}`, {
        user_id: this.user.user_id,
        field: field,
        value: this.temp_field_value[field]
      })
        .then(response => {
          this.edit_message[field] = '修改成功!'
          this.user[field] = this.temp_field_value[field]
          this.temp_field_value[field] = ''
          console.log('User data updated:', response.data);
          setTimeout(() => {
            this.edit_message[field] = ''
          }, CONSTS.EDIT_MESSAGE_SHOW_TIME)
        })
        .catch(error => {
          this.edit_message[field] = '修改失败!'
          this.temp_field_value[field] = ''
          // 添加错误提示
          console.error('Error updating user data:', error);
          setTimeout(() => {
            this.edit_message[field] = ''
          }, CONSTS.EDIT_MESSAGE_SHOW_TIME)
        });
    },
    saveUserPlatformData(item) {
      this.editing_state[item.platform_name] = false
      if (this.temp_field_value[item.platform_name] == '' || this.temp_field_value[item.platform_name] == item.platform_username) {
        return
      }
      axios.post('/py_api/update/platform', {
        user_id: this.user.user_id,
        platform_name: item.platform_name,
        platform_username: this.temp_field_value[item.platform_name]
      })
        .then(response => {
          // 可以提示修改成功
          this.edit_message[item.platform_name] = '修改成功'
          this.temp_field_value[item.platform_name] = ''
          console.log("resp:", response.data)
          this.platforms[item.platform_name] = response.data
          // console.log('User platform data updated:', responsedata);
          setTimeout(() => {
            this.edit_message[item.platform_name] = ''
          }, CONSTS.EDIT_MESSAGE_SHOW_TIME)

        })
        .catch(error => {
          // 添加错误信息
          this.edit_message[item.platform_name] = '修改失败'
          this.temp_field_value[item.platform_name] = ''
          console.error('Error updating user platform data:', error);
          setTimeout(() => {
            this.edit_message[item.platform_name] = ''
          }, CONSTS.EDIT_MESSAGE_SHOW_TIME)
        });

    },
    getFieldDisplayName(field) {
      const fieldMap = {
        user_id: '用户编号',
        user_type: '用户类型',
        username: '用户名称',
        register_date: '注册时间',
        university: '大学',
        high_school: '高中',
        middle_school: '中学',
        primary_school: '小学',
        location: '现居住地',
        Luogu: '洛谷',
        NowCoder: '牛客',
      };
      return fieldMap[field] || field;
    },
    platformShowRating(platform_name) {
      switch (platform_name) {
        case 'Codeforces':
          return true;
        case 'AtCoder':
          return true;
        case 'Luogu':
          return true;
        case 'LeetCode':
          return false;
        case 'Vjudge':
          return false;
        case 'NowCoder':
          return false;
      }
    },


    // refs
    openBackgroundImageFilePicker() {
      this.$refs.backgroundImageFilePicker.click();
    },
    openAvatarFilePicker() {
      this.$refs.avatarFilePicker.click();
    },


    handleAvatarFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadAvatar(file);
      }
    },
    handleBackgroundImageFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadBackgroundImage(file);
      }
    },

    uploadAvatar(file) {
      // 这里是上传头像的逻辑，可以使用axios或其他库发送POST请求
      // 上传成功后更新用户头像的显示
      const formData = new FormData();
      formData.append('avatar', file);

      // 发送POST请求，将formData发送到服务器
      // 假设服务器返回新的头像URL
      axios.post(`/api/upload/user/avatar?user_id=${this.user.user_id}`, formData)
        .then(response => {
          // 更新用户头像URL
          this.user.avatar = response.data.avatar_url;
        })
        .catch(error => {
          console.error('Error uploading avatar:', error);
        });
    },
    uploadBackgroundImage(file) {
      const formData = new FormData();
      formData.append('background_image', file);

      // 发送POST请求，将formData发送到服务器
      axios.post(`/api/upload/user/background-image?user_id=${this.user.user_id}`, formData)
        .then(response => {
          this.user.background_image_url = response.data.background_image_url;
        })
        .catch(error => {
          console.error('Error uploading background image:', error);
        });
    },

  },
  computed: {
    canEditProfile() {
      // check
      return this.current_user.user_id == this.target_user.user_id;
    },
  },
  created() {
    this.current_user.user_id = this.$store.state.user_id;
    this.target_user.user_id = this.$route.params.userId;
  },
  mounted() {
    this.initFieldData();
    this.getUserInfo();
  },
};
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  padding: 20px;
  padding-left: 5%;
  padding-right: 5%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #efefef;
}

.user-header-top {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 0px;
  width: 100%;
  height: 425px;
  overflow: clip;
}

.user-info-container {
  width: 100%;
  height: 100%;
  /* white-space: nowrap; */
}

.info-rows {
  line-height: 1.5;
  display: block;
  justify-content: space-between;
  margin-bottom: 16px;
}

.info-rows h3 {
  margin-top: 0px;
  margin-bottom: 16px;
}



.info-row {
  display: flex;
  margin-bottom: 16px;
}

.left-span {
  flex: 1;
}

.right-span {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}


/* 右侧 span 的样式 */

.info-content {
  text-align: right;
  color: #8c8c8c;
  font-size: 16px;
}

.info-card {
  padding: 1.3em;

  display: block;
  margin-bottom: 1.3em;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(26, 26, 26, .1);
  box-sizing: border-box;
  padding: 1em;
}


.user-info {
  display: inline-block;
  vertical-align: top;
}

.user-sub-info {
  /* text-align: left; */
  width: 25%;
  margin-top: 10px;
}


.user-main-info {
  text-align: center;
  width: 50%;
  height: 100%;
}


.avatar {
  width: 40%;
  height: 40%;
  border-radius: 50%;
  margin-top: -20%;
  margin-bottom: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}


.data-display {
  text-align: left;
  width: 25%;
  height: 100%;
  margin-top: 10px;
}

.platform {
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.platform h3 {
  margin: 0 0 6px 0;
  display: flex;
}

.platform-inforow {
  display: flex;
  align-items: center;
}

.platfrom-name {
  align-items: center;
}

.platform-field {
  font-size: 16px;
  line-height: 1.5;
}

.platform p {
  margin: 6px 0;
}


.platform-icon {
  /* 自定义图标的样式 */
  width: 24px;
  /* 设置图标的宽度 */
  height: 24px;
  /* 设置图标的高度 */
  margin-right: 5px;
  /* 可以添加间距 */
}

.platform-input {
  background-color: #efefef;
}

.edit-message {
  color: red;
  opacity: 1;
}
</style>
