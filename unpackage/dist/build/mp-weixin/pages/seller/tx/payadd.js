(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/seller/tx/payadd"],{"022e":function(n,e,t){"use strict";var o=function(){var n=this,e=n.$createElement;n._self._c},i=[];t.d(e,"a",function(){return o}),t.d(e,"b",function(){return i})},"0983":function(n,e,t){},"16a3":function(n,e,t){"use strict";t.r(e);var o=t("022e"),i=t("611b");for(var s in i)"default"!==s&&function(n){t.d(e,n,function(){return i[n]})}(s);t("e9c3");var a=t("2877"),r=Object(a["a"])(i["default"],o["a"],o["b"],!1,null,null,null);e["default"]=r.exports},"466c":function(n,e,t){"use strict";(function(n){t("1857"),t("921b");o(t("66fd"));var e=o(t("16a3"));function o(n){return n&&n.__esModule?n:{default:n}}n(e.default)}).call(this,t("543d")["createPage"])},"611b":function(n,e,t){"use strict";t.r(e);var o=t("a409"),i=t.n(o);for(var s in o)"default"!==s&&function(n){t.d(e,n,function(){return o[n]})}(s);e["default"]=i.a},a409:function(n,e,t){"use strict";(function(n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=s(t("a34a")),i=t("2f62");function s(n){return n&&n.__esModule?n:{default:n}}function a(n,e,t,o,i,s,a){try{var r=n[s](a),u=r.value}catch(c){return void t(c)}r.done?e(u):Promise.resolve(u).then(o,i)}function r(n){return function(){var e=this,t=arguments;return new Promise(function(o,i){var s=n.apply(e,t);function r(n){a(s,o,i,r,u,"next",n)}function u(n){a(s,o,i,r,u,"throw",n)}r(void 0)})}}var u={data:function(){return{current:"wxpay",uname:"",unumber:"",smscode:"",showTxt:"获取动态码",countdown:60,cTimer:null,phonetxt:"",phoneNumber:"",logining:!1,openid:"",wxnick:""}},computed:(0,i.mapState)(["sellerHasLogin"]),onLoad:function(){console.log("页面加载"),this.loadData()},methods:{loadData:function(){var e=r(o.default.mark(function e(){var t;return o.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:wx.getSetting({success:function(n){n.authSetting["scope.userInfo"]&&wx.getUserInfo({success:function(n){console.log(n.userInfo)}})}}),t=this,this.sellerHasLogin?(t.getWxInfo(),t.$Request.post("seller_fund/phone").then(function(e){200==e.code?(console.log(e),t.phonetxt=e.datas.mobiletxt,t.phoneNumber=e.datas.shop_phone):(n.showToast({icon:"none",title:e.datas.error,duration:2e3}),n.navigateTo({url:"../login"}))})):n.navigateTo({url:"../login"});case 3:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),getUserInfo:function(n){console.log("nickname="+n.detail.userInfo.nickName),this.wxnick=n.detail.userInfo.nickName},formSubmit:function(e){var t=this;return t.logining=!0,"wxpay"!==this.current&&"alipay"!==this.current?(n.showToast({title:"请选择账户类型",icon:"none"}),t.logining=!1,!1):"wxpay"==this.current&&""==this.openid?(n.showToast({title:"获取微信账号信息失败",icon:"none"}),t.logining=!1,!1):""==this.uname?(n.showToast({title:"请填写账户名称",icon:"none"}),t.logining=!1,!1):""==this.unumber&&"wxpay"!==this.current?(n.showToast({title:"请填写提现账号",icon:"none"}),t.logining=!1,!1):/^[0-9]*$/.test(this.smscode)&&6==this.smscode.length?("wxpay"==this.current&&(this.unumber=this.wxnick),void t.$Request.post("connect/check_sms",{phone:t.phoneNumber,yzcode:t.smscode,type:5}).then(function(e){if(200==e.code){console.log(e);var o={phone:t.phoneNumber,yzcode:t.smscode,type:1,openid:t.openid,bill_user_name:t.uname,bill_type_number:t.unumber,bill_type_code:t.current};t.$Request.post("seller_fund/txway_add",o).then(function(e){200==e.code?(console.log(e),n.showToast({icon:"none",title:"添加成功！",duration:3e3,success:function(){setTimeout(function(){n.navigateTo({url:"txway"})},2e3)}})):n.showToast({icon:"none",title:e.datas.error,duration:2e3,success:function(){t.logining=!1}})})}else n.showToast({icon:"none",title:e.datas.error,duration:2e3,success:function(){t.logining=!1}})})):(n.showToast({title:"请填写正确的验证码",icon:"none"}),t.logining=!1,!1)},toPage:function(e){n.navigateTo({url:e})},radioChange:function(n){console.log(n),console.log(n.target.value),console.log(n.detail.value),"wxpay"==n.detail.value?this.getWxInfo():this.openid="",this.current=n.detail.value},getWxInfo:function(){var e=this;n.showLoading({title:"正在获取微信账号信息..."}),n.login({provider:"weixin",success:function(t){var o=t.code;e.$Request.post("seller_fund/getwxinfo",{code:o}).then(function(t){200==t.code?("10"==t.datas.state&&(console.log(t.datas),e.openid=t.datas.openid),n.hideLoading()):(n.hideLoading(),n.showToast({icon:"none",title:t.datas.error,duration:2e3}))})}})},toSendSms:function(){var e=this;if(!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))return n.showToast({title:"请填写正确手机号码",icon:"none"}),!1;e.$Request.post("connect/get_sms_captcha",{phone:e.phoneNumber,type:5}).then(function(t){200==t.code?(console.log(t),e.startTimer(),n.showToast({title:"验证码已发送",icon:"none",duration:2e3})):n.showToast({icon:"none",title:t.datas.error,duration:2e3})})},startTimer:function(){var n=this;null==n.cTimer&&(n.cTimer=setInterval(function(){n.countdown--,0==n.countdown&&n.clearTimer()},1e3))},clearTimer:function(){var n=this;clearInterval(n.cTimer),n.cTimer=null,n.countdown=60,n.showTxt="重新发送"}}};e.default=u}).call(this,t("543d")["default"])},e9c3:function(n,e,t){"use strict";var o=t("0983"),i=t.n(o);i.a}},[["466c","common/runtime","common/vendor"]]]);