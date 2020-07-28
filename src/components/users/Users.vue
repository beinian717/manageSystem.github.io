<template>
  <div class>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" clearable @clear="getUserList" v-model="queryInfo.query">
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              @click="showEditDialog(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              @click="removeUserById(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 这是添加用户的对话框 -->
      <el-dialog title="提示" :visible.sync="addDialogVisible" width="30%" @close="addDialogClose">
        <!-- 内容主题区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改的对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名" prop="name">
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

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    // 自定义验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 合法
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    // 验证手机号规则
    // 自定义验证邮箱规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则
      const regMobile = /^(0o|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback;
      }
      callback(new Error("请输入合法的手机号"));
    };
    return {
      userList: [], //初始数据
      total: 0, //页面总数
      queryInfo: {
        query: "",
        pagenum: 1, //当前页数
        pagesize: 2, //当前页面显示多少数据
      }, //请求携带的参数
      addDialogVisible: false, //控制添加用户提示框的显示
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      }, //添加用户的表单数据对象
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "密码的长度在6~15个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            min: 6,
            // max: 15,
            message: "邮箱的长度在6~15个字符之间",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "手机号的长度在6~15个字符之间",
            trigger: "blur",
          },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      }, //添加表单的验证规则对象
      editDialogVisible: false, //控制修改对话框是否显示
      editForm: {}, //查询到的用户对象信息
      editFormRules: {
        email: [
          {
            required: true,
            message: "请输入邮箱地址",
            trigger: "blur",
          },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          { validator: checkMobile, trigger: "blur" },
        ],
      }, //修改表单的验证规则对象
    };
  },
  computed: {},
  methods: {
    //   获取初始数据
    async getUserList() {
      let { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      //   console.log(res);
      if (res.meta.status != 200) return this.$message.err("获取用户列表失败");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      //   console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      //   console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 修改状态事件
    async userStateChange(userinfo) {
      //   console.log(userinfo);
      let { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status != 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },
    // 监听添加用户的对话框关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击添加用户对话框的确认按钮
    addUser() {
      // this.$refs.addFormRef.validate(async (valid) => {
      //   console.log(valid);
      //   if (!valid) {
      //     let { data: res } = await this.$http.post("users", this.addForm);
      //     console.log(res);
      //   }
      // });

      this.$http.post("users", this.addForm).then((res) => {
        console.log(res);
        if (res.data.status != 201) {
          this.$message.error("添加用户失败");
        }
      this.$message.success("添加用户成功");
      this.addDialogVisible = false;
      this.getUserList();
      });
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      let { data: res } = await this.$http.get("users/" + id);
      console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("查询用户信息失败");
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息并验证
    editUserInfo() {
      // this.$refs.editFormRef.validate(async (valid) => {
      //   // if(!valid)return;
      //   const { data: res } = await this.$http.put(
      //     "users/" + this.editForm.id,
      //     {
      //       email: this.editForm.email,
      //       mobile: this.editForm.mobile,
      //     }
      //   );
      //   console.log(res);
      //   if (res.meta.statu != 200) {
      //     return this.$message.error("更新用户信息失败");
      //   }
      //   this.editDialogVisible = false;
      //   this.getUserList();
      //   this.$message.success("更新用户信息成功");
      // });
      this.$http
        .put("users/" + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        })
        .then((res) => {
          console.log(res);
          if (res.data.status != 200) {
            this.$message.error("修改用户失败");
          }
          this.$message.success("修改用户成功");
          this.editDialogVisible = false;
          this.getUserList();
        });
    },
    // 根据id删除用户信息
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果用户确认了删除，返回字符串confirm
      // 如果用户取消了删除，返回字符串cancel
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.getUserList();
    },
  },
  created() {
    //   获取用户列表初始数据
    this.getUserList();
  },
};
</script>
<style  scoped>
.el-card {
  box-shadow: 0 1px 1px rgb(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 10px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>