import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css';

// 树形控件
import TreeTable from 'vue-table-with-tree-grid';

// 导入NProgress包对应的js和css
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import axios from 'axios';
import nProgress from 'nprogress'
// 配置请求的根路径
// axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/';
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/';
// 在request拦截器中，展示进度条  .start();
axios.interceptors.request.use(config=>{
  nProgress.start();
  // 做预处理
  config.headers.Authorization=window.sessionStorage.getItem("token");
  // 预处理结束要return
  return config;
})
// 在response拦截器中，隐藏进度条 .done()
axios.interceptors.response.use(config=>{
  nProgress.done();
  return config;
})

Vue.prototype.$http=axios;

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
