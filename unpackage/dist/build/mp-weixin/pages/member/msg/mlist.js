(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/member/msg/mlist"],{"0109":function(t,e,n){},"0a0d":function(t,e,n){"use strict";n.r(e);var o=n("4479"),s=n("e358");for(var i in s)"default"!==i&&function(t){n.d(e,t,function(){return s[t]})}(i);n("d77f");var r=n("2877"),a=Object(r["a"])(s["default"],o["a"],o["b"],!1,null,null,null);e["default"]=a.exports},"11f6":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=i(n("a34a")),s=n("2f62");function i(t){return t&&t.__esModule?t:{default:t}}function r(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},o=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),o.forEach(function(e){a(t,e,n[e])})}return t}function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function u(t,e,n,o,s,i,r){try{var a=t[i](r),u=a.value}catch(l){return void n(l)}a.done?e(u):Promise.resolve(u).then(o,s)}function l(t){return function(){var e=this,n=arguments;return new Promise(function(o,s){var i=t.apply(e,n);function r(t){u(i,o,s,r,a,"next",t)}function a(t){u(i,o,s,r,a,"throw",t)}r(void 0)})}}var c={data:function(){return{list:[],loadingText:"正在加载...",hasmore:!0,curpage:1,theIndex:null,oldIndex:null,isStop:!1}},computed:(0,s.mapState)(["hasLogin","userInfo"]),onLoad:function(){console.log("页面加载"),this.loadData()},onReachBottom:function(){console.log("下拉加载..."),this.curpage++,this.loadData()},onPageScroll:function(){console.log("页面滚动...")},onPullDownRefresh:function(){console.log("上拉刷新..."),t.stopPullDownRefresh()},methods:{loadData:function(){var e=l(o.default.mark(function e(){var n;return o.default.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(n=this,console.log("===userInfo==="+this.hasLogin),console.log(this.userInfo),console.log(this.userInfo.token),this.hasLogin){e.next=8;break}t.navigateTo({url:"../login"}),e.next=12;break;case 8:if(this.hasmore){e.next=11;break}return this.loadingText="到底了",e.abrupt("return",!1);case 11:n.$Request.post("member_message/systemmsg",{curpage:n.curpage}).then(function(e){if(200==e.code){console.log(e),n.hasmore=e.hasmore,console.log(n.hasmore);for(var o=e.datas.list,s=0;s<o.length;s++)n.list.push(o[s]);n.hasmore||(n.loadingText="到底了")}else t.showToast({icon:"none",title:e.datas.error,duration:2e3}),t.navigateTo({url:"../login"})});case 12:case"end":return e.stop()}},e,this)}));function n(){return e.apply(this,arguments)}return n}(),toPage:function(e){t.navigateTo({url:e})},touchStart:function(t,e){console.log("====touchStart===="),e.touches.length>1?this.isStop=!0:(this.oldIndex=this.theIndex,this.theIndex=null,this.initXY=[e.touches[0].pageX,e.touches[0].pageY])},touchMove:function(t,e){var n=this;if(console.log("====touchMove===="),e.touches.length>1)this.isStop=!0;else{var o=e.touches[0].pageX-this.initXY[0],s=e.touches[0].pageY-this.initXY[1];this.isStop||Math.abs(o)<5||(Math.abs(s)>Math.abs(o)?this.isStop=!0:o<0?(this.theIndex=t,this.isStop=!0):o>0&&null!=this.theIndex&&this.oldIndex==this.theIndex&&(this.oldIndex=t,this.theIndex=null,this.isStop=!0,setTimeout(function(){n.oldIndex=null},150)))}},touchEnd:function(t,e){console.log("====touchEnd===="),this.isStop=!1},deleteOrder:function(e){var n=this;n.$Request.post("member_message/sysmsgdel",{msgid:e}).then(function(o){if(console.log(o),200==o.code){console.log(o);for(var s=n.list.length,i=0;i<s;i++)if(e==n.list[i].message_id){n.list.splice(i,1);break}n.oldIndex=null,n.theIndex=null}else t.showToast({icon:"none",title:o.datas.error,duration:2e3})})},toBack:function(){t.redirectTo({url:"list",success:function(t){var e=getCurrentPages();console.log(e[0]),e[0].onLoad(r({},e[0].options))}})}}};e.default=c}).call(this,n("543d")["default"])},4479:function(t,e,n){"use strict";var o=function(){var t=this,e=t.$createElement;t._self._c},s=[];n.d(e,"a",function(){return o}),n.d(e,"b",function(){return s})},d1cb:function(t,e,n){"use strict";(function(t){n("1857"),n("921b");o(n("66fd"));var e=o(n("0a0d"));function o(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},d77f:function(t,e,n){"use strict";var o=n("0109"),s=n.n(o);s.a},e358:function(t,e,n){"use strict";n.r(e);var o=n("11f6"),s=n.n(o);for(var i in o)"default"!==i&&function(t){n.d(e,t,function(){return o[t]})}(i);e["default"]=s.a}},[["d1cb","common/runtime","common/vendor"]]]);