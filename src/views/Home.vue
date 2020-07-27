<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>

    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠按钮 -->
        <div @click="toggleBtn" class="toggle_button">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              @click="saveNavState('/'+subItem.path)"
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- main部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  components: {},
  data() {
   
    return {
      menuList: [],
      iconObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao",
      }, //  动态图标数据
      isCollapse: false, //是否折叠
      activePath:'' //激活的链接地址
      
    };
  },
  computed: {},
  methods: {
    //   退出登录按钮
    loginOut() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的菜单数据
    async getMenuList() {
      let { data: res } = await this.$http.get("menus");
      // console.log(res);
      if (res.meta.status != 200) {
        this.$message.error(res.meta.msg);
      }
      this.menuList = res.data;
    },
    // 切换折叠与展开
    toggleBtn() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath){
        window.sessionStorage.setItem("activePath",activePath);
        this.activePath=activePath;
    }
  },
  mounted() {
    this.getMenuList();    //初始数据
    this.activePath=window.sessionStorage.getItem("activePath");    //获取激活状态
  },
};
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  color: #fff;
  align-items: center;
  font-size: 20px;
  & div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle_button {
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2rem;
  cursor: pointer;
}
</style>