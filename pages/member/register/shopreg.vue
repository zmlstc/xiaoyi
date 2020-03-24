<template>
	<view class="mian">
		
		<view class="welcome mb40 mt40">
			<view class="title">欢迎您入驻小易共享平台</view>
			<view class="text">花一分钟完成入驻流程</view>
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
		<view class="agree mt10">
			<checkbox-group @change="checkboxChange">
			<checkbox value="1" />我已了解并同意<text>《平台商家入驻协议》</text>
			</checkbox-group>
		</view>
		<view class="btn mt40" @click="nextReg">下一步</view>
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
				isagree:false
			}				
		},
		onLoad(e) {
			 console.log('页面加载');
			 if(e.q){
				let rqurl = decodeURIComponent(e.q);
				this.invitecode = this.$Request.getQueryString(rqurl,'sbm');
			 }else{
				this.invitecode = e.bm; 
			 }
			 
			//this.loadData();
		},
        methods: {   
            nextReg() {  
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
				
				if(!this.isagree){uni.showToast({title: '请选择同意商家协议',icon:"none",duration:2000}); return false;}
				
               
				this.$Request.post('store_joinin/check_sms_invite',{phone:this.phoneNumber,yzcode:this.smscode,invcode:this.invitecode,type:5}).then(res => {
					if (res.code == 200) {
						console.log(res);
						//this.setUserInfo(res.datas);							
						//this.memberInfo = res.datas;
						//this.showNext=true;
						uni.navigateTo({
							url:'shopreg2?tk='+res.datas.tk,
						})
					}
					else{
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
				let _this = this;
				/* if(this.countdown>0){
					return false ;
				} */
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))){ 
					uni.showToast({title: '请填写正确手机号码',icon:"none"});
					return false; 
				}
				
				_this.$Request.post('store_joinin/checkmob',{phone:_this.phoneNumber}).then(res => {
					if (res.code == 200&&res.datas=='1') {
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
				}else{
					this.isagree = false;
				}
				 console.log(this.isagree);
			}
			 
        }  
    }  
</script> 

<style>
	@import "../../../static/css/register.css";
</style>