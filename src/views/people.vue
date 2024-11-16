<template>
  <div>
    <!-- 搜索框 -->
    <el-input
      v-model="username"
      placeholder="请输入用户名"
      style="width: 200px; margin-bottom: 20px;"
      clearable
    />
    <el-button @click="onSearch" type="primary" icon="el-icon-search" style="margin-bottom: 20px;">搜索</el-button>

    <!-- 用户表格 -->
    <el-table
      :data="tableData.records"
      style="width: 100%"
      :row-class-name="tableRowClassName">
      <el-table-column
        prop="userid"
        label="用户ID">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户姓名">
      </el-table-column>
      <el-table-column
        prop="userpassword"
        label="用户密码">
      </el-table-column>
      <el-table-column
        prop="isadmin"
        label="管理员权限">
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      @current-change="handlePageChange"
      :current-page="pageNum"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next, jumper"
      style="margin-top: 20px; text-align: right;"
    />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'user',

  data() {
    return {
      // 用户表格数据
      tableData: {
        records: [],
        total: 0
      },
      // 搜索条件
      username: '',
      // 分页信息
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },

  methods: {
    // 表格行样式
    tableRowClassName({ rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },

    // 搜索功能
    onSearch() {
      this.pageNum = 1; // 重置页码为1，避免搜索后从第2页开始
      this.getUserPage();
    },

    // 获取分页数据
    getUserPage() {
      axios
        .get('/user/query', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            username: this.username // 模糊查询条件
          }
        })
        .then((response) => {
          console.log(response);  // 打印响应内容进行调试
          if (response.data.code === '200') {
            this.tableData = response.data.data;  // 设置表格数据
            this.total = response.data.data.total;  // 设置总记录数
          } else {
            this.$message.error('查询失败：' + (response.data.message || '未知错误'));
          }
        })
        .catch((error) => {
          console.error('获取数据失败:', error);
          this.$message.error('请求失败');
        });
    },

    // 分页处理
    handlePageChange(page) {
      this.pageNum = page;
      this.getUserPage();
    }
  },

  // 页面加载时自动请求第一页数据
  created() {
    this.getUserPage();
  }
};
</script>

<style scoped>
/* 可根据需要定制样式 */
</style>
