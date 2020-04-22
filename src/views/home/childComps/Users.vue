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
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
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
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主题区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户对话框 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editClose">
        <el-form
          :model="editForm"
          :rules="addFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getUsersList,
  getUserState,
  addNewUser,
  queryUser,
  editUser,
  deleteUser
} from "../../../network/home";

export default {
  name: "Users",
  data() {
    // 验证邮箱的规则
    var checkEmile = (rule, value, cb) => {
      // 验证的正则表达式
      const regEmile = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法手机号"));
    };

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
      userState: null,
      // 控制添加用户对话框的显示隐藏
      addDialogVisible: false,
      // 控制修改 用户对话框的显示隐藏
      editDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加用户表单的规则
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "用户名长度在3-10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "用户名长度在6-15个字符之间",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkEmile,
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      // 更改用户的id
      editId: null,
      // 更改用户的数据存储
      editForm: {},
      // 删除用户的id
      removeId: null
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    // 监听 pagesize 更改的事件函数
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUsersList();
    },
    // 监听 页面值 改变的事件函数
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUsersList();
    },
    // 监听 用户状态 改变的事件函数
    uerStateChanged(userInfo) {
      // console.log(userInfo);
      this.uid = userInfo.id;
      this.userState = userInfo.mg_state;
      this.getUserState();
    },
    // 监听 添加用户对话框 关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return;
        // 发送添加用户的网络请求
        this.addNewUser();
      });
    },
    // 点击按钮，修改用户
    showEditDialog(id) {
      this.editDialogVisible = true;
      this.editId = id;
      this.queryUser();
    },
    // 监听 修改用户对话框 关闭事件
    editClose() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交 事件
    editUserInfo() {
      this.$refs.editFormRef.validate(valid => {
        if(!valid) return
        // 发送修改请求
        this.editUser()
      })
    },
    // 删除用户 事件
    async removeUser(id) {
      // console.log(id);
      this.removeId = id
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        
        
        // 点击取消返回cancel
        // 点击确定返回confirm
        if(confirmResult !== 'confirm') {
          return this.$msg.info('已取消删除')
        }
        this.deleteUser()
    },


    // 网络请求的函数
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
          this.userState = !this.userState;
          return this.$msg.error("更新用户状态失败！");
        } else {
          this.$msg.success("更新用户状态成功！");
        }
      });
    },
    addNewUser() {
      addNewUser(
        this.addForm.username,
        this.addForm.password,
        this.addForm.email,
        this.addForm.mobile
      ).then(res => {
        // console.log(res);
        if (res.data.meta.status !== 201) {
          this.$msg.error("添加用户失败");
        }
        this.$msg.success("添加用户成功");

        // 隐藏添加对话框
        this.addDialogVisible = false;
        // 刷新列表数据
        this.getUsersList();
      });
    },
    queryUser() {
      queryUser(this.editId).then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$msg.error("查询用户失败！");
        }
        this.editForm = res.data.data;
      });
    },
    editUser() {
      editUser(this.editForm.id, this.editForm.email, this.editForm.mobile).then(res => {
        // console.log(res);
        
        if(res.data.meta.status !== 200){
          return this.$msg.error('更新用户信息失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 更新列表
        this.getUsersList()
        // 提示信息
        this.$msg.success('更新用户信息成功！')
      })
    },
    deleteUser() {
      deleteUser(this.removeId).then(res => {
        if(res.data.meta.status !== 200) {
          return this.$msg.error('删除用户失败！' + res.data.meta.msg)
        }
        this.$msg.success('删除用户成功！')
        // 刷新用户列表
        this.getUsersList()
      })
    }
  }
};
</script>

<style scoped>
</style>