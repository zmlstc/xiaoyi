(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/member/mlogin"],{"1dc9":function(e,t,n){"use strict";var o=function(){var e=this,t=e.$createElement;e._self._c},r=[];n.d(t,"a",function(){return o}),n.d(t,"b",function(){return r})},4445:function(e,t,n){"use strict";(function(e){n("1857"),n("921b");o(n("66fd"));var t=o(n("ed65"));function o(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},"4e2a":function(e,t,n){"use strict";var o=n("b267"),r=n.n(o);r.a},"61e0":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=n("2f62");function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},o=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),o.forEach(function(t){c(e,t,n[t])})}return e}function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var i={data:function(){return{showTxt:"获取动态码",countdown:60,cTimer:null,phoneNumber:"",smscode:""}},onLoad:function(){console.log("页面加载")},methods:r({},(0,o.mapMutations)(["setToken","setUserInfo"]),{nextReg:function(){var t=this;return/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber)?/^[0-9]*$/.test(this.smscode)&&6==this.smscode.length?(e.showLoading({title:"正在处理中..."}),void t.$Request.post("connect/smslogin",{phone:t.phoneNumber,yzcode:t.smscode,type:2}).then(function(n){200==n.code?(console.log(n),t.setToken(n.datas.token),t.setUserInfo(n.datas),e.switchTab({url:"/pages/member/home",success:function(e){var t=getCurrentPages().pop();void 0!=t&&null!=t&&t.onLoad()}}),e.hideLoading()):(e.hideLoading(),e.showToast({icon:"none",title:n.datas.error,duration:2e3}))})):(e.showToast({title:"请填写正确的验证码",icon:"none"}),!1):(e.showToast({title:"请填写正确手机号码",icon:"none"}),!1)},toPage:function(t){e.navigateTo({url:t})},toSendSms:function(){var t=this;if(!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))return e.showToast({title:"请填写正确手机号码",icon:"none"}),!1;t.$Request.post("connect/get_sms_captcha",{phone:t.phoneNumber,type:2}).then(function(n){200==n.code?(console.log(n),t.startTimer(),e.showToast({title:"验证码已发送",icon:"none",duration:2e3})):e.showToast({icon:"none",title:n.datas.error,duration:2e3})})},startTimer:function(){var e=this;null==e.cTimer&&(e.cTimer=setInterval(function(){e.countdown--,0==e.countdown&&e.clearTimer()},1e3))},clearTimer:function(){var e=this;clearInterval(e.cTimer),e.cTimer=null,e.countdown=60,e.showTxt="重新发送"}})};t.default=i}).call(this,n("543d")["default"])},"720e":function(e,t,n){"use strict";n.r(t);var o=n("61e0"),r=n.n(o);for(var c in o)"default"!==c&&function(e){n.d(t,e,function(){return o[e]})}(c);t["default"]=r.a},b267:function(e,t,n){},ed65:function(e,t,n){"use strict";n.r(t);var o=n("1dc9"),r=n("720e");for(var c in r)"default"!==c&&function(e){n.d(t,e,function(){return r[e]})}(c);n("4e2a");var i=n("2877"),u=Object(i["a"])(r["default"],o["a"],o["b"],!1,null,null,null);t["default"]=u.exports}},[["4445","common/runtime","common/vendor"]]]);