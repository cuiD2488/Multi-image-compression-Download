webpackJsonp([9],{"T+/8":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r("Xxa5"),s=r.n(n),o=r("mvHQ"),a=r.n(o),i=r("exGp"),l=r.n(i),u=r("gyMJ"),c={components:{},data:function(){return{historyPsw:!0,showChange:!1,formInline:{user:localStorage.getItem("user")?localStorage.getItem("user"):"",password:localStorage.getItem("pswd")?localStorage.getItem("pswd"):""},ruleInline:{user:[{required:!0,message:"请输入账号",trigger:"blur"}],password:[{required:!0,message:"请输入密码",max:12,trigger:"blur"},{type:"string",min:6,message:"密码最少六位",trigger:"blur"}]}}},methods:{savePsw:function(e){},OpenAlert:function(){this.$refs.changePassword.openChangeClose()},handleSubmit:function(e){var t=this;this.$refs[e].validate(function(e){e?t.submitLogin():t.$Message.error("登录失敗,请检查账号密码是否错误!")})},submitLogin:function(){var e=this;return l()(s.a.mark(function t(){var r,n;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.$Message.loading("登录中..."),r={phone:e.formInline.user,password:e.formInline.password},t.next=4,Object(u.e)(r);case 4:if(n=t.sent,console.log(n),200!==n.code){t.next=14;break}e.historyPsw?(localStorage.setItem("user",e.formInline.user),localStorage.setItem("pswd",e.formInline.password)):(localStorage.removeItem("user"),localStorage.removeItem("pswd")),e.$Message.success("登录成功!"),sessionStorage.setItem("userInfo",a()(n.data)),e.$store.commit("GETUSERINFO",n.data),setTimeout(function(){e.$router.push({name:"parkingRecord"})},1e3),t.next=16;break;case 14:return e.$Message.error("登录失敗,请检查账号密码是否错误"),t.abrupt("return",!1);case 16:case"end":return t.stop()}},t,e)}))()}}},m={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"loginContent"},[e._m(0),e._v(" "),r("div",{staticClass:"loginForm"},[r("Form",{ref:"formInline",attrs:{model:e.formInline,rules:e.ruleInline,inline:""}},[r("FormItem",{attrs:{prop:"user"}},[r("Input",{attrs:{prefix:"ios-contact",type:"text",placeholder:"请输入账号"},model:{value:e.formInline.user,callback:function(t){e.$set(e.formInline,"user",t)},expression:"formInline.user"}})],1),e._v(" "),r("FormItem",{attrs:{prop:"password"}},[r("Input",{attrs:{prefix:"ios-keypad",type:"password",placeholder:"请输入密码"},on:{"on-enter":function(t){return e.handleSubmit("formInline")}},model:{value:e.formInline.password,callback:function(t){e.$set(e.formInline,"password",t)},expression:"formInline.password"}})],1),e._v(" "),r("FormItem",{staticStyle:{width:"100%"},attrs:{label:"记住密码"}},[r("i-switch",{on:{"on-change":e.savePsw},model:{value:e.historyPsw,callback:function(t){e.historyPsw=t},expression:"historyPsw"}})],1),e._v(" "),r("FormItem",{staticStyle:{"text-align":"right",width:"100%"}},[r("Button",{attrs:{type:"primary"},on:{click:function(t){return e.handleSubmit("formInline")}}},[e._v("登录")]),e._v(" "),r("Button",{attrs:{type:"primary"},on:{click:function(t){return e.$router.push({name:"regist"})}}},[e._v("注册")])],1)],1)],1)])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticStyle:{position:"absolute",top:"100px","font-size":"40px",color:"#fff"}},[t("p",[this._v("\n      云尚智能停车系统\n    ")])])}]};var p=r("VU/8")(c,m,!1,function(e){r("xqyz")},"data-v-2a9f8244",null);t.default=p.exports},xqyz:function(e,t){}});
//# sourceMappingURL=9.6287c95b119a9004230f.js.map