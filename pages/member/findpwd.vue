<template>
	<view>
	<view class="r-content content"  v-if="!isNext">
		<view class="login-image"></view>
		<view class="nav-reg b-line">
			<view class="item"><view class="phone"></view></view>
			<view class="item3 ml10">				
			<input type="number"  v-if="phoneShow==''" placeholder="请输入手机号" placeholder-class="pl-class" v-model="phoneNumber" maxlength="11" />
			<input type="number" v-if="phoneShow!=''" placeholder-class="pl-class" v-model="phoneShow" maxlength="11" disabled />
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
		<view class="btn mt40" @click="nextReg">下一步</view>
	</view>
	<view class="r-content content" v-if="isNext">
		<view class="nav-reg b-line">
			<view class="item"><view class="pass"></view></view>
			<view class="item2">
				<input @blur="checkpwd1"  placeholder="大于6位的字母加数字组合" placeholder-class="pl-class" password data-key="password" v-model="pwd" maxlength="20" />
				</view>
		</view>
		<view class="nav-reg b-line">
			<view class="item"><view class="qr"></view></view>
			<view class="item2">
				<input @blur="checkpwd2"  placeholder="重复输入密码" placeholder-class="pl-class" password data-key="password" v-model="pwd2" maxlength="20" />
				</view>
		</view>
		<view class="btn mt40" @click="nextReg2">确认提交</view>
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
				phoneShow:'',
				smscode:'',
				isNext:false,
				pwd:'',
				pwd2:''
			}				
		},
		onLoad() {
			 console.log('页面加载');
			 
			let _this= this;
			 console.log('页面加载');
			 _this.$Request.post('login/getPhone').then(res => {
				if (res.code == 200) {
					console.log(res);					
					_this.phoneNumber = res.datas.phone;
					_this.phoneShow = res.datas.phone_show;
				}
				
			 });
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
				_this.$Request.post('connect/check_sms_captcha',{phone:_this.phoneNumber,yzcode:_this.smscode,type:3}).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.hideLoading();
						console.log(res);
						_this.isNext=true;
						 uni.setNavigationBarTitle({
							title:'输入新密码'
						}) ;
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
            nextReg2() {  
				var _this =this;
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))){ 
					uni.showToast({title: '请填写正确手机号码',icon:"none"});
					return false; 
				}
				
				if(!(/^[0-9]*$/.test(this.smscode)) ||this.smscode.length!=6){ 
					uni.showToast({title: '请填写正确的验证码',icon:"none"});
					return false; 
				}
				
				if(!(/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(this.pwd)) ){ 
					uni.showToast({title: '密码必须大于6位包含数字和字母',icon:"none"});
					return false; 
				}
				if(this.pwd!=this.pwd2 ){ 
					uni.showToast({title: '两次输入的密码不一致',icon:"none"});
					return false; 
				}
				uni.showLoading({title: '正在处理中...'});
				_this.$Request.post('connect/find_password',{phone:_this.phoneNumber,yzcode:_this.smscode,type:3,password:_this.pwd,password_confirm:_this.pwd2}).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'恭喜您，新密码设置成功！',
							duration:3000,
							success: function () {
								 setTimeout(function () {
									uni.navigateTo({
										url:'/pages/member/login',
									});
								 }, 2000);
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
				
				_this.$Request.post('connect/get_sms_captcha',{phone:_this.phoneNumber,type:3}).then(e => {
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
