<template>
  <div class="home-container">
    <div class="home-left-content">
      <div class="intro">

        <h1>欢迎使用 CP One-Stop 程序设计竞赛一站式服务平台 ^.^</h1>
        <p>平台仍在测试开发中...</p>
        <h2>平台简介</h2>
        <p>CP One-Stop 的初衷是集成程序设计竞赛学习的公开资源, 不同于网络上已有的学习平台, CP One-Stop
          不只是做优质教学内容的生产者，更是要做好优质教学内容的搬运工，来帮助竞赛学习者正确的入门和找到适合自己的学习路线以快速提高自身的竞赛水平。好的入门方式能帮助学习者逐渐的建立兴趣并深入的学习, 拒绝算法竞赛从入门到放弃！
        </p>
        <h3>平台期望能够提供包含但不限于以下的功能</h3>
        <p>
          1. 用户可以像使用搜索引擎一样在平台上进行提问，平台结合大语言模型给出合理的回答，此外对于部分问题也可以通过文本分类给出更具有针对性的答案。
          <router-link to="/chat" class="navbar-link">点击这里使用！</router-link>
        </p>
        <p>
          2. 期望模型能够学习全世界程序设计竞赛选手的竞赛学习的相关经验，能够根据用户提供的教育经历、教育环境给出相对适合用户的学习路线和资源的建议，这也是 CP One-Stop
          的主要差异点。模型能够学习的相关数据。
        </p>
        <p>
          3. CP One-Stop 也能集成对程序设计竞赛常用的在线比赛平台的数据统计，用户可以在平台上同时查看 Codeforces、Atcoder、洛谷等相关的数据如
          rating、题目通过数等，方便观察用户自己的学习情况。
          <router-link :to="'/user/' + this.$store.state.user_id" class="navbar-link">点击进入个人主页查看！</router-link>
        </p>
      </div>
      <!-- 其余首页内容 -->

      <header class="header">
        <!-- 标题和搜索等可以放这里 -->
        <h2>最近讨论</h2>
        <button @click="createPost">我要发文</button>
      </header>

      <section>
        <article v-for="post in posts" :key="post.post_id" class="post">

          <h2 style="margin-bottom: 5px; margin-top: 5px;">{{ post.title }}</h2>

          <div class="post-author">
            <span style="font-size: 16px; color: grey">作者：</span>
            <span style="display:flex; align-items: center;">
              <el-avatar :src=getAuthorAvatarUrl(post.author_avatar) shape="circle" :size="35"></el-avatar>
              <span style="margin-left: 8px;">{{ post.author }}</span>
            </span>
          </div>

          <p style="margin-top: 5px; margin-bottom: 5px">{{ post.excerpt || 无摘要 }}</p>
          <div class="post-meta">
            <span style="color:grey">发布于 {{ formatTimestamp(post.created_at) }}</span>
            <button @click="readMore(post.post_id)">阅读更多</button>
          </div>
        </article>
      </section>

    </div>
    <div class="home-right-content">
      <div class="roundbox sidebox">
        <div class="titled">
          >>近期赛事
        </div>
        <div>
          <div class="contest-info">
            <span class="contest-source">Codeforces</span>
            <br>
            <a href="https://codeforces.com/contests/1952">April Fools Day Contest 2024</a>
            <br>
            <span class="countdown"> Rated for All </span>
            <br>
            <a href="https://codeforces.com"> Codeforces HomePage>></a>
          </div>
          <div class="contest-info">
            <span class="contest-source">AtCoder</span>
            <br>
            <a href="https://atcoder.jp/contests/abc348">AtCoder Beginner Contest 348</a>
            <br>
            <span class="countdown"> Rated for under 2000 </span>
            <br>
            <a href="https://atcoder.jp/home">AtCoder HomePage</a>
          </div>
        </div>
      </div>

      <div class="roundbox sidebox">
        <div class="titled">
          >>{{ user.username }}
        </div>
        <div class="personal-content">
          <div>
            <ul class="personal-info" style="margin-top: 0.5em; margin-bottom: 0.5em;">
              <li><span>用户名：</span> <span> {{ user.username }} </span></li>
              <li><span>注册时间：</span><span style="color:#777">{{ formatTimestamp(user.register_ts) }}</span></li>
            </ul>
            <div style="font-size: small; margin-top: auto; margin-bottom: auto;">前往其他网站个人主页</div>
            <ul class="nav-links">
              <li>AtCoder</li>
              <li>Codeforces</li>
              <li>洛谷</li>
              <li>VJudge</li>
            </ul>
          </div>

          <div class="avatar-content">
            <div class="avatar">
              <img :src="getUserAvatarUrl()" class="avatar" style="overflow-clip-margin: content-box; overflow: clip">
            </div>
          </div>
        </div>
      </div>

      <div class="roundbox sidebox">
        <div class="titled">
          >>查找用户
        </div>
        <form @click.prevent="handleSubmit" class="handleForm">
          <div style="padding:1em; text-align:right;">
            <label style="padding-right:1em;">
              用户名:
              <input v-model="find_user" style="width:12em;" type="text" class="handleBox" autocomplete="off">
            </label>

          </div>
          <div style="padding: 0em 1em 1em 1em; text-align:right">
            <button style="height:1.65em;padding:0 0.75em;" @click="findUser()"> 查找</button>
          </div>

        </form>
      </div>
      <div class="roundbox sidebox">
        <div class="titled">
          >>本站公告
        </div>
        <div class="notice-container">
          <p class="notice-title">
            <router-link to="/post/1" class="notice-router-link">CP One-Stop 平台简介</router-link>
          </p>
          <p class="notice-title">
            <router-link to="/post/2" class="notice-router-link">CP One-Stop 新用户必读</router-link>
          </p>
          <p class="notice-title">
            <router-link to="/post/3" class="notice-router-link">CP One-Stop 发文规范</router-link>
          </p>
          <p class="notice-title">
            <router-link to="/post/4" class="notice-router-link">管理员名单</router-link>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ElContainer, ElMain, ElDivider, ElAvatar } from 'element-plus';

