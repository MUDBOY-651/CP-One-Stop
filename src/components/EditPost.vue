<template>
  <el-container>
    <el-main>
      <div class="edit-post">
        <h1>发布文章</h1>
        <el-form label-width="80px">
          <el-form-item label="文章标题">
            <el-input type="text" v-model="form.title" size="large" maxlength="45" show-word-limit
              input-style="width:50%; font-size:18px;"></el-input>
          </el-form-item>
          <el-form-item label="文章摘要">
            <el-input type="textarea" v-model="form.excerpt" size="large" maxlength="100" show-word-limit
              :autosize="{ minRows: 2, maxRows: 4 }" input-style="width:75%;font-size:16px;"></el-input>
          </el-form-item>
          <el-form-item label="文章内容">
            <p style="font-size:14px; color:grey">支持 markdown 格式，请注意备份输入数据</p>
            <el-input type="textarea" v-model="form.content" :autosize="{ minRows: 25, maxRows: 50 }"
              maxlength="1000000" input-style="width:100%; font-size:15px"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button type="primary" @click="returnMyPost"
              style="height: 2.5em; width:15%; font-size:16px; border-radius: 10px; background-color:blanchedalmond;">
              <span style="color: black">返回个人专栏</span>
            </el-button>
            <el-button type="primary" @click="submitForm(false)"
              style="height: 2.5em; width:15%; font-size:16px; border-radius: 10px; background-color:#65DA78; margin-left:1em">
              <span style="color:white">保存文章</span>
            </el-button>
            <el-button type="primary" @click="submitForm(true)"
              style="height: 2.5em; width:15%; font-size:16px; border-radius: 10px; background-color:#f76262; margin-left:1em">
              <span style="color:white">发布文章</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { ref } from 'vue';
import { ElContainer, ElMain, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  components: {
    ElContainer, ElMain, ElForm, ElFormItem, ElInput, ElButton,
    ref,
  },
  data() {
    return {
      form: {
        title: '',
        excerpt: '',
        content: '',
      },
      post_id: '',
    }
  },
  methods: {
    initForm() {
      axios.get(`/py_api/get/post-detail?post_id=${this.post_id}`)
        .then(response => {
          console.log("get post detail resp:", response)
          this.form.title = response.data.title;
          this.form.excerpt = response.data.excerpt;
          this.form.content = response.data.content;
        })
        .catch(error => {
          console.error('Error get post detail:', error);
        });
    },
    submitForm(ask_review) {
      console.log('Form Data:', this.form.value);
      // 在这里发送表单数据到服务器...
      let req = {
        "post_id": this.post_id,
        "title": this.form.title,
        "excerpt": this.form.excerpt,
        "content": this.form.content,
        "ask_review": ask_review,
      }
      axios.post('/py_api/update/post', req)
        .then(response => {
          console.log(`edit post ${this.post_id} success`)
          this.$router.push({ path: `/post/${this.post_id}` })
        })
        .catch(error => {
          console.error('Error editing post:', error);
        });
    },
    returnMyPost() {
      this.$router.push({ path: '/mypost' })
    },
  },
  created() {
    this.post_id = this.$route.params.postId
    this.initForm();
  },
}
</script>

<style scoped>
.edit-post {
  max-width: 1200px;
  margin: 0 auto;
}

.el-form-item {
  margin-bottom: 20px;
}

/* .el-input,
.el-textarea__inner {
  width: 100%;
}  */

/* 可以设置一个最小高度 */
.el-textarea__inner {
  min-height: 200px;
  /* 这是初始的最小高度，您可以根据需要调整 */
}

.el-form-item .el-form-item__content {
  margin-left: 0px !important;
}
</style>
