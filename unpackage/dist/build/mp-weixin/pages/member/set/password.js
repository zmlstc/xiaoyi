(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/member/set/password"],{1035:function(n,t,e){},"1b80":function(n,t,e){"use strict";e.r(t);var o=e("ef41"),r=e("d2b0");for(var u in r)"default"!==u&&function(n){e.d(t,n,function(){return r[n]})}(u);e("2f5e");var i=e("2877"),a=Object(i["a"])(r["default"],o["a"],o["b"],!1,null,null,null);t["default"]=a.exports},"2f5e":function(n,t,e){"use strict";var o=e("1035"),r=e.n(o);r.a},7981:function(n,t,e){"use strict";(function(n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=u(e("a34a")),r=e("2f62");function u(n){return n&&n.__esModule?n:{default:n}}function i(n,t,e,o,r,u,i){try{var a=n[u](i),c=a.value}catch(f){return void e(f)}a.done?t(c):Promise.resolve(c).then(o,r)}function a(n){return function(){var t=this,e=arguments;return new Promise(function(o,r){var u=n.apply(t,e);function a(n){i(u,o,r,a,c,"next",n)}function c(n){i(u,o,r,a,c,"throw",n)}a(void 0)})}}function c(n){for(var t=1;t<arguments.length;t++){var e=null!=arguments[t]?arguments[t]:{},o=Object.keys(e);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(e).filter(function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),o.forEach(function(t){f(n,t,e[t])})}return n}function f(n,t,e){return t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}var s={data:function(){return{memberInfo:[],opwd:"",newpwd:"",newpwd2:"",logining:!1}},computed:(0,r.mapState)(["hasLogin","userInfo"]),onLoad:function(){console.log("页面加载"),this.loadData()},methods:c({},(0,r.mapMutations)(["setUserInfo"]),{loadData:function(){var t=a(o.default.mark(function t(){return o.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:this.hasLogin?this.memberInfo=this.userInfo:n.navigateTo({url:"../login"});case 1:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),formSubmit:function(t){var e=this;return e.opwd.length<6||e.opwd.length>20?(n.showToast({title:"请填写正确的旧密码",icon:"none"}),!1):/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(e.newpwd)?e.newpwd!=e.newpwd2?(n.showToast({title:"两次输入的密码不一致",icon:"none"}),!1):(e.logining=!0,console.log("-----check-----------"),void e.$Request.post("member_account/modify_pwd",{opwd:e.opwd,newpwd:e.newpwd,newpwd2:e.newpwd2}).then(function(t){200==t.code?(console.log(t),n.showToast({icon:"none",title:"修改成功！",duration:2e3,success:function(){setTimeout(function(){n.redirectTo({url:"safeset"})},2e3)}})):(n.showToast({icon:"none",title:t.datas.error,duration:2e3}),e.logining=!1)}).catch(function(n){console.log(n)})):(n.showToast({title:"密码必须大于6位包含数字和字母",icon:"none"}),!1)},toPage:function(t){n.navigateTo({url:t})}})};t.default=s}).call(this,e("543d")["default"])},d2b0:function(n,t,e){"use strict";e.r(t);var o=e("7981"),r=e.n(o);for(var u in o)"default"!==u&&function(n){e.d(t,n,function(){return o[n]})}(u);t["default"]=r.a},ef41:function(n,t,e){"use strict";var o=function(){var n=this,t=n.$createElement;n._self._c},r=[];e.d(t,"a",function(){return o}),e.d(t,"b",function(){return r})},f07d:function(n,t,e){"use strict";(function(n){e("1857"),e("921b");o(e("66fd"));var t=o(e("1b80"));function o(n){return n&&n.__esModule?n:{default:n}}n(t.default)}).call(this,e("543d")["createPage"])}},[["f07d","common/runtime","common/vendor"]]]);