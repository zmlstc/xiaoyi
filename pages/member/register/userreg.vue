<template>
	<view>
	<view class="r-content content" >
		<view class="welcome mb40 mt40">
			<view class="title">欢迎您注册小易共享平台</view>
			<view class="text">花一分钟完成注册</view>
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
		<!--view class="nav-reg b-line">
			<view class="item">昵称</view>
			<view class="item2">
				<input class="input-text mt5" @blur="checknickname"  placeholder="不超过6个字符" placeholder-class="pl-class" v-model="nickname" maxlength="12" />
				</view>
		</view-->
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
		<view class="agree mt10 mb20">
			<checkbox-group @change="checkboxChange">
			<checkbox color="#00BAAD" value="1" />我已了解并同意<text>《小易共享平台用户协议》</text></checkbox-group>
		</view>
		<view class="btn" @click="nextReg">确认注册</view>
	</view>
	<!--view class="content" v-if="showNext">
		<view class="welcome mb40 mt40">
			<view class="title">欢迎您注册小易共享平台</view>
			<view class="text">花一分钟完成注册</view>
		</view-->
		<!--view class="nav-reg b-line">
			<view class="item">用户名</view>
			<view class="item2">
			<input class="input-text mt5" @blur="checkname"  placeholder="不超过12个字符字母、数字组合" placeholder-class="pl-class" v-model="username" maxlength="12" minlength="4"/>
				</view>
		</view-->
		
		<!--view class="nav-reg b-line">
			<view class="item">电子邮箱</view>
			<view class="item2">
				<input class="input-text mt5" @blur="checkemail"  placeholder="填写电子邮箱地址" placeholder-class="pl-class" v-model="email" maxlength="30" />
				</view>
		</view-->
		<!--view class="btn mt40" @click="userReg">完成注册</view>
	</view-->
	</view>
</template>
<script> 
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
				//showNext:false,
				//username:'',
				//nickname:'',
				pwd:'',
				pwd2:''
				//email:''
			}				
		},
		onLoad(e) {
			 console.log('页面加载');
			 if(e.q){
				let rqurl = decodeURIComponent(e.q);
				this.invitecode = this.$Request.getQueryString(rqurl,'bm');
			 }else{
				this.invitecode = e.bm;
			 }
			//this.loadData();
		},
        methods: {   
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
								password:_this.pwd,password_confirm:_this.pwd2};
						_this.$Request.post('connect/sms_register',postData).then(res => {
							if (res.code == 200) {
								console.log(res);
								//this.setUserInfo(res.datas);							
								//this.memberInfo = res.datas;
								uni.showToast({
									icon: 'none',
									title:'恭喜您，注册成功！',
									duration:3000,
									success: function () {
										 setTimeout(function () {
											uni.navigateTo({
												url:'/pages/member/login',
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
			
/* 			checkname(e){
				let _username= e.detail.value;console.log(_username);
				if(!(/(?=.*\d+)^[a-zA-Z]\w{5,11}$/.test(_username))){ 
					uni.showToast({title: '用户名以字母开头包含数字',icon:"none"});
					return false; 
				}
				
				this.$Request.post('connect/check_member',{username:_username,type:1}).then(res => {
					if (res.code == 200) {
						console.log(res);
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						
					}
				});
			}, */
		/* 	checknickname(e){
				let _nickname= e.detail.value;
				if(!(/^[\u4e00-\u9fa5]{0,6}$/.test(_nickname)) ){ 
					uni.showToast({title: '昵称必须为中文',icon:"none"});
					return false; 
				}
			}, */
			checkpwd1(e){
				///^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/
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
/* 			checkemail(e){
				let _email= e.detail.value;
				if(!(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(_email)) ){ 
					uni.showToast({title: '邮箱格式不正确',icon:"none"});
					return false; 
				}
				this.$Request.post('connect/check_email',{email:_email,type:1}).then(res => {
					if (res.code == 200) {
						console.log(res);
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						
					}
				});
			}, */
			userReg(){
			/* 	if(!(/(?=.*\d+)^[a-zA-Z]\w{5,11}$/.test(this.username))){ 
					uni.showToast({title: '用户名以字母开头包含数字',icon:"none"});
					return false; 
				} */
			/* 	if(!(/^[\u4e00-\u9fa5]{0,6}$/.test(this.nickname)) ){ 
					uni.showToast({title: '昵称必须为中文',icon:"none"});
					return false; 
				} */
				if(!(/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(this.pwd)) ){ 
					uni.showToast({title: '密码必须大于6位包含数字和字母',icon:"none"});
					return false; 
				}
				if(this.pwd!=this.pwd2 ){ 
					uni.showToast({title: '两次输入的密码不一致',icon:"none"});
					return false; 
				}
/* 				if(!(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email)) ){ 
					uni.showToast({title: '邮箱格式不正确',icon:"none"});
					return false; 
				} */
				
				if(this.phoneNumber==''||this.smscode==""||this.invitecode==''){
					uni.showToast({title: '参数错误',icon:"none"});
					uni.switchTab({
						url:'userreg',
					});
				}
				let postData={phone:this.phoneNumber,yzcode:this.smscode,invcode:this.invitecode,type:1,
						password:this.pwd,password_confirm:this.pwd2,email:this.email};
				this.$Request.post('connect/sms_register',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						//this.setUserInfo(res.datas);							
						//this.memberInfo = res.datas;
						uni.showToast({
							icon: 'none',
							title:'注册成功！',
							duration:3000
						});
						uni.switchTab({
							url:'/pages/member/login',
						});
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						
					}
				});
				
				
			}
			 
        }  
    }  
</script> 


<style>
	@import "../../../static/css/register.css";
</style>