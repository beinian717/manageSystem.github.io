<template>
  <div class>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1===0?'bdtop':'']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children" :key="i2">
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3,i3) in item2.children"
                      :key="i3"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="roleDelete(scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框部分 -->
    <el-dialog title="添加角色" :visible.sync="roleVisible" width="50%" @close="dialogClose">
      <el-form :model="roleForm" :rules="roleRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleSureClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色对话框部分 -->
    <el-dialog title="修改角色" :visible.sync="editVisible" width="50%" @close="dialogClose">
      <el-form :model="roleForm" :rules="roleRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框部分 -->
    <el-dialog title="分配权限" :visible.sync="roleDialogVisible" width="50%" @close="dialogClose">
      <!-- 树形控件 -->
      <el-tree
        show-checkbox
        default-expand-all
        :data="rightsList"
        :props="treeProps"
        node-key="id"
        :default-checked-keys="defaultKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      rolesList: [], //角色列表数据
      roleDialogVisible: false, //显示隐藏分配权限对话框
      rightsList: [], //所有权限数据
      treeProps: {
        label: "authName",
        children: "children",
      }, //树形控件的绑定对象
      defaultKeys: [], //默认选中的节点id值数组
      roleId: "", //当前即将分配角色的角色id
      roleVisible: false, //控制添加角色对话框的显示隐藏
      roleForm: {
        roleName: "",
        roleDesc: "",
      }, //
      roleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      }, //表单规则
      editVisible: false, //显示编辑角色对话框
    };
  },
  computed: {},
  methods: {
    //   获取角色列表初始数据
    async getRolesList() {
      let { data: res } = await this.$http.get("roles");
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("获取角色列表数据失败");
      }
      this.rolesList = res.data;
    },
    // 根据id删除对应的权限
    async removeRightById(role, powerId) {
      let confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("取消了删除");
      }
      let { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${powerId}`
      );
      if (res.meta.status != 200) {
        return this.$message.error("删除权限失败");
      }
      this.$message.success("删除权限成功");
      //    this.getRolesList();
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取树形权限数据
      let { data: res } = await this.$http.get("rights/tree");
      // console.log(res);
      if (res.meta.status != 200) {
        this.$message.error("获取权限数据失败");
      }
      this.rightsList = res.data; //所有权限数据

      // 递归获取三级节点的id
      this.getDefalutKey(role, this.defaultKeys);

      this.roleDialogVisible = true;
    },

    // 通过递归的形式，获取角色下所有三级权限的id，
    // 并保存到defaultKey数组中
    getDefalutKey(node, arr) {
      //如果当前node节点不包括children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => {
        this.getDefalutKey(item, arr);
      });
    },
    // 监听分配权限对话框的关闭事件
    dialogClose() {
      this.defaultKeys = [];
    },
    // 点击为角色分配权限
    async sureClick() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      let { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr,
      });
      if (res.meta.status != 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.roleDialogVisible = false;
    },
    // 添加角色
    addRole() {
      this.roleVisible = true;
    },
    // 添加角色对话框确定
    async roleSureClick() {
      let { data: res } = await this.$http.post("roles", {
        roleName: this.roleForm.roleName,
        roleDesc: this.roleForm.roleDesc,
      });
      if (res.meta.status != 201) {
        return this.$message.error("添加角色失败");
      }
      this.$message.success("添加角色成功");
      this.roleVisible = false;
      this.getRolesList();
    },
    // 删除角色
    async roleDelete(role) {
      let confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      let { data: res } = await this.$http.delete(`roles/${role.id}`);
      if (res.meta.status != 200) {
        return this.$message.error("删除角色失败");
      }
      this.$message.success("删除角色成功");
      this.getRolesList();
    },
    // 修改角色对话框显示并查询
    async showEditDialog(info) {
      let { data: res } = await this.$http.get('roles/'+info.id);
      // console.log(res);
      if(res.meta.status!=200){
        return this.$message.error("编辑用户失败")
      }
      this.roleForm=res.data;
      this.editVisible=true;
    },
    // 编辑对话框中的确认
    async editRoles(){
      let {data:res} =await this.$http.put("roles/"+this.roleForm.roleId,{
        roleName:this.roleForm.roleName,
        roleDesc:this.roleForm.roleDesc
      });
      console.log(res);
      if(res.meta.status!=200){
        return this.$message.error("编辑用户失败")
      }
      this.getRolesList();
      this.editVisible=false;
      this.$message.success("编辑用户成功");
    }
  },
  mounted() {
    //   获取所有角色列表数据
    this.getRolesList();
  },
};
</script>
<style  scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
  display: flex;
  align-items: Center;
}
.bdbottom {
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: Center;
}
</style>