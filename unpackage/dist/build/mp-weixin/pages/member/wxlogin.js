(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/member/wxlogin"],{1177:function(e,t,n){"use strict";n.r(t);var o=n("5c33"),i=n.n(o);for(var s in o)"default"!==s&&function(e){n.d(t,e,function(){return o[e]})}(s);t["default"]=i.a},"33e7":function(e,t,n){"use strict";var o=n("e378"),i=n.n(o);i.a},"3b82":function(e,t,n){"use strict";var o=function(){var e=this,t=e.$createElement;e._self._c},i=[];n.d(t,"a",function(){return o}),n.d(t,"b",function(){return i})},"48f9":function(e,t,n){},"5b63":function(e,t,n){"use strict";n.r(t);var o=n("3b82"),i=n("1177");for(var s in i)"default"!==s&&function(e){n.d(t,e,function(){return i[e]})}(s);n("33e7"),n("776b");var a=n("2877"),c=Object(a["a"])(i["default"],o["a"],o["b"],!1,null,null,null);t["default"]=c.exports},"5c33":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=n("2f62");function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},o=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),o.forEach(function(t){s(e,t,n[t])})}return e}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var a={data:function(){return{showTxt:"获取动态码",countdown:60,cTimer:null,phoneNumber:"",smscode:"",invitecode:"",isagree:!1,pwd:"",pwd2:"",SessionKey:"",unionid:"",nickName:null,avatarUrl:null,isCanUse:e.getStorageSync("isCanUse")||!0,isBind:!1}},methods:i({},(0,o.mapMutations)(["setToken","setUserInfo"]),{toShow:function(e){"1"===e?(this.clearTimer(),this.showTxt="获取动态码",this.smscode="",this.isBind=!0):"0"===e&&(this.clearTimer(),this.showTxt="获取动态码",this.smscode="",this.isBind=!1)},login:function(){var t=this;e.showLoading({title:"登录中..."}),e.login({provider:"weixin",success:function(n){var o=n.code;t.$Request.post("connect/wxlogin",{code:o}).then(function(n){200==n.code?("10"==n.datas.state?(t.isCanUse=!1,t.SessionKey=n.datas.SessionKey,t.unionid=n.datas.unionid):(console.log(n),t.setToken(n.datas.token),t.setUserInfo(n.datas),e.switchTab({url:"/pages/member/home",success:function(e){var t=getCurrentPages().pop();void 0!=t&&null!=t&&t.onLoad()}})),e.hideLoading()):(e.hideLoading(),e.showToast({icon:"none",title:n.datas.error,duration:2e3}))})}})},getPhoneNumber:function(t){var n=this;console.log(t.detail.errMsg),console.log(t.detail.iv),console.log(t.detail.encryptedData),n.$Request.post("connect/wxminphone",{iv:t.detail.iv,epdata:t.detail.encryptedData,skey:this.skey}).then(function(t){200==t.code?("10"==t.datas.state?n.isCanUse=!1:(console.log(t),n.setToken(t.datas.token),n.setUserInfo(t.datas),e.switchTab({url:"/pages/member/home",success:function(e){var t=getCurrentPages().pop();void 0!=t&&null!=t&&t.onLoad()}})),e.hideLoading()):(e.hideLoading(),e.showToast({icon:"none",title:t.datas.error,duration:2e3}))})},toSendSms:function(){var t=this;if(!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))return e.showToast({title:"请填写正确手机号码",icon:"none"}),!1;t.$Request.post("connect/checkmob",{phone:t.phoneNumber}).then(function(n){200==n.code&&"1"==n.datas?t.$Request.post("connect/get_sms_captcha",{phone:t.phoneNumber,type:1}).then(function(n){200==n.code?(console.log(n),t.startTimer(),e.showToast({title:"验证码已发送",icon:"none",duration:2e3})):e.showToast({icon:"none",title:n.datas.error,duration:2e3})}):e.showToast({icon:"none",title:"手机号码已存在",duration:2e3})})},startTimer:function(){var e=this;null==e.cTimer&&(e.cTimer=setInterval(function(){e.countdown--,0==e.countdown&&e.clearTimer()},1e3))},clearTimer:function(){var e=this;clearInterval(e.cTimer),e.cTimer=null,e.countdown=60,e.showTxt="重新发送"},checkboxChange:function(e){console.log("--------------"),console.log(e.detail.value[0]),e.detail.value.length>0&&(this.isagree=!0),console.log(this.isagree)},checkpwd1:function(t){var n=t.detail.value;if(!/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(n))return e.showToast({title:"密码必须大于6位包含数字和字母",icon:"none"}),!1},checkpwd2:function(t){if(this.pwd!=this.pwd2)return e.showToast({title:"两次输入的密码不一致",icon:"none"}),!1},nextReg:function(){var t=this;return/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber)?/^[0-9]*$/.test(this.smscode)&&6==this.smscode.length?!/^[A-Za-z0-9]+$/.test(this.invitecode)||this.invitecode.length<3?(e.showToast({title:"请填写正确的邀请码",icon:"none"}),!1):/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(this.pwd)?this.pwd!=this.pwd2?(e.showToast({title:"两次输入的密码不一致",icon:"none"}),!1):this.isagree?(e.showLoading({title:"正在处理中..."}),void t.$Request.post("connect/check_sms_invite",{phone:t.phoneNumber,yzcode:t.smscode,invcode:t.invitecode,type:1}).then(function(n){if(200==n.code){console.log(n);var o={phone:t.phoneNumber,yzcode:t.smscode,invcode:t.invitecode,type:1,password:t.pwd,password_confirm:t.pwd2,unionid:t.unionid,nickname:t.nickName};t.$Request.post("connect/wxmini_register",o).then(function(n){200==n.code?(console.log(n),t.setToken(n.datas.token),t.setUserInfo(n.datas),e.showToast({icon:"none",title:"恭喜您！微信账号绑定成功",duration:2e3,success:function(){setTimeout(function(){e.switchTab({url:"/pages/member/home",success:function(e){var t=getCurrentPages().pop();void 0!=t&&null!=t&&t.onLoad()}})},2e3)}})):(e.hideLoading(),e.showToast({icon:"none",title:n.datas.error,duration:2e3}))})}else e.hideLoading(),e.showToast({icon:"none",title:n.datas.error,duration:2e3})})):(e.showToast({title:"请选择同意注册协议",icon:"none",duration:2e3}),!1):(e.showToast({title:"密码必须大于6位包含数字和字母",icon:"none"}),!1):(e.showToast({title:"请填写正确的验证码",icon:"none"}),!1):(e.showToast({title:"请填写正确手机号码",icon:"none"}),!1)},nextBind:function(){var t=this;if(!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))return e.showToast({title:"请填写正确手机号码",icon:"none"}),!1;if(!/^[0-9]*$/.test(this.smscode)||6!=this.smscode.length)return e.showToast({title:"请填写正确的验证码",icon:"none"}),!1;if(""==t.unionid)return e.showToast({title:"登陆参数错误！",icon:"none"}),!1;e.showLoading({title:"正在处理中..."});var n={phone:t.phoneNumber,yzcode:t.smscode,type:2,unionid:t.unionid};t.$Request.post("connect/wxbindMember",n).then(function(n){200==n.code?(console.log(n),t.setToken(n.datas.token),t.setUserInfo(n.datas),e.hideLoading(),e.showToast({icon:"none",title:"恭喜您！微信账号绑定成功",duration:2e3,success:function(){setTimeout(function(){e.switchTab({url:"/pages/member/home",success:function(e){var t=getCurrentPages().pop();void 0!=t&&null!=t&&t.onLoad()}})},2e3)}})):(e.hideLoading(),e.showToast({icon:"none",title:n.datas.error,duration:2e3}))})},toSendSms2:function(){var t=this;if(!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))return e.showToast({title:"请填写正确手机号码",icon:"none"}),!1;t.$Request.post("connect/get_sms_captcha",{phone:t.phoneNumber,type:2}).then(function(n){200==n.code?(console.log(n),t.startTimer(),e.showToast({title:"验证码已发送",icon:"none",duration:2e3})):e.showToast({icon:"none",title:n.datas.error,duration:2e3})})}}),onLoad:function(){this.login()}};t.default=a}).call(this,n("543d")["default"])},"776b":function(e,t,n){"use strict";var o=n("48f9"),i=n.n(o);i.a},"799d":function(e,t,n){"use strict";(function(e){n("1857"),n("921b");o(n("66fd"));var t=o(n("5b63"));function o(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},e378:function(e,t,n){}},[["799d","common/runtime","common/vendor"]]]);