(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/member/tx/txway"],{1544:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=u(e("a34a")),r=e("2f62");function u(t){return t&&t.__esModule?t:{default:t}}function a(t,n,e,o,r,u,a){try{var i=t[u](a),c=i.value}catch(s){return void e(s)}i.done?n(c):Promise.resolve(c).then(o,r)}function i(t){return function(){var n=this,e=arguments;return new Promise(function(o,r){var u=t.apply(n,e);function i(t){a(u,o,r,i,c,"next",t)}function c(t){a(u,o,r,i,c,"throw",t)}i(void 0)})}}function c(t){for(var n=1;n<arguments.length;n++){var e=null!=arguments[n]?arguments[n]:{},o=Object.keys(e);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(e).filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.forEach(function(n){s(t,n,e[n])})}return t}function s(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}var f={data:function(){return{memberInfo:[],txwaylist:[],current:0}},computed:(0,r.mapState)(["hasLogin","userInfo"]),onLoad:function(){console.log("页面加载"),this.loadData()},onShow:function(){this.hasLogin?this.memberInfo=this.userInfo:t.navigateTo({url:"../login"})},methods:c({},(0,r.mapMutations)(["setUserInfo"]),{loadData:function(){var n=i(o.default.mark(function n(){var e;return o.default.wrap(function(n){while(1)switch(n.prev=n.next){case 0:e=this,this.hasLogin?this.memberInfo=this.userInfo:t.navigateTo({url:"../login"}),e.$Request.post("member_fund/txwaylist").then(function(t){200==t.code&&(console.log(t),e.txwaylist=t.datas.list)}).catch(function(t){console.log(t)});case 3:case"end":return n.stop()}},n,this)}));function e(){return n.apply(this,arguments)}return e}(),toPage:function(n){t.navigateTo({url:n})},checkTxWay:function(n){for(var e=0;e<this.txwaylist.length;e++)this.txwaylist[e].id===n&&(this.current=n,this.txwaylist[e].is_default=0),this.txwaylist[e].is_default=0;this.$Request.post("member_fund/isdefaut",{id:n}).then(function(n){200==n.code&&(console.log(n),t.navigateTo({url:"tx",success:function(t){var n=getCurrentPages().pop();void 0!=n&&null!=n&&n.onLoad()}}))})}})};n.default=f}).call(this,e("543d")["default"])},3018:function(t,n,e){"use strict";var o=function(){var t=this,n=t.$createElement;t._self._c},r=[];e.d(n,"a",function(){return o}),e.d(n,"b",function(){return r})},"327f":function(t,n,e){"use strict";e.r(n);var o=e("1544"),r=e.n(o);for(var u in o)"default"!==u&&function(t){e.d(n,t,function(){return o[t]})}(u);n["default"]=r.a},"47e2":function(t,n,e){"use strict";var o=e("7cf3"),r=e.n(o);r.a},"5d8a":function(t,n,e){"use strict";e.r(n);var o=e("3018"),r=e("327f");for(var u in r)"default"!==u&&function(t){e.d(n,t,function(){return r[t]})}(u);e("47e2");var a=e("2877"),i=Object(a["a"])(r["default"],o["a"],o["b"],!1,null,null,null);n["default"]=i.exports},"7cf3":function(t,n,e){},c8bf:function(t,n,e){"use strict";(function(t){e("1857"),e("921b");o(e("66fd"));var n=o(e("5d8a"));function o(t){return t&&t.__esModule?t:{default:t}}t(n.default)}).call(this,e("543d")["createPage"])}},[["c8bf","common/runtime","common/vendor"]]]);