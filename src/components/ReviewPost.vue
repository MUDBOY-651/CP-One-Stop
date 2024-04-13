<template>

  <div class="app-container">
    <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect"
      style="width: 200px; height: 100%; float: left;">
      <el-menu-item index="1">待审核列表</el-menu-item>
      <el-menu-item index="2">历史审核记录</el-menu-item>
    </el-menu>


    <!-- 根据当前状态渲染不同的表格 -->
    <div class="review-content" v-if="currentTab === '1'">
      <!-- 待审核列表 -->
      <el-table :data="posts" stripe style="width: 100%; margin-bottom: 1em;">
        <el-table-column prop="post_id" width="100" label="文章编号"></el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip="true" />
        <el-table-column prop="author" width="300" label="作者" show-overflow-tooltip="true" />
        <el-table-column prop="created_at" width="180" label="发布时间" align="center" />
        <el-table-column label="操作" width="360" align="center">
          <template #default="scope">
            <el-button size="small" @click="approvepost(scope.row)">审核通过</el-button>
            <el-button size="small" @click="showRejectDialog(scope.row)">审核不通过</el-button>
            <el-button size="small" @click="viewDetails(scope.row)">查看文章详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total_posts">
      </el-pagination>

      <el-dialog title="输入拒绝理由" v-model="rejectDialogVisible" width="30%" @close="resetRejectReason">
        <el-input type="textarea" v-model="rejectReason" :rows="2" placeholder="请输入拒绝理由" style="margin-bottom: 1em;">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rejectDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="rejectpost(currentpost)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="review-content" v-else-if="currentTab === '2'">
      <!-- 历史审核记录 -->
      <el-table :data="review_history" stripe style="width: 100%; margin-bottom:1em">
        <el-table-column prop="review_id" label="审核编号" width="100" />
        <el-table-column prop="post_id" width="100" label="文章编号"></el-table-column>
        <el-table-column prop="post_title" label="文章标题"></el-table-column>
        <el-table-column prop="reviewer_id" label="审核人ID" width="100" align="center" />
        <el-table-column prop="review_pass" label="审核是否通过" width="180" align="center" />
        <el-table-column prop="reason" label="原因" show-overflow-tooltip="true" />
        <el-table-column prop="reviewed_at" label="审核时间" width="180" align="center" />
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total_reviewed">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'



export default {
  data() {
    return {
      posts: [],
      review_history: [],
      review_records: [],
      currentPage: 1,
      pageSize: 10,
      total_posts: 0,
      total_reviewed: 0,
      rejectDialogVisible: false,
      rejectReason: '',
      currentpost: null,
      currentTab: '1',  // 默认显示待审核列表
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
    fetchposts(page, limit) {
      axios.get(`/py_api/get/review-post?page=${page}&limit=${limit}`)
        .then(response => {
          this.posts = response.data.posts;
          this.total_posts = response.data.review_count;
          for (var post of this.posts) {
            post.created_at = this.formatTimestamp(post.created_at)
          }
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
        })
    },
    fetchHistory(page, limit) {
      // 假设这是从后端获取数据的 API 调用
      axios.get(`/py_api/get/review-history?page=${page}&limit=${limit}`)
        .then(response => {
          this.review_history = response.data.review_history;
          for (var record of this.review_history) {
            record.reviewed_at = this.formatTimestamp(record.reviewed_at)
            if (record.review_pass == 0) {
              record.review_pass = '未通过';
            } else {
              record.review_pass = '通过';
            }
          }
          this.review_history.reverse();
          this.total_reviewed = response.data.reviewed_count;
          console.log("history", this.review_history)
        })
        .catch(error => {
          console.error('Error fetching history:', error);
        });
    },
    handleSelect(key) {
      this.currentTab = key;
      this.currentPage = 1;
      if (key === '2') {
        this.fetchHistory(this.currentPage, this.pageSize);
      } else {
        this.fetchposts(this.currentPage, this.pageSize)
      }
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      if (this.currentTab === '1') {
        this.fetchposts(this.currentPage, this.pageSize);
      } else if (this.currentTab === '2') {
        this.fetchHistory(this.currentPage, this.pageSize);
      }
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      if (this.currentTab === '1') {
        this.fetchposts(this.currentPage, this.pageSize);
      } else if (this.currentTab === '2') {
        this.fetchHistory(this.currentPage, this.pageSize);
      }
    },
    approvepost(post) {
      if (!this.$store.state.user_id) {
        this.$message({
          type: 'error',
          message: '管理员用户非法，操作失败!'
        });
        console.log("admin id invalid, reject operation")
        return;
      }
      let req = {
        "post_id": post.post_id,
        "reviewer_id": this.$store.state.user_id,
        "reason": "符合发文规范，审核通过",
        "review_pass": true,
      }
      axios.post('/py_api/update/review', req)
        .then(response => {
          console.log('post approved:', post.post_id);
          this.posts = this.posts.filter(post_ => post_.post_id !== post.post_id);
          this.total_posts--;
        })
        .catch(error => {
          console.log("Error approve post:", error)
        })

    },
    showRejectDialog(post) {
      if (!this.$store.state.user_id) {
        this.$message({
          type: 'error',
          message: '管理员用户非法，操作失败!'
        });
        console.log("admin id invalid, reject operation")
        return;
      }
      this.rejectDialogVisible = true;
      this.currentpost = post;
    },
    rejectpost(post) {
      if (!this.rejectReason) {
        this.$message({
          type: 'warning',
          message: '请输入拒绝理由'
        });
        return;
      }

      let req = {
        "post_id": post.post_id,
        "reviewer_id": this.$store.state.user_id,
        "reason": this.rejectReason,
        "review_pass": false,
      }
      if (!this.$store.state.user_id) {
        return;
      }
      console.log("REQ", req)

      axios.post('/py_api/update/review', req)
        .then(response => {
          console.log("review rejected")
          this.posts = this.posts.filter(post_ => post_.post_id !== post.post_id);
          this.total_posts--;
        })
        .catch(error => {
          console.log("Error update review:", error)
        })

      this.rejectDialogVisible = false;
      this.resetRejectReason();
    },
    resetRejectReason() {
      this.rejectReason = '';
    },
    viewDetails(post) {
      if (!this.$store.state.user_id) {
        this.$message({
          type: 'error',
          message: '管理员用户非法，操作失败!'
        });
        console.log("admin id invalid, reject operation")
        return;
      }
      this.$router.push({ path: `/post/${post.post_id}` });
    }
  },
  mounted() {
    if (this.currentTab === '1') {
      this.fetchposts(this.currentPage, this.pageSize);
    }
  }
};
</script>

<style scoped>
.review-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
}

.el-button {
  margin-right: 5px;
}


.app-container {
  display: flex;
  height: 100%;
}

.el-menu-vertical-demo {
  border-right: 1px solid #e6e6e6;
}

.content-panel {
  flex: 1;
  padding: 20px;
}
</style>
