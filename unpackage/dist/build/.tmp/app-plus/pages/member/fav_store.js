(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/member/fav_store"],{"596e":function(e,t,o){"use strict";var n=o("a909"),a=o.n(n);a.a},"8c55":function(e,t,o){"use strict";o.r(t);var n=o("abea"),a=o.n(n);for(var s in n)"default"!==s&&function(e){o.d(t,e,function(){return n[e]})}(s);t["default"]=a.a},a0ee:function(e,t,o){"use strict";o.r(t);var n=o("eaaf"),a=o("8c55");for(var s in a)"default"!==s&&function(e){o.d(t,e,function(){return a[e]})}(s);o("596e");var r=o("2877"),i=Object(r["a"])(a["default"],n["a"],n["b"],!1,null,null,null);t["default"]=i.exports},a909:function(e,t,o){},abea:function(e,t,o){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=s(o("a34a")),a=o("2f62");function s(e){return e&&e.__esModule?e:{default:e}}function r(e,t,o,n,a,s,r){try{var i=e[s](r),u=i.value}catch(l){return void o(l)}i.done?t(u):Promise.resolve(u).then(n,a)}function i(e){return function(){var t=this,o=arguments;return new Promise(function(n,a){var s=e.apply(t,o);function i(e){r(s,n,a,i,u,"next",e)}function u(e){r(s,n,a,i,u,"throw",e)}i(void 0)})}}var u=function(){return o.e("components/uni-rate/uni-rate").then(o.bind(null,"556a"))},l={data:function(){return{list:[],loadingText:"正在加载...",hasmore:!0,curpage:1,theIndex:null,oldIndex:null,isStop:!1}},components:{uniRate:u},computed:(0,a.mapState)(["hasLogin","userInfo"]),onLoad:function(){console.log("页面加载"," at pages\\member\\fav_store.vue:52"),this.loadData()},onReachBottom:function(){console.log("下拉加载..."," at pages\\member\\fav_store.vue:56"),this.curpage++,this.loadData()},onPageScroll:function(){console.log("页面滚动..."," at pages\\member\\fav_store.vue:61")},onPullDownRefresh:function(){console.log("上拉刷新..."," at pages\\member\\fav_store.vue:64"),e.stopPullDownRefresh()},methods:{loadData:function(){var t=i(n.default.mark(function t(){var o=this;return n.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(console.log("===userInfo==="+this.hasLogin," at pages\\member\\fav_store.vue:69"),console.log(this.userInfo," at pages\\member\\fav_store.vue:70"),console.log(this.userInfo.token," at pages\\member\\fav_store.vue:71"),this.hasLogin){t.next=7;break}e.navigateTo({url:"login"}),t.next=11;break;case 7:if(this.hasmore){t.next=10;break}return this.loadingText="到底了",t.abrupt("return",!1);case 10:this.$Request.post("member_favorites_store/favlist",{curpage:this.curpage}).then(function(t){if(200==t.code){console.log(t," at pages\\member\\fav_store.vue:83"),o.hasmore=t.hasmore,console.log(o.hasmore," at pages\\member\\fav_store.vue:85");for(var n=t.datas.list,a=0;a<n.length;a++)o.list.push(n[a]);o.hasmore||(o.loadingText="到底了")}else e.showToast({icon:"none",title:t.datas.error,duration:2e3}),e.navigateTo({url:"login"})});case 11:case"end":return t.stop()}},t,this)}));function o(){return t.apply(this,arguments)}return o}(),toPage:function(t){e.navigateTo({url:t})},touchStart:function(e,t){console.log("====touchStart===="," at pages\\member\\fav_store.vue:114"),t.touches.length>1?this.isStop=!0:(this.oldIndex=this.theIndex,this.theIndex=null,this.initXY=[t.touches[0].pageX,t.touches[0].pageY])},touchMove:function(e,t){var o=this;if(console.log("====touchMove===="," at pages\\member\\fav_store.vue:126"),t.touches.length>1)this.isStop=!0;else{var n=t.touches[0].pageX-this.initXY[0],a=t.touches[0].pageY-this.initXY[1];this.isStop||Math.abs(n)<5||(Math.abs(a)>Math.abs(n)?this.isStop=!0:n<0?(this.theIndex=e,this.isStop=!0):n>0&&null!=this.theIndex&&this.oldIndex==this.theIndex&&(this.oldIndex=e,this.theIndex=null,this.isStop=!0,setTimeout(function(){o.oldIndex=null},150)))}},touchEnd:function(e,t){console.log("====touchEnd===="," at pages\\member\\fav_store.vue:159"),this.isStop=!1},deleteOrder:function(t){var o=this;console.log("====deleteOrder===="," at pages\\member\\fav_store.vue:165"),this.$Request.post("member_favorites_store/favdel",{store_id:t}).then(function(n){if(200==n.code){console.log(n," at pages\\member\\fav_store.vue:168");for(var a=o.list.length,s=0;s<a;s++)if(t==o.list[s].id){o.list.splice(s,1);break}o.oldIndex=null,o.theIndex=null}else e.showToast({icon:"none",title:n.datas.error,duration:2e3})})}}};t.default=l}).call(this,o("6e42")["default"])},eaaf:function(e,t,o){"use strict";var n=function(){var e=this,t=e.$createElement;e._self._c},a=[];o.d(t,"a",function(){return n}),o.d(t,"b",function(){return a})}},[["28bf","common/runtime","common/vendor"]]]);