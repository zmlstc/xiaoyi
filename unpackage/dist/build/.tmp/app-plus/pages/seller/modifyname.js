(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/seller/modifyname"],{"29c5":function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=i(t("a34a")),o=t("2f62");function i(e){return e&&e.__esModule?e:{default:e}}function s(e,n,t,a,o,i,s){try{var r=e[i](s),l=r.value}catch(u){return void t(u)}r.done?n(l):Promise.resolve(l).then(a,o)}function r(e){return function(){var n=this,t=arguments;return new Promise(function(a,o){var i=e.apply(n,t);function r(e){s(i,a,o,r,l,"next",e)}function l(e){s(i,a,o,r,l,"throw",e)}r(void 0)})}}var l={data:function(){return{storename:"",newstorename:"",newsname:"",allnum:0,allownum:0,state:0,zhizhao_pic:"",zz_url:"",pingzheng_pic:"",pz_url:""}},computed:(0,o.mapState)(["sellerHasLogin"]),onLoad:function(){console.log("页面加载"," at pages\\seller\\modifyname.vue:61"),this.loadData()},methods:{loadData:function(){var n=r(a.default.mark(function n(){var t=this;return a.default.wrap(function(n){while(1)switch(n.prev=n.next){case 0:this.sellerHasLogin?this.$Request.post("seller_index/modname").then(function(n){200==n.code?(console.log(n," at pages\\seller\\modifyname.vue:74"),t.storename=n.datas.store_name,t.allownum=n.datas.alownum,t.state=n.datas.state,t.newsname=n.datas.newname):(e.showToast({icon:"none",title:n.datas.error,duration:2e3}),e.navigateTo({url:"login"}))}):e.navigateTo({url:"login"});case 1:case"end":return n.stop()}},n,this)}));function t(){return n.apply(this,arguments)}return t}(),toPost:function(){if(this.newstorename.length<3)return e.showToast({title:"请填写正确店铺名称",icon:"none"}),!1;if(""==this.zhizhao_pic)return e.showToast({title:"请上传营业执照",icon:"none"}),!1;if(""==this.pingzheng_pic)return e.showToast({title:"请上传申请凭证",icon:"none"}),!1;var n={store_name:this.newstorename,zhizhao_pic:this.zhizhao_pic,pingzheng_pic:this.pingzheng_pic};this.$Request.post("seller_index/modname_save",n).then(function(n){200==n.code?(console.log(n," at pages\\seller\\modifyname.vue:114"),e.navigateTo({url:"sellerinfo"})):e.showToast({icon:"none",title:n.datas.error,duration:2e3})})},chooseImage:function(){var n=r(a.default.mark(function n(){var t=this;return a.default.wrap(function(n){while(1)switch(n.prev=n.next){case 0:e.chooseImage({sourceType:["camera","album"],count:1,success:function(n){t.zz_url=n.tempFilePaths[0],console.log(JSON.stringify(n.tempFilePaths)," at pages\\seller\\modifyname.vue:141"),t.$Request.upLoadFile("store_joinin/image_upload",t.zz_url).then(function(n){console.log(n," at pages\\seller\\modifyname.vue:143"),console.log("===upload======"," at pages\\seller\\modifyname.vue:144"),200==n.code?(console.log("===upload=2====="," at pages\\seller\\modifyname.vue:146"),e.hideLoading(),console.log(n," at pages\\seller\\modifyname.vue:148"),t.zhizhao_pic=n.datas.image_name):(e.showToast({icon:"none",title:n.datas.error,duration:2e3}),e.hideLoading())})}});case 1:case"end":return n.stop()}},n,this)}));function t(){return n.apply(this,arguments)}return t}(),choosePzImage:function(){var n=r(a.default.mark(function n(){var t=this;return a.default.wrap(function(n){while(1)switch(n.prev=n.next){case 0:e.chooseImage({sourceType:["camera","album"],count:1,success:function(n){t.pz_url=n.tempFilePaths[0],console.log(JSON.stringify(n.tempFilePaths)," at pages\\seller\\modifyname.vue:174"),t.$Request.upLoadFile("store_joinin/image_upload",t.pz_url).then(function(n){console.log(n," at pages\\seller\\modifyname.vue:176"),console.log("===upload======"," at pages\\seller\\modifyname.vue:177"),200==n.code?(console.log("===upload=2====="," at pages\\seller\\modifyname.vue:179"),e.hideLoading(),console.log(n," at pages\\seller\\modifyname.vue:181"),t.pingzheng_pic=n.datas.image_name):(e.showToast({icon:"none",title:n.datas.error,duration:2e3}),e.hideLoading())})}});case 1:case"end":return n.stop()}},n,this)}));function t(){return n.apply(this,arguments)}return t}()}};n.default=l}).call(this,t("6e42")["default"])},"5d7d":function(e,n,t){},"67a3":function(e,n,t){"use strict";var a=t("5d7d"),o=t.n(a);o.a},d6b3:function(e,n,t){"use strict";t.r(n);var a=t("29c5"),o=t.n(a);for(var i in a)"default"!==i&&function(e){t.d(n,e,function(){return a[e]})}(i);n["default"]=o.a},ea23:function(e,n,t){"use strict";t.r(n);var a=t("eaa7"),o=t("d6b3");for(var i in o)"default"!==i&&function(e){t.d(n,e,function(){return o[e]})}(i);t("67a3");var s=t("2877"),r=Object(s["a"])(o["default"],a["a"],a["b"],!1,null,null,null);n["default"]=r.exports},eaa7:function(e,n,t){"use strict";var a=function(){var e=this,n=e.$createElement;e._self._c},o=[];t.d(n,"a",function(){return a}),t.d(n,"b",function(){return o})}},[["e8f6","common/runtime","common/vendor"]]]);