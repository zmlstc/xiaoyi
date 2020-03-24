<template>
	<view>
		<view v-if="memberInfo.is_realverify==='1'">
				<view class="state-pic">
					<view class="state1 mc"></view>
					<view class="text mt10">状态：认证成功</view>
				</view>
				<view class="c-title">个人实名认证信息</view>
				<view class="certify bf mb2">
					<view class="item">
						<text>姓名</text>
					</view>
					<view class="item2">
					{{realverify.truename}}
					</view>
				</view>
			<view class="certify bf mb2">
				<view class="item">
					<text>身份证号码</text>
				</view>
				<view class="item2">
					{{realverify.cardid}}
				</view>
			</view>
			<view class="certify bf mb2">
				<view class="item">
					<text>籍贯</text>
				</view>
				<view class="item2">
					{{realverify.area}}
				</view>
			</view>
			<view class="certify bf mb2">
				<view class="item">
					<text>性别</text>
				</view>
				<view class="item2">
					{{realverify.sex}}
				</view>
			</view>
			<!--view class="certify bf mb2">
				<view class="item">
					<text>生日</text>
				</view>
				<view class="item2">
					{{realverify.birthday}}
				</view>
			</view-->
			
		</view>
		<view v-if="memberInfo.is_realverify==='2'">
				<view class="state-pic bf">
					<view class="state2 mc"></view>
					<view class="text2 mt10">状态：认证中</view>
				</view>
			<view class="c-title">个人待实名认证信息</view>
			<view class="certify bf mb2">
					<view class="item">
						<text>姓名</text>
					</view>
					<view class="item2">
					{{realverify.truename}}
					</view>
				</view>
			<view class="certify bf mb2">
				<view class="item">
					<text>身份证号码</text>
				</view>
				<view class="item2">
					{{realverify.cardid}}
				</view>
			</view>
			<view class="certify bf mb2">
				<view class="item">
					<text>籍贯</text>
				</view>
				<view class="item2">
					{{realverify.area}}
				</view>
			</view>
			<view class="certify bf mb2">
				<view class="item">
					<text>性别</text>
				</view>
				<view class="item2">
					{{realverify.sex}}
				</view>
			</view>
			<!--view class="certify bf mb2">
				<view class="item">
					<text>生日</text>
				</view>
				<view class="item2">
					{{realverify.birthday}}
				</view>
			</view-->
		</view>
		<view  v-if="memberInfo.is_realverify==='0'">
		<view v-if="first">
			<view class="column bf mt20">
				<view class="item f-r">手机号</view>
				<view class="item3 ml10">{{memberInfo.phone_show}}</view>
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
			
		</view>	
		
		<view  v-if="!first">	
			<view class="certify mb2 mt20">
				<view class="item">
					<text>姓名</text>
				</view>
				<view class="item2">
					<input  placeholder="请输入您的真实姓名" placeholder-class="pl-class" v-model="truename" maxlength="10" />
				</view>
			</view>
			<view class="certify mb2">
				<view class="item">
					<text>身份证号码</text>
				</view>
				<view class="item2">
					<input  placeholder="请输入18位身份证号码" placeholder-class="pl-class" v-model="cardid" maxlength="18" />
				</view>
			</view>
			<view class="certify mb2">
				<view class="item">
					<text>身份证正面</text>
				</view>
				<view class="item2"  @tap="chooseUserImage">
					<image v-if="pic1!=''" :src="pic1" :data-src="pic1" ></image>
					<text v-if="pic1==''" class="upload">+</text>请上传身份证正面图片</view>
			</view>
			<view class="certify mb2">
				<view class="item">
					<text>身份证反面</text>
				</view>
				<view class="item2"  @tap="chooseUserImage2">
					<image v-if="pic2!=''" :src="pic2" :data-src="pic2"></image>
					<text v-if="pic2==''" class="upload">+</text>请上传身份证反面图片</view>
					
			</view>
			<view class="certify mb2">
				<view class="item">
					<text>截止有效期</text>
				</view>
				<view class="item2">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" >
						<view class="uni-input">{{showdate}}</view>
					</picker>
				</view>
			</view>

			<view class="tips">
				<text>● 请确认您输入的信息准确无误，认证通过后不可更改。</text>
			</view>
			<button class="btn mt40" formType="submit" bindtap="sumbit" @click="formSubmit" :disabled="logining">确认提交</button>
			</view>
		</view>
	</view>

