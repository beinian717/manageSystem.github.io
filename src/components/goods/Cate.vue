
<template>
  <div class>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCatDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格占位 -->
      <tree-table
        class="tree_table"
        :selection-type="false"
        :expand-type="false"
        border
        index-text="#"
        :show-row-hover="false"
        :show-index="true"
        :data="categoryList"
        :columns="columns"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted"></i>
          <i class="el-icon-error" style="color:lightgreen" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" type="success" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag size="mini" type="warning" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag size="mini" type="error" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope>
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 6, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" @close="addCateDialogClosed" :visible.sync="addCatDialogVisible" width="50%">
      <!-- 添加分类的表单 -->
      <el-form :model="addCatForm" :rules="addCatFormRules" ref="addCatFormRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <div class="block">
            <!-- options用来指定数据源 -->
            <!-- props用来配置数据对象 -->
            <el-cascader
              v-model="selectdKeys"
              :options="parentCatList"
              :props="cascaderProps"
              expand-trigger="hover"
              clearable
              change-on-select
              @change="parentCatChange"
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      categoryList: [], //商品列表默认数据为空
      queryInfo: {
        type: 3,
        pagenum: 1, //有多少页面
        pagesize: 5, //一页有多少条
      }, //查询条件
      total: 0, //总条数
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template", //将当前列定义为模板列
          template: "isOk", //表示当前这列使用模板名称
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ], //为每个指定列 的定义
      addCatDialogVisible: false, //控制添加分类对话框显示隐藏
      addCatForm: {
        cat_name: "", //分类名称
        cat_pid: 0, //父级分类id
        cat_level: 0, //分类等级默认要添加的是一级分类
      }, //添加分类的表单数据对象
      addCatFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      }, //添加分类的表单规则
      parentCatList: [], //父级分类的列表数据
      cascaderProps: {
        value: "cat_id", //具体选中哪个属性
        label: "cat_name", //具体看到哪个属性
        children: "children", //父子嵌套用的是哪个属性
      }, //指定级联选择器的配置对象
      selectdKeys: [], //选中的父级id数组
    };
  },
  computed: {},
  methods: {
    async getCateList() {
      let { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取商品分类信息失败");
      }
      this.categoryList = res.data.result;
      this.total = res.data.total;
      console.log(res);
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 展示添加分类对话框
    showAddCatDialog() {
      this.addCatDialogVisible = true;
      this.getParentCateList(); //获取父级分类的数据列表
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      let { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取父级分类数据失败");
      }
      this.parentCatList = res.data;
    },
    // 选择项发生变化触发这个函数
    parentCatChange() {
      console.log(this.selectdKeys);
      // 如果selectdKeys数组中的length大于0，证明选中的父级分类
      // 反之，就说明没有选中的额任何父级分类
      if (this.selectdKeys.length > 0) {
        // 父级分类的id
        this.addCatForm.cat_pid = this.selectdKeys[this.selectdKeys.length - 1];
        // 为当前分类的等级赋值
        this.addCatForm.cat_level = this.selectdKeys.length;
        return;
      } else {
        this.addCatForm.cat_pid =0;
        // 为当前分类的等级赋值
        this.addCatForm.cat_level = 0;
      }
    },
    // 添加新的分类
    addCat(){
      this.$refs.addCatFormRef.validate(async (valid)=>{
        if(!valid)return;
        let {data:res}=await this.$http.post("categories",this.addCatForm);
        if(res.meta.status!=201){
          return this.$message.error("添加分类失败")
        }
        this.$message.success("添加分类成功")
        this.getCateList();
        this.addCatDialogVisible=false;
      })
    },
    //监听对话框的关闭
    addCateDialogClosed(){
      this.$refs.addCatFormRef.resetFields();
      this.selectdKeys=[];
      this.addCatForm.cat_level=0;
      this.addCatForm.cat_pid=0;
    } 
  },
  mounted() {
    //   获取商品分类初始数据
    this.getCateList();
  },
};
</script>
<style  scoped>
.tree_table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>