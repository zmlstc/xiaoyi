(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/member/home"],{1971:function(e,o,n){"use strict";(function(e){Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var t=r(n("a34a")),a=n("2f62");function r(e){return e&&e.__esModule?e:{default:e}}function u(e,o,n,t,a,r,u){try{var s=e[r](u),i=s.value}catch(l){return void n(l)}s.done?o(i):Promise.resolve(i).then(t,a)}function s(e){return function(){var o=this,n=arguments;return new Promise(function(t,a){var r=e.apply(o,n);function s(e){u(r,t,a,s,i,"next",e)}function i(e){u(r,t,a,s,i,"throw",e)}s(void 0)})}}var i={data:function(){return{memberInfo:[],artlist:[]}},computed:(0,a.mapState)(["hasLogin","userInfo"]),onLoad:function(){console.log("页面加载"," at pages\\member\\home.vue:106"),this.loadData()},onShow:function(){console.log("页面显示.."," at pages\\member\\home.vue:110")},onReady:function(){console.log("页面初次显示"," at pages\\member\\home.vue:113")},onHide:function(){console.log("页面隐藏"," at pages\\member\\home.vue:116")},onUnload:function(){console.log("页面卸载"," at pages\\member\\home.vue:119")},onBackPress:function(){console.log("页面返回..."," at pages\\member\\home.vue:122")},onShareAppMessage:function(){console.log("分享!"," at pages\\member\\home.vue:125")},onReachBottom:function(){console.log("下拉加载..."," at pages\\member\\home.vue:128")},onPageScroll:function(){console.log("页面滚动..."," at pages\\member\\home.vue:131")},onPullDownRefresh:function(){console.log("上拉刷新..."," at pages\\member\\home.vue:134"),e.stopPullDownRefresh()},methods:{loadData:function(){var o=s(t.default.mark(function o(){var n=this;return t.default.wrap(function(o){while(1)switch(o.prev=o.next){case 0:console.log("===userInfo==="+this.hasLogin," at pages\\member\\home.vue:139"),console.log(this.userInfo," at pages\\member\\home.vue:140"),console.log(this.userInfo.token," at pages\\member\\home.vue:141"),this.hasLogin?this.$Request.post("member_index").then(function(o){200==o.code?(console.log(o," at pages\\member\\home.vue:149"),n.memberInfo=o.datas.member_info,n.artlist=o.datas.artlist):(e.showToast({icon:"none",title:o.datas.error,duration:2e3}),e.navigateTo({url:"login"}))}):e.navigateTo({url:"login"});case 4:case"end":return o.stop()}},o,this)}));function n(){return o.apply(this,arguments)}return n}(),toPage:function(o){e.navigateTo({url:o})}}};o.default=i}).call(this,n("6e42")["default"])},"1af4":function(e,o,n){"use strict";n.r(o);var t=n("1971"),a=n.n(t);for(var r in t)"default"!==r&&function(e){n.d(o,e,function(){return t[e]})}(r);o["default"]=a.a},"37eb":function(e,o,n){"use strict";n.r(o);var t=n("b003"),a=n("1af4");for(var r in a)"default"!==r&&function(e){n.d(o,e,function(){return a[e]})}(r);var u=n("2877"),s=Object(u["a"])(a["default"],t["a"],t["b"],!1,null,null,null);o["default"]=s.exports},b003:function(e,o,n){"use strict";var t=function(){var e=this,o=e.$createElement;e._self._c},a=[];n.d(o,"a",function(){return t}),n.d(o,"b",function(){return a})}},[["9856","common/runtime","common/vendor"]]]);