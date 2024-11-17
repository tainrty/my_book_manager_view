<template>
  <div>
    <!-- 搜索框 -->
    <el-input
      v-model="username"
      placeholder="请输入用户名"
      style="width: 400px; margin-bottom: 20px;margin-right:20px"
      clearable
    />
    <el-button @click="onSearch" type="primary" icon="el-icon-search" style="margin-right:20px;">搜索</el-button>
    <el-button @click="reset" type="info" icon="el-icon-refresh" style="margin-bottom: 20px;margin-right:20px">重置</el-button>
    <el-button @click="deleteSelected" type="danger" icon="el-icon-delete" style="margin-bottom: 20px;margin-right:20px">删除</el-button>
    <el-button @click="openUpdateDialog" type="primary" icon="el-icon-edit" style="margin-bottom: 20px;margin-right:20px">修改</el-button>
    <el-button @click="openAddDialog" type="primary" icon="el-icon-plus" style="margin-bottom: 20px; margin-right:20px">新增</el-button>
    
    <el-table
      :data="tableData.records"
      style="width: 100%"
      :row-class-name="tableRowClassName"     
      @selection-change="handleSelectionChange"
      ref="table">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
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
      style="margin-top: 20px; text-align: right;"/>
    
    <!-- 修改用户信息弹框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="updateDialogVisible"
      width="40%"
      @close="resetUpdateForm">
      <el-form :model="userForm" ref="userForm">
        <el-form-item label="用户名" prop="username" :rules="[ { required: true, message: '请输入用户名', trigger: 'blur' } ]">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="userpassword" :rules="[ { required: true, message: '请输入密码', trigger: 'blur' } ]">
          <el-input v-model="userForm.userpassword" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="是否管理员">
          <el-radio v-model="userForm.isadmin" :label="1">是</el-radio>
          <el-radio v-model="userForm.isadmin" :label="0">否</el-radio>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUser">确认修改</el-button>
      </span>
    </el-dialog>

    <!-- 新增用户弹框 -->
    <el-dialog
      title="新增用户"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="resetAddForm">
      <el-form :model="userForm" ref="userForm">
        <el-form-item label="用户名" prop="username" :rules="[ { required: true, message: '请输入用户名', trigger: 'blur' } ]">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="userpassword" :rules="[ { required: true, message: '请输入密码', trigger: 'blur' } ]">
          <el-input v-model="userForm.userpassword" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="是否管理员">
          <el-radio v-model="userForm.isadmin" :label="1">是</el-radio>
          <el-radio v-model="userForm.isadmin" :label="0">否</el-radio>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser">确认新增</el-button>
      </span>
    </el-dialog>
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
      total: 0,
      selectedRows: [], // 记录选中的行
      // 修改用户的弹框相关数据
      updateDialogVisible: false,
      addDialogVisible: false,  // 控制新增弹框的显示
      userForm: {
        userid: null,
        username: '',
        userpassword: '',
        isadmin: 0
      }
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

    // 重置功能
    reset() {
      this.username = '';  // 清空搜索框中的用户名
      this.pageNum = 1;    // 重置页码为1
      this.pageSize = 10;  // 重置每页显示条数
      this.getUserPage();  // 重新获取数据，加载第一页
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

    // 修改按钮点击事件，打开修改弹框
    openUpdateDialog() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先选择一个用户');
        return;
      }

      // 取第一个选中的用户
      const user = this.selectedRows[0];
      this.userForm = { ...user };  // 填充表单数据
      this.updateDialogVisible = true;  // 打开对话框
    },

    // 修改用户信息
    updateUser() {
      axios
        .put('/user/update', this.userForm)
        .then((response) => {
          if (response.data.code === '200') {
            this.$message.success('修改成功');  // 显示成功消息
            this.updateDialogVisible = false;  // 关闭弹框
            this.getUserPage();  // 刷新数据
          } else {
            this.$message.error('修改失败：' + (response.data.message || '未知错误'));
          }
        })
        .catch((error) => {
          console.error('修改失败:', error);
          this.$message.error('请求失败');
        });
    },

    // 删除选中的用户
    deleteSelected() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先选择要删除的用户');
        return;
      }

      const userIds = this.selectedRows.map(user => user.userid);

      // 确保正确传递参数，去掉userIds[]，并修改URL以适应后端
      axios
        .delete('/user/deleteBatchIds', { params: { userIds: userIds.join(',') } })  // 将数组拼接为逗号分隔的字符串
        .then((response) => {
          if (response.data.code === '200') {
            this.$message.success('删除成功');
            this.selectedRows = [];  // 清空选中
            this.getUserPage();  // 刷新用户列表
          } else {
            this.$message.error('删除失败：' + (response.data.message || '未知错误'));
          }
        })
        .catch((error) => {
          console.error('删除失败:', error);
          this.$message.error('请求失败');
        });
    },

    // 打开新增用户弹框
    openAddDialog() {
      this.userForm = {
        userid: null,
        username: '',
        userpassword: '',
        isadmin: 0
      };  // 清空表单数据
      this.addDialogVisible = true;  // 显示新增用户的弹框
    },

    // 新增用户
    addUser() {
      axios
        .post('/user/add', this.userForm)
        .then((response) => {
          if (response.data.code === '200') {
            this.$message.success('新增成功');  // 显示成功消息
            this.addDialogVisible = false;  // 关闭新增用户弹框
            this.getUserPage();  // 刷新用户列表
          } else {
            this.$message.error('新增失败：' + (response.data.message || '未知错误'));
          }
        })
        .catch((error) => {
          console.error('新增失败:', error);
          this.$message.error('请求失败');
        });
    },

    // 重置新增表单数据
    resetAddForm() {
      this.userForm = {
        userid: null,
        username: '',
        userpassword: '',
        isadmin: 0
      };
    },

    // 重置修改表单数据
    resetUpdateForm() {
      this.userForm = {
        userid: null,
        username: '',
        userpassword: '',
        isadmin: 0
      };
    },

    // 选择行时获取选中的行
    handleSelectionChange(val) {
      this.selectedRows = val;
    },

    // 分页改变时重新请求数据
    handlePageChange(page) {
      this.pageNum = page;
      this.getUserPage();
    }
  },

  mounted() {
    // 加载数据
    this.getUserPage();
  }
};
</script>

<style scoped>
.warning-row {
  background-color: #f9f9f9;
}

.success-row {
  background-color: #e6f7ff;
}
</style>
