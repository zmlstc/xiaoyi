<template>
	<view class="mian">
		
		<view class="welcome mb40 mt40">
			<view class="title">欢迎您代理小易共享平台</view>
			<view class="text">花五分钟完成申请</view>
		</view>
		<view class="nav-reg b-line">
			<view class="item">申请方</view>
			<view class="item2"><input  placeholder="申请代理权公司名称" placeholder-class="pl-class" v-model="company_name" maxlength="30" /></view>
		</view>
		<view class="nav-reg b-line">
			<view class="item">联系人</view>
			<view class="item2"><input  placeholder="输入公司代表姓名" placeholder-class="pl-class" v-model="contacts_name" maxlength="10" /></view>
		</view>
		<view class="nav-reg b-line">
			<view class="item">手机号</view>
			<view class="item3 ml10">				
			<input type="number" placeholder="请输入手机号" placeholder-class="pl-class" v-model="phoneNumber" maxlength="11" />
			</view>
			<view v-if="countdown==60" class="item4" @click="toSendSms"><text class="title">{{showTxt}}</text></view>
			<view v-if="countdown<60" class="item4"><text class="again">重新获取({{countdown}}s)</text></view>
		</view>
		<view class="nav-reg b-line">
			<view class="item">验证码</view>
			<view class="item2">
				<input type="number" placeholder="填写6位动态码" placeholder-class="pl-class" v-model="smscode" maxlength="6" />
				</view>
		</view>
				<view class="nav-reg b-line">
			<view class="item">电子邮箱</view>
			<view class="item2"><input  placeholder="输入公司电子邮箱" placeholder-class="pl-class" v-model="contacts_email" maxlength="50" /></view>
		</view>
		<view class="nav-reg b-line" @click="showMulLinkageThreePicker">
			<view class="item f-r">代理区域</view>
			<view class="area">{{selectAreaTxt}}</view>
		</view>
		<view class="agree mt10">
			<checkbox-group @change="checkboxChange">
			<checkbox color="#00BAAD" value="1" />我已了解并同意<text>《小易共享平台代理协议》</text>
			</checkbox-group>
		</view>
		<view class="btn mt40" @click="nextReg">下一步</view>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>
<script> 
	import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'
    export default { 
		components: {mpvueCityPicker
		}, 
		data() {
			return {
				showTxt:'获取动态码',
				countdown: 60,
				cTimer: null,
				phoneNumber:'',
				smscode:'',
				isagree:false,
				company_name:'',
				contacts_name:'',
				contacts_email:'',
				cityPickerValueDefault: [0, 0, 1],
				selectAreaTxt:"选择代理的区域",
				provId:0,
				cityId:0,
				areaId:0,
				themeColor: '#007AFF'
			}				
		},
		onLoad() {
			 console.log('页面加载');
			//this.loadData();
		},
        methods: {   
            nextReg() {  
				if(!(/^[\u4e00-\u9fa5\(.*\)]{6,20}$/.test(this.company_name))){ 
					uni.showToast({title: '请填写正确公司名称',icon:"none"});
					return false; 
				}
				if(!(/^[\u4e00-\u9fa5()]{2,10}$/.test(this.contacts_name))){ 
					uni.showToast({title: '请填写正确的联系人姓名',icon:"none"});
					return false; 
				}
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))){ 
					uni.showToast({title: '请填写正确手机号码',icon:"none"});
					return false; 
				}
				
				if(!(/^[0-9]*$/.test(this.smscode)) ||this.smscode.length!=6){ 
					uni.showToast({title: '请填写正确的验证码',icon:"none"});
					return false; 
				}
				if(!(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.contacts_email)) ){ 
					uni.showToast({title: '邮箱格式不正确',icon:"none"});
					return false; 
				}
				
				if(this.provId==0||this.cityId==0||this.areaId==0){
					uni.showToast({title: '请选择代理地区',icon:"none"});
					return false; 
				}
				console.log(this.isagree);
				if(!this.isagree){uni.showToast({title: '请选择同意商家协议',icon:"none",duration:2000}); return false;}
				
				let postData={phone:this.phoneNumber,yzcode:this.smscode,company_name:this.company_name,type:5,
					contacts_name:this.contacts_name,contacts_email:this.contacts_email,provId:this.provId,
					cityId:this.cityId,areaId:this.areaId,areainfo:this.selectAreaTxt
				};
               
				this.$Request.post('agent_joinin/check_sms_add',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						//this.setUserInfo(res.datas);							
						//this.memberInfo = res.datas;
						//this.showNext=true;
						uni.navigateTo({
							url:'reg2?tk='+res.datas.tk,
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
			// 三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				console.log(e);
				this.selectAreaTxt = e.name;//JSON.stringify(e).name;
				console.log(e.name);
				this.provId=e.provinceCode;
				this.cityId=e.provinceCode;
				this.areaId=e.areaCode;
			},
			toSendSms() {
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))){ 
					uni.showToast({title: '请填写正确手机号码',icon:"none"});
					return false; 
				}
				
				this.$Request.post('agent_joinin/checkmob',{phone:this.phoneNumber}).then(res => {
					if (res.code == 200&&res.datas=='1') {
						this.$Request.post('connect/get_sms_captcha',{phone:this.phoneNumber,type:5}).then(e => {
							if (e.code == 200) {
								console.log(e);
								this.startTimer();
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
			},
    onBackPress() {
      if (this.$refs.mpvueCityPicker.showPicker) {
      	this.$refs.mpvueCityPicker.pickerCancel();
        return true;
      }
    },
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		}
			 
        }  
    }  
</script> 

<style>
	@import "../../static/css/register.css";
</style>