<template>
	<view>
		<view class="set-column mt10 mb5"  @tap="upload">
			<view class="item">店铺头像</view>
			<view class="item2">
				<image class="avatar" :src="sellerInfo.store_avatar"></image>
			</view>
		</view>
		<view class="column bf"  @tap="toPage('modifyname')">
			<view class="item f-r">店铺名称</view>
			<view class="item4 f-r">
				<text></text>
				<view class="moer ml10"></view>
			</view>
		</view>
		<view class="column bf" @tap="toPage('storeintro')">
			<view class="item f-r">店铺介绍</view>
			<view class="item4 f-r">
				<text></text>
				<view class="moer ml10"></view>
			</view>
		</view>
		<view class="column bf" @tap="toPage('qrcode')">
			<view class="item f-r">收  款  码</view>
			<view class="item4 f-r">
				<text></text>
				<view class="moer ml10"></view>
			</view>
		</view>
		<view class="column bf" @tap="toPage('set-addr')">
			<view class="item f-r">地理位置</view>
			<view class="item4 f-r">
				<!-- <text>请在PC端进行设置</text> -->
				<view class="moer ml10"></view>
			</view>
		</view>
		<view class="column bf" @tap="toPage('set-photo')">
			<view class="item f-r">图片管理</view>
			<view class="item4 f-r">
				<!-- <text>请在PC端进行设置</text> -->
				<view class="moer ml10"></view>
			</view>
		</view>
		<!-- <view class="column bf" >
			<view class="item f-r">地理位置</view>
			<view class="item4 f-r" @tap="chooseLocation">
				<text>修改</text>
				<view class="moer ml10"></view>
			</view>
		</view> -->
		<view class="column bf" >
			<view class="item f-r">店铺分类</view>
			<view class="item4 f-r">
				<text>{{sellerInfo.store_scinfo}}</text>
			</view>
		</view>
		
		<view class="btn mt40" @tap="toOnline" v-if="sellerInfo.isshow==0">店铺上线</view>
		<!-- <view class="btn mt40" @tap="toOffline"  v-if="sellerInfo.isshow==1">店铺暂停营业</view> -->
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
				sellerInfo:[]
			}				
		},
        computed: mapState(['sellerHasLogin']),  
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
        methods: {  
            //...mapMutations(['logout','setUserInfo']),  
            async loadData() {  
				let _this = this;
                if (!this.sellerHasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
 					this.$Request.post('seller_index/sellerinfo').then(res => {
						if (res.code == 200) {
							console.log(res);						
							_this.sellerInfo = res.datas.store_info;
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
			upload() {
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success(res) {
						
						const src = res.tempFilePaths[0];
			
						uni.redirectTo({
							url: 'sellerpicupload?src=' + src
						});
					}
				});
			},
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			toOnline(){
				this.updateStore(1);
			},
			toOffline(){
				this.updateStore(0);
			},
			updateStore(isshow){
				let _this = this;
				this.$Request.post('seller_index/editshow',{isshow:isshow}).then(res => {
					if (res.code == 200) {
						console.log(res);						
						uni.showToast({
							icon: 'none',
							title:'操作成功',
							duration:2000
						});
						_this.sellerInfo.isshow=isshow;
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
					}
				});
			},
			chooseLocation: function () {
				uni.chooseLocation({
					success: (res) => {
						console.log(res);
						this.$Request.post('seller_index/updatemap',{lng:res.longitude,lat:res.latitude,address:res.address}).then(res => {
							if (res.code == 200) {
								console.log(res);
							}
						}); 
						/* this.hasLocation = true,
							this.location = formatLocation(res.longitude, res.latitude),
							this.locationAddress = res.address */
					}
				})
			}
			 
        }  
    }  
</script> 

<style>
	@import "../../static/css/store.css";
	page{background: #F5F5F5;}
</style>
