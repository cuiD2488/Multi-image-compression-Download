webpackJsonp([12],{CvbC:function(e,t){},"io+m":function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=o("Dd8w"),n=o.n(i),r=o("Xxa5"),a=o.n(r),s=o("exGp"),l=o.n(s),u=o("yOOA"),d=o("gyMJ"),c=o("R4Sj"),m={components:{tabledata:u.a},data:function(){var e=this;return{tableColumns:[{title:"违停编号",key:"violationNumber"},{title:"车位编号",key:"positionNumber"},{title:"车牌号",render:function(e,t){return e("div",[e("p",{style:{"margin-right":"10px"}},t.row.abbreviation+t.row.numberPlate)])}},{title:"操作人",key:"managerName"},{title:"违停图片",align:"center",width:220,render:function(t,o){return t("div",[t("p",{style:{"margin-right":"10px"},on:{click:function(){e.showViolationIMG=!0;var t=o.row.violationImage;e.imgArr=t.split(","),console.log(e.imgArr)}}},"点击查看图片")])}},{title:"违停原因",key:"reasons"},{title:"创建时间",render:function(e,t){return e("div",t.row.violationCreateTime.slice(0,t.row.violationCreateTime.length-5))}},{title:"操作",align:"center",width:220,render:function(t,o){return t("div",[t("Button",{style:{"margin-right":"10px"},on:{click:function(){e.$Modal.confirm({title:"操作确认",content:"确认删除吗？",onOk:function(){e.deleteViolation(o.row)}})}}},"删除"),t("Button",{on:{click:function(){e.editViolationForm=o.row,e.showEditBox=!0}}},"编辑")])}}],conditionList:[{name:"选择全部",key:"0"},{name:"车牌号",key:"numberPlate"},{name:"车位编号",key:"positionNumber"},{name:"操作人",key:"managerName"}],editViolationFormRule:{positionNumber:[{required:!0,message:"请输入停车场名字",trigger:"blur"}],reasons:[{required:!0,message:"请输入违停原因",trigger:"blur"}]},editViolationForm:{},showEditBox:!1,imgArr:[],showViolationIMG:!1,searchValue:"",findeCondition:"",queryUrl:d.y,queryData:{},page:1,num:10,type:"json"}},methods:{searchFind:function(){var e=this;console.log("条件搜索"),this.queryData={vendorId:this.userInfo.vendorId},this.queryData[this.findeCondition]=this.searchValue,"0"===this.searchValue&&(this.queryData={vendorId:this.userInfo.vendorId}),this.$nextTick(function(){e.$refs.table.updateData()})},deleteViolation:function(e){var t=this;return l()(a.a.mark(function o(){var i,n;return a.a.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return i={violationNumber:e.violationNumber},o.next=3,Object(d.f)(i);case 3:n=o.sent,console.log(n),t.$nextTick(function(){t.$refs.table.updateData()});case 6:case"end":return o.stop()}},o,t)}))()},editViolation:function(){var e=this;return l()(a.a.mark(function t(){var o;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return o={vendorId:e.userInfo.vendorId,positionNumber:e.editViolationForm.positionNumber,reasons:e.editViolationForm.reasons,violationNumber:e.editViolationForm.violationNumber},t.next=3,Object(d.o)(o);case 3:200===t.sent.code?(e.$Message.success("编辑提交成功"),e.$refs.table.updateData()):e.$Message.info("编辑违停信息失败"),e.$refs.table.updateData();case 6:case"end":return t.stop()}},t,e)}))()}},computed:n()({},Object(c.b)(["userInfo"])),mounted:function(){console.log(this.userInfo),console.log("vendorId:"+this.userInfo.vendorId)},created:function(){this.queryData.vendorId=this.userInfo.vendorId,2===this.userInfo.role&&(this.queryData.parkingLotNumber=this.userInfo.parkingLotNumber)}},p={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"violationrecord"},[o("div",{staticClass:"searchContent"},[o("Input",{staticClass:"search",on:{"on-enter":e.searchFind,"on-search":e.searchFind},model:{value:e.searchValue,callback:function(t){e.searchValue=t},expression:"searchValue"}},[o("Select",{staticStyle:{width:"100px"},attrs:{slot:"prepend",placeholder:"请选择"},slot:"prepend",model:{value:e.findeCondition,callback:function(t){e.findeCondition=t},expression:"findeCondition"}},e._l(e.conditionList,function(t){return o("Option",{key:t.key,attrs:{value:t.key}},[e._v(e._s(t.name))])}),1),e._v(" "),o("Button",{attrs:{slot:"append",icon:"ios-search"},on:{click:e.searchFind},slot:"append"})],1)],1),e._v(" "),o("tabledata",{ref:"table",attrs:{"page-position":"center",columns:e.tableColumns,queryUrl:e.queryUrl,queryData:e.queryData,axiosType:e.type,current:e.page,pageSize:e.num,type:e.type,border:""}}),e._v(" "),o("Modal",{attrs:{width:"500",align:"center",title:"展示违停图片"},on:{"on-cancel":function(t){e.showViolationIMG=!1}},model:{value:e.showViolationIMG,callback:function(t){e.showViolationIMG=t},expression:"showViolationIMG"}},[e.showViolationIMG?o("Carousel",{attrs:{loop:""}},e._l(e.imgArr,function(e){return o("CarouselItem",{key:e.id},[o("img",{attrs:{src:e}})])}),1):e._e()],1),e._v(" "),o("Modal",{attrs:{title:"编辑"},on:{"on-ok":e.editViolation,"on-cancel":function(t){e.showEditBox=!1}},model:{value:e.showEditBox,callback:function(t){e.showEditBox=t},expression:"showEditBox"}},[o("div",[o("Form",{ref:"formValidate",attrs:{model:e.editViolationForm,rules:e.editViolationFormRule,"label-width":100}},[o("FormItem",{attrs:{label:"违停编号"}},[o("Input",{attrs:{placeholder:"请输入违停编号",disabled:""},model:{value:e.editViolationForm.violationNumber,callback:function(t){e.$set(e.editViolationForm,"violationNumber",t)},expression:"editViolationForm.violationNumber"}})],1),e._v(" "),o("FormItem",{attrs:{label:"车位编号"}},[o("Input",{attrs:{placeholder:"请输入车位编号"},model:{value:e.editViolationForm.positionNumber,callback:function(t){e.$set(e.editViolationForm,"positionNumber",t)},expression:"editViolationForm.positionNumber"}})],1),e._v(" "),o("FormItem",{attrs:{label:"车牌号"}},[o("Input",{attrs:{value:e.editViolationForm.abbreviation+e.editViolationForm.numberPlate,placeholder:"请输入车牌号",disabled:""}})],1),e._v(" "),o("FormItem",{attrs:{label:"违停原因"}},[o("Input",{attrs:{placeholder:"请输入违停原因"},model:{value:e.editViolationForm.reasons,callback:function(t){e.$set(e.editViolationForm,"reasons",t)},expression:"editViolationForm.reasons"}})],1)],1)],1)])],1)},staticRenderFns:[]};var h=o("VU/8")(m,p,!1,function(e){o("CvbC")},"data-v-0e4eb8e4",null);t.default=h.exports}});
//# sourceMappingURL=12.c62d52339fe6603cd87f.js.map