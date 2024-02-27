<template>
  <div class="profile-container">
    <div class="user-header-top">
    </div>
    <div class="user-info-container">
      <div class="user-info user-sub-info">
        <div class="info-card">
          <div class="info-row">
            <b>基本信息</b>
          </div>
          <info-row>
            <span>注册时间</span>
            <span class="info-content">{{ user.registerDate }}</span>
          </info-row>
        </div>
        <div class="info-card">
          <div class="info-row">
            <b>教育经历</b>
          </div>
          <div class="info-row">
            <span>大学</span>
            <span class="info-content">{{ user.organization }}</span>
          </div>
        </div>
      </div>
      <div class="user-info user-main-info">
        <img :src="user.avatar" alt="User avatar" class="avatar">
        <h1>{{ user.username }}</h1>
        <p>{{ user.bio }}</p>
      </div>
      <div class="user-info data-display">
        <div class="platform" v-for="(item, index) in platforms" :key="index">
          <h3>{{ item.name }}</h3>
          <p>Rating: {{ item.rating }}</p>
          <p>做题量: {{ item.problemsSolved }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "Roshin",
        backgroundPhoto: require("../assets/example_bg.jpg"),
        avatar: require("../assets/example_img.jpg"),
        organization: "四川大学",
        bio: "Passionate about AI and competitive programming.",
        registerDate: "2024-2-30",
      },
      platforms: [
        { name: "Codeforces", rating: 2400, problemsSolved: 300 },
        { name: "LeetCode", rating: 1500, problemsSolved: 500 },
        { name: "洛谷", rating: 2200, problemsSolved: 200 },
      ]
    };
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #efefef;
}

.user-header-top {
  background-image: url("../assets/example_bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 0px;
  width: 100%;
  height: 400px;
  overflow: clip;
}

.user-info-container {
  width: 100%;
  height: 100%;
  /* white-space: nowrap; */
}

.info-rows {
  text-align: left;
}

.info-row {
  display: flow-root;
  margin-bottom: .5em;
}

.info-content {
  float: right;
  color: #8c8c8c;
}

.info-card {
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
  text-align: left;
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
  margin: 0 0 10px 0;
}

.platform p {
  margin: 5px 0;
}
</style>
