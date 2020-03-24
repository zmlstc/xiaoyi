<template>
	<view>
		<view class="comment">
			<view class="left-tab" :class="state==20 ? 'act' : ''" @tap="clickBar(20)">未兑换</view>
			<view class="right-tab" :class="state==50 ? 'act' : ''"  @tap="clickBar(50)">已兑换</view>
		</view>		
		<view class="show-box b-line"  v-for="(item ,index) in datalist" :key="index">
			<view class="box-left">
				<view class="image" :style="{'background':'url('+item.point_goodsimage+')','background-size':'100%'}"></view>
				<view class="text-box">
					<view class="h3 clip-2">{{item.point_goodsname}}</view>
					<view class="shop-info">
						<view class="icon"></view>
						<text>{{item.store_name}}</text>
					</view>
					<view class="deal">
						<view class="integral fl"><view class="icon"></view>{{item.point_goodspoints}}</view>
						<view class="money fl ml10"><view class="icon"></view>{{item.price}}</view>
					</view>
				</view>
			</view>
			<view class="box-right">
				<view class="date" v-if="state==20">{{item.point_addtime}}</view>
				<view class="date" v-if="state==50">{{item.point_finnshedtime}}</view>
				<view class="code" v-if="state==20" @click="toggleMask('show',item.p_info)"></view>
				<view class="del" v-if="state==50" @click="toDel(item.point_orderid)"></view>
				
			</view>
		</view>
		<view class="loading-text">{{ loadingText }}</view>
		<!-- 面板 -->
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<view class="container">
					<view class="qrimg">
						<tki-qrcode v-if="ifShow" ref="qrcode" :val="val" :size="size" :unit="unit"  :icon="icon" :iconSize="iconsize" :lv="lv" :onval="onval" :loadMake="loadMake" :usingComponents="true" @result="qrR" />
					</view>
					<view class="tip mt10">
						<text>会员凭二维码至商家店铺领取礼品
						商家通过扫码验证兑换有效性</text>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>  
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
    import {  
        mapState,  
        mapMutations  
    } from 'vuex';  
    export default { 
		data() {
			return {
				datalist:[],
				loadingText: '正在加载...',
				hasmore:true,
				curpage:1,
				maskState: 0, //面板显示状态
				state:20,
				//qrtxt:'123456',
				
				ifShow: true,
				val: 'POINTS:', // 要生成的二维码值
				size: 400, // 二维码大小
				unit: 'upx', // 单位
				//background: '#b4e9e2', // 背景色
				//foreground: '#309286', // 前景色
				//pdground: '#32dbc6', // 角标色
				icon: '', // 二维码图标
				iconsize: 40, // 二维码图标大小
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: true, // val值变化时自动重新生成二维码
				loadMake: false, // 组件加载完成后自动生成二维码
				src: '' // 二维码生成后的图片地址或base64
				
			}				
		},
        computed: mapState(['hasLogin','userInfo']), 
		components: {tkiQrcode}, 
		onLoad() {
			console.log('页面加载');
			this.loadData();
		},
         onReachBottom() {
             console.log('正在加载中...');
			 this.curpage++;
			 this.loadData();
         },
         onPageScroll(){
             console.log('页面滚动...');
         },
         onPullDownRefresh() {
             console.log('上拉刷新...');
             uni.stopPullDownRefresh();
         },
        methods: {   
            async loadData() {  
				let _this= this;
				console.log('===userInfo==='+this.hasLogin);
				console.log(this.userInfo);
				console.log(this.userInfo.token);
              
				if(!this.hasmore){
					this.loadingText = '暂无更多信息';
					return false;
				}
				if (!this.hasLogin) {
					url="/pages/member/login";
				}else{
					this.$Request.post('member_pointorder/orderlist',{curpage:_this.curpage,state:_this.state}).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.hasmore =res.hasmore;
							if(!_this.hasmore){
								_this.loadingText = '暂无更多信息';
							}
							console.log(_this.hasmore);
							let _datalist = res.datas.list;
							for(var i=0;i<_datalist.length;i++){
								_this.datalist.push(_datalist[i]);
							}
						}
						else{
							uni.showToast({
								icon: 'none',
								title:res.datas.error,
								duration:2000
							});
							uni.navigateTo({
								url:'login',
							});
						}
					});
				}
            },
			toPage: function(url) {
				if (!this.hasLogin) {
					url="/pages/member/login";
				} 
				uni.navigateTo({
					url:url,
				})
				
			},
			clickBar: function(state) {
				if (this.state!=state) {
					this.state=state;
					this.hasmore=true;
					this.curpage=1;
					this.datalist=[];
					this.loadingText='正在加载...';
					this.loadData();
				}
				
			},
			//显示面板
			toggleMask(type,info){
				console.log('---type----'+type);
				//this.$refs.qrcode._clearCode();
				this.val = 'POINTS:'+info;
				this.$refs.qrcode._makeCode();
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(()=>{
					this.maskState = state;
				}, timer)
			},
			stopPrevent(e){
				console.log('======stopPrevent=====');
				console.log(e);
			},
			qrR(res) {
				this.src = res
			},
			toDel(orderid){
				var _this= this;
				
				uni.showModal({
					title: '提示',
					content: '确认要删除吗？',
					success: function (re) {
						if (re.confirm) {
							 uni.showLoading({title: '正在处理中...'});
							_this.$Request.post('member_pointorder/orderdel',{orderid:orderid}).then(res => {
								if (res.code == 200) {
									console.log(res);
									let len = _this.datalist.length;
									for(let i=0;i<len;i++){
										if(orderid==_this.datalist[i].point_orderid){
											_this.datalist.splice(i, 1);
											break;
										}
									}
									uni.hideLoading();
								}
								else{
									uni.hideLoading();
									uni.showToast({
										icon: 'none',
										title:res.datas.error,
										duration:2000
									});
								}
							});
						}
					},
				})
				
			}
			 
        }  
    }  
</script>  
<style lang="scss">
	page {background-color:#f5f5f5;}
/* 面板 */
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 9995;
		transition: .3s;
		
		.mask-content{
			width: 100%;
			height: 60vh;
			max-height: 90vh;
			background: #FFF;
			transform: translateY(100%);
			transition: .3s;
			overflow-y:scroll;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			.mask-content{
				transform: translateY(0);
			}
		}
	}
	
.container {display: flex;flex-direction: column;width:100%;padding-top:30px;}
.qrimg {display:flex;justify-content:center;}
.tip {width: 90%;padding:0 5%;line-height: 42upx;color: #999;text-align: center;}

</style>
