webpackJsonp([3],{fQfl:function(e,a){},vjZR:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var l=t("bOdI"),r=t.n(l),o={data:function(){return{formBoard:{name:"",check:""},tableData:[r()({userName:"1111",personNo:"1111",scaleName:"1111"},"userName","1111")],currentPage4:1,total:0,pageNumber:1,pageSize:10,value:!1}},components:{},methods:{handleSizeChange:function(e){console.log("每页 "+e+" 条")},handleCurrentChange:function(e){console.log("当前页: "+e)},addBoard:function(){console.log(11111111)}}},s={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"page_main"},[t("el-form",{ref:"formBoard",staticClass:"formBoard",attrs:{model:e.formBoard,"label-width":"80px"}},[t("el-form-item",{staticClass:"left marginR",attrs:{label:"模板名称"}},[t("el-input",{attrs:{placeholder:"请输入模板名称"},model:{value:e.formBoard.name,callback:function(a){e.$set(e.formBoard,"name",a)},expression:"formBoard.name"}})],1),e._v(" "),t("el-form-item",{staticClass:"left marginR",attrs:{label:"模板分类"}},[t("el-select",{attrs:{clearable:"",placeholder:"模板分类"},model:{value:e.formBoard.check,callback:function(a){e.$set(e.formBoard,"check",a)},expression:"formBoard.check"}},[t("el-option",{attrs:{label:"检查类",value:"检查类"}})],1)],1),e._v(" "),t("el-form-item",{staticClass:"left"},[t("el-button",{attrs:{type:"primary",plain:""}},[e._v("查询")])],1)],1),e._v(" "),t("el-row",{staticStyle:{height:"80%"}},[t("el-col",{staticClass:"colLeft",attrs:{span:12}},[t("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,border:"","header-cell-style":{background:"#FAFAFA",height:"48px"},size:""}},[t("el-table-column",{attrs:{prop:"userName",label:"模板名称",width:""}}),e._v(" "),t("el-table-column",{attrs:{prop:"personNo",label:"模板分类",width:""}}),e._v(" "),t("el-table-column",{attrs:{prop:"scaleName",label:"最近更新时间",width:""}}),e._v(" "),t("el-table-column",{attrs:{prop:"userName",label:"状态",width:""}})],1),e._v(" "),t("div",{staticClass:"page_bottom"},[t("div",{staticClass:"block"},[t("el-pagination",{attrs:{background:"","hide-on-single-page":e.value,"current-page":e.currentPage4,"page-size":10,layout:"total, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1),e._v(" "),t("div",{staticClass:"left bottom_btn"},[t("el-button",{staticClass:"right",attrs:{type:"primary",plain:"",size:"small"},on:{click:function(a){return e.addBoard()}}},[e._v("新增模板")])],1)])],1),e._v(" "),t("el-col",{staticClass:"colRight",attrs:{span:12}})],1)],1)},staticRenderFns:[]};var n=t("VU/8")(o,s,!1,function(e){t("fQfl")},"data-v-7e8571ce",null);a.default=n.exports}});
//# sourceMappingURL=3.01ba9ef69ca920b580af.js.map