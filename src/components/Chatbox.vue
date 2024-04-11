<template>
  <div class="chatbox">
    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index"
        :class="['message', { 'user-message': message.user, 'ai-message': !message.user }]">
        <template v-if="message.user">
          <div class="message-content">{{ message.text }}</div>
        </template>
        <template v-else>
          <div class="message-content" v-html="renderMarkdown(message.text)"></div>
        </template>
      </div>
    </div>
    <ElForm @submit.native.prevent="sendMessage" class="form-container">
      <ElInput
        v-model="userInput"
        type="textarea"
        class="message-input"
        placeholder="请在这里输入您的问题..."
        :autosize="{ minRows: 1, maxRows: 15 }">
      </ElInput>
      <ElButton type="primary" native-type="submit" class="send-button">发送</ElButton>
    </ElForm>
  </div>
</template>



<script>
import axios from 'axios'; // 引入axios
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex';
import 'katex/dist/katex.min.css';

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

md.use(mk)



export default {
  data() {
    return {
      userInput: '',
      messages: [],
      // gpt_messages: [{ role: "system", content: "现在你是文心一言模型, You are a helpful assistant who only answer questions about competitve programming, which is called 程序设计竞赛 in chinese." }],
      gpt_messages: []
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;

      // 将用户输入添加到messages
      this.messages.push({ text: this.userInput, user: true });
      // this.gpt_messages.push({ role: "user", content: this.userInput })
      this.gpt_messages.push(this.userInput)

      this.userInput = ''; // 清空输入框
      // 准备发送到后端的数据
      const payload = {
        messages: this.gpt_messages,
      };

      try {
        // 发送POST请求到后端
        const response = await axios.post('/py_api/chat', payload);


        console.log(response.data)

        if (response.data) {
          // this.gpt_messages.push({ role: "assistant", content: response.data })
          this.gpt_messages.push(response.data)
          this.messages.push({ text: response.data, user: false })
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }

    },
    renderMarkdown(text) {
      return md.render(text)
    },
    initMessages() {
      // 示例消息填充逻辑
      setTimeout(() => {
        this.messages.push({
          text: '您好！我是你的专属程序设计竞赛小助手，请问有什么程序设计竞赛相关的问题需要我解答的吗？',
          user: false
        });
      }, 500); // 设置500毫秒的延时
    }
  },
  mounted() {
    this.initMessages();
  }
};
</script>


<style scoped>
.chatbox {
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  width: 85%;
  height: 87vh;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.messages {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9f9f9;
}

.message {
  display: flex;
  width: 100%;
  margin: 5px 0;
}

.message-content {
  padding: 18px;
  border-radius: 10px;
  color: white;
  max-width: 80%;
  word-wrap: break-word;
  white-space: pre-wrap;
  font-size: 14px;
}

.user-message .message-content {
  margin-left: auto;
  background-color: #007bff;
}

.ai-message .message-content {
  margin-right: auto;
  background-color: #666;
}

.form-container {
  display: flex;
  position: relative;
  /* 确保可以相对定位其子元素 */
  align-items: flex-start;
  /* 从顶部对齐子元素 */
  padding: 10px;
}

.message-input {
  vertical-align: middle;
  line-height: 30px;
  flex-grow: 1;
  border-radius: 20px;
  /* 阻止用户手动调整大小 */
  resize: none;
  margin-right: 55px;
  /* 预留出足够的空间给发送按钮，值根据按钮大小调整 */
  outline: none;
  /* 移除焦点时的轮廓 */
  min-height: 30px;
}

.send-button {
  position: absolute;
  right: 10px;
  /* 与父容器右边距保持一致 */
  bottom: 10px;
  /* 调整至底部，与父容器底部距离保持一致 */
  padding: 6px 12px;
  border-radius: 20px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
</style>