</template>
<script> 
    import {  
        mapState
    } from 'vuex';  
    export default {  
		data() {
			return {
				memberInfo:[],
				truename:'',
				cardid:'',
				upic1:'',
				upic2:'',
				iddate:'',
				pic1:'',
				pic2:'',
				logining: false,
				showdate:'身份证截止有效期',
				is_realverify:"0",
				realverify:[],
				showTxt:'获取动态码',
				countdown: 60,
				cTimer: null,
				smscode:'',
				first:true,	
			}				
		},
        computed: mapState(['hasLogin','userInfo']),
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
        methods: {  
            loadData() {  
				let _this = this;
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'../login',
					})
                }else{
					
						_this.$Request.post('member_index/realver').then(res => {
							if (res.code == 200) {
								console.log(res);
								let _userinfo = _this.userInfo
								_userinfo.is_realverify = res.datas.member_info.is_realverify;
								_this.is_realverify=res.datas.member_info.is_realverify;
								_userinfo.phone_show=res.datas.member_info.phone_show;
								_userinfo.phone=res.datas.member_info.phone;
								//_this.setUserInfo(_userinfo);
								_this.memberInfo = _userinfo;
								_this.realverify =res.datas.member_info.realverify;
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
			//选择图片 身份证照片
			chooseUserImage: async function() {
				var _this = this;
					uni.chooseImage({
						sourceType: ['camera', 'album'],
						// #ifdef MP-WEIXIN
						sizeType: ['original'],
						// #endif
						count: 1,
						success: (res) => {
							_this.pic1=res.tempFilePaths[0];
							console.log(JSON.stringify(res.tempFilePaths));
							_this.$Request.upLoadFile('member_index/image_upload',_this.pic1).then(res => {
								console.log(res);
								console.log('===upload======');
								if (res.code == 200) {
									console.log('===upload=2=====');
									uni.hideLoading();
									console.log(res);
									_this.upic1=res.datas.image_name;
									
								}else{
									uni.showToast({
										icon: 'none',
										title:res.datas.error,
										duration:2000
									});
									uni.hideLoading();
								}
							});
						}
					});
					
				},
			//选择图片 身份证照片反面
			chooseUserImage2: async function() {
				var _this = this;
					uni.chooseImage({
						sourceType: ['camera', 'album'],
						// #ifdef MP-WEIXIN
						sizeType: ['original'],
						// #endif
						count: 1,
						success: (res) => {
							_this.pic2=res.tempFilePaths[0];
							console.log(JSON.stringify(res.tempFilePaths));
							_this.$Request.upLoadFile('member_index/image_upload',_this.pic2).then(res => {
								console.log(res);
								console.log('===upload======');
								if (res.code == 200) {
									console.log('===upload=2=====');
									uni.hideLoading();
									console.log(res);
									_this.upic2=res.datas.image_name;
									
								}else{
									uni.showToast({
										icon: 'none',
										title:res.datas.error,
										duration:2000
									});
									uni.hideLoading();
								}
							});
						}
					});
					
				},
			formSubmit: function () {
				var _this =this;
				
				console.log('----');
				if(!(/^[\u4e00-\u9fa5()]{2,10}$/.test(_this.truename))){ 
					uni.showToast({title: '请填写正确的姓名',icon:"none"});
					return false; 
				}
				
				if(!(/^[A-Za-z0-9]+$/.test(_this.cardid)) ||_this.cardid.length!=18){ 
					uni.showToast({title: '请填写正确的身份证号',icon:"none"});
					return false; 
				}
				
				if(_this.pic1==''){
					uni.showToast({title: '请上传身份证照片',icon:"none"});
					return false; 
				}
				if(_this.pic2==''){
					uni.showToast({title: '请上传身份证照片反面',icon:"none"});
					return false; 
				}
				_this.logining = true;
				let postData={ truename:_this.truename,cardid:_this.cardid,iddate:_this.iddate,pic1:_this.upic1,pic2:_this.upic2};
				_this.$Request.post('member_index/realverify_add',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'验证资料提交成功！',
							duration:2000,
							success: function () {
								 setTimeout(function () {
									uni.redirectTo({
										url:'/pages/member/set/userset',
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
			bindDateChange: function(e) {
				
				console.log(e);
				this.iddate = e.target.value;
				this.showdate = e.target.value;
			},
			getDate(type) {
				const date = new Date();
			
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
			
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
			
				return `${year}-${month}-${day}`;
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
	@import "../../../static/css/store.css";
	page{background: #F5F5F5;}
	.certify{ width: 90%;padding: 0 5%;overflow: hidden;background: #FFF;}
	.certify input{height:68upx;color: #666;margin-top: 8upx;}
	.certify .item{ width: 25%;line-height:84upx;float: left;text-align: right;}
	.certify .item2{ width: 70%;line-height:84upx;float: right;color: #999;}
	.certify .item2 image{ width:68upx;height:68upx;margin-top:8upx;float: left;margin-right: 10upx;}
	.certify .item2 .upload{padding:10upx 20upx;color: #999;border-radius: 5upx;border: 2upx solid #999;margin-right: 10upx;}
	
</style>