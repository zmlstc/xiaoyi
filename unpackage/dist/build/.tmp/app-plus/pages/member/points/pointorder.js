(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/member/points/pointorder"],{"17ed":function(e,t,o){"use strict";var n=function(){var e=this,t=e.$createElement;e._self._c},a=[];o.d(t,"a",function(){return n}),o.d(t,"b",function(){return a})},"444a":function(e,t,o){},5643:function(e,t,o){"use strict";o.r(t);var n=o("17ed"),a=o("6a89");for(var r in a)"default"!==r&&function(e){o.d(t,e,function(){return a[e]})}(r);o("d197");var i=o("2877"),s=Object(i["a"])(a["default"],n["a"],n["b"],!1,null,null,null);t["default"]=s.exports},"6a89":function(e,t,o){"use strict";o.r(t);var n=o("a4e7"),a=o.n(n);for(var r in n)"default"!==r&&function(e){o.d(t,e,function(){return n[e]})}(r);t["default"]=a.a},a4e7:function(e,t,o){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=r(o("a34a")),a=o("2f62");function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t,o,n,a,r,i){try{var s=e[r](i),u=s.value}catch(l){return void o(l)}s.done?t(u):Promise.resolve(u).then(n,a)}function s(e){return function(){var t=this,o=arguments;return new Promise(function(n,a){var r=e.apply(t,o);function s(e){i(r,n,a,s,u,"next",e)}function u(e){i(r,n,a,s,u,"throw",e)}s(void 0)})}}var u={data:function(){return{datalist:[],loadingText:"正在加载...",hasmore:!0,curpage:1,state:20}},computed:(0,a.mapState)(["hasLogin","userInfo"]),onLoad:function(){console.log("页面加载"," at pages\\member\\points\\pointorder.vue:47"),this.loadData()},onReachBottom:function(){console.log("正在加载中..."," at pages\\member\\points\\pointorder.vue:51"),this.curpage++,this.loadData()},onPageScroll:function(){console.log("页面滚动..."," at pages\\member\\points\\pointorder.vue:56")},onPullDownRefresh:function(){console.log("上拉刷新..."," at pages\\member\\points\\pointorder.vue:59"),e.stopPullDownRefresh()},methods:{loadData:function(){var t=s(n.default.mark(function t(){var o=this;return n.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(console.log("===userInfo==="+this.hasLogin," at pages\\member\\points\\pointorder.vue:64"),console.log(this.userInfo," at pages\\member\\points\\pointorder.vue:65"),console.log(this.userInfo.token," at pages\\member\\points\\pointorder.vue:66"),this.hasmore){t.next=6;break}return this.loadingText="到底了",t.abrupt("return",!1);case 6:this.hasLogin?this.$Request.post("member_pointorder/orderlist",{curpage:this.curpage,state:this.state}).then(function(t){if(200==t.code){console.log(t," at pages\\member\\points\\pointorder.vue:77"),o.hasmore=t.hasmore,o.hasmore||(o.loadingText="到底了"),console.log(o.hasmore," at pages\\member\\points\\pointorder.vue:82");for(var n=t.datas.list,a=0;a<n.length;a++)o.datalist.push(n[a])}else e.showToast({icon:"none",title:t.datas.error,duration:2e3}),e.navigateTo({url:"login"})}):url="/pages/member/login";case 7:case"end":return t.stop()}},t,this)}));function o(){return t.apply(this,arguments)}return o}(),toPage:function(t){this.hasLogin||(t="/pages/member/login"),e.navigateTo({url:t})},clickBar:function(e){this.state!=e&&(this.state=e,this.hasmore=!0,this.curpage=1,this.datalist=[],this.loadingText="正在加载...",this.loadData())}}};t.default=u}).call(this,o("6e42")["default"])},d197:function(e,t,o){"use strict";var n=o("444a"),a=o.n(n);a.a}},[["e5b4","common/runtime","common/vendor"]]]);