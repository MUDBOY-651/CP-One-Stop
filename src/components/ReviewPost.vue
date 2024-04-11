<template>
  <el-container>
    <el-main>
      <div class="post-content">
        <h2>{{ post.title }}</h2>
        <div class="post-author">
          <!-- <el-avatar :src="post.author_avatar"></el-avatar> -->
          <span style="font-size: 16px; color: grey">作者：</span>
          <span>
            <el-avatar :src="getAuthorAvatarUrl(post.author_avatar)" shape="shape" :size="35"></el-avatar>
            <span style="margin-left: 8px;">{{ post.author }}</span>
          </span>
        </div>
        <div class="post-excerpt">
          <span style="font-size: 16px; color: grey">摘要：</span>
          <span style="margin-top: 5px; margin-bottom: 5px">{{ post.excerpt }}</span>
        </div>
        <div class="post-meta">
          <span style="font-size:16px; color: grey">发布时间：{{ formatTimestamp(post.created_at) }}</span>
        </div>
        <!-- <el-divider></el-divider> -->
        <div v-html="renderMarkdown(post.content)"></div>
        <!-- <div v-html="post.content"></div> -->
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElContainer, ElMain, ElDivider, ElAvatar } from 'element-plus';
import axios from 'axios';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex'
import 'katex/dist/katex.min.css';


// 使用Vue Router的useRoute来获取当前路由信息
const route = useRoute();

// 文章数据
const post = ref({
  title: '',
  excerpt: '',
  content: '',
  created_at: '',
  author: '',
  author_avatar: ''
});

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          '</code></pre>';
      } catch (__) { }
    }

    return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

md.use(mk);

const renderMarkdown = (content) => {
  return md.render(content)
};

const getAuthorAvatarUrl = (avatar) => {
  return avatar || require('../assets/default_avatar.jpg');
};

const formatTimestamp = (timestamp) => {
  let now = new Date(timestamp * 1000);
  let y = now.getFullYear();
  let m = now.getMonth() + 1;
  let d = now.getDate();
  return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
};



// 从API获取文章详情
onMounted(() => {
  const postId = route.params.postId; // 获取路径参数中的 postId
  console.log(postId)

  axios.post(`/py_api/get/post-detail?post_id=${postId}`)
    .then(response => {
      console.log("get post detail resp:", response)
      post.value = response.data;
    })
    .catch(error => {
      console.error('Error get post detail:', error);
    });
});
</script>

<style scoped>
.post-content {
  max-width: 1200px;
  margin: 20px auto;
  min-height: 600px;
  padding: 20px;
  border: 1px solid #eaecef;
  /* 添加边框 */
  border-radius: 8px;
  /* 可选的，为边框添加圆角 */
  background-color: #fff;
  /* 可选的，设置背景颜色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 可选的，为整个内容添加轻微阴影 */
}

.post-excerpt,
.post-author,
.post-meta {
  border-bottom: 1px solid #eaecef;
  /* 添加分隔线 */
  padding-bottom: 10px;
  /* 添加一些padding以分开文本和分隔线 */
  margin-bottom: 10px;
  /* 添加一些margin来分隔下一个内容区块 */
}

h2 {
  margin-bottom: 20px;
  /* 为标题添加底部外边距 */
}

/* 调整文章内容的样式，为段落添加更多的margin */
.post-content div p {
  margin-bottom: 1em;
}
</style>
