<template>
  <div>
    <!-- 查询框和按钮 -->
    <div style="margin-bottom: 20px;">
      <el-input v-model="input" placeholder="请输入查询内容" style="width: 1100px; margin-left: 5px; margin-right: 5px"></el-input>
      <el-button @click="search"> <i class="el-icon-search"></i> 搜索一下</el-button>
    </div>

    <!-- 表格展示 -->
    <div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="userid"
          label="用户id"
          width="180">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="userpassword"
          label="用户密码"
          width="180">
        </el-table-column>
        <el-table-column
          prop="isadmin"
          label="是否为管理员">
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div style="margin-top: 20px;">
      <el-pagination
        background
        :current-page="params.pageNum"
        :page-size="params.pageSize"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
import request from '@/utils/request';

export default {
  data() {
    return {
      input: '',        // 搜索框内容
      tableData: [],    // 存储表格数据
      total: 0   ,       // 存储数据的总数
      params:{
        username:'',
        pageNum:1,
        pageSize:10
      }
    };
  },
  created() {
    // 页面加载时获取数据
    this.load();
  },
  methods: {
    // 加载数据
    load() {
      request.get('/user/page',{params:this.params}).then(res => {
        // 检查返回的响应是否成功
        if (res.code === '200') {
          // 如果成功，则赋值给tableData和total
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          console.error('加载数据失败', res.message);
        }
      }).catch(error => {
        console.error('请求出错:', error);
      });
    },

    // 搜索功能（可以根据 input 的值来过滤数据）
    search() {
      console.log('搜索内容：', this.input);
      // 这里可以根据需求添加搜索逻辑，如发起新的请求
      // 或者直接过滤已加载的 `tableData`
    },

    // 设置行样式
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    }
  }
};
</script>
