<template>
	<view>
		<view v-if="first">
			<view class="column bf mt20">
				<view class="item f-r">手机号</view>
				<view class="item2 ml10">{{memberInfo.phone_show}}</view>
				<view class="item3">
				<view v-if="countdown==60" class="msg fc" @click="toSendSms">{{showTxt}}</view>
				<view v-if="countdown<60" class="again fc">重新获取({{countdown}}s)</view>
				</view>
			</view>
			<view class="column bf mt5">
				<view class="item f-r">验证码</view>
				<view class="item2 ml10">
					<input type="number" placeholder="填写6位动态码" placeholder-class="pl-class" v-model="smscode" maxlength="6" class="mt12" /></view>
			</view>
			<view class="btn mt40" @click="nextReg">下一步</view>
			<view class="warn mt10">手机号停用？</view>
		</view>
		
			<view  v-if="!first">
				<view class="column bf mt20">
					<view class="item f-r">手机号</view>
					<view class="item2 ml10">
						<input type="number" placeholder="请输入手机号" placeholder-class="pl-class" v-model="phoneNumber" maxlength="11" />
					</view>
					<view class="item3">
					<view v-if="countdown==60" class="msg fc" @click="toSendSms2">{{showTxt}}</view>
					<view v-if="countdown<60" class="again fc">重新获取({{countdown}}s)</view>
					</view>
				</view>
				<view class="column bf mt5">
					<view class="item f-r">验证码</view>
					<view class="item2 ml10">
						<input type="number" placeholder="填写6位动态码" placeholder-class="pl-class" v-model="smscode2" maxlength="6" /></view>
				</view>
				<view class="btn mt40" @tap="editPhone">确认修改</view>
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
				memberInfo:[],
				showTxt:'获取动态码',
				countdown: 60,
				cTimer: null,
				smscode:'',
				phoneNumber:'',
				smscode2:'',
				first:true,
			}				
		},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
        methods: {  
            ...mapMutations(['logout','setUserInfo']), 
            async loadData() {  
				let _this = this;
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'../login',
					})
                }else{
 					_this.$Request.post('member_account/getPhone').then(res => {
						if (res.code == 200) {
							console.log(res);
							let _sinfo = res.datas;						
							_this.memberInfo = _sinfo;
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
			toSendSms() {
				var _this = this;
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.memberInfo.phone))){ 
					uni.showToast({title: '手机号码不正确',icon:"none"});
					return false; 
				}
				
				_this.$Request.post('connect/get_sms_captcha',{phone:_this.memberInfo.phone,type:5}).then(e => {
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
			toSendSms2() {
				var _this = this;
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))){ 
					uni.showToast({title: '手机号码不正确',icon:"none"});
					return false; 
				}
				
				_this.$Request.post('connect/get_sms_captcha',{phone:_this.phoneNumber,type:5}).then(e => {
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
            nextReg() {  
				var _this =this;
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.memberInfo.phone))){ 
					uni.showToast({title: '手机号码错误',icon:"none"});
					return false; 
				}
				
				if(!(/^[0-9]*$/.test(this.smscode)) ||this.smscode.length!=6){ 
					uni.showToast({title: '请填写正确的验证码',icon:"none"});
					return false; 
				}
				
               uni.showLoading({title: '正在处理中...'});
				_this.$Request.post('connect/check_sms_captcha',{phone:_this.memberInfo.phone,yzcode:_this.smscode,type:5}).then(res => {
					if (res.code == 200) {
						uni.hideLoading();
						console.log(res);
						_this.first=false;
						_this.clearTimer();
						_this.showTxt='获取动态码';
						 uni.setNavigationBarTitle({
							title:'修改绑定手机号码'
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
            editPhone() {  
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))){ 
					uni.showToast({title: '请填写正确手机号码',icon:"none"});
					return false; 
				}
				
				if(!(/^[0-9]*$/.test(this.smscode2)) ||this.smscode2.length!=6){ 
					uni.showToast({title: '请填写正确的验证码',icon:"none"});
					return false; 
				}
               uni.showLoading({title: '正在处理中...'});
				let postData={phone:this.phoneNumber,yzcode2:this.smscode2,type:5,
					oldphone:this.memberInfo.phone,yzcode:this.smscode
				};
               
				this.$Request.post('member_account/editPhone',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'绑定成功！',
							duration:3000,
							success: function () {
								 setTimeout(function () {
									uni.navigateTo({
										url:'set', 
										success (res) { 
											let page = getCurrentPages().pop(); 
											if (page == undefined || page == null) { 
											  return ;
											 } 
											 page.onLoad() ;
										}
									});
								 }, 2000);
							}
						});
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
			 
        }  
    }  
</script> 

<style>
	@import "../../../static/css/store.css";
	page{background: #F5F5F5;}
</style>


