<template>
  <div style="display: flex; flex-direction: column; height: 100vh;">
    <!-- Header -->
    <div style="background-color: whitesmoke; color: black; font-size: 24px; padding: 10px;">
      <div style="display: flex; align-items: center;">
        <img src="./assets/nav_图书馆.png" alt="" style="height: 40px; margin-right: 10px;">
        <div style="font-weight: bold;">图书管理系统</div>
      </div>
    </div>

    <!-- 主体侧边栏 -->
    <div style="display: flex; height: 100%;">
      <!-- 侧边栏 -->
      <div style="width: 200px; background-color: #f4f4f4;">
        <el-menu :default-active="$route.path" router class="el-menu-demo">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/people">人员管理</el-menu-item>
          <el-menu-item index="1">书籍管理</el-menu-item>
          <el-menu-item index="1">借阅管理</el-menu-item>
        </el-menu>
      </div>

      <!-- 主体 -->
      <div style="flex-grow: 1; padding: 20px; background-color: #fff;">
        <router-view/>
      </div>
    </div>
  </div>
</template>
