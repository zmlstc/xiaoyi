<template>
	<view>
		<!-- 状态栏 -->
		<view class="status" ></view>
		<!-- 顶部导航栏 -->
		<view class="header b-line" >
			<!-- 定位城市 -->
			<view class="addr"  @tap="toCity">
				<view class="icon"></view>
				<text>{{ city }}</text>
			</view>
			<!-- 搜索框 -->
			<view class="input-box">
				<input placeholder="搜索店铺" placeholder-style="color:#c0c0c0;" @tap="toSearch()"/>
				<view class="icon search"></view>
			</view>
		</view>
		<view class="place"></view>
		<view v-if="!has_agent">
		<view class="place"></view>
			<view class="noservice">
				<view class="icon"></view>
				<view class="tip">
				<text>非常抱歉！！！
				当前城市暂未开通小易共享</text>
				</view>
				<text>请选择已开通城市</text>
			</view>
		</view>
		<view v-if="has_agent">
		<!-- tab-store_class S -->
		<view class="uni-tab-bar">
			<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x >
				<view v-for="(tab,index) in tabClasslist" :key="tab.sc_id" :class="['swiper-tab-list',tabIndex==index ? 'active' : '']" :id="tab.sc_id"
				 :data-current="index" @click="tapTab(tab.sc_id)">{{tab.sc_name}}</view>
			</scroll-view>
		</view>
		<!-- tab-store_class E -->
		
		<!-- 轮播图S -->
		<swiper @change="swiperChange" previous-margin="20px" next-margin="20px" class="swiper" :indicator-dots="false"
		 :autoplay="true" :interval="5000" :duration="1000" :current="bigId">
			<template v-for="(img, index) in bannerImg">
				<swiper-item :key="index">
					<view :class="['swiper-item',bigId === index ? 'big' : 'big']" @tap="toCategory(img.url)">
						<image class="img" :src="img.show_img" ></image>						
					</view>
				</swiper-item>
			</template>
		</swiper>
		<!-- 轮播图E -->
		<!-- 导航栏板块 -->
		<view class="nav-list" v-if="navlist.length > 0">
			<view class="nav" 	v-for="(row, index) in navlist" :key="index" @tap="toCategory(row.url)" >
				<view class="img"><image :src="row.img"></image></view>
				<view class="text">{{ row.name }}</view>
			</view>
		</view>
		<!-- 导航栏板块 -->
		
		<!-- 会员福利 (积分兑换)-->
		<view class="seckill-section m-t mb10">
			<view class="s-header">
				<view class="title">会员福利</view>
				<text class="other" @tap="reflist">换一批</text>
				<text class="more" @tap="toCategory('/pages/index/agreement?id=1')">更多></text>
			</view>
			<scroll-view class="floor-list" scroll-x>
				<view class="scoll-wrapper">
					<view  v-for="(item, index) in pgList" :key="index" @tap="toPage(item.pgoods_id)" class="floor-item">
						<image :src="item.pgoods_image" mode="aspectFill"></image>
						<view class="title clip">{{item.pgoods_name}}</view>
						<view class="price"><view class="icon"></view>{{item.pgoods_points}}</view>
						<view class="clamp duihuan">已兑换：{{item.pgoods_salenum}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 猜你喜欢-->
		<view class="guesslike-section">
			<view class="s-header">
				<view class="title">猜你喜欢</view>
			</view>
			<view class="goods-list" v-if="storelist.length > 0">
				<view class="coupon-page s-row" v-for="(item,index) in storelist" :key="index" @tap="toStore(item.store_id)">
				<image :src="item.store_avatar"></image>
					<view class="content">
						<view class="title s-row"><text class="clip">{{item.store_name}}</text><text class="distance">{{item.distance}} km</text></view>
						<view class="num s-row">
							<view class="start"><uni-rate :disabled="true" :size="14" :margin="5" :value="item.scores" isShowNum="true"></uni-rate></view>
							<view class="xiaofei s-row"><text>{{item.consume_num}}</text>人消费</view>
						</view>
						<view class="consume">
							<view class="zhekou">
							<view class="tmprice clip" v-if="item.voucher!=''"><view class="icon"></view>{{item.voucher}}</view>
							<view class="tmprice clip" v-if="item.voucher2!=''"><view class="icon"></view>{{item.voucher2}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 加载更多提示 -->
		<view class="s-col is-col-24" v-if="storelist.length > 0">
			<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
		</view>
		</view>
	</view>
</template>

<script>
	//高德SDK
	import amap from '../../common/SDK/amap/amap-wx.js';
	import uniRate from "../../components/uni-rate/uni-rate.vue"
	import {  
	    mapState,  
	    mapMutations  
	} from 'vuex'; 
	export default {
		data() {
			return {
				city:'定位中',
				bigId: 1,
				bannerImg: [],
				tabIndex: 0,
				tabClasslist: [],
				// 航栏板块
				navlist: [
					{ id: 1, name: '分类',url:'/pages/index/cate', img: 'https://www.fhlego.com/static/2.png' },
					{ id: 2, name: '邀请',url:'/pages/member/invite', img: 'https://www.fhlego.com/static/3.png' },
					{ id: 3, name: '扫码',url:'/pages/index/scan', img: 'https://www.fhlego.com/static/6.png' },
					{ id: 4, name: '签到',url:'/pages/member/signin', img: 'https://www.fhlego.com/static/1.png' },
					{ id: 5, name: '帮助',url:'/pages/index/news', img: 'https://www.fhlego.com/static/5.png' }
				],
				pgList:[],
				storelist: [],
				page: 1,
				loadingType: 0,
				contentText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				mapinfo:[],
				p_page:0,
				has_agent:true
			}
		},	
		components: {uniRate},
        computed: mapState(['Location']), 
		onLoad() {
			var _this = this;
			_this.tabClasslist = [{sc_name: '首页',sc_id: '0'},{sc_name: '分类',sc_id: '-1'}];
			_this.$Request.post('index').then(res => {
				if (res.code == 200) {
					console.log(res);
					//_this.pgList = res.datas.pglist;
					_this.bannerImg = res.datas.aplist;
					if(res.datas.sc_list){
						for (let i = 0; i < res.datas.sc_list.length;i++) {
							_this.tabClasslist.push(res.datas.sc_list[i]);
						}
					}
					console.log(_this.tabClasslist);
				}
			});
			console.log(this.Location);
			if(JSON.stringify(this.Location) !== "{}") {　　　　　　　　
				console.log('==Location not null===');
				
				this.mapinfo =this.Location;
				this.city = this.Location.city_name;
				if( this.Location.has_agent==1){
					this.has_agent=true;
				}else{
					_this.has_agent=false;
				}
				this.loadData();
			}else{
				this.locationMap();
			}
			//this.loadData();
		},
		onShow(e) {
             console.log('页面显示..');
         },
		methods: {
			...mapMutations(['setLocation']),
			async loadData() {
				var _this = this;
				/* _this.$Request.post('index').then(res => {
					if (res.code == 200) {
						console.log(res);
						//_this.pgList = res.datas.pglist;
						_this.bannerImg = res.datas.aplist;
						if(res.datas.sc_list){
							for (let i = 0; i < res.datas.sc_list.length;i++) {
								_this.tabClasslist.push(res.datas.sc_list[i]);
							}
						}
						console.log(_this.tabClasslist);
					}
				}); */
				this.storelist =[];
				this.reflist();
				console.log('---------------mapinfo-----');
				console.log(this.mapinfo);
				this.$Request.post('shop/shop_list',{page:10,curpage:this.page,lat:this.mapinfo.lat,lng:this.mapinfo.lng,adcode:this.mapinfo.adcode,city_id:this.mapinfo.city_id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.storelist = res.datas.store_list;
						
					}
				});
				
			},
			locationMap(){
				var _this = this;
				this.amapPlugin = new amap.AMapWX({
					//高德地图KEY，参考：http://ask.dcloud.net.cn/article/35070
					key: '57796d182a0849a4bff2b46fd6088ed3'
				});
				//定位地址
				_this.amapPlugin.getRegeo({
					success: data => {
						//_this.mapinfo={lat:data[0].latitude,lng:data[0].longitude,adcode:data[0].regeocodeData.addressComponent.adcode};
						console.log('-----amap---------');
						console.log(data);
						_this.$Request.post('area/getareainfo',{adcode:data[0].regeocodeData.addressComponent.adcode}).then(res => {
							if (res.code == 200) {
								console.log(res);
								//this.login(res.datas);
								_this.city = res.datas.areainfo.area_name;
								let _location={lat:data[0].latitude,lng:data[0].longitude,city_id:res.datas.areainfo.area_id,city_name:res.datas.areainfo.shortname,has_agent:res.datas.has_agent};
								_this.setLocation(_location);
								this.mapinfo = _location;
								if(res.datas.has_agent==1){
									_this.has_agent=true;
								}else{
									_this.has_agent=false;
								}
							}
							_this.loadData();
						});
						//_this.city = data[0].regeocodeData.addressComponent.city.replace(/市/g, ''); //把"市"去掉
						
					}
				});
			},
			swiperChange(e) {
				//this.bigId = e.detail.current
			},
			toSearch:function(){
				uni.navigateTo({
					url:"/pages/search/search"
				})
			},
			toCity:function(){
				uni.navigateTo({
					url:"/pages/index/city"
				})
			},
			toStore: function(store_id) {
				uni.navigateTo({
					//url:"/pages/member/login",
					url:"/pages/store/index?store_id="+store_id,
				})
			},
			toCategory(url){
				uni.navigateTo({
					url:url
				})
			},
			toUrl(url){
				uni.switchTab({
					url: url
				});
			},
			toPage(id){
				uni.navigateTo({
					url:'/pages/member/points/pinfo?id='+id
				})
			},
			tapTab(cateid){
				uni.navigateTo({
					url:'cate?id='+cateid
				})
			},
			reflist(){
				var _this = this;
				_this.pgList = [];
				_this.p_page++;
				_this.$Request.post('index/pglist',{curpage:this.p_page,cityid:this.mapinfo.city_id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						if(res.datas.pglist.length>0){
							_this.pgList = res.datas.pglist;
						}
					}
				});
			}
		}
	}
