<template>
  <div class="chatbox">
    <div class="messages" ref="messagesContainer">
      <!-- 使用v-for循环遍历messages数组 -->
      <div v-for="(message, index) in messages" :key="index"
        :class="['message', { 'user-message': message.user, 'ai-message': !message.user }]">
        <!-- 对于用户消息，直接显示文本 -->
        <template v-if="message.user">
          <div class="message-content">{{ message.text }}</div>
        </template>
        <!-- 对于AI消息，应用Markdown渲染 -->
        <template v-else>
          <div class="message-content" v-html="renderMarkdown(message.text)"></div>
        </template>
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="form-container">
      <textarea v-model="userInput" ref="messageInput" placeholder="Type your message here..." class="message-input"
        @input="autoResize" rows="1"></textarea>
      <button type="submit" class="send-button">Send</button>
    </form>
  </div>
</template>


<script>
import axios from 'axios'; // 引入axios
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const marked = new Marked (
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);


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
      this.gpt_messages.push({ role: "user", content: this.userInput })

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
          this.gpt_messages.push({ role: "assistant", content: response.data })
          this.messages.push({ text: response.data, user: false })
        }
        // 假设后端返回一个新的messages数组，包括用户的输入和AI的回复
        // if (response.data && response.data.messages) {
        //   this.gpt_messages.push({role: "assistant", content: response.data.messages[response.data.messages.length - 1].content})
        //   this.messages.push({ text: response.data.messages[response.data.messages.length - 1].content, user: false })
        // }
      } catch (error) {
        console.error('Error sending message:', error);
        // 处理错误情况（例如：显示错误消息）
      }

      this.$nextTick(() => {
        this.autoResize();
        const { messagesContainer } = this.$refs;
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // 滚动到底部
      });
    },
    autoResize() {
      // 自动调整输入框大小的逻辑保持不变
      const textarea = this.$refs.messageInput;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    },
    renderMarkdown(text) {
      return marked.parse(text);
    },
  },
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
  padding: 10px;
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
  padding: 0px 10px 0px 10px;
  margin-right: 55px;
  /* 预留出足够的空间给发送按钮，值根据按钮大小调整 */
  border: 1px solid #ccc;
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
