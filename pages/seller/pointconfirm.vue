<template>
	<view>
		<view>
			<view class="column mt5">
				<view class="item3 f-r">礼品名称</view>
				<view class="item8 f-l">{{pinfo.point_goodsname}}</view>
			</view>
			<view class="column">
				<view class="item3 f-r">店铺名称</view>
				<view class="item8 f-l">{{pinfo.store_name}}</view>
			</view>
			<view class="column">
				<view class="item3 f-r">会员昵称</view>
				<view class="item8 f-l">{{pinfo.nickname}}</view>
			</view>
			<view class="column">
				<view class="item3 f-r">领取时间</view>
				<view class="item8 f-l">{{pinfo.point_addtime}}</view>
			</view>
			<view class="column">
				<view class="item3 f-r">兑换积分</view>
				<view class="item8 f-l">{{pinfo.point_goodspoints}}</view>
			</view>
			<view class="column">
				<view class="item3 f-r">截止日期</view>
				<view class="item8 f-l">{{pinfo.endtime}}</view>
			</view>
			<view class="btn-nav">
				<view class="cbtn no fl" @tap="toPage('pointorder')">取消</view>
				<view class="cbtn yes fr" @tap="toScan()">确认</view>
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
				pinfo:[],
				urldata:''
			}				
		},
        computed: mapState(['sellerHasLogin']),  
		onLoad(e) {
			this.urldata = e.udata;
			 console.log('页面加载');
			this.loadData();
		},
		onShow() {
             console.log('页面显示..');
         },
        methods: {   
            async loadData() { 
				let _this = this;
				console.log('===sellerHasLogin==='+this.sellerHasLogin);
				
                if (!this.sellerHasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					this.$Request.post('seller_pointorder/order_info',{str:this.urldata}).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.pinfo = res.datas.prod_info;
							
						}
						else{
							uni.showToast({
								icon: 'none',
								title:res.datas.error,
								duration:2000,
								success: function () {
									 setTimeout(function () {
										uni.redirectTo({
											url:'pointorder'
										});
									 }, 1500);
								}
							});
							
						}
					});
				}
            },
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			toScan(){
				let _this = this;
				 uni.showLoading({title: '正在处理中...'});
				 let info = _this.urldata;
				 //let info = info.replace('POINTS:','');
				_this.$Request.post('seller_pointorder/point_scan',{str:info}).then(rest => {
					if (rest.code == 200) {
						uni.hideLoading();
						console.log(rest);
						uni.showToast({
							icon: 'none',
							title:'兑换成功！',
							duration:2000,
							success: function () {
								 setTimeout(function () {
									uni.redirectTo({
										url:'pointorder', 
										success (res) { 
											let page = getCurrentPages().pop(); 
											if (page == undefined || page == null) { 
											  return ;
											 } 
											 page.onLoad() ;
										}
									});
								 }, 1500);
							}
						});
						
					}
					else{
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title:rest.datas.error,
							duration:2000
						});
					}
				});
			
			}
			 
        }  
    }  
</script> 


<style>
	@import "../../static/css/store.css";
</style>

<style lang="scss">
page{background: #F5F5F5}
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
</style>