</script>

<style  lang="scss">
	page{position: relative;background-color:#f5f5f5;}
	@font-face {
		font-family: 'HMfont-home';
		src: url('data:application/x-font-woff2;charset=utf-8;base64,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')
			format('woff2');
	}
	.icon {
		font-family: 'HMfont-home' !important;
		font-size:24upx;
		font-style: normal;
		color: #fff;
		&.yuyin {
			&:before {
				content: '\e64e';
			}
		}
		&.tongzhi {
			&:before {
				content: '\e729';
			}
		}
		&.search {
			&:before {
				content: '\e628';
			}
		}
		&.xia {
			&:before {
				content: '\e689';
			}
		}
	}
	.pullDown-effects{
		position: fixed;
		top: 0;
		z-index: 9;
		width: 100%;
		height: 36vw;
		image{
			width: 100%;
			height: 36vw;
		}
	}
	.status {
		width: 100%;
		height: 0;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		top: 0;
	}
	.header {
		width:92%;
		padding:0 4%;
		height: 100upx;
		display: flex;
		align-items:center;
		justify-content:space-between;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #FFF;
		.input-box {
			width:65%;
			height: 60upx;
			background-color: #f5f5f5;
			border-radius: 30upx;
			margin-left:16upx;
			position: relative;
			display: flex;
			align-items: center;
			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				padding: 0;
				top: 0;
				right: 0;
				width: 60upx;
				height: 60upx;
				font-size: 34upx;
				color: #c0c0c0;
			}
			input {
				padding-left: 28upx;
				height: 28upx;
				font-size: 28upx;
			}
		}
		.icon-btn {
			width: 120upx;
			height: 60upx;
			flex-shrink: 0;
			display: flex;
			.icon {
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				font-size: 42upx;
			}
		}
	}
	
	.place {
		background-color: #ffffff;
		height:100upx;
	}
	
