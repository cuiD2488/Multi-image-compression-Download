webpackJsonp([9],{d15a:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=r("Dd8w"),i=r.n(a),o=r("Xxa5"),s=r.n(o),n=r("exGp"),l=r.n(n),d=r("yOOA"),c=r("gyMJ"),u=r("R4Sj"),m={components:{tabledata:d.a},data:function(){var e=this;return{tableColumns:[{title:"车牌号",render:function(e,t){return e("div",[e("p",{style:{"margin-right":"10px"}},t.row.abbreviation+t.row.carNumber)])}},{title:"操作人",key:"operator"},{title:"备注",key:"remark"},{title:"创建时间",render:function(e,t){return e("div",t.row.whiteCreateTime.slice(0,t.row.whiteCreateTime.length-5))}},{title:"操作",align:"center",width:220,render:function(t,r){return t("div",[t("Button",{style:{"margin-right":"10px"},on:{click:function(){e.$Modal.confirm({title:"操作确认",content:"确认删除吗？",onOk:function(){e.deleteWhiteList(r.row)}})}}},"删除"),t("Button",{on:{click:function(){e.editWhitelistForm=r.row,e.editWhitelistForm.whiteCreateTime=r.row.whiteCreateTime.slice(0,r.row.whiteCreateTime.length-5),e.showEditBox=!0}}},"编辑")])}}],showWhitelistAddBox:!1,addWhitelistForm:{operator:"",remark:"",abbreviationcarNumber:""},addWhitelistFormRule:{remark:[{required:!0,message:"请输入备注",trigger:"blur"}],abbreviationcarNumber:[{required:!0,message:"请输入车牌号",min:8,max:10,trigger:"blur"}]},searchValue:"",showEditBox:!1,editWhitelistForm:{abbreviationcarNumber:""},queryUrl:c.z,queryData:{},page:1,num:10,type:"json"}},methods:{searchFind:function(){var e=this;console.log("条件搜索"),""!==this.searchValue?(this.queryData.abbreviation=this.searchValue.substring(0,2),this.queryData.carNumber=this.searchValue.substring(2),console.log(this.queryData.carNumber),this.queryData={vendorId:this.userInfo.vendorId,abbreviation:this.queryData.abbreviation,carNumber:this.queryData.carNumber}):(delete this.queryData.abbreviation,delete this.queryData.carNumber,this.queryData.vendorId=this.userInfo.vendorId),this.$nextTick(function(){e.$refs.table.updateData()})},addWhitelist:function(){var e=this;return l()(s.a.mark(function t(){var r,a;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return console.log(e.addWhitelistForm.abbreviationcarNumber),r={vendorId:e.userInfo.vendorId,managerNumber:e.userInfo.managerNumber,remark:e.addWhitelistForm.remark,whiteCreateTime:e.addWhitelistForm.whiteCreateTime,abbreviation:e.addWhitelistForm.abbreviationcarNumber.substring(0,2),carNumber:e.addWhitelistForm.abbreviationcarNumber.substring(2)},t.next=4,Object(c.d)(r);case 4:200===(a=t.sent).code?e.$Message.success("新增成功"):e.$Message.success(a.msg),e.$refs.table.updateData();case 7:case"end":return t.stop()}},t,e)}))()},deleteWhiteList:function(e){var t=this;return l()(s.a.mark(function r(){var a,i;return s.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return a={vendorId:t.userInfo.vendorId,id:e.id},r.next=3,Object(c.g)(a);case 3:i=r.sent,console.log(i),t.$nextTick(function(){t.$refs.table.updateData()});case 6:case"end":return r.stop()}},r,t)}))()},editWhitelist:function(){var e=this;return l()(s.a.mark(function t(){var r;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r={vendorId:e.userInfo.vendorId,id:e.editWhitelistForm.id,abbreviation:e.editWhitlistForm.abbreviation,carNumber:e.editWhitelistForm.carNumber,remark:e.editWhitelistForm.remark},t.next=3,Object(c.p)(r);case 3:200===t.sent.code?(e.$Message.success("编辑提交成功"),e.$refs.table.updateData()):e.$Message.info("编辑违停信息失败"),e.$refs.table.updateData();case 6:case"end":return t.stop()}},t,e)}))()}},computed:i()({},Object(u.b)(["userInfo"])),created:function(){this.queryData.vendorId=this.userInfo.vendorId}},h={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"whitelist"},[r("div",{staticClass:"whitenav"},[r("Button",{attrs:{type:"primary"},on:{click:function(t){e.showWhitelistAddBox=!0}}},[e._v("新增白名单")]),e._v(" "),r("Input",{staticClass:"search",attrs:{placeholder:"车牌号查询"},on:{"on-enter":e.searchFind,"on-search":e.searchFind},model:{value:e.searchValue,callback:function(t){e.searchValue=t},expression:"searchValue"}},[r("Button",{attrs:{slot:"append",icon:"ios-search"},on:{click:e.searchFind},slot:"append"})],1)],1),e._v(" "),r("tabledata",{ref:"table",attrs:{"page-position":"center",columns:e.tableColumns,queryUrl:e.queryUrl,queryData:e.queryData,axiosType:e.type,current:e.page,pageSize:e.num,type:e.type,border:""}}),e._v(" "),r("Modal",{attrs:{title:"新增白名单"},on:{"on-ok":e.addWhitelist,"on-cancel":function(t){e.showWhitelistAddBox=!1}},model:{value:e.showWhitelistAddBox,callback:function(t){e.showWhitelistAddBox=t},expression:"showWhitelistAddBox"}},[r("div",[r("Form",{ref:"formValidate",attrs:{model:e.addWhitelistForm,rules:e.addWhitelistFormRule,"label-width":100}},[r("FormItem",{attrs:{label:"车牌号(非必传)",prop:"abbreviationcarNumber"}},[r("Input",{attrs:{placeholder:"请输入车牌号"},model:{value:e.addWhitelistForm.abbreviationcarNumber,callback:function(t){e.$set(e.addWhitelistForm,"abbreviationcarNumber",t)},expression:"addWhitelistForm.abbreviationcarNumber"}})],1),e._v(" "),r("FormItem",{attrs:{label:"备注",prop:"remark"}},[r("Input",{attrs:{placeholder:"请输入备注"},model:{value:e.addWhitelistForm.remark,callback:function(t){e.$set(e.addWhitelistForm,"remark",t)},expression:"addWhitelistForm.remark"}})],1)],1)],1)]),e._v(" "),r("Modal",{attrs:{title:"编辑"},on:{"on-ok":e.editWhitelist,"on-cancel":function(t){e.showEditBox=!1}},model:{value:e.showEditBox,callback:function(t){e.showEditBox=t},expression:"showEditBox"}},[r("div",[r("Form",{ref:"formValidate",attrs:{model:e.editWhitelistForm,"label-width":100}},[r("FormItem",{attrs:{label:"操作人"}},[r("Input",{attrs:{placeholder:"请输入操作人",disabled:""},model:{value:e.editWhitelistForm.operator,callback:function(t){e.$set(e.editWhitelistForm,"operator",t)},expression:"editWhitelistForm.operator"}})],1),e._v(" "),r("FormItem",{attrs:{label:"车牌号"}},[r("Input",{attrs:{value:e.editWhitelistForm.abbreviation+e.editWhitelistForm.carNumber,placeholder:"请输入车牌号"}})],1),e._v(" "),r("FormItem",{attrs:{label:"备注"}},[r("Input",{attrs:{placeholder:"请输入备注"},model:{value:e.editWhitelistForm.remark,callback:function(t){e.$set(e.editWhitelistForm,"remark",t)},expression:"editWhitelistForm.remark"}})],1),e._v(" "),r("FormItem",{attrs:{label:"创建时间"}},[r("Input",{attrs:{placeholder:"创建时间",disabled:""},model:{value:e.editWhitelistForm.whiteCreateTime,callback:function(t){e.$set(e.editWhitelistForm,"whiteCreateTime",t)},expression:"editWhitelistForm.whiteCreateTime"}})],1)],1)],1)])],1)},staticRenderFns:[]};var b=r("VU/8")(m,h,!1,function(e){r("htmX")},"data-v-4742a190",null);t.default=b.exports},htmX:function(e,t){}});
//# sourceMappingURL=9.0dbd1234e22527575de3.js.map