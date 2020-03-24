<template>
	<view>
		
		<view class="cash-add bf mt10">
			<view class="item f-r">账号类型</view>
			<view class="item2 ml20">
			<radio-group @change="radioChange">
				<label class="radio">
						<radio value="wxpay"  />微信
				</label>
				<label class="radio">
					<radio value="alipay"  />支付宝
				</label>
			</radio-group>	
			</view>
		</view>
		
		<view class="cash-add bf mb2" v-if="current =='wxpay'">
			<view class="item f-r">提现账号</view>
			<view class="item2 ml20">
				<open-data type="userNickName"></open-data>
				</view>
		</view>
		<view class="cash-add bf mt10"  v-if="current =='alipay'">
			<view class="item f-r">提现账号</view>
			<view class="item2 ml20">
				<input placeholder="提现账号的名称" placeholder-class="pl-class" v-model="unumber" maxlength="50" />
				</view>
		</view>
		<view class="cash-add bf mt10">
			<view class="item f-r">用户名</view>
			<view class="item2 ml20">
				<input placeholder="账号所属用户的名称" placeholder-class="pl-class" v-model="uname" maxlength="50" /></view>
		</view>
		<view class="cash-add bf mt10">
			<view class="item f-r">手机验证</view>
			<view class="item3 ml20">{{phonetxt}}</view>
			<view class="item3">
				<view v-if="countdown==60" class="code" @click="toSendSms"><text class="title">{{showTxt}}</text></view>
				<view v-if="countdown<60" class="code"><text class="again">重新获取({{countdown}}s)</text></view>
			</view>
		</view>
		<view class="cash-add bf mt10">
			<view class="item f-r">验证码</view>
			<view class="item2 ml20">
				<input placeholder="输入6位动态验证码" placeholder-class="pl-class" v-model="smscode" maxlength="6" /></view>
		</view>
		<view class="tips">*请绑定使用者本人的账号信息，若非本人账号出现提现错误，平台概不负责</view>
		<button class="btn mt40" @click="formSubmit" :disabled="logining">确认提交</button>
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
				current:'',
				uname:'',
				unumber:'',
				smscode:'',
				showTxt:'获取动态码',
				countdown: 60,
				cTimer: null,
				phonetxt:'',
				phoneNumber:'',
				logining: false,
				openid:''
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
						url:'../login',
					})
                }else{
					_this.$Request.post('seller_fund/phone').then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.phonetxt = res.datas.mobiletxt;
							_this.phoneNumber =res.datas.shop_phone;
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
			formSubmit: function (e) {
				var _this =this;
				_this.logining =true;
				if(this.current!=='wxpay' && this.current!=='alipay'){ 
					uni.showToast({title: '请选择账户类型',icon:"none"});
					_this.logining =false;
					return false; 
				}
				if(this.current =='wxpay'&&this.openid==''){ 
					uni.showToast({title: '获取微信账号信息失败',icon:"none"});
					_this.logining =false;
					return false; 
				}
				if(this.uname ==''){ 
					uni.showToast({title: '请填写账户名称',icon:"none"});
					_this.logining =false;
					return false; 
				}
				if(this.unumber ==''&&this.current!=='wxpay'){ 
					uni.showToast({title: '请填写提现账号',icon:"none"});
					_this.logining =false;
					return false; 
				}
				if(!(/^[0-9]*$/.test(this.smscode)) ||this.smscode.length!=6){ 
					uni.showToast({title: '请填写正确的验证码',icon:"none"});
					_this.logining =false;
					return false; 
				}
				
				if(this.current =='wxpay'){ 
					this.unumber = '微信账户：'+this.uname;
				}
				               
				_this.$Request.post('connect/check_sms',{phone:_this.phoneNumber,yzcode:_this.smscode,type:5}).then(res => {
					if (res.code == 200) {
						console.log(res);
						let postData={phone:_this.phoneNumber,yzcode:_this.smscode,type:1,openid:_this.openid,
								bill_user_name:_this.uname,bill_type_number:_this.unumber,bill_type_code:_this.current};
						_this.$Request.post('seller_fund/txway_add',postData).then(res => {
							if (res.code == 200) {
								console.log(res);
								uni.showToast({
									icon: 'none',
									title:'添加成功！',
									duration:3000,
									success: function () {
										 setTimeout(function () {
											uni.navigateTo({
												url:'txway',
											});
										 }, 2000);
									}
								});
								
							}
							else{
								uni.showToast({
									icon: 'none',
									title:res.datas.error,
									duration:2000,
									success: function () {
										_this.logining =false;
									}
								});
								
							}
						});
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000,
							success: function () {
								 _this.logining =false;
							}
						});
						
					}
				});
				
			},
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			radioChange: function(evt) {
				console.log(evt);
				console.log(evt.target.value);
				console.log(evt.detail.value);
				if(evt.detail.value=='wxpay'){
					this.getWxInfo();
				}else{
					this.openid='';
				}
				this.current=evt.detail.value;
			},
			//
			getWxInfo() {
				let _this = this;
				uni.showLoading({
					title: '正在获取微信账号信息...'
				});
			 
			   // 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						let code = loginRes.code;
				   
						_this.$Request.post('seller_fund/getwxinfo',{code:code}).then(res => {
							if (res.code == 200) {
								if(res.datas.state=='10'){
									console.log(res.datas);
									_this.openid = res.datas.openid;
								}
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
				});
			},
			toSendSms() {
				var _this = this;
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))){ 
					uni.showToast({title: '请填写正确手机号码',icon:"none"});
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
			
			 
        }  
    }  
</script> 
<style>
	page{background: #F5F5F5;}
</style>