<template>
	<view class="container flex">
		<view style="text-align: center;">
			<image :src="src" class="avatar" @tap="upload"></image>
			
		</view>
		<view class="btn mt40"  @tap="upload">修改头像</view>
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
			src: ''
		}				
	},
	methods:{
		upload() {
			uni.chooseImage({
				count: 1, // 默认9
				sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success(res) {
					const src = res.tempFilePaths[0];
		
					uni.redirectTo({
						url: 'userpicupload?src=' + src
					});
				}
			});
		},
	},
    computed: mapState(['hasLogin','userInfo']), 
	onLoad(option) { 
		let { avatar } = option;
		if (!this.hasLogin) {  
			uni.navigateTo({
				url:'../login',
			})
		}
		if (avatar) {
			this.src=avatar;
		}
	}
};
</script>

<style>
.container{
    width: 100%;
    height: 100%;
}
.avatar-container{
    position: relative;
    text-align: center;
    padding-top: 50%;
}
.avatar{
	margin-top: 50upx;
}
</style>