//<!-- 轮播图开始 -->
	.swiper {
		width: 100%;
		margin-top: 8px;
		height: 32.7vw;
		.swiper-item {
			border-radius: 14upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-left: 10px;
			margin-right: 10px;
		}
		.big {
			margin-top: 0;
			.img {
				border-radius:14upx;
				width: 100%;
				height: 30.5vw;
			}
		}
		.small {
			margin-top: 1vw;
			height: 28vw;
			 transition: all 0.3s;
			.img {
				border-radius:14upx;
				width: 100%;
				height: 30.7vw;
			}
		}
	}
//<!-- 轮播图结束 -->
	
	//tab_store_class
	.uni-swiper-tab {
		border-bottom: none;
		line-height:105upx;
		height:105upx;
	}
	.swiper-tab-list {
		width: auto;
		padding:0 2vw 0;
		color:#A6A6A6;
		position: relative;
		line-height:68upx;
	}
	.uni-tab-bar .active {
		font-weight: 600;
		color: #333;
		font-size: 4vw;
	}
	.uni-tab-bar .swiper-tab-list:after {
		content: '';
		width: 0;
		height: 0;
		border-bottom:8upx solid #00BAAD;
		position: absolute;
		left: 50%;
		bottom: 0;
		-webkit-transform: translateX(-50%);
		-ms-transform: translateX(-50%);
		transform: translateX(-50%);
		-webkit-transition: .3s;
		-o-transition: .3s;
		transition: .3s;
	}
	.uni-tab-bar .active:after {
		width: 50%;
	}
	
	//导航栏板块
	.nav-list {
		width: 92%;
		margin: 0 auto 20upx;
		padding:30upx 0;
		display:flex;
		justify-content: space-between;
		align-items:center;
		.nav {
			width: 20%;
			.img {
				width: 100%;
				display: flex;
				justify-content: center;
				image {
					width: 9vw;
					height: 9vw;
				}
			}
			.text {
				width: 100%;
				display: flex;
				justify-content: center;
				font-size:28upx;
				color: #3c3c3c;
			}
		}
	}
	
	/* 会员福利 积分兑换 */
	.seckill-section{
		padding: 4upx 30upx 24upx;
		background: #fff;
		.s-header{
			display:flex;
			align-items:center;
			height: 92upx;
			line-height: 1;
			margin-bottom: 10upx;
			.title{
				font-weight:bold;
				color: #333;
				margin-right: 20upx;
				border-bottom: 0.5vw solid #00BAAD;
			}
			.other{
				display:inline-block;
				width: 140upx;
				height: 36upx;
				text-align:center;
				line-height: 36upx;
				margin-right: 14upx;
				font-size: 3vw;
				color: #909399;
			}
			.more{
				font-size: 3vw;
				color: #909399;
				flex:1;
				text-align:right;
			}
		}
		.floor-list{
			white-space: nowrap;
		}
		.scoll-wrapper{
			display:flex;
			align-items: flex-start;
		}
		.floor-item{
			width: 206upx;
			margin-right: 20upx;
			font-size: 26upx;
			color: #333333;
			line-height: 1.8;
			image{
				width:206upx;
				height:206upx;
				border-radius: 6upx;
			}
			.title{
				width:100%;
				color: #333333;
				line-height:32upx;
				margin-bottom: 8upx;
			}
			.price{
				font-weight:bold;
				color: #00BAAD;
				line-height:38upx;
				display:flex;
				align-items:center;
			 .icon{
				width:32upx;
				height:32upx;
				background: url('https://www.fhlego.com/static/point_ico.png') center no-repeat;
				background-size:100%;
				float: left;
				}
			}
			.duihuan{
				width: 100%;
				color: #999;
				font-size:24upx;
				line-height:38upx;
			}
		}
	}
	//
	/* 猜你喜欢 */
	.guesslike-section{
		padding: 4upx 30upx 24upx;
		.s-header{
			display:flex;
			align-items:center;
			height: 92upx;
			line-height: 1;
			.title{
				font-weight:bold;
				color: #333;
				margin-right: 20upx;
				border-bottom: 0.5vw solid #00BAAD;
			}
			.other{
				display:inline-block;
				width: 140upx;
				height: 36upx;
				text-align:center;
				line-height: 36upx;
				margin-right: 14upx;
				font-size: 3.6vw;
				color: #999999;
			}
			.more{
				font-size: 3.6vw;
				color: #909399;
				flex: 1;
				text-align: right;
			}
			.more::before{
				content: "\E606";
			}
		}
	}
	



</style>
