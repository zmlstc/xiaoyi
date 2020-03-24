<template>
	<view>
		<view class="pic-column mb2 mt10" @tap="upload">
			<view class="item">头像</view>
			<view class="itme2"><view class="icon"></view>
			<image class="avatar" :src="memberInfo.avatar"></image>
			</view>
		</view>
		<view class="set-column mb2" @tap="toPage('editnick')">
			<view class="item">昵称</view>
			<view class="itme2">{{memberInfo.nickname}}<view class="icon"></view></view>
		</view>
		<view class="set-column mb2"  @tap="toPage('realverify')">
			<view class="item">实名认证</view>
			<view class="itme2"><view class="icon"></view>
			<view class="finish" v-if="is_realverify==='1'">已认证</view>
			<view class="no-finish" v-if="is_realverify==='0'">未认证</view>
			<view class="no-finish" v-if="is_realverify==='2'">认证中</view>
			</view>
		</view>
		<!--view class="set-column mb2">
			<view class="item">信息完善</view>
			<view class="itme2"><view class="icon"></view></view>
		</view-->
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
				memberInfo:[],
				is_realverify:"-1"
			}				
		},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
		onShow(){
			this.memberInfo = this.userInfo;
		},
        methods: { 
			...mapMutations(['setUserInfo']),
            async loadData() {  
				let _this = this;
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'../login',
					})
                }else{
					_this.$Request.post('member_index').then(res => {
						if (res.code == 200) {
							console.log(res);
							let _userinfo = _this.userInfo
							_userinfo.is_realverify = res.datas.member_info.is_realverify;
							_this.is_realverify=res.datas.member_info.is_realverify;
							_this.setUserInfo(_userinfo);
							_this.memberInfo = _userinfo;
						}
						else{
							uni.showToast({
								icon: 'none',
								title:res.datas.error,
								duration:2000
							});
							uni.navigateTo({
								url:'../login',
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
							url: 'userpicupload?src=' + src
						});
					}
				});
			},
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			toBack(url){
				uni.redirectTo({
					url:url,
				})
			}
			 
        }  
    }  
</script>
<style lang="scss">
	page{background: #F5F5F5}
	.no-finish{width:30%;line-height:68upx;color: #999;float: right;}
	.finish{width:30%;line-height:68upx;color: #00BAAD;float: right;}
</style>
