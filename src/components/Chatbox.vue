<template>
  <div class="chatbox">
    <div class="messages" ref="messagesContainer">
      <!-- 使用v-for循环遍历messages数组 -->
      <div v-for="(message, index) in messages" :key="index"
        :class="['message', { 'user-message': message.user, 'ai-message': !message.user }]">
        <!-- 包装消息内容以应用样式 -->
        <div class="message-content">
          {{ message.text }}
        </div>
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
export default {
  data() {
    return {
      userInput: '',
      messages: [],
    };
  },
  methods: {
    sendMessage() {
      if (!this.userInput.trim()) return;
      this.messages.push({ text: this.userInput, user: true });
      this.userInput = ''; // Clear input after sending
      this.$nextTick(() => {
        this.autoResize();
        const { messagesContainer } = this.$refs;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      });

      // Simulate an AI response
      setTimeout(() => {
        this.messages.push({ text: "This is a simulated response.", user: false });
        this.$nextTick(() => {
          const { messagesContainer } = this.$refs;
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
      }, 1000); // Simulate response delay
    },
    autoResize() {
      const textarea = this.$refs.messageInput;
      // 重置高度，以便能够准确测量
      textarea.style.height = 'auto';
      // 设置高度为scrollHeight以适应内容，加上边框的高度（如果有的话）
      textarea.style.height = textarea.scrollHeight + 'px';
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
  border-radius: 20px;
  color: white;
  max-width: 80%;
  word-wrap: break-word;
  white-space: pre-wrap;
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
