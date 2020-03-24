<template>
	<view>
		<view v-if="step==0" class="pay-step1">
		<view class="price-box mt20">
			<view class="title">
				<image :src="store_avatar" class="icon"></image>{{store_name}}</view>
			<view class="content"><text>￥</text><input type="digit" v-model="inmoney" maxlength="8"  placeholder="实际消费金额" placeholder-class="placeholder f16"/></view>
		</view>
		<view class="warn mt10">请认真核对商家名称，避免支付错误！</view>
		<text class="btn mt40" @click="nextPay">下一步</text>
		</view>
		
		<view v-if="step==2" class="pay-step2">
			<view class="price-box">
				<view class="title"><image :src="store_avatar" class="icon"></image>{{store_name}}</view>
				<text class="price mb20">{{inmoney}}</text>
			</view>
		<!-- 优惠明细  -->
		<view class="yt-list bg-1">
			<view class="yt-list-cell b-b b-line" @click="toggleMask('show')">
				<view class="cell-icon">
					券
				</view>
				<text class="cell-tit clamp">优惠券</text>
				<text class="cell-tip active">
					{{selectCouponTxt}}
				</text>
				<text class="cell-more wanjia wanjia-gengduo-d"></text>
			</view>
			<view class="yt-list-cell b-b b-line">
				<text class="cell-tit clamp">实付金额</text>
				<text class="cell-tip">￥<text>{{inmoney-discount_money}}</text></text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额</text>
				<text class="cell-tip red">-{{discount_money}}元</text>
			</view>
			<view class="yt-list-cell b-b b-line">
				<text class="cell-tit clamp">支付备注</text>
				<input v-model="pay_comment" class="mt5 f-l"></input>
			</view>
		</view>
		
		<view class="pay-type-list">
			<view class="type-item b-line" @click="changePayType(3)">
				<view class="icon yticon yue"></view>
				<view class="con">
					<text class="tit">预存款支付</text>
					<text>可用余额 ¥ {{memberInfo.available_predeposit}}</text>
				</view>
				<label class="radio">
					<radio value="" color="#00BAAD" :checked='payType == 3' />
					</radio>
				</label>
			</view>

			<view class="type-item b-b b-line mb40" @click="changePayType(1)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#00BAAD" :checked='payType == 1' />
					</radio>
				</label>
			</view>

		</view>
		
		<button class="btn" @click="confirm" :disabled="logining">确认支付</button>
				
		<!-- 优惠券面板 -->
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<view v-if="couponList && couponList.length>0" class="coupon-item" >
				<view v-for="(item,index) in couponList" :key="index"  @click="selectcoupon(item)">
					<view class="con">
						<view class="left">
							<text class="title">{{item.voucher_title}}</text>
						</view>
						<view class="right">
							<text class="price">{{item.voucher_price}}</text>
						</view>
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<view class="tip">
					<text class="time">有效期至{{item.valid_time}}</text>
					<text class="factor">满{{item.voucher_limit}}可用</text>
					</view>
				</view>
				</view>
				<view v-else class="no-info">
					<view class="content">
						<view class="icon"></view>
						<view class="text">暂无可用优惠券</view>
					</view>
				</view>
			</view>
		</view>
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
					<view v-for="(num , indexs) in numbr" :key='indexs' @tap="checkNum(num)" hover-class="hover" :hover-stay-time='20' class="password">
						{{num}}
					</view>
					<view @tap="reset()" class="password bgc3 f-c" hover-class="p-hover">重置</view>
					<view @tap="checkNum(0)" hover-class="hover" :hover-stay-time='20' class="password">0</view>
					<view @tap="backspace()" class="password bgc3 f-c" hover-class="p-hover">删除</view>
				</view>
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
				inmoney:"",
				discount_money:0,
				step:0,
				store_name:'',
				store_avatar:'',
				store_id:0,
				payType: 3,
				paycode:'pdpay',
				memberInfo: {},
				maskState: 0, //优惠券面板显示状态
				couponList: [],
				selectCouponId:0,
				selectCouponTxt:'选择优惠券',
				logining: false,				
				password: '',
				mask: false,
				passwordArray: [],
				pwdnum:0,
				bott: '',
				pasList: ['', '', '', '', '', ''],
				numbr: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				pay_comment:''
			};
		},
        computed: mapState(['hasLogin','userInfo']),
		onLoad(e) {
			console.log('---------e-----------');
			console.log(e);
			if(e.q){
				let rqurl = decodeURIComponent(e.q);
				this.store_id = this.$Request.getQueryString(rqurl,'pay_sid');
			}else{
				this.store_id=e.store_id;
			}
			console.log('==storeid===='+this.store_id);
			this.loadData(e);
		},

		methods: {   
            async loadData(e) {  
				let _this = this;
				console.log('===userInfo==='+this.hasLogin);
				console.log('---------e-----------');
				console.log(e);
				console.log(this.userInfo);
				console.log(this.userInfo.token);
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'/pages/member/login',
					})
                }else{
					this.$Request.post('member_buy/store_info',{store_id:_this.store_id}).then(res => {
						if (res.code == 200) {
							console.log(res);
							//this.login(res.datas);
							_this.store_name = res.datas.store_name;
							_this.store_avatar = res.datas.store_avatar;
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
            },
			//选择支付方式
			changePayType(type) {
				this.payType = type;
				if(type==1){this.paycode='wxminipay';}
				if(type==3){this.paycode='pdpay';}
			},
			stopPrevent(e){
				console.log('======stopPrevent=====');
				console.log(e);
			},
			selectcoupon(e){
				console.log('======selectcoupon=====');
				this.selectCouponId=e.voucher_id;
				this.discount_money=e.voucher_price;
				this.selectCouponTxt=e.mtitle;
				this.toggleMask();
			},
			//确认支付
			confirm: async function() {
				var _this=this;
				uni.showModal({
					title: '提示',
					content: '是否确认支付当前订单',
					success: function (res) {
						if (res.confirm) {
							
							if(_this.paycode=='wxminipay'){
								 uni.login({
									provider: 'weixin',
									success: function(loginRes) {
										let code = loginRes.code;
										console.log(code);
										_this.toPostPay(code);
									}
									
								});	
							}else{
								//_this.toPostPay('');
								if(_this.memberInfo.pp_state==0){
									uni.showToast({
										icon: 'none',
										title:'您未设置支付密码，请到个人中心—>安全设置里进行设置',
										duration:2000,
										success: function () {
											setTimeout(function () {
													
												 }, 2000);
											}
									});
								}else{
									_this.masks();return;
									
								}
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				}); 
			},
			toPostPay(code){
				let _this = this;
				_this.logining = true;
				let postData={
					store_id:this.store_id,total:this.inmoney,vt_id:this.selectCouponId,paycode:this.paycode,wxcode:code,ppwd:this.password,pay_comment:this.pay_comment
				}
				console.log(postData);
				this.$Request.post('member_buy/buy_step2',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						if(res.datas.payment_code == 'wxminipay' ){
							console.log('调起支付');
								// 调起支付
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: res.datas.payinfo.timeStamp+'',
									nonceStr: res.datas.payinfo.nonceStr+'',
									package: res.datas.payinfo.package+'',
									signType: res.datas.payinfo.signType+'',
									paySign: res.datas.payinfo.paySign+'',
									success: function(re) {
										console.log('success:' + JSON.stringify(re));
										uni.showToast({
											icon: 'none',
											title:'支付成功',
											duration:2000,
											success: function () {
												setTimeout(function () {
														uni.navigateTo({
															url:"/pages/store/index?store_id="+_this.store_id,
														});
													 }, 2000);
												}
										});
									},
									fail: function(err) {
										console.log('fail:' + JSON.stringify(err));
										_this.logining = false;
									}
								});
						}else{
							uni.showToast({
								icon: 'none',
								title:'支付成功',
								duration:2000,
								success: function () {
									setTimeout(function () {
											uni.navigateTo({
												url:"/pages/store/index?store_id="+_this.store_id,
											});
										 }, 2000);
									}
							});
						}
					/* 	uni.navigateTo({
							url:"/pages/member/home"
						}) */
						//this.login(res.datas);
						//this.store_name = res.datas.store_name;
					}else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						_this.logining = false;
					}
				});
			},
			async nextPay(){
				let _this = this;
				if(this.inmoney.length<1){
					uni.showToast({
						icon: 'none',
						title:'请输入消费金额！',
						duration:2000
					});
					return false;
				}
				_this.logining = false;
				_this.$Request.post('member_buy/buy_step1',{store_id:this.store_id,total:this.inmoney}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.memberInfo=res.datas.member_info;
						_this.couponList=res.datas.voucher_list;
						_this.inmoney=res.datas.cost_total;
						
						//this.login(res.datas);
						//this.store_name = res.datas.store_name;
						_this.step=2;
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
			//显示优惠券面板
			toggleMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(()=>{
					this.maskState = state;
				}, timer)
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
					
					_this.toPostPay('');
					
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

<style lang="scss">
	.pay-step1{position:absolute;background: #FFF;bottom: 0;top: 0;left: 0;right: 0;}
	.pay-step2{position: absolute;background: #F5F5F5;bottom: 0;top: 0;left: 0;right: 0;}
	.price-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;
		.price{
			font-size:56upx;
			color: #00BAAD;
			font-weight: bold;
			margin-top:12upx;
			&:before{
				content: '￥';
				font-size:28upx;
				color:#666666;
				font-weight: normal;
			}
		}
			.title{
				margin:60upx auto 20upx;
				font-size: 36upx;
				color: #303133;
				font-weight:600;
				line-height:56upx;
				height:56upx;
				display: flex;
				justify-content: flex-start;
				.icon{
					height:52upx;
					width:52upx;
					border-radius:50%;
					flex-direction: column;
					margin-right:10upx;
					background: #FFF url('https://www.fhlego.com/static/avatar.jpg') center no-repeat;
					background-size:100%;
					border: 2upx solid #CCC;
					align-items: center;
				}
			}
		.content{
			width:40%;
			padding: 0 20%;
			border-bottom:#ccc 2upx solid;
			display:flex;
			text{
				width:30upx;
				padding:26upx 0 0;
				flex-direction: column;
			}
			input{
				width:auto;
				font-size:48upx;
				color:#00BAAD;
				padding: 20upx 10upx;
				font-weight: 600;
				flex-direction: column;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;
		.type-item{
			height: 100upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}
		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.yue {
			width:110upx;
			height:100upx;
			background: #FFF url('https://www.fhlego.com/static/yue.png') left no-repeat;
			background-size:50%;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_w4kpxh0rafi.ttf') format('truetype');
	}

	.yticon {
		font-family: "yticon" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
	.icon-weixinzhifu:before {
		content: "\e61a";
	}
	.icon-erjiye-yucunkuan:before {
		content: "\e623";
	}
	
	.yt-list-cell {
	display: flex;
	align-items: center;
	padding: 10upx 30upx 10upx 40upx;
	line-height: 70upx;
	position: relative;
	
	&.cell-hover {
		background: #fafafa;
	}
	
	&.b-b:after {
		left: 30upx;
	}
	
	.cell-icon {
		height: 32upx;
		width: 32upx;
		font-size: 22upx;
		color: #fff;
		text-align: center;
		line-height: 32upx;
		background: #f85e52;
		border-radius: 4upx;
		margin-right: 12upx;
	
		&.hb {
			background: #ffaa0e;
		}
	
		&.lpk {
			background: #3ab54a;
		}
	}
	
	.cell-more {
		align-self: center;
		font-size: 24upx;
		color: $font-color-light;
		margin-left: 8upx;
		margin-right: -10upx;
	}
	.cell-tit {
		flex: 1;
		font-size: 26upx;
		color: $font-color-light;
		margin-right: 10upx;
	}
	
	.cell-tip {
		font-size:24upx;
		color: $font-color-dark;
		text{
			font-size:36upx;
			font-weight: 600;
			color: #FF0000;
		}
		&.disabled {
			color: $font-color-light;
		}
	
		&.active {
			color: $base-color;
		}
		&.red{
			color: $base-color;
		}
	}
	&.desc-cell {
		.cell-tit {
			max-width: 90upx;
		}
	}
	.desc {
		flex: 1;
		font-size: $font-base;
		color: $font-color-dark;
		}
	}
		.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	
	/* 优惠券面板 */
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 9995;
		transition: .3s;
		.mask-content{
			width: 100%;
			display: flex;
			min-height: 30vh;
			max-height: 70vh;
			background: #F5F5F5;
			transform: translateY(100%);
			transition: .3s;
			overflow-y:scroll;
		.no-info{
			width: 90%;
			color: #999;
			padding:0 5%;
			display: flex;
			align-items: center;
			.content{
				width:100%;
				line-height:118upx;
				color: #999;
				display: flex;
				justify-content: center;
				.icon{
					width:98upx;
					height:118upx;
					background: url('https://www.fhlego.com/static/no-coupon.png') center no-repeat;
					flex-direction: column;
					background-size:80%;
					}
				.text{
					flex-direction: column;
					line-height: 118upx;
					}
				}
			}
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			.mask-content{
				transform: translateY(0);
			}
		}
	}
	
	/* 优惠券列表 */
	.coupon-item{
		width: 90%;
		display: flex;
		flex-direction: column;
		margin:20upx auto;
		background: #fff;
		overflow: hidden;
		height:130upx;
		.con{
			display: flex;
			align-items: center;
			position: relative;
			height: 80upx;
			padding: 0 30upx;
			&:after{
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
		.left{
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}
		.time{
			font-size: 24upx;
			color: $font-color-light;
		}
		.factor{
			font-size: 28upx;
			float: right;
		}
		.right{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}
		.price{
			font-size: 48upx;
			color: $base-color;
			font-weight: 600;
			&:before{
				content: '￥';
				font-size: 34upx;
			}
		}
		.tip{
			font-size: 24upx;
			color: $font-color-light;
			height:30upx;
			line-height:30upx;
			padding:10upx 30upx;
		}
		.circle{
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;
			&.r{
				left: auto;
				right: -6upx;
			}
		}
	}
	
.password{width: 25%;flex-grow:1;padding: 3%;font-size:40upx;box-shadow:0px 0px 1upx #ccc;}
.hover{background: #eee;}
.masks{bottom:-50%;position: fixed;background: #fff;width: 100%;transition:.5s}
.bot{bottom: 0;}
</style>
