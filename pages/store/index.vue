<template>
	<view>
		<swiper class="carousel" indicator-dots=true circular=true interval="3000" duration="700">
			<swiper-item v-for="(item,index) in storeInfo.plist" :key="index" @tap="toPage('/pages/store/pic?store_id='+store_id)">
				<view class="image-wrapper">
					<image :src="item.img" :class="item.loaded" mode="aspectFit"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="info">
			<view class="title">
				<text :class="{Skeleton:!loaded}">{{storeInfo.store_name}}</text>
			</view>
			<view>
				<text class="iconfont icon-point-open" v-if="storeInfo.yy_state"><text class="state">营业中</text></text>
				<text class="iconfont icon-point-close" v-if="!storeInfo.yy_state"><text class="state">休息中</text></text>
			</view>
		</view>
		<view class="actions"> 
			<view class="actions-info" v-if="seval_scores>-1">
				<uni-rate disabled="true" size="14" margin="5" :value="seval_scores"></uni-rate>
			</view>
			<view class="actions-cost"><text>{{storeInfo.consume_num}}人消费</text></view>
			<view class="actions-coll">
				<text class="iconfont icon-likefill" :class="{active: fav}" @click="toFavorite" v-if="!fav"></text>
				<text class="iconfont icon-likefill" :class="{active: fav}" @click="toFavorite" v-if="fav"></text>
			</view>
		</view>
		<view class="store-box mt10">
			<view class="item">
				<view class="addr" @tap="toLocation">
				<view class="icon"></view>{{storeInfo.map_address}}
			</view>
			<view class="phone" @tap="callPhone(storeInfo.store_phone)">
				<view class="icon"></view>
			</view>
			</view>
			<view class="item2 t-line" @tap="toPage('intro?store_id='+store_id)">
				<view class="ss-box">
					<view v-for="(item, index) in storeInfo.flist" :key="index" class="box" >
						<img class="num" :src="item.img" />
						<view class="text">{{item.f_name}}</view>
					</view>
				</view>
			<view class="more"></view>
			</view>
		</view>
		
		<view class="store-contain">
			<view class="balance-info">
				<view class="left">
					<view v-if="storeInfo.vlist && storeInfo.vlist.length>0">
						<view class="left-coupon ml10"  @click="toggleMask('show')">
							<view class="c-info" v-for="(item, index) in storeInfo.vlist" :key="index">
							<view class="icon"></view><text>{{item.mtitle}}</text>
							</view>
						</view>
						<view class="more"></view>
					</view>
					<view v-else class="no-info">
						<view class="icon"></view>
						<view class="text">商家暂无优惠券</view>
					</view>
					</view>
				<view class="right">
					<view class="box">
						<view class="buybtn" @click="toPay">到店买单</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 评论 -->
	<view class="evalution">
		<view class="evaluate-header" @tap="toPage('evallist?store_id='+storeInfo.store_id)">
			<view class="title">
				<text class="ml5">用户评价 ({{ storeInfo.eval_num }})</text>
			</view>
			<view class="total"  v-if="storeInfo.eval_num>0"><text>{{storeInfo.eval_manyi}}%满意</text><view class="icon"></view></view>
			<view class="total" v-if="storeInfo.eval_num==0">无评价<view class="icon"></view></view>
		</view>
		<view class="eva-list" :class="{Skeleton:!loaded}">
			<view  v-for="(item, index) in evaList" :key="index" class="eva-item b-line">
				<image :src="item.member_avatar" mode="aspectFill" class="img"></image>
				<view class="eva-right">
					<view class="acc">
					<view class="name">{{item.member_name}}</view>
						<view class="start"><uni-rate disabled="true" size="14" margin="5" :value="item.seval_scores"></uni-rate></view>
						<view class="time">{{item.date_txt}}{{item.time_txt}}</view>
					</view>
					<text class="content">{{item.seval_content}}</text>
					<view class="imgs" v-if="item.geval_image_240">
						<block v-for="(imgurl, key) in item.geval_image_240" :key="key">
							<view class="imgs-box"><image :src="imgurl" mode="widthFix" @click="previewImg(imgurl,item.geval_image_240)"></image></view>
						</block>
					</view>
					<view class="reply bg-color2" v-if="item.is_reply=='1'&&item.reply_del=='0'">
						<view class="title">官方回复：</view>
						<view class="content"  v-if="item.reply_del=='0'">{{item.seval_explain}}</view>
						<view class="date">
							<view class="icon"></view>
							<text>{{item.reply_date_txt}}</text><text class="ml5">{{item.reply_time_txt}}</text>
						</view>
					</view>
					
				</view>
			</view>
		</view>
	</view>
		<!-- 优惠券面板 -->
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<view class="coupon-item" v-for="(item,index) in couponList" :key="index"  @click="selectcoupon(item)">
					<view class="con">
						<view class="left">
							<text class="title">{{item.voucher_t_title}}</text>
						</view>
						<view class="right">
							<text class="price">{{item.voucher_t_price}}</text>
						</view>
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<view class="tip">
						<text class="time">有效期至{{item.valid_time}}</text>
						<text class="factor">满{{item.voucher_t_limit}}可用</text>						
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import uniRate from "../../components/uni-rate/uni-rate.vue"
    import {  
        mapState,  
        mapMutations  
    } from 'vuex'; 
	export default {
		data() {
			return {
				loaded: false,
				currentEpd: 1,
				store_id:0,
				storeInfo:{'eval_num':0,'eval_manyi':0},
				evaList:[],
				fav:false,
				maskState: 0, //优惠券面板显示状态
				couponList: [],
				seval_scores:-1
			};
		},
		components: {uniRate},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad(e){
			
			if(e.q){
				let rqurl = decodeURIComponent(e.q);
				this.invitecode = this.$Request.getQueryString(rqurl,'pay_sid');
			}else{
				this.store_id=e.store_id;
			}
			this.loadData();
			console.log('onload');
			console.log(e);
			this.loaded = true;
			
			
		},
		methods:{
			loadData(){
				let _this = this;
				_this.$Request.post('store/store_info',{store_id:_this.store_id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.storeInfo=res.datas.store_info;
						_this.fav = res.datas.is_favorate;
						_this.evaList = res.datas.evaList;
						_this.couponList = res.datas.store_info.vtlist;
						_this.seval_scores = res.datas.store_info.seval_scores;
						 uni.setNavigationBarTitle({
							title: _this.storeInfo.store_name
						}) 
					}
				});
			},
			imageOnLoad(key,index){
				//this.$set(this.data[key][index], 'loaded', 'loaded');
			},
			//收藏
			toFavorite(){
				let _fav = this.fav;
				let url='member_favorites_store/favadd';
				let showinfo_txt = '已收藏';
				if(_fav){url='member_favorites_store/favdel';showinfo_txt = '已取消';}
				this.$Request.post(url,{store_id:this.store_id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						this.fav = !_fav;
						uni.showToast({
							icon: 'none',
							title:showinfo_txt,
							duration:1500
						});
					}else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
					}
				});
			},
			callPhone(phone){
				uni.makePhoneCall({
					phoneNumber: phone 
				});
			},
			toPay:function(){
				 if (!this.hasLogin) {  
					 uni.showToast({
					 	icon: 'none',
					 	title:'请先登录！',
					 	duration:3000,
					 	success: function () {
							 setTimeout(function () {
								uni.navigateTo({
									url:'/pages/member/login',
								});
							  }, 1500);
					 		
					 	}
					 });
				}else{
					uni.navigateTo({
						url:"/pages/store/pay?store_id="+this.store_id
					})
				}
			},
			toLocation: function () {
				uni.openLocation({
					latitude: parseFloat(this.storeInfo.map_lat),
					longitude: parseFloat(this.storeInfo.map_lng),
					success: function () {
						console.log('success');
					}
				});
			},
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			previewImg(src,urls){
				uni.previewImage({
					current:src,
					urls
				})
			},
			stopPrevent(e){
				console.log('======stopPrevent=====');
				console.log(e);
			},
			//显示优惠券面板
			toggleMask(type){
				console.log('======toggleMask====='+type);
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(()=>{
					this.maskState = state;
				}, timer)
			},
			selectcoupon(e){
				console.log('======selectcoupon=====');
				let _this  = this;
				let selectCouponId=e.voucher_t_id;
				let discount_money=e.voucher_price;
				let selectCouponTxt=e.mtitle;
				this.$Request.post('member_voucher/voucher_freeex',{tid:selectCouponId}).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'领取成功！',
							duration:3000,
							success: function () {
								 setTimeout(function () {
									_this.toggleMask();
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
					}
				}); 
				//this.toggleMask();
			},
			
		},
	}
