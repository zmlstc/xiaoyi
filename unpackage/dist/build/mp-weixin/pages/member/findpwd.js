(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/member/findpwd"],{3763:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=n("2f62");function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},o=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),o.forEach(function(t){s(e,t,n[t])})}return e}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var c={data:function(){return{showTxt:"获取动态码",countdown:60,cTimer:null,phoneNumber:"",phoneShow:"",smscode:"",isNext:!1,pwd:"",pwd2:""}},onLoad:function(){console.log("页面加载");var e=this;console.log("页面加载"),e.$Request.post("login/getPhone").then(function(t){200==t.code&&(console.log(t),e.phoneNumber=t.datas.phone,e.phoneShow=t.datas.phone_show)})},methods:i({},(0,o.mapMutations)(["setToken","setUserInfo"]),{nextReg:function(){var t=this;return/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber)?/^[0-9]*$/.test(this.smscode)&&6==this.smscode.length?(e.showLoading({title:"正在处理中..."}),void t.$Request.post("connect/check_sms_captcha",{phone:t.phoneNumber,yzcode:t.smscode,type:3}).then(function(n){200==n.code?(console.log(n),e.hideLoading(),console.log(n),t.isNext=!0,e.setNavigationBarTitle({title:"输入新密码"})):(e.hideLoading(),e.showToast({icon:"none",title:n.datas.error,duration:2e3}))})):(e.showToast({title:"请填写正确的验证码",icon:"none"}),!1):(e.showToast({title:"请填写正确手机号码",icon:"none"}),!1)},nextReg2:function(){var t=this;return/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber)?/^[0-9]*$/.test(this.smscode)&&6==this.smscode.length?/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(this.pwd)?this.pwd!=this.pwd2?(e.showToast({title:"两次输入的密码不一致",icon:"none"}),!1):(e.showLoading({title:"正在处理中..."}),void t.$Request.post("connect/find_password",{phone:t.phoneNumber,yzcode:t.smscode,type:3,password:t.pwd,password_confirm:t.pwd2}).then(function(t){200==t.code?(console.log(t),e.showToast({icon:"none",title:"恭喜您，新密码设置成功！",duration:3e3,success:function(){setTimeout(function(){e.navigateTo({url:"/pages/member/login"})},2e3)}}),e.hideLoading()):(e.hideLoading(),e.showToast({icon:"none",title:t.datas.error,duration:2e3}))})):(e.showToast({title:"密码必须大于6位包含数字和字母",icon:"none"}),!1):(e.showToast({title:"请填写正确的验证码",icon:"none"}),!1):(e.showToast({title:"请填写正确手机号码",icon:"none"}),!1)},toPage:function(t){e.navigateTo({url:t})},toSendSms:function(){var t=this;if(!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))return e.showToast({title:"请填写正确手机号码",icon:"none"}),!1;t.$Request.post("connect/get_sms_captcha",{phone:t.phoneNumber,type:3}).then(function(n){200==n.code?(console.log(n),t.startTimer(),e.showToast({title:"验证码已发送",icon:"none",duration:2e3})):e.showToast({icon:"none",title:n.datas.error,duration:2e3})})},startTimer:function(){var e=this;null==e.cTimer&&(e.cTimer=setInterval(function(){e.countdown--,0==e.countdown&&e.clearTimer()},1e3))},clearTimer:function(){var e=this;clearInterval(e.cTimer),e.cTimer=null,e.countdown=60,e.showTxt="重新发送"}})};t.default=c}).call(this,n("543d")["default"])},"3dc0":function(e,t,n){"use strict";n.r(t);var o=n("6368"),i=n("458d");for(var s in i)"default"!==s&&function(e){n.d(t,e,function(){return i[e]})}(s);n("e2dc");var c=n("2877"),r=Object(c["a"])(i["default"],o["a"],o["b"],!1,null,null,null);t["default"]=r.exports},"458d":function(e,t,n){"use strict";n.r(t);var o=n("3763"),i=n.n(o);for(var s in o)"default"!==s&&function(e){n.d(t,e,function(){return o[e]})}(s);t["default"]=i.a},"500c":function(e,t,n){},6368:function(e,t,n){"use strict";var o=function(){var e=this,t=e.$createElement;e._self._c},i=[];n.d(t,"a",function(){return o}),n.d(t,"b",function(){return i})},"70f1":function(e,t,n){"use strict";(function(e){n("1857"),n("921b");o(n("66fd"));var t=o(n("3dc0"));function o(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},e2dc:function(e,t,n){"use strict";var o=n("500c"),i=n.n(o);i.a}},[["70f1","common/runtime","common/vendor"]]]);