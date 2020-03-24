<template>
	<view>
	<view>
		<view class="login-phone"></view>
		<view class="nav-reg b-line">
			<view class="item"><view class="phone"></view></view>
			<view class="item3 ml10">				
			<input type="number" placeholder="请输入手机号" placeholder-class="pl-class" v-model="phoneNumber" maxlength="11" />
			</view>
			<view v-if="countdown==60" class="item4" @click="toSendSms"><text class="title">{{showTxt}}</text></view>
			<view v-if="countdown<60" class="item4"><text class="again">重新获取({{countdown}}s)</text></view>
		</view>
		<view class="nav-reg b-line">
			<view class="item"><view class="yz"></view></view>
			<view class="item2">
				<input type="number" placeholder="填写6位动态码" placeholder-class="pl-class" v-model="smscode" maxlength="6" />
				</view>
		</view>
		<view class="btn mt40" @click="nextReg">确认登陆</view>
	</view>
	</view>
</template>
<script> 
	import {  
        mapMutations  
    } from 'vuex';
    export default {  
		data() {
			return {
				showTxt:'获取动态码',
				countdown: 60,
				cTimer: null,
				phoneNumber:'',
				smscode:''
			}				
		},
		onLoad() {
			 console.log('页面加载');
			//this.loadData();
		},
        methods: {  
			...mapMutations(['setToken','setUserInfo']), 
            nextReg() {  
				var _this =this;
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))){ 
					uni.showToast({title: '请填写正确手机号码',icon:"none"});
					return false; 
				}
				
				if(!(/^[0-9]*$/.test(this.smscode)) ||this.smscode.length!=6){ 
					uni.showToast({title: '请填写正确的验证码',icon:"none"});
					return false; 
				}
				uni.showLoading({title: '正在处理中...'});
				_this.$Request.post('connect/smslogin',{phone:_this.phoneNumber,yzcode:_this.smscode,type:2}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.setToken(res.datas.token);
						_this.setUserInfo(res.datas);
						uni.switchTab({
							url:"/pages/member/home", 
							success (res) { 
									let page = getCurrentPages().pop(); 
									if (page == undefined || page == null) { 
									  return ;
									 } 
									 page.onLoad() ;
							}
						});
						uni.hideLoading();
					}
					else{
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
					}
				});
				
				
            },
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			toSendSms() {
				var _this = this;
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))){ 
					uni.showToast({title: '请填写正确手机号码',icon:"none"});
					return false; 
				}
				
				_this.$Request.post('connect/get_sms_captcha',{phone:_this.phoneNumber,type:2}).then(e => {
					if (e.code == 200) {
						console.log(e);
						_this.startTimer();
						uni.showToast({title: '验证码已发送',icon:"none",duration:2000});
					}
					else{
						uni.showToast({
							icon: 'none',
							title:e.datas.error,
							duration:2000
						});
						
					}
				});
				
			},
			startTimer: function() {
				var _this = this;
				if (_this.cTimer == null) {
					_this.cTimer = setInterval(function() {
						_this.countdown--;
						if (_this.countdown == 0) {
							_this.clearTimer();
						}
					}, 1000)
				}
			},
			clearTimer: function() {
				var _this = this;
				clearInterval(_this.cTimer);
				_this.cTimer = null;
				_this.countdown = 60;
				_this.showTxt='重新发送';
			},

        }  
    }  
</script> 


<style>
	@import "../../static/css/register.css";
</style>
