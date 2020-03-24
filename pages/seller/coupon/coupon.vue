<template>
	<view>
		<view class="top-nav bf b-line">
			<view class="back"  @tap="toPage('../seller')"></view>
			<view class="title">优惠券管理</view>
		</view>
		<view class="place"></view>
		<view class="btn mt20 mb20" @tap="toPage('add')">添加优惠券</view>
		<view v-for="(item ,index) in datalist":key="index">
			<view class="coupon bf mb10">
				<view class="item">
					<view class="h3">￥<text>{{item.voucher_t_price}}</text></view>
					<view class="tip">满{{item.voucher_t_limit}}使用</view>
					<view class="sur">{{item.voucher_t_giveout}}/{{item.voucher_t_total}}</view>
				</view>
				<view class="circle t"></view>
				<view class="circle b"></view>
				<view class="item2">
					<view class="title">
						<view class="h3 clip">{{item.voucher_t_title}}</view>
						<view class="del" @tap="del(item.voucher_t_id)"></view>
					</view>
					<view class="tip"><text>期限：{{item.voucher_t_end_date_text}}</text></view>
					<view class="tip"><text>规则：每次消费使用一次</text></view>
					<view class="tip"><text>兑换：{{item.voucher_t_eachlimit_text}}</text></view>
				</view>
			</view>
		</view>
	<view class="loading-text">{{ loadingText }}</view>
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
				datalist:[],
				loadingText: '正在加载...',
				hasmore:true,
				curpage:1,
				storeInfo:[]
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
				console.log('===sellerHasLogin==='+this.sellerHasLogin);
				
                if (!this.sellerHasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					if(!this.hasmore){
						this.loadingText = '暂无更多信息';
						return false;
					}
					this.$Request.post('seller_voucher/templatelist',{curpage:this.curpage}).then(res => {
						if (res.code == 200) {
							console.log(res);
							this.hasmore =res.hasmore;
							console.log(this.hasmore);
							if(!this.hasmore){
								this.loadingText = '暂无更多信息';
							}
							let _datalist = res.datas.list;
							for(var i=0;i<_datalist.length;i++){
								this.datalist.push(_datalist[i]);
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
			},
			del(id){
				var _this= this;
				uni.showModal({
					title: '提示',
					content: '确认要删除吗？',
					success: function (re) {
						if (re.confirm) {
							console.log('====deleteOrder====');
							_this.$Request.post('seller_voucher/voucher_del',{id:id}).then(res => {
								if (res.code == 200) {
									console.log(res);
									let len = _this.datalist.length;
									for(let i=0;i<len;i++){
										if(id==_this.datalist[i].voucher_t_id){
											_this.datalist.splice(i, 1);
											break;
										}
									}
								}
								else{
									uni.showToast({
										icon: 'none',
										title:res.datas.error,
										duration:2000
									});
								}
							});
						} else if (re.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
				
			},
			toBack: function() {
				uni.redirectTo({
					url:'/pages/seller/seller',
				})
			}
			 
        }  
    }  
</script>  
<style>
	@import "../../../static/css/store.css";
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