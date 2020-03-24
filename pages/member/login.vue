<template>
	<view>	
	<view class="top-nav">
			<view class="back"  @tap="toBack"></view>
			<view class="title">会员登陆</view>
		</view>
	<view class="login-image" style="margin-top:240rpx !important;"></view>
	<view class="login">
		<view class="item mb10">
			<view class="title"><view class="acc"></view></view>
			<input class="input-text" type="text" value="" placeholder="用户ID/手机号" placeholder-class="pl-login" maxlength="12" data-key="username" @input="inputChange" />
		</view>
		<view class="item">
			<view class="title"><view class="pass"></view></view>
			<input type="password" placeholder="请输入登录密码" placeholder-class="pl-login" class="input-text" maxlength="20" password data-key="password" @input="inputChange" @confirm="toLogin"/>
		</view>
	</view>
	<view class="dlbutton" hover-class="dlbutton-hover" @click="toLogin" :disabled="logining">立即登录</view>
	<view class="login-tip"><text class="fl"  @tap="toPage('/pages/member/findpwd')">忘记密码？</text><text class="fr"  @tap="toPage('/pages/member/register/userreg')">我要注册</text></view>
	<view class="separator mb40 mt30"><span>其它登陆方式</span></view>
	<view class="other-login">
		<view class="wx" @tap="toPage('wxlogin')">
			<view class="icon mc"></view>
			<view class="text">微信登陆</view>
		</view>
		<view class="phone" @tap="toPage('mlogin')">
			<view class="icon mc"></view>
			<view class="text">手机登陆</view>
		</view>
	</view>
	</view>
</template>

<script>
	import {  
        mapMutations  
    } from 'vuex';
	export default{
		data(){
			return {
				mobile: '',
				password: '',
				logining: false
			}
		},
		onLoad(){
			//uni.hideTabBar();
		},
		methods: {
			...mapMutations(['setToken','setUserInfo']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			}, 
			async toLogin(){
				let _this = this;
				_this.logining = true;
				const {username, password} = this;
				
				const sendData = {
					username,
					password
				};
				_this.$Request.post('login',{username:username,password:password,client:'wap'}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.setToken(res.datas.token);
						_this.setUserInfo(res.datas);
						uni.switchTab({
							url:"/pages/member/home", 
							success (res) {
									const currentPages = getCurrentPages()  
									console.log(currentPages[0]);  
									currentPages[0].onLoad({  
										...currentPages[0].options  
									})
									/* let page = getCurrentPages().pop(); 
									if (page == undefined || page == null) { 
									  return ;
									 } 
									 page.onLoad() ; */
							}
						}) 
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						_this.logining = false;
					}
				});
		
			},
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			toBack: function() {
				uni.switchTab({
					url:'/pages/index/index',
				})
			}
		},

	}
</script>