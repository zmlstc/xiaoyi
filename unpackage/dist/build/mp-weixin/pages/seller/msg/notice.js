(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/seller/msg/notice"],{2213:function(e,n,t){"use strict";t.r(n);var o=t("3a6d"),a=t.n(o);for(var r in o)"default"!==r&&function(e){t.d(n,e,function(){return o[e]})}(r);n["default"]=a.a},"3a6d":function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=r(t("a34a")),a=t("2f62");function r(e){return e&&e.__esModule?e:{default:e}}function u(e,n,t,o,a,r,u){try{var l=e[r](u),i=l.value}catch(c){return void t(c)}l.done?n(i):Promise.resolve(i).then(o,a)}function l(e){return function(){var n=this,t=arguments;return new Promise(function(o,a){var r=e.apply(n,t);function l(e){u(r,o,a,l,i,"next",e)}function i(e){u(r,o,a,l,i,"throw",e)}l(void 0)})}}var i={data:function(){return{list:[],loadingText:"正在加载...",hasmore:!0,curpage:1,theIndex:null,oldIndex:null,isStop:!1}},computed:(0,a.mapState)(["sellerHasLogin","sellerInfo"]),onLoad:function(){console.log("页面加载"),this.loadData()},onReachBottom:function(){console.log("下拉加载..."),this.curpage++,this.loadData()},onPageScroll:function(){console.log("页面滚动...")},onPullDownRefresh:function(){console.log("上拉刷新..."),e.stopPullDownRefresh()},methods:{loadData:function(){var n=l(o.default.mark(function n(){var t;return o.default.wrap(function(n){while(1)switch(n.prev=n.next){case 0:if(t=this,this.sellerHasLogin){n.next=5;break}e.navigateTo({url:"../login"}),n.next=9;break;case 5:if(this.hasmore){n.next=8;break}return this.loadingText="到底了",n.abrupt("return",!1);case 8:t.$Request.post("seller_msg/ggmsg",{curpage:t.curpage}).then(function(n){if(200==n.code){console.log(n),t.hasmore=n.hasmore,console.log(t.hasmore);for(var o=n.datas.list,a=0;a<o.length;a++)t.list.push(o[a]);t.hasmore||(t.loadingText="到底了")}else e.showToast({icon:"none",title:n.datas.error,duration:2e3}),e.navigateTo({url:"login"})});case 9:case"end":return n.stop()}},n,this)}));function t(){return n.apply(this,arguments)}return t}(),toPage:function(n){e.navigateTo({url:n})}}};n.default=i}).call(this,t("543d")["default"])},"68e2":function(e,n,t){"use strict";t.r(n);var o=t("bccb"),a=t("2213");for(var r in a)"default"!==r&&function(e){t.d(n,e,function(){return a[e]})}(r);t("fbd5");var u=t("2877"),l=Object(u["a"])(a["default"],o["a"],o["b"],!1,null,null,null);n["default"]=l.exports},8219:function(e,n,t){"use strict";(function(e){t("1857"),t("921b");o(t("66fd"));var n=o(t("68e2"));function o(e){return e&&e.__esModule?e:{default:e}}e(n.default)}).call(this,t("543d")["createPage"])},bccb:function(e,n,t){"use strict";var o=function(){var e=this,n=e.$createElement;e._self._c},a=[];t.d(n,"a",function(){return o}),t.d(n,"b",function(){return a})},ca85:function(e,n,t){},fbd5:function(e,n,t){"use strict";var o=t("ca85"),a=t.n(o);a.a}},[["8219","common/runtime","common/vendor"]]]);