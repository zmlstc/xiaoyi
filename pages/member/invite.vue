<template>
	<view>
		<view class="comment">
			<view :class="['left-tab',isShop ? 'act' : '']" @tap="showShop">商家</view>
			<view :class="['right-tab',!isShop ? 'act' : '']" @tap="showUser">会员</view>
		</view>
		<view class="qrcode mt20">
			<view class="qr-info">
				<image class="avatar" :src="memberInfo.avator" ></image>
				<view class="name ml10">{{memberInfo.nickname}}</view>
			</view>
			<view class="image">
			<!--image :src="memberInfo.myurl_src"></image-->
			<tki-qrcode v-if="!isShop" ref="qrcode" :val="memberInfo.user_url" size="450" unit="upx"  iconSize="40" lv="3" onval="3" :loadMake="true" :showLoading="false" :usingComponents="true" @result="qrR" />
			<tki-qrcode v-if="isShop" ref="qrcode" :val="memberInfo.store_url" size="450" unit="upx"  iconSize="40" lv="3" onval="3" :loadMake="true" :showLoading="false" :usingComponents="true" @result="qrR" />
			</view>
			<view class="title">邀请码：<text>{{memberInfo.invite_bm}}</text></view>
		</view>
		<!--view class="share-mode mt20">
			<button class="wx fl" open-type="share"></button>
			<button class="pyq fl ml10" open-type="share"></button>
			<button class="qq fl ml10" open-type="share"></button>
			<button class="kj fl ml10" open-type="share"></button>
			<button class="wb fl ml10" open-type="share"></button>
		</view-->
		<view class="btn mt40 mb10" v-if="isShop" @tap="toPage('invitestore')">查看已邀请商家</view>
		<view class="btn mt40 mb10" v-if="!isShop" @tap="toPage('invitemember')">查看已邀请会员</view>
	</view>
</template>
<script>  
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
    import {  
        mapState
    } from 'vuex';  
    export default {  
		data() {
			return {
				memberInfo:[],
				isShop:false
			}				
		},
        computed: mapState(['hasLogin','userInfo']),  
		components: {tkiQrcode}, 
		onLoad(e) {
			 console.log('页面加载');
			 console.log(e);
			 if(e.t=='shop'){
				this.isShop=true;
			 }
			this.loadData();
		},
		 methods: {   
			async loadData() {  
				console.log('===userInfo==='+this.hasLogin);
				console.log(this.userInfo);
				console.log(this.userInfo.token);
				if (!this.hasLogin) {  
					uni.navigateTo({
						url:'login',
					})
				}else{
					this.$Request.post('member_invite').then(res => {
						if (res.code == 200) {
							console.log(res);
							if(res.datas.is_realverify!=1){
								console.log('请先实名验证！');
								uni.showToast({
									icon: 'none',
									title:'请先实名验证！',
									duration:5000,
									success: function () {
										uni.redirectTo({
											url:'set/realverify',
										});
									}
								});
							}else{
								this.memberInfo = res.datas.member_info;
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
			showShop:function(){
				this.isShop=true;
			},
			showUser:function(){
				this.isShop=false;
			},
			qrR(res) {
				//this.src = res
			},
			/* ,
			share(type) {
				
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 0,
					href: "http://uniapp.dcloud.io/",
					title: "uni-app分享",
					summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
					imageUrl: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png",
					success: function (res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function (err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
					
			} */
			 
		}  
	}  
</script>  
<style>
	page{background: #f5f5f5;}
</style>