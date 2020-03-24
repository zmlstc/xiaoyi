(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/uni-badge/uni-badge"],{"02fa":function(t,e,n){"use strict";n.r(e);var u=n("c983"),a=n("70df");for(var i in a)"default"!==i&&function(t){n.d(e,t,function(){return a[t]})}(i);n("28b6");var r=n("2877"),c=Object(r["a"])(a["default"],u["a"],u["b"],!1,null,null,null);e["default"]=c.exports},"068a":function(t,e,n){},"28b6":function(t,e,n){"use strict";var u=n("068a"),a=n.n(u);a.a},"70df":function(t,e,n){"use strict";n.r(e);var u=n("c59a"),a=n.n(u);for(var i in u)"default"!==i&&function(t){n.d(e,t,function(){return u[t]})}(i);e["default"]=a.a},c59a:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var u={name:"uni-badge",props:{type:{type:String,default:"default"},inverted:{type:Boolean,default:!1},text:{type:String,default:""},size:{type:String,default:"normal"}},computed:{setClass:function(){var t=["uni-badge-"+this.type,"uni-badge--"+this.size];return!0===this.inverted&&t.push("uni-badge-inverted"),t.join(" ")}},methods:{onClick:function(){this.$emit("click")}}};e.default=u},c983:function(t,e,n){"use strict";var u=function(){var t=this,e=t.$createElement;t._self._c},a=[];n.d(e,"a",function(){return u}),n.d(e,"b",function(){return a})}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/uni-badge/uni-badge-create-component',
    {
        'components/uni-badge/uni-badge-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("02fa"))
        })
    },
    [['components/uni-badge/uni-badge-create-component']]
]);                
