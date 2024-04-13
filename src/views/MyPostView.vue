<template>
  <div class="app-container">
    <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect"
      style="width: 200px; height: 100%; float: left;">
      <el-menu-item index="1">平台近期动态</el-menu-item>
      <el-menu-item index="2">个人文章列表</el-menu-item>
      <el-menu-item index="3">收藏文章列表</el-menu-item>
    </el-menu>
    <div class="blog-home">
      <header class="header">
        <!-- 标题和搜索等可以放这里 -->
        <h1>文章主页</h1>
        <button @click="createPost" style="background-color: #409eff;">发布文章</button>
      </header>
      <section class="content">
        <div v-if="loading">加载中...</div>
        <article v-else v-for="post in posts" :key="post.post_id" class="post">
          <h2 style="margin-bottom: 5px; margin-top: 5px;">{{ post.title }}</h2>

          <p style="margin-top: 5px; margin-bottom: 5px">{{ post.excerpt }}</p>

          <div class="post-meta">
            <span style="color:grey">发布于 {{ formatTimestamp(post.created_at) }}</span>
            <span>
              <button @click="deletePost(post.post_id)" class="delete-button">删除</button> <!-- 添加编辑按钮 -->
              <button @click="editPost(post.post_id)" class="edit-button">编辑</button> <!-- 添加编辑按钮 -->
              <button @click="readMore(post.post_id)">阅读更多</button>
            </span>
          </div>
        </article>
      </section>

      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
          :page-sizes="[5, 10, 20, 50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
          :total="total_posts">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      posts: [],
      loading: true,
      page: 1, // 当前页码
      limit: 10, // 每页显示的条目数
      total_posts: 0, // 总页数，需要后端返回这个数据
    };
  },
  methods: {
    formatTimestamp(timestamp) {
      let now = new Date(timestamp * 1000);
      let y = now.getFullYear();
      let m = now.getMonth() + 1;
      let d = now.getDate();
      return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
    },
    createPost() {
      // 跳转到文章发布页面
      this.$router.push({ path: '/publish/post' });
    },
    readMore(postId) {
      // 跳转到文章详情页面
      this.$router.push({ path: `/post/${postId}` });
    },
    fetchPosts() {
      axios.get(`/py_api/get/my-post?user_id=${this.$store.state.user_id}&page=${this.page}&limit=${this.limit}`)
        .then(response => {
          console.log("get my post resp: ", response);
          this.posts = response.data.posts;
          this.total_posts = response.data.total_posts; // 假设后端返回总页数
          this.loading = false;
        })
        .catch(error => {
          console.error('Error fetching user post:', error);
          this.loading = false
        });
    },
    editPost(postId) {
      this.$router.push({ path: `/edit/post/${postId}` });
    },
    deletePost(postId) {
      axios.post(`/py_api/delete/post?post_id=${postId}`)
        .then(response => {
          this.posts = this.posts.filter(post => post.post_id !== postId);
          this.total_posts--;
        }).catch(error => {
          console.error('Error delete post:', error);
        })
    },
    handleSizeChange(newSize) {
      this.limit = newSize;
      this.fetchPosts();
    },
    handleCurrentChange(newPage) {
      this.page = newPage;
      this.fetchPosts();
    },
  },
  mounted() {
    this.fetchPosts();
  },
};
</script>

<style scoped>
.blog-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* background-color: #efefef; */
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

button {
  background-color: red;
  /* 绿色背景 */
  border: none;
  padding: 5px 15px;
  color: white;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

.edit-button {
  background-color: green;
  /* 绿色背景 */
  margin-left: 10px;
  /* 在按钮之间添加一些间隔 */
  margin-right: 10px;
}

.delete-button {
  background-color: #f76262;
  margin-left: 10px;
  /* 在按钮之间添加一些间隔 */
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>
