<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="usersList" :border="true" :stripe="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="uerStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="更改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getUsersList, getUserState} from "../../../network/home";

export default {
  name: "Users",
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前显示多少条数据
        pagesize: 2
      },
      usersList: [],
      total: 0,
      uid: null,
      userState: null
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    // 监听 pagesize 更改的事件函数
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize
      this.getUsersList()
      
    },
    // 监听 页面值 改变的事件函数
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    // 监听 用户状态 改变的事件函数
    uerStateChanged(userInfo) {
      // console.log(userInfo);
      this.uid = userInfo.id
      this.userState = userInfo.mg_state
      this.getUserState();

    },
    getUsersList() {
      getUsersList(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then(res => {
        const data = res.data;
        if (data.meta.status !== 200) {
          return this.$msg.error("获取用户列表失败！");
        }
        this.usersList = data.data.users;
        this.total = data.data.total;

        // console.log(data);
      });
    },
    getUserState() {
      getUserState(this.uid, this.userState).then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          this.userState = !this.userState
          return this.$msg.error('更新用户状态失败！')
        }else{
        this.$msg.success('更新用户状态成功！')
        }
      })
    },
  }
};
</script>

<style scoped>
</style>