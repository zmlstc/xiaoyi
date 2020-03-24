<template>
	<view class="m-mian">
		<view v-if="first">
			<view style="padding: 0 3%;">
				<view style="text-align: center;font-size:30upx;padding-top: 3%;">请输入旧支付密码</view>
			</view>
			<view style="display: flex;width: 80%;margin:5% auto;text-align: center;">
				<view v-for="(item , index) in pasList0" :key='index' style="flex: 1;">
					<view style="width: 80upx;height: 80upx;border: 1px solid#ccc;margin: auto;line-height:1;">
						<text v-show="pwdnum0 > index" style="font-size:80upx;position: relative;top: -8upx;">●</text>
					</view>
				</view>
			</view>
				<view style="padding: 0 3%;">
					<view style="text-align: center;font-size:30upx;">
						<view class="btn" @click="nextReg">下一步</view>
					</view>
				</view>
			
			<view style="display: flex;flex-wrap: wrap;text-align: center;margin-top: 40rpx;">
				<view v-for="(num , indexs) in numbr " :key='indexs' @tap="checkNum(num)" hover-class="hover" :hover-stay-time='20' class="password">
					{{num}}
				</view>
				<view @tap="reset()" class="password" style="background: #09BB07;color: #fff;">重置</view>
				<view @tap="checkNum(0)" hover-class="hover" :hover-stay-time='20' class="password">0</view>
				<view @tap="backspace()" class="password" style="background: #09BB07;color: #fff;">删除</view>
			</view>
			
		</view>
		
			<view  v-if="!first">
				<view style="padding: 0 3%;">
					<view style="text-align: center;font-size:30upx;padding-top: 3%;">请输入支付密码</view>
				</view>
				<view style="display: flex;width: 80%;margin:5% auto;text-align: center;">
					<view v-for="(item , index) in pasList" :key='index' style="flex: 1;">
						<view style="width: 80upx;height: 80upx;border: 1px solid#ccc;margin: auto;line-height:1;">
							<text v-show="pwdnum > index" style="font-size:80upx;position: relative;top: -8upx;">●</text>
						</view>
					</view>
				</view>
				<view style="padding: 0 3%;">
					<view style="text-align: center;font-size:30upx;">再次输入支付密码</view>
				</view>
				<view style="display: flex;width: 80%;margin:5% auto;text-align: center;">
					<view v-for="(item , index) in pasList2" :key='index' style="flex: 1;">
						<view style="width: 80upx;height: 80upx;border: 1px solid#ccc;margin: auto;line-height:1;">
							<text v-show="pwdnum2 > index" style="font-size:80upx;position: relative;top: -8upx;">●</text>
						</view>
					</view>
				</view>
				<view style="padding: 0 3%;">
					<view style="text-align: center;font-size:30upx;">
						<button class="btn " @tap="setPPwd" type="primary" :disabled="logining">确认</button>
					</view>
				</view>
				<view style="display: flex;flex-wrap: wrap;text-align: center;margin-top: 40rpx;">
					<view v-for="(num , indexs) in numbr " :key='indexs' @tap="checkNum(num)" hover-class="hover" :hover-stay-time='20' class="password">
						{{num}}
					</view>
					<view @tap="reset()" class="password" style="background: #09BB07;color: #fff;">重置</view>
					<view @tap="checkNum(0)" hover-class="hover" :hover-stay-time='20' class="password">0</view>
					<view @tap="backspace()" class="password" style="background: #09BB07;color: #fff;">删除</view>
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
				first:true,				
				password0: '',			
				password: '',				
				password2: '',
				pwdArray: [],
				pwdnum:0,
				pasList: ['', '', '', '', '', ''],
				pwdnum2:0,
				pasList2: ['', '', '', '', '', ''],
				pwdArray2: [],
				pwdnum0:0,
				pasList0: ['', '', '', '', '', ''],
				pwdArray0: [],
				numbr: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				logining: false
			}				
		},
        computed: mapState(['sellerHasLogin']), 
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
        methods: {  
            async loadData() {  
                if (!this.sellerHasLogin) {  
                	uni.navigateTo({
                		url:'login',
                	})
                }
            },
			nextReg() {  
				var _this =this;
				if(!(/^[0-9]*$/.test(_this.password0) ||_this.password0.length!=6) ){ 
					uni.showToast({title: '请输入正确的旧密码',icon:"none"});
					return false; 
				}
				
                uni.showLoading({title: '正在处理中...'});
				_this.$Request.post('seller_index/check_ppwd',{oppwd:_this.password0}).then(res => {
					if (res.code == 200) {
						uni.hideLoading();
						console.log(res);
						_this.first=false;
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
						_this.reset();
						
					}
				});
				
				
            },
			setPPwd: function (e) {
				var _this =this;
				
				if(_this.password0.length!=6){ 
					uni.showToast({title: '请填写正确的旧密码',icon:"none"});
					return false; 
				}
				/* if(!(/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(_this.newpwd)) ){ 
					uni.showToast({title: '密码必须大于6位包含数字和字母',icon:"none"});
					return false; 
				} */
				if(!(/^[0-9]*$/.test(_this.password) ||_this.password.length!=6) ){ 
					uni.showToast({title: '密码必须6位数字',icon:"none"});
					return false; 
				}
				if(_this.password!=_this.password2 ){ 
					uni.showToast({title: '两次输入的密码不一致',icon:"none"});
					return false; 
				}
				_this.logining =true;
				console.log('-----check-----------');
				_this.$Request.post('seller_index/modify_ppwd',{opwd:_this.password0,newpwd:_this.password,newpwd2:_this.password2}).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'修改成功！',
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
				if(this.first){
					this.checkNum_old(num);
				}else{
					this.checkNum_new(num);
				}
			},
			checkNum_old(num){
				let _this = this;
				if (this.pwdnum0 < 6) {
					console.log('---'+num);
					this.pwdArray0.push(num+'');
					this.pwdnum0++;
					//this.passwordArray=[this.passwordArray,num];
					console.log(this.pwdArray0);
					
				}
				if (this.pwdnum0 == 6) {
					let p1 = '';
					for (let i = 0; i < this.pwdArray0.length; i++) {
						p1 += this.pwdArray0[i];
					}
					console.log(p1);
					this.password0 = p1;
				} 
			},
			checkNum_new(num){
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
				if(this.first){
					this.pwdArray0 = [];
					this.pwdnum0=0;
					this.password0 ='';
				}else{
					this.pwdArray = [];
					this.pwdArray2 = [];
					this.pwdnum=0;
					this.pwdnum2=0;
					this.password ='';
					this.password2 ='';
				}
				
			},
			backspace() {
				if(this.first){
					this.pwdArray0.pop();
					this.pwdnum0--;
					this.password0 ='';
				}else{
					if(this.pwdnum2>0){
						this.pwdArray2.pop();
						this.pwdnum2--;
						this.password2 ='';
					}else{
						this.pwdArray.pop();
						this.pwdnum--;
						this.password ='';
					}
				}
			},
			 
        }  
    }  
</script> 
<style>
	@import "../../static/css/store.css";
	page{background: #F5F5F5;}
	.password{width: 25%;flex-grow:1;padding: 3%;font-size:40upx;box-shadow:0px 0px 1upx #ccc;}
	.hover{background: #eee;}
	.masks{bottom:-50%;position: fixed;background: #fff;width: 100%;transition:.5s}
	.bot{bottom: 0;}
</style>