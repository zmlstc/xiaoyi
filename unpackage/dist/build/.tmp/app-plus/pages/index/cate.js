(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/index/cate"],{4858:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=i(n("a34a")),o=i(n("0410"));function i(t){return t&&t.__esModule?t:{default:t}}function s(t,e,n,a,o,i,s){try{var c=t[i](s),u=c.value}catch(r){return void n(r)}c.done?e(u):Promise.resolve(u).then(a,o)}function c(t){return function(){var e=this,n=arguments;return new Promise(function(a,o){var i=t.apply(e,n);function c(t){s(i,a,o,c,u,"next",t)}function u(t){s(i,a,o,c,u,"throw",t)}c(void 0)})}}var u=function(){return n.e("components/uni-rate/uni-rate").then(n.bind(null,"556a"))},r={data:function(){return{city:"广州",bigId:1,bannerImg:[],tabIndex:0,tabClasslist:[{sc_name:"首页",sc_id:"-1"},{sc_name:"全部",sc_id:"0"}],storelist:[],page:1,loadingType:0,contentText:{contentdown:"上拉显示更多",contentrefresh:"正在加载...",contentnomore:"没有更多数据了"},mapinfo:[],cateid:0}},components:{uniRate:u},onLoad:function(){this.locationMap(),this.loadData()},methods:{loadData:function(){var t=c(a.default.mark(function t(){var e=this;return a.default.wrap(function(t){while(1)switch(t.prev=t.next){case 0:this.$Request.post("index").then(function(t){if(200==t.code){if(console.log(t," at pages\\index\\cate.vue:109"),e.pgList=t.datas.pglist,e.bannerImg=t.datas.aplist,t.datas.sc_list)for(var n=0;n<t.datas.sc_list.length;n++)e.tabClasslist.push(t.datas.sc_list[n]);console.log(e.tabClasslist," at pages\\index\\cate.vue:117")}}),this.$Request.post("shop/shop_list",{cateid:this.cateid,page:10,curpage:this.page,lat:this.mapinfo.lat,lng:this.mapinfo.lng,adcode:this.mapinfo.adcode}).then(function(t){200==t.code&&(console.log(t," at pages\\index\\cate.vue:123"),e.storelist=t.datas.store_list,console.log(e.tabClasslist," at pages\\index\\cate.vue:131"))});case 2:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),locationMap:function(){var t=this;this.amapPlugin=new o.default.AMapWX({key:"57796d182a0849a4bff2b46fd6088ed3"}),this.amapPlugin.getRegeo({success:function(e){t.mapinfo={lat:e[0].latitude,lng:e[0].longitude,adcode:e[0].regeocodeData.addressComponent.adcode},console.log("-----amap---------"," at pages\\index\\cate.vue:145"),console.log(e," at pages\\index\\cate.vue:146"),t.city=e[0].regeocodeData.addressComponent.city.replace(/市/g,"")}})},swiperChange:function(t){this.bigId=t.detail.current},toSearch:function(){t.navigateTo({url:"/pages/search/search"})},toCity:function(){t.navigateTo({url:"/pages/index/city"})},toStore:function(e){t.navigateTo({url:"/pages/store/index?store_id="+e})},toCategory:function(e){t.navigateTo({url:e})},toPage:function(e){t.navigateTo({url:"/pages/member/points/pinfo?id="+e})},tapTab:function(e){this.cateid=e,this.tabIndex=e,-1==e?t.switchTab({url:"index"}):this.loadData()}}};e.default=r}).call(this,n("6e42")["default"])},"7a6b":function(t,e,n){"use strict";n.r(e);var a=n("4858"),o=n.n(a);for(var i in a)"default"!==i&&function(t){n.d(e,t,function(){return a[t]})}(i);e["default"]=o.a},"970e":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement;t._self._c},o=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return o})},adbe:function(t,e,n){},bf17:function(t,e,n){"use strict";var a=n("adbe"),o=n.n(a);o.a},ead5:function(t,e,n){"use strict";n.r(e);var a=n("970e"),o=n("7a6b");for(var i in o)"default"!==i&&function(t){n.d(e,t,function(){return o[t]})}(i);n("bf17");var s=n("2877"),c=Object(s["a"])(o["default"],a["a"],a["b"],!1,null,null,null);e["default"]=c.exports}},[["8626","common/runtime","common/vendor"]]]);