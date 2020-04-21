<template>
  <el-container class="home">
    <!-- 头部 -->
    <el-header>
      <div class="header-left">
        <img src="../../assets/img/head.jpg" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logoutClick">退出登录</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠侧边栏 -->
        <div class="toggle-button" @click="toggleClick">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          :unique-opened="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
            >
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{subitem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from "../../network/home";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao"
      },
      isCollapse: false,
      activePath: ''
    };
  },
  created() {
    // 请求侧边菜单栏数据
    this.getMenuList();
    // 获取菜单活动状态
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logoutClick() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 菜单栏的折叠与展开
    toggleClick() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },

    // 网络请求的方法
    getMenuList() {
      getMenuList().then(res => {
        const data = res.data;
        if (data.meta.status !== 200) return this.$msg.error(data.meta.msg);
        this.menuList = data.data;
        // console.log(this.menuList);
      });
    }
  }
};
</script>

<style scoped>
.home {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left img {
  height: 50px;
  width: 50px;
  margin-right: 15px;
}

.el-aside {
  background-color: #333744;
}

.toggle-button {
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
}

.el-aside .el-menu {
  border-right: none;
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}
</style>