</script>
<style lang="scss">
@import "../../static/css/store.css";
	page{background: #f5f5f5;}

	.carousel {
		height: 200px;
		.image-wrapper{
			display: flex;
			justify-content: center;
			align-content: center;
			width: 100%;
			height: 100%;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.scroll-view-wrapper{
		display:flex;
		align-items:center;
		height: 90upx;
		padding: 20upx 0 20upx 40upx;
		background: #fff;
	}
	.episode-panel {
		white-space: nowrap;
		width: 100%;
		view {
			display: inline-block;
			margin-right: 30upx;
			width: 56upx;
			font-size: 32upx;
			color: #606266;
			&.current{
				color: #07a7a7;
			}
		}
	}

	.info {
		display: flex;
		align-items: center;
		padding: 8upx 40upx 8upx 20upx;
		background: #fff;
		.title {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 36upx;
			color: #303133;
			font-weight: 600;
		} 
		.state{
			color: #666;
			font-size: 24upx;
		}
	}

	.actions {
		padding: 0 45upx 20upx 18upx;
		background: #fff;
		display: flex;
		&-info{
			height:50upx;
			line-height:50upx;
		}
		&-cost{
			margin-left: 4vw;
			height: 50upx;
			line-height: 50upx;
			flex: 1;
			display: flex;
			flex-direction: column; 
		}
		&-coll{
			font-size:32upx;
			height: 18px;
			color:#CCC;
			line-height: 18px;
		}
		.active{
			color:#d40000;
		}
	}
	
	.store-contain{
		margin:10upx 0;
		background-color: #fff;
		.balance-info{
			display: flex;
			padding: 20upx 0;
			.left{
				width:75%;
				.no-info{width: 90%;line-height:118upx;color: #999;padding:0 5%;display: flex;justify-content: center}
				.no-info .icon{
					width:98upx;
					height:118upx;
					background: url('https://www.fhlego.com/static/no-coupon.png') center no-repeat;
					flex-direction: column;
					background-size:80%;
					}
				.no-info .text{
					flex-direction: column;
					line-height: 118upx;
					}
				&-top{
					//position: absolute;
					margin-left: 2vw;
					display: flex;
					width: 96%;
					.icon{
						width:32upx;
						height:60upx;
						background: url('https://www.fhlego.com/static/location.png') center no-repeat;
						background-size:100%;
						float: left;						
					}
					.text{
						width: 90%;
						flex: 1;
						display: flex;
						height:60upx;
						line-height:60upx;
						float: left;
					}
					.more {
						width:88upx;
						height:128upx;
						background: url('https://www.fhlego.com/static/arrow_r.png') center no-repeat;
						background-size:60%;
						float: right;
					}
				}
				&-coupon{
					width:80%;
					padding:10upx;
					float:left;
				.c-info{
						width:100%;
						height: 48upx;
						line-height: 48upx;
						overflow: hidden;
						color:#999;
					.icon{
						width: 32upx;
						height:48upx;
						background: url('https://www.fhlego.com/static/coupon.png') center no-repeat;
						background-size:100%;
						float: left;
						margin-right: 8upx;
						}
					}
				}
				.more {
					width:58upx;
					height:128upx;
					background: url('https://www.fhlego.com/static/arrow_r.png') center no-repeat;
					background-size:60%;
					float: right;
				}
				&-bottom{
					padding: 0 2%;
					.f-content{
						width:90%;
						height:74upx;
						overflow: hidden;
						float: left;
						flex-wrap:wrap;
						display: flex;
					.box{
						width:84upx;
						height: 80upx;
						font-size: 28upx;
						flex-direction: column;
						text-align: center;
						.num{
							width:42upx;
							height:42upx;
						}
						.text{
							width: 100%;
							font-size:24upx;
							line-height:32upx;	
							margin-top: -10upx;
							color: #666;
						}
						}
					}
				}
			}
			.right{
				width: 25%;
				padding:20upx 10upx;
				.box{
					.img{
						width: 100%;
						display: flex;
						justify-content: center;
						align-items: flex-end;
						.icon-dianhua1:before {
						  content: "\e63a";
							font-size:10vw;
							color: rgba(0, 186, 173, 1);
							line-height: 1.2;
						}
					}
					.text{
						width: 100%;
						display: flex;
						justify-content: center;
						font-size: 28upx;
						color: #3d3d3d;
					}
				}
			}
		}
	}
	

	.section-tit {
		font-size: 30upx;
		color: #303133;
		margin-bottom: 30upx;
		text-align:center;
	}

	.guess {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 30upx 40upx 10upx;
		margin-top: 16upx;
		background: #fff;
	}

	.guess-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}
	.guess-item {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		min-width: 40%;
		margin-right: 26upx;
		padding-bottom: 40upx;
	
		&:nth-child(2n) {
			margin-right: 0;
		}
	
		image {
			width: 100%;
			height: 200upx;
			border-radius: 10upx;
		}
	
		text {
			font-size: 24upx;
			color: #909399;
			&.Skeleton{
				width: 180upx;
				&.title{
					width: 140upx;
				}
			}
			&.title{
				font-size: 30upx;
				color: #303133;
				margin-top:16upx;
				margin-bottom: 8upx;
			}
		}
	}
	.evalution{
		display:flex;
		flex-direction:column;
		background: #fff;
		padding:0;
	}
	.eva-item{
		display:flex;
		margin-left:40upx;
		padding: 40upx 20upx 20upx 0;
		.img{
			width: 60upx;
			height: 60upx;
			border-radius:50%;
			flex-shrink:2;
			border: 2upx solid #ccc;
		}
	}


.evaluate-header {
	width: 100%;
	height: 80upx;
	display: flex;
	justify-content: space-between;
	padding: 20upx;
	align-items: center;
	box-sizing: border-box;
	border-bottom: 1upx solid #e5e5e5;
}

.evaluateBox .title {
	display: flex;
	align-items: center;
	color: #000000;
	font-size: 30upx;
}

.total {
	/* flex: 1; */
	height: 100%;
	color: #999;
	font-size: 24upx;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	text{
		color: #00BAAD;
	}
	.icon{
	width:32upx;height:38upx;background: url('https://www.fhlego.com/static/arrow_r.png') center no-repeat;background-size:80%;
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
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y:scroll;
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
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;
		.con{
			display: flex;
			align-items: center;
			position: relative;
			height:80upx;
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
				font-size: 32upx;
				font-weight: normal;
				color: #999;
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
</style>

