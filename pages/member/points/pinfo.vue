<template>
	<view>
		<view class="gift-pic bf">
			<img :src="goods_content.pgoods_image" />
			<view class="title">{{goods_content.pgoods_name}}</view>
		</view>
		<view class="gift-info bf">
			<view class="title">兑换信息</view>
			<view class="item">
				<view class="sub">积分：</view><view class="value">{{goods_content.pgoods_points}}积分</view>
			</view>
			<view class="item">
				<view class="sub">价格：</view><view class="value">￥<text>{{goods_content.pgoods_price}}</text></view>
			</view>
			<view class="item">
				<view class="sub">开始：</view><view class="value">{{goods_content.pgoods_starttime}}</view>
			</view>
			<view class="item">
				<view class="sub">结束：</view><view class="value">{{goods_content.pgoods_endtime}}</view>
			</view>
			<view class="item">
				<view class="sub">已兑：</view><view class="value"><text>{{goods_content.pgoods_salenum}}</text>/{{goods_content.pgoods_storage}}</view>
			</view>
			<view class="item">
				<view class="sub">店铺：</view><view class="value">{{goods_content.store_name}}</view>
			</view>
		</view>
		<view class="gift-info bf" v-if="warning">
			<view class="title">注意事项</view>
			<view class="warn">
				<rich-text :nodes="goods_content.pgoods_body">{{warning}}</rich-text>
			</view>
		</view>
		<view class="btn mt20 mb20" @tap="confirm">立即兑换</view>
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
				goods_content:[],
				pg_id:0,
				warning:''
			};
		},
        computed: mapState(['hasLogin','userInfo']),
		onLoad(e) {
			this.pg_id=e.id;
			this.loadData();
		},

		methods: {   
            async loadData() {  
				let _this = this;
				_this.$Request.post('pointprod/pinfo',{id:_this.pg_id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.goods_content=res.datas.goods_content;
						_this.pg_id=res.datas.goods_content.pgoods_id;
						_this.warning = res.datas.goods_content.warning;
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						
					}
				});
				
				console.log('===userInfo==='+_this.hasLogin);
				console.log(_this.userInfo);
				console.log(_this.userInfo.token);
               
            },
			
			//确认支付
			confirm: async function() {
				let _this = this;
				if (!_this.hasLogin) {  
					uni.showToast({
						icon: 'none',
						title:'请先登录',
						duration:2000
					});
				 }else{
								
				
				}
				uni.showModal({
					title: '提示',
					content: '确认要兑换该商品吗？',
					success: function (res) {
						if (res.confirm) {
							 uni.showLoading({title: '正在处理中...'});
							let postData={pgid:_this.pg_id};
							_this.$Request.post('member_pointorder/pointbuy',postData).then(res => {
								if (res.code == 200) {
									console.log(res);
									uni.hideLoading();
									uni.showToast({
										icon: 'none',
										title:'兑换成功',
										duration:2000,
										complete:function(e){
											uni.navigateTo({
												url:"pointorder"
											})
										}
									});
									
								}else{
									uni.hideLoading();
									uni.showToast({
										icon: 'none',
										title:res.datas.error,
										duration:2000
									});
									
								}
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
			
		}
	}
</script>
<style lang="scss">
	page{background: #F5F5F5;}
</style>