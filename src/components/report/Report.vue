<template>
  <div class>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">数据统计</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>


<script>
import echarts from "echarts";
import _ from "lodash";

export default {
  components: {},
  data() {
    return {
      option: {
        title: {
          text: "用户来源",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    };
  },
  computed: {},
  methods: {},
  async mounted() {
    let { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status != 200) {
      return this.$message.error("获取折线图数据失败");
    }

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    //准备数据和配置项
    let result=_.merge(res.data,this.option);
    // 展示数据
    myChart.setOption(result);
  },
};
</script>
<style  scoped>
</style>