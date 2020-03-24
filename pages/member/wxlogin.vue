<template>
    <view>
        <!-- #ifdef MP-WEIXIN -->
        <view v-if="isCanUse">
            <view>
               <view class="login-image"></view>
                <view class='content'>
                    <view>申请获取以下权限</view>
                    <text>获得你的公开信息(昵称，头像、地区等)</text>
                </view>
                <button class='btn' bindtap='sumbit' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
                    授权登录
                </button>
            </view>
        </view>
        <!-- #endif -->
		
		<view  v-if="!isCanUse">
			<view v-if="!isBind" >
				<view class="welcome mb40 mt40">
					<view class="title">欢迎您使用微信登陆小易</view>
					<view class="text">您可以绑定新的或已有小易账号</view>
				</view>
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
				<view class="nav-reg b-line">
					<view class="item"><view class="yq"></view></view>
					<view class="item2">
						<input placeholder="填写邀请码" placeholder-class="pl-class" v-model="invitecode" maxlength="10" />
						</view>
				</view>
				<view class="nav-reg b-line">
					<view class="item"><view class="pass"></view></view>
					<view class="item2">
						<input @blur="checkpwd1"  placeholder="大于6位的字母加数字组合" placeholder-class="pl-class" v-model="pwd" maxlength="20" />
						</view>
				</view>
				<view class="nav-reg b-line">
					<view class="item"><view class="qr"></view></view>
					<view class="item2">
						<input  @blur="checkpwd2"  placeholder="重复输入密码" placeholder-class="pl-class" v-model="pwd2" maxlength="20" />
						</view>
				</view>
				<view class="agree mt10">
					<checkbox-group @change="checkboxChange">
					<checkbox color="#00BAAD" value="1"  />我已了解并同意<text>《小易共享平台用户协议》</text></checkbox-group>
				</view>
				<button class="btn mt40" @click="nextReg">确认注册</button>
				<view class="warn mt20"><text  @tap="toShow('1')">绑定已有账号</text></view>
			</view>
			<view v-if="isBind">
				<view class="welcome mb40 mt40">
					<view class="title">绑定已有小易共享账号</view>
					<view class="text">绑定后可通过微信快捷登陆</view>
				</view>
				<view class="nav-reg b-line">
					<view class="item"><view class="phone"></view></view>
					<view class="item3 ml10">				
					<input type="number" placeholder="请输入手机号" placeholder-class="pl-class" v-model="phoneNumber" maxlength="11" />
					</view>
					<view v-if="countdown==60" class="item4" @click="toSendSms2"><text class="title">{{showTxt}}</text></view>
					<view v-if="countdown<60" class="item4"><text class="again">重新获取({{countdown}}s)</text></view>
				</view>
				<view class="nav-reg b-line">
					<view class="item"><view class="yz"></view></view>
					<view class="item2">
						<input type="number" placeholder="填写6位动态码" placeholder-class="pl-class" v-model="smscode" maxlength="6" />
					</view>
				</view>
				<button class="btn mt40" @click="nextBind">确认绑定</button>
				<view class="warn mt20"><text  @tap="toShow('0')">注册新账号</text></view>
				
			</view>
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
				smscode:'',
				invitecode:'',
				isagree:false,
				pwd:'',
				pwd2:'',
                SessionKey: '',
                unionid: '',
                nickName: null,
                avatarUrl: null,
                isCanUse: uni.getStorageSync('isCanUse')||true,//默认为true
				isBind:false
            };
        },
        methods: {
			...mapMutations(['setToken','setUserInfo']), 
			toShow(t){
				if(t==='1'){
					this.clearTimer();
					this.showTxt ='获取动态码';
					this.smscode='';
					this.isBind=true;
				}else if(t==='0'){
					this.clearTimer();
					this.showTxt ='获取动态码';
					this.smscode='';
					this.isBind=false;
				}
			},
			
　　　　　　//登录
            login() {
                let _this = this;
                uni.showLoading({
                    title: '登录中...'
                });
             
               // 1.wx获取登录用户code
                uni.login({
                    provider: 'weixin',
                    success: function(loginRes) {
                        let code = loginRes.code;
                   
						_this.$Request.post('connect/wxlogin',{code:code}).then(res => {
							if (res.code == 200) {
								if(res.datas.state=='10'){
									_this.isCanUse = false;
									_this.SessionKey = res.datas.SessionKey;
									_this.unionid = res.datas.unionid;
								}else{
									console.log(res);
									_this.setToken(res.datas.token);
									_this.setUserInfo(res.datas);
									uni.switchTab({
										url:"/pages/member/home", 
										success (_res) { 
												let page = getCurrentPages().pop(); 
												if (page == undefined || page == null) { 
												  return ;
												 } 
												 page.onLoad() ;
										}
									});
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

			getPhoneNumber(e) {
				let _this = this;
				console.log(e.detail.errMsg);
				console.log(e.detail.iv);
				console.log(e.detail.encryptedData);
				_this.$Request.post('connect/wxminphone',{iv:e.detail.iv,epdata:e.detail.encryptedData,skey:this.skey}).then(res => {
					if (res.code == 200) {
						if(res.datas.state=='10'){
							_this.isCanUse = false;
						}else{
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
			toSendSms() {
				var _this = this;
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))){ 
					uni.showToast({title: '请填写正确手机号码',icon:"none"});
					return false; 
				}
				
				_this.$Request.post('connect/checkmob',{phone:_this.phoneNumber}).then(res => {
					if (res.code == 200&&res.datas=='1') {
						_this.$Request.post('connect/get_sms_captcha',{phone:_this.phoneNumber,type:1}).then(e => {
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
					}
					else{
						uni.showToast({
							icon: 'none',
							title:'手机号码已存在',
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
			checkboxChange(e){
				console.log('--------------');
				console.log(e.detail.value[0]);
				//let _isg= e.detail.value[0];
				if(e.detail.value.length>0)
				{
					this.isagree = true;
				}
				 console.log(this.isagree);
			},
			
			checkpwd1(e){
				
				let _pwd1= e.detail.value;
				if(!(/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(_pwd1)) ){ 
					uni.showToast({title: '密码必须大于6位包含数字和字母',icon:"none"});
					return false; 
				}
			},
			checkpwd2(e){
				if(this.pwd!=this.pwd2 ){ 
					uni.showToast({title: '两次输入的密码不一致',icon:"none"});
					return false; 
				}
			}, 
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
				
				if(!(/^[A-Za-z0-9]+$/.test(this.invitecode)) ||this.invitecode.length<3){ 
					uni.showToast({title: '请填写正确的邀请码',icon:"none"});
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
				
				if(!this.isagree){uni.showToast({title: '请选择同意注册协议',icon:"none",duration:2000}); return false;}
				
			   uni.showLoading({title: '正在处理中...'});
				_this.$Request.post('connect/check_sms_invite',{phone:_this.phoneNumber,yzcode:_this.smscode,invcode:_this.invitecode,type:1}).then(res => {
					if (res.code == 200) {
						console.log(res);
						//_this.showNext=true;
						let postData={phone:_this.phoneNumber,yzcode:_this.smscode,invcode:_this.invitecode,type:1,
								password:_this.pwd,password_confirm:_this.pwd2,unionid:_this.unionid,nickname:_this.nickName};
						_this.$Request.post('connect/wxmini_register',postData).then(res => {
							if (res.code == 200) {
								console.log(res);
								_this.setToken(res.datas.token);
								_this.setUserInfo(res.datas);
						uni.showToast({
							icon: 'none',
							title:'恭喜您！微信账号绑定成功',
							duration:2000,
							success: function () {
								setTimeout(function () {
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
			nextBind() {  
				var _this =this;
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))){ 
					uni.showToast({title: '请填写正确手机号码',icon:"none"});
					return false; 
				}
				
				if(!(/^[0-9]*$/.test(this.smscode)) ||this.smscode.length!=6){ 
					uni.showToast({title: '请填写正确的验证码',icon:"none"});
					return false; 
				}
				if(_this.unionid==''){ 
					uni.showToast({title: '登陆参数错误！',icon:"none"});
					return false; 
				}
				
				
			   uni.showLoading({title: '正在处理中...'});
				
				let postData={phone:_this.phoneNumber,yzcode:_this.smscode,type:2,unionid:_this.unionid};
				_this.$Request.post('connect/wxbindMember',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.setToken(res.datas.token);
						_this.setUserInfo(res.datas);
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title:'恭喜您！微信账号绑定成功',
							duration:2000,
							success: function () {
								setTimeout(function () {
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
			toSendSms2() {
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
			
        },
        onLoad() {//默认加载
            this.login();
        },
			
    }
</script>
<style>
	@import "../../static/css/register.css";
</style>
<style>
    .header {
        margin: 90rpx 0 90rpx 50rpx;
        border-bottom: 1px solid #ccc;
        text-align: center;
        width: 650rpx;
        height: 300rpx;
        line-height: 450rpx;
    }

    .header image {
        width: 200rpx;
        height: 200rpx;
    }

    .content {
        margin-left: 50rpx;
        margin-bottom: 90rpx;
    }

    .content text {
        display: block;
        color: #9d9d9d;
    }

    .bottom {
        border-radius: 80rpx;
        margin: 70rpx 50rpx;
        font-size: 35rpx;
    }
</style>
