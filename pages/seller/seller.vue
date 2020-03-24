<template>
	<view>
		<view class="set-nav bgc3">
			<view class="set" @tap="toPage('set')"></view>
			<view class="title"></view>
			<view class="notice" @tap="toPage('msg/syslist')">
				<view class="msg-tis" v-if="sysnum>0">{{sysnum}}</view>
			</view>
		</view>
	<view class="store-top mt40">
		<view class="content">
			<image class="avatar" :src="storeInfo.store_avatar" @tap="toPage('sellerinfo')"></image>
			<view class="name ml10">{{storeInfo.store_name}}</view>
			<view class="paycode" @tap="toPage('qrcode')"></view>
		</view>
		<view class="info mt20">
			<view class="item">
				<view class="title">累计收入</view>
				<view class="num mt5"><text class="mt5">￥</text>{{storeInfo.sell_amount}}</view>
			</view>
			<view class="item2">
				<view class="title">今日销售</view>
				<view class="num mt5"><text class="mt5">￥</text>{{storeInfo.sell_today_amount}}</view>
			</view>
			<view class="item3">
				<view class="title"  @tap="toPage('zzlist')"><view class="icon"></view>到账记录</view>
			</view>
		</view>
	</view>
	<view class="store-manage mb20">
		<!--view class="notice b-line">
			<view class="icon"></view>
			<swiper class="title" style="height: 20px;"  vertical="true" autoplay="true" circular="true" interval="3000">
				<swiper-item style="width: 80%;"  v-for="(item, index) in artlist" :key="index"  @tap="toPage('/pages/index/newsdetail?aid='+item.article_id)">
					{{item.article_title}}<text class="ml10">{{item.article_time_txt}}</text>
				</swiper-item>
			</swiper>
		</view-->
		<view class="control">
		<view class="item" @tap="toPage('salelist')">
			<view class="jilu mc"></view>
			<view class="title">销售记录</view>
		</view>
		<view class="item"  @tap="toPage('coupon/coupon')">
			<view class="youhui mc"></view>
			<view class="title">优惠券</view>
		</view>
		<view class="item"  @tap="toPage('reply')">
			<view class="pingjia mc"></view>
			<view class="title">评价回复</view>
		</view>
		<view class="item"  @tap="toPage('pointorder')">
			<view class="duihuan mc"></view>
			<view class="title">礼品兑换</view>
		</view>
		<!--view class="item"  @tap="toPage('p-day')">
			<view class="duihuan mc"></view>
			<view class="title">积分日</view>
		</view-->
	</view>
	</view>
	</view>
</template>
<script>  
    import {  
        mapState,  
        mapMutations  
    } from 'vuex';  
    export default {  
		data() {
			return {
				storeInfo:[],
				sysnum:0,
				artlist:[]
			}				
		},
        computed: mapState(['sellerHasLogin']),  
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
		onShow() {
             console.log('页面显示..');
         },
         onReady(){
             console.log('页面初次显示');
         },
         onHide() {
             console.log('页面隐藏');
         },
         onUnload() {
             console.log('页面卸载');
         },
         onBackPress(){
             console.log('页面返回...');
         },
         onShareAppMessage() {
             console.log('分享!');
         },
         onReachBottom() {
             console.log('下拉加载...');
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
				var _this=this;
				console.log('===sellerHasLogin==='+this.sellerHasLogin);
				
                if (!this.sellerHasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					_this.$Request.post('seller_index').then(res => {
						if (res.code == 200) {
							console.log(res);
							//this.login(res.datas);
							_this.storeInfo = res.datas.store_info;
							_this.artlist = res.datas.artlist;
							_this.sysnum =res.datas.sysnum;
							if(res.datas.setbill.alipay==0){
								uni.showToast({
									icon: 'none',
									title:'请设置您的支付宝提现方式',
									duration:2000,
									complete:function(e){
										setTimeout(function () {
											uni.navigateTo({
												url:"tx/txway"
											})
										 }, 2000);
									}
								});
								return false;
							}else if(res.datas.setbill.wxpay==0){
								uni.showToast({
									icon: 'none',
									title:'请设置您的微信提现方式',
									duration:2000,
									complete:function(e){
										setTimeout(function () {
											uni.navigateTo({
												url:"tx/txway"
											})
										 }, 2000);
									}
								});
								return false;
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
				uni.navigateTo({
					url:url,
				})
			}
			 
        }  
    }  
</script>  


<style>
	@import "../../static/css/store.css";
	uni-swiper .uni-swiper-wrapper{
		width: 88%;
	}
</style>

