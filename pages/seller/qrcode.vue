<template>
	<view>
		<view class="collect-qr">
			<view class="intro">
				<image class="avatar" :src="storeinfo.store_avatar" ></image>
				<view class="info-box ml10">
					<view class="name clip">{{storeinfo.store_name}}</view>
					<view class="dizhi clip">{{storeinfo.address}}</view>
				</view>
			</view>
			<view class="qr-code">
				<image  :src="storeinfo.rqcode_src" mode="widthFix"></image>
			</view>
			<view class="tip">扫一扫上面的二维码，可直接付款到商家</view>
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
				storeinfo:[]
			}
		},
        computed: mapState(['sellerHasLogin']),  
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		}, 
		methods: {   
			async loadData() {  
				let _this = this;
				if (!this.sellerHasLogin) {  
					uni.navigateTo({
						url:'login',
					})
				}else{
					_this.$Request.post('seller_index/payrqcode').then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.storeinfo=res.datas.store_info;
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
			 
		}  
		   
	}
</script>

<style>
	@import "../../static/css/store.css";
	page{background: #F5F5F5;}
</style>