<template>
  <div class>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 表格部分 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">标签一</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success">标签二</el-tag>
            <el-tag v-else type="info">标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      rightsList: [], //权限列表数据
    };
  },
  computed: {},
  methods: {
    //获取权限列表数据
    async getRightsList() {
      let { data: res } = await this.$http.get("rights/list");
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rightsList = res.data;
    },
  },
  mounted() {
    //   获取数据权限列表的数据
    this.getRightsList();
  },
};
</script>
<style  scoped>
</style>