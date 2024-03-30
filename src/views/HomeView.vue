<template>
  <div class="home-content">
    <h1>欢迎使用 CP One-Stop 程序设计竞赛一站式服务平台</h1>
      <p>平台仍在测试开发中...</p>
    <h2>平台简介</h2>
      <p>CP One-Stop 的初衷是集成程序设计竞赛学习的公开资源, 不同于网络上已有的学习平台, CP One-Stop
        不只是做优质教学内容的生产者，更是要做好优质教学内容的搬运工，来帮助竞赛学习者正确的入门和找到适合自己的学习路线以快速提高自身的竞赛水平。好的入门方式能帮助学习者逐渐的建立兴趣并深入的学习, 拒绝算法竞赛从入门到放弃！</p>
    <h2>平台期望能够提供包含但不限于以下的功能</h2>
      <p>
        1. 用户可以像使用搜索引擎一样在平台上进行提问，平台结合大语言模型给出合理的回答，此外对于部分问题也可以通过文本分类给出更具有针对性的答案。
        <router-link to="/chat" class="navbar-link">点击这里使用！</router-link>
      </p>
      <p>
        2. 期望模型能够学习全世界程序设计竞赛选手的教育经历、教育背景和对竞赛学习的相关经验，能够根据用户提供的教育经历、教育环境给出相对适合用户的学习路线和资源的建议，这也是 CP One-Stop
        的主要差异点。模型能够学习的相关数据，可以通过建立一个有偿的贡献渠道来收集。
      </p>
      <p>
        3. CP One-Stop 也能集成对程序设计竞赛常用的在线比赛平台的数据统计，用户可以在平台上同时查看 Codeforces、Atcoder、洛谷等相关的数据如 rating、题目通过数等，方便观察用户自己的学习情况。
        <router-link to="/user/2" class="navbar-link">点击进入个人主页查看！</router-link>
      </p>
    <h2>期望的非核心的额外 feature</h2>
      <p>1. 平台内置发帖功能，方便用户交流</p>
      <p>2. 提供站内发帖搜索</p>

    <!-- 其余首页内容 -->
  </div>
</template>

<script>
export default {
};
</script>

<style scoped>
.home-content {
  max-width: 95%;
  height: 90%;
  margin: 1rem auto;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
