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
			<view class="btn mt40" hover-class="btn-hover" @click="nextReg">下一步</view>
		</view>
		
			<view  v-if="!first">
				<view class="pass-tip mt20">请输入支付密码</view>
				<view class="psdnum-box">
					<view v-for="(item , index) in pasList" :key='index' style="flex: 1;">
						<view class="pass">
							<text v-show="pwdnum > index" class="text">●</text>
						</view>
					</view>
				</view>
				<view class="pass-tip">再次输入支付密码</view>
				<view class="psdnum-box">
					<view v-for="(item , index) in pasList2" :key='index' style="flex: 1;">
						<view class="pass">
							<text v-show="pwdnum2 > index" class="text">●</text>
						</view>
					</view>
				</view>
				<button class="btn" @tap="setPPwd" bindtap="sumbit" hover-class="btn-hover" :disabled="logining">确认</button>
				<view class="pass-box">
					<view v-for="(num , indexs) in numbr " :key='indexs' @tap="checkNum(num)" hover-class="hover" :hover-stay-time='20' class="password">
						{{num}}
					</view>
					<view @tap="reset()" class="password" style="background: #00baad;color: #fff;">重置</view>
					<view @tap="checkNum(0)" hover-class="hover" :hover-stay-time='20' class="password">0</view>
					<view @tap="backspace()" class="password" style="background: #00baad;color: #fff;">删除</view>
				</view>
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
				first:true,				
				password: '',				
				password2: '',
				pwdArray: [],
				pwdnum:0,
				pasList: ['', '', '', '', '', ''],
				pwdnum2:0,
				pasList2: ['', '', '', '', '', ''],
				pwdArray2: [],
				numbr: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				logining: false
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
						 uni.setNavigationBarTitle({
							title:'设置支付密码'
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
            setPPwd() {  
				var _this =this;
				
				if(!(/^[0-9]*$/.test(_this.password) ||_this.password.length!=6) ){ 
					uni.showToast({title: '支付密码必须6位数字',icon:"none"});
					return false; 
				}
				if(_this.password!=_this.password2 ){ 
					uni.showToast({title: '两次输入的支付密码不一致',icon:"none"});
					return false; 
				}
                uni.showLoading({title: '正在处理中...'});
				let postData={type:5,phone:this.memberInfo.phone,yzcode:this.smscode,ppwd:_this.password,ppwd2:_this.password2
				};
				
				_this.logining =true;
				_this.$Request.post('member_account/findppwd',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'设置成功！',
							duration:2000,
							success: function () {
								 setTimeout(function () {
									uni.redirectTo({
										url:'set',
									});
								 }, 2000);
							}
						});
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						_this.logining = false;
					}
				}).catch(function (err) {
					console.log(err);
				  });
              
            },
			// 密码框
			checkNum(num) {
				let _this = this;
				if (this.pwdnum < 6) {
					console.log('---'+num);
					this.pwdArray.push(num+'');
					this.pwdnum++;
					//this.passwordArray=[this.passwordArray,num];
					console.log(this.pwdArray);
					
				}else if (this.pwdnum == 6) {
					if (this.pwdnum2 < 6) {
						console.log('---'+num);
						this.pwdArray2.push(num+'');
						this.pwdnum2++;
						//this.pwdArray=[this.pwdArray,num];
						console.log(this.pwdArray2);
						
					}
				}
				if (this.pwdnum == 6&& this.pwdnum2==6) {
					let p1 = '',p2='';
					for (let i = 0; i < this.pwdArray.length; i++) {
						p1 += this.pwdArray[i];
					}
					console.log(p1);
					this.password = p1;
					for (let i = 0; i < this.pwdArray2.length; i++) {
						p2 += this.pwdArray2[i];
					}
					console.log(p1);
					this.password2 = p2;
					if(this.password!=this.password2){
						uni.showToast({title: '两次输入的支付密码不一致！',icon:"none"});
						this.reset();
						return false;
					}
				} 
			},
			reset() {
				this.pwdArray = [];
				this.pwdArray2 = [];
				this.pwdnum=0;
				this.pwdnum2=0;
				this.password ='';
				this.password2 ='';
			},
			backspace() {
				if(this.pwdnum2>0){
					this.pwdArray2.pop();
					this.pwdnum2--;
					this.password2 ='';
				}else{
					this.pwdArray.pop();
					this.pwdnum--;
					this.password ='';
				}
			},
			 
        }  
    }  
</script> 

<style>
	@import "../../../static/css/store.css";
	page{background: #F5F5F5;}
	.masks{bottom:-50%;position: fixed;background: #fff;width: 100%;transition:.5s}
	.bot{bottom: 0;}
</style>


