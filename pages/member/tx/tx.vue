<template>
	<view>
		
		<view class="cash-mode mt10 bf" @tap="toPage('txway')">
			<view class="item">
				<view :class="txwayinfo.bill_type_code"></view>
				<view class="content">
					<view class="name">{{txwayinfo.paytxt}}</view>
					<view class="acc">{{txwayinfo.bill_type_number_txt}}</view>
				</view>
			</view>
			<view class="item2">
				<view class="more"></view>
			</view>
		</view>
		<view class="cash-out bf mt10">
			<view class="title">提现金额</view>
			<view class="content b-line">
				<text>￥</text>
				<input placeholder="输入金额" placeholder-class="pl-class" v-model="txmoney" maxlength="10" />
			</view>
			<view class="tip">可用余额<text>{{predepoit}}</text>元</view>
		</view>
		<view class="tips f-r">*预计24小时内到账</view>
		<button class="btn mt40" @click="masks" :disabled="logining">确认提交</button>
		
						<!-- 密码框 -->
		<view v-if="mask" class="shop-pay">
			<view :class="bott" class="masks">
				<view class="pay-tip">
					<view @tap="maskss()" class="close">×</view>
					<view class="tip">请输入支付密码</view>
				</view>
				<view class="psdnum-box">
					<view v-for="(item , index) in pasList" :key='index' style="flex: 1;">
						<view class="pass">
							<text v-show="pwdnum > index" class="text">●</text>
						</view>
					</view>
				</view>
				<view class="pay-num">
					<view v-for="(num , indexs) in numbr " :key='indexs' @tap="checkNum(num)" hover-class="hover" :hover-stay-time='20' class="password">
						{{num}}
					</view>
					<view @tap="reset()" class="password" style="background: #00BAAD;color: #fff;">重置</view>
					<view @tap="checkNum(0)" hover-class="hover" :hover-stay-time='20' class="password">0</view>
					<view @tap="backspace()" class="password" style="background: #00BAAD;color: #fff;">删除</view>
				</view>
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
				predepoit:'',
				txwayinfo:[],
				txmoney:'',
				logining: false,				
				password: '',
				mask: false,
				passwordArray: [],
				pwdnum:0,
				bott: '',
				pasList: ['', '', '', '', '', ''],
				numbr: [1, 2, 3, 4, 5, 6, 7, 8, 9]
			}				
		},
        computed: mapState(['hasLogin','userInfo']),
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
        methods: {  
			...mapMutations(['setUserInfo']),
            async loadData() {  
				let _this=this;
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'../login',
					})
                }else{
					this.memberInfo = this.userInfo;
				}
				
				_this.$Request.post('member_fund/gettxway').then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.predepoit = res.datas.predepoit;
						_this.txwayinfo = res.datas.txway;
						if(res.datas.notxway==1){
							uni.showToast({
								icon: 'none',
								title:'请先添加提现方式！',
								duration:2000,
								success: function () {
									 setTimeout(function () {
										uni.navigateTo({
											url:'txwayadd',
										});
									 }, 2000);
								}
							});
						}
					}
				}).catch(function (err) {
					console.log(err);
				  });
				  
            },
			formSubmit: function () {
				var _this = this;
				if(_this.txmoney ==''||parseFloat(_this.txmoney)<0.01){ 
					uni.showToast({title: '请填写正确的提现金额',icon:"none"});
					return false; 
				}
				if(parseFloat(_this.txmoney)>_this.predepoit){ 
					uni.showToast({title: '提现金额不足',icon:"none"});
					return false; 
				}
				_this.logining = true;
				let postData = {id:_this.txwayinfo.id,pdc_amount:_this.txmoney,ppwd:_this.password};
				_this.$Request.post('member_fund/pd_cash_add',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'提交成功！',
							duration:3000,
							success: function () {
								 setTimeout(function () {
									uni.navigateTo({
										url:'/pages/member/wallet',
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
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			// 密码框
			checkNum(num) {
				let _this = this;
				if (this.pwdnum < 6) {
					console.log('---'+num);
					this.passwordArray.push(num+'');
					this.pwdnum++;
					//this.passwordArray=[this.passwordArray,num];
					console.log(this.passwordArray);
					
				}
				if (this.pwdnum == 6) {
					let str = '';
					for (let i = 0; i < this.passwordArray.length; i++) {
						str += this.passwordArray[i];
					}
					console.log(str)
					this.password = str
					this.mask = false
					this.passwordArray = []
					this.bott = '';
					console.log(this.password);
					
					_this.formSubmit();
					
					this.pwdnum=0;
				}
			},
			reset() {
				this.passwordArray = [];
				this.pwdnum=0;
			},
			backspace() {
				this.passwordArray.pop();
				this.pwdnum--;
			},
			masks() {
				let _this = this
				
				if(_this.txmoney ==''||parseFloat(_this.txmoney)<0.01){ 
					uni.showToast({title: '请填写正确的提现金额',icon:"none"});
					return false; 
				}
				if(parseFloat(_this.txmoney)>_this.predepoit){ 
					uni.showToast({title: '提现金额不足',icon:"none"});
					return false; 
				}
				this.mask = true
				this.pwdnum=0;
				setTimeout(()=> {
					_this.bott = 'bot'
				}, 50)
			},
			maskss() {
				this.mask = false
				this.bott = ''
				this.passwordArray = []
				this.pwdnum=0;
			},
			 
        }  
    }  
</script> 
<style>
	page{background: #F5F5F5;}
	.password{width: 25%;flex-grow:1;padding: 3%;font-size:40upx;box-shadow:0px 0px 1upx #ccc;}
	.hover{background: #eee;}
	.masks{bottom:-50%;position: fixed;background: #fff;width: 100%;transition:.5s}
	.bot{bottom: 0;}
</style>