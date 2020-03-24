<template>
	<view>
	<view class="login-store"></view>
	<view class="login">
		<view class="item">
			<view class="title"><view class="acc"></view></view>
			<input type="text" placeholder="用户名/手机号" placeholder-class="pl-class" maxlength="12" v-model="seller_name"></input>
		</view>
		<view class="item">
			<view class="title"><view class="pass"></view></view>
			<input type="text" placeholder="请输入登录密码" maxlength="20" placeholder-class="pl-class" password v-model="password" @confirm="toLogin"></input>
		</view>
	</view>
	
	<view class="dlbutton mt40 mb10" @click="toLogin" :disabled="logining">立即登录</view>
	<view class="login-tip"><text class="fl"  @tap="toPage('/pages/seller/findpwd')">忘记密码？</text><text class="fr" @tap="toPage('/pages/member/register/shopreg')">立即入驻</text></view>
	
	</view>
</template>

<script>
	import {  
        mapMutations  
    } from 'vuex';
	export default{
		data(){
			return {
				seller_name: '',
				password: '',
				logining: false
			}
		},
		onLoad(){
			//uni.hideTabBar();
		},
		methods: {
			...mapMutations(['setSellerToken']),
			async toLogin(){
				this.logining = true;
				this.$Request.post('seller_login',{seller_name:this.seller_name,password:this.password,client:'wap'}).then(res => {
					if (res.code == 200) {
						console.log(res);
						this.setSellerToken(res.datas.stoken);
						//this.setUserInfo(res.datas);
						
						uni.redirectTo({
							url:"/pages/seller/seller"
						}) 
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						this.logining = false;
					}
				});
			},
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			}
		},

	}
</script>