export default {
  data() {
    return {
      // 假设的文章数据，实际应用中您可能需要从后端API获取

      posts: [],
      user: {
        user_id: '',
        avatar: '',
        username: '',
        register_ts: '',
        links: {

        }
      },
      contest_info: {
        Codeforces: {
          contest_name: '',
          contest_url: '',
        },
        AtCoder: {
          contest_name: '',
          contest_url: '',
        },
      },
      find_user: '',
    };
  },
  methods: {
    getUserAvatarUrl() {
      // 如果 user.avatar 不为空，则返回 user.avatar；否则返回默认图片路径
      return this.user.avatar || require('../assets/default_avatar.jpg')
    },
    getAuthorAvatarUrl(avatar) {
      return avatar || require('../assets/default_avatar.jpg');
    },
    formatTimestamp(timestamp) {
      let now = new Date(timestamp * 1000);
      let y = now.getFullYear();
      let m = now.getMonth() + 1;
      let d = now.getDate();
      return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
    },
    getUserHomeInfo() {
      // 向后端发送请求
      axios.get(`/py_api/get/user-home-info?user_id=${this.user.user_id}`)
        .then(response => {
          console.log("get user home info: ", response)
          this.user.avatar = response.data.user.avatar;
          this.user.username = response.data.user.username;
          this.user.register_ts = response.data.user.register_ts;
          this.user.links = response.data.user.links;
          console.log(this.user)
        })
        .catch(error => {
          console.error('Error fetching user home info:', error);
        });

    },
    getLatestPost(post_count) {
      // 向后端发送请求
      axios.get(`/py_api/get/latest-post?post_count=${post_count}`)
        .then(response => {
          console.log("get latest post data: ", response.data.posts)
          this.posts = response.data.posts;
        })
        .catch(error => {
          console.error('Error fetching latest-post:', error);
        });
    },
    createPost() {
      // 跳转到文章发布页面
      this.$router.push({ path: '/publish/post' });
    },
    readMore(post_id) {
      // 跳转到文章详情页面
      this.$router.push({ path: `/post/${post_id}` });
    },
    findUser() {
      axios.get(`/py_api/find-user?username=${this.find_user}`)
        .then(response => {
          console.log("find user_id: ", response.data.user_id)
          const userId = response.data.user_id;
          this.$router.push({ path: `/user/${userId}` });
        })
        .catch(error => {
          this.$message({
            type: 'warning',
            message: error.response.data.detail || "未知原因，操作失败",
          });
          console.error('Error findUser():', error);
        });
    }
  },
  mounted() {
    this.getUserHomeInfo();
    this.getLatestPost(5);
  },
  created() {
    console.log("user_type:", this.$store.state.user_type)
    this.user.user_id = this.$store.state.user_id;
  }
};

</script>

<style scoped>
.home-left-content {
  width: 70%;
  height: 100%;
  margin: 1rem auto;
  padding: 1rem;
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
  /* border-radius: 8px; */
  margin-right: auto;
  border-left: 2px dashed var(--el-border-color);
}

.home-right-content {
  float: right;
  width: 20em;
  display: inline;
  margin: 1em 1em 1em;
  /* width: 30%;
  height: 100%;
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 8px;
  margin-right: auto */
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
}

.home-container {
  height: 100%;
  display: flex;
  /* flex-direction: column; */
  /* align-items: center; */
  max-width: 1300px;
  padding: 20px;
  padding-left: 5%;
  padding-right: 5%;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
  border-radius: 8px;
  margin: auto;
  /* background-color: #efefef; */
}

.sidebox {
  margin-bottom: 1.5em;
}

.roundbox {
  border: 2px solid var(--el-border-color);
  position: relative;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}


.roundbox .titled {
  padding: 0 0 .3em .5em;
  border-bottom: 1px solid var(--el-border-color);
  color: #409eff;
  font-size: 1.4rem;
  font-weight: 700;
  margin: .2em 0;
  position: relative;
}

.contest-info {
  text-align: center;
  padding: 0.5em;
}

.contest-source {
  color: #4A5D4B;
  font-size: 1.3rem;
  font-weight: 700;
}

.countdown {
  color: #777;
}

.avatar-content {
  float: right;
  margin-left: auto;
  margin-right: auto;
}

.avatar {
  text-align: center;
  font-size: smaller;
  width: 80px;
  height: 80px;
}

.personal-content {
  display: flex;
  margin: 0.8em;
}

.personal-content .nav-links {
  margin-top: 0.5em;

}

.personal-content li {
  list-style: disc;
  list-style-position: inside;
}

.personal-content li {
  font-size: 0.8em;
}



.notice-container {
  padding: 16px 16px 12px 16px;
  position: relative;
}

.notice-title {
  margin: 0 0 1.3rem;
}

.notice-router-link {
  color: #3498db;
  text-decoration: none;
}


.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.content {
  margin-top: 20px;
}

.post {
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}

.post:last-child {
  border-bottom: none;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8em;
}

.post-author {
  display: flex;
  align-items: center;
}

button {
  background-color: #409eff;
  border: none;
  padding: 5px 15px;
  color: white;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

.intro {
  padding-bottom: 1em;
  border-bottom: 1px solid var(--el-border-color);
}
</style>
