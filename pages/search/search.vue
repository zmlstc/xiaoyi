<template>
	<view>
		<view class="search-box">
			<!-- searchInput组件 如果使用原样式，删除组件元素-->
			<!--searchInput :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(false)" @input="inputChange"
			 @confirm="doSearch(false)" v-model="keyword"></searchInput-->
			<!-- 原样式 如果使用原样式，恢复下方注销代码 -->
			<view class="input-box">
				<input type="text" :placeholder="defaultKeyword" @input="inputChange" placeholder-class="pl-class" v-model="keyword" @confirm="doSearch(false)" confirm-type="search">
				<view class="search-btn" @tap="doSearch(false)">搜索</view>
			</view>
			<!-- 原样式 end -->
		</view>
		<view class="goods-list" v-show="isShowStoreList" v-if="storelist.length > 0">
			<view class="coupon-page s-row" v-for="(item,index) in storelist" :key="index" @tap="toStore(item.store_id)">
				<image :src="item.store_avatar"></image>
				<view class="content">
					<view class="title s-row"><text class="clip">{{item.store_name}}</text><text class="distance">{{item.distance}}km</text></view>
					<view class="num s-row">
						<view class="start">
							<uni-rate :disabled="true" :size="14" :margin="5" :value="item.scores" isShowNum="true"></uni-rate>
						</view>
						<view class="xiaofei s-row"><text>{{item.consume_num}}</text>人消费</view>
					</view>
					<view class="consume">
						<view class="zhekou">
							<view class="tmprice clip" v-if="item.voucher!=''">
								<view class="icon"></view>{{item.voucher}}
							</view>
							<view class="tmprice clip" v-if="item.voucher2!=''">
								<view class="icon"></view>{{item.voucher2}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="search-keyword" @touchstart="blur">
			<scroll-view class="keyword-list-box" v-show="isShowKeywordList" scroll-y>
				<view class="keyword-entry" hover-class="keyword-entry-tap" v-for="row in keywordList" :key="row.keyword">
					<view class="keyword-text" @tap="doSearch(row.keyword)">
						<rich-text :nodes="row.htmlStr"></rich-text>
					</view>
					<view class="keyword-img" @tap="setkeyword(row)">
						<image src="https://www.fhlego.com/static/search/back.png"></image>
					</view>
				</view>
			</scroll-view>
			<scroll-view class="keyword-box" v-show="!isShowKeywordList" scroll-y>
				<view class="keyword-block" v-if="oldKeywordList.length>0">
					<view class="keyword-list-header">
						<view>历史搜索</view>
						<view>
							<image @tap="oldDelete" src="https://www.fhlego.com/static/search/delete.png"></image>
						</view>
					</view>
					<view class="keyword">
						<view v-for="key in oldKeywordList" @tap="doSearch(key)" :key="key">{{key}}</view>
					</view>
				</view>
				<view class="keyword-block">
					<view class="keyword-list-header">
						<view>热门搜索</view>
						<view>
							<image @tap="hotToggle" :src="'https://www.fhlego.com/static/search/eyes'+forbid+'.png'"></image>
						</view>
					</view>
					<view class="keyword" v-if="forbid==''">
						<view v-for="key in hotKeywordList" @tap="doSearch(key)" :key="key">{{key}}</view>
					</view>
					<view class="hide-hot-tis" v-else>
						<view>当前搜热门搜索已隐藏</view>
					</view>
				</view>

			</scroll-view>
		</view>
	</view>

</template>

<script>
	//引用mSearch组件，如不需要删除即可
	import searchInput from '@/components/search-input/search.vue';
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
				mapinfo:[],
				defaultKeyword: "",
				keyword: '',
				storelist: [],
				oldKeywordList: [],
				hotKeywordList: [],
				keywordList: [],
				forbid: '',
				isShowKeywordList: false,
				isShowStoreList:false
			}
		},
		onLoad() {
			this.init();
			this.loadData();
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
		},
		components: {
			//引用searchInput组件，如不需要删除即可
			searchInput,
			uniRate
		},
		computed: mapState(['Location']),
		methods: {
			...mapMutations(['setLocation']),
			async loadData() {
				var _this = this;
				console.log(this.mapinfo);
				// uni.request({
				// 	url: 'https://www.fhlego.com/api/mobile/index.php/shop/shop_list?keyword=' + _this.keyword, //仅为示例
				// 	data:{
				// 		lat:this.mapinfo.lat,
				// 		lng:this.mapinfo.lng,
				// 		adcode:this.mapinfo.adcode
				// 	},
				// 	success: (res) => {
				// 		console.log(res.data.datas.store_list)
				// 		_this.storelist = [];
				// 		_this.storelist = res.data.datas.store_list;
				// 		//this.keywordList = this.drawCorrelativeKeyword(res.data.result, keyword);
				// 	}
				// });
				console.log(this.mapinfo);
				this.$Request.post('shop/shop_list?keyword=' + _this.keyword,{page:10,curpage:this.page,lat:this.mapinfo.lat,lng:this.mapinfo.lng,adcode:this.mapinfo.adcode,city_id:this.mapinfo.city_id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.storelist = res.datas.store_list;
						
					}
				});
				console.log(this.storelist)
			},
			init() {
				this.loadDefaultKeyword();
				this.loadOldKeyword();
				this.loadHotKeyword();

			},
			blur() {
				uni.hideKeyboard()
			},
			//加载默认搜索关键字
			loadDefaultKeyword() {
				//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
				this.defaultKeyword = "默认关键字";
			},
			//加载历史搜索,自动读取本地Storage
			loadOldKeyword() {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
			},
			//加载热门搜索
			loadHotKeyword() {
				//定义热门搜索关键字，可以自己实现ajax请求数据再赋值
				this.hotKeywordList = ['键盘', '鼠标', '显示器', '电脑主机', '蓝牙音箱', '笔记本电脑', '鼠标垫', 'USB', 'USB3.0'];
			},
			//监听输入
			inputChange(event) {
				var _this = this;
				//兼容引入组件时传入参数情况
				var keyword = event.detail ? event.detail.value : event;
				_this.keyword = keyword;
				console.log(_this.keyword)
				if(keyword) {
					this.isShowStoreList = true;
					this.isShowKeywordList = true;
				} else {
					this.isShowStoreList = false;
					this.keywordList = [];
					this.isShowKeywordList = false;
				}
				
				
				//this.isShowKeywordList = true;
				//以下示例截取淘宝的关键字，请替换成你的接口
				// uni.request({
				// 	url: 'https://www.fhlego.com/api/mobile/index.php/shop/shop_list?code=utf-8&keyword=' + keyword, //仅为示例
				// 	success: (res) => {
				// 		console.log(res.data.datas.store_list)
				// 		_this.storelist = res.data.datas.store_list;
				// 		_this.loadData();
				// 		//this.keywordList = this.drawCorrelativeKeyword(res.data.result, keyword);
				// 	}
				// });
				_this.loadData()

			},
			//高亮关键字
			drawCorrelativeKeyword(keywords, keyword) {
				var len = keywords.length,
					keywordArr = [];
				for (var i = 0; i < len; i++) {
					var row = keywords[i];
					//定义高亮#9f9f9f
					var html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + "</span>");
					html = '<div>' + html + '</div>';
					var tmpObj = {
						keyword: row[0],
						htmlStr: html
					};
					keywordArr.push(tmpObj)
				}
				return keywordArr;
			},
			//顶置关键字
			setkeyword(data) {
				this.keyword = data.keyword;
			},
			//清除历史搜索
			oldDelete() {
				uni.showModal({
					content: '确定清除历史搜索记录？',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.oldKeywordList = [];
							uni.removeStorage({
								key: 'OldKeys'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//热门搜索开关
			hotToggle() {
				this.forbid = this.forbid ? '' : '_close';
			},
			//执行搜索
			doSearch(key) {
				key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
				this.keyword = key;
				this.saveKeyword(key); //保存为历史 
				// uni.showToast({
				// 	title: key,
				// 	icon: 'none',
				// 	duration: 2000
				// });
				if(key) {
					this.isShowStoreList = true;
					this.isShowKeywordList = true;
				} else {
					this.isShowStoreList = false;
					this.keywordList = [];
					this.isShowKeywordList = false;
				}
				this.loadData()
				//以下是示例跳转淘宝搜索，可自己实现搜索逻辑
			},
			toStore: function(store_id) {
				uni.navigateTo({
					//url:"/pages/member/login",
					url:"/pages/store/index?store_id="+store_id,
				})
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
			//保存关键字到历史记录
			saveKeyword(keyword) {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						console.log(res.data);
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
			}
		}
	}
</script>
<style>
	.search-box {
		margin:0 auto;
		width:60%;
		background-color: rgb(242, 242, 242);
		padding: 7.5px 2.5%;
		display: flex;
		justify-content: space-between;
	}

	.search-box .input-box {
		width: 85%;
		flex-shrink:1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.search-box .input-box .search-btn {
		width: 15%;
		height:30px;
		line-height:30px;
		position:absolute;
		z-index:9;
		flex-shrink: 0;
		text-align: center;
		right:12%;
		font-size: 14px;
		color: #fff;
		background:#00BAAD;
		border-radius:30px;
	}

	.search-box .input-box>input {
		width: 100%;
		height: 30px;
		font-size:14px;
		border: 0;
		border-radius:30px;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		padding: 0 3%;
		margin: 0;
		background-color: #ffffff;
	}

	.placeholder-class {
		color: #9e9e9e;
	}

	.search-keyword {
		width: 100%;
		background-color: rgb(242, 242, 242);
	}

	.keyword-list-box {
		height: calc(100vh - 55px);
		padding-top: 5px;
		border-radius: 10px 10px 0 0;
		background-color: #fff;
	}

	.keyword-entry-tap {
		background-color: #eee;
	}

	.keyword-entry {
		width: 94%;
		height: 40px;
		margin: 0 3%;
		font-size: 15px;
		color: #333;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: solid 1px #e7e7e7;
	}

	.keyword-entry image {
		width: 30px;
		height: 30px;
	}

	.keyword-entry .keyword-text,
	.keyword-entry .keyword-img {
		height: 40px;
		display: flex;
		align-items: center;
	}

	.keyword-entry .keyword-text {
		width: 90%;
	}

	.keyword-entry .keyword-img {
		width: 10%;
		justify-content: center;
	}

	.keyword-box {
		height: calc(100vh - 55px);
		border-radius: 10px 10px 0 0;
		background-color: #fff;
	}

	.keyword-box .keyword-block {
		padding: 5px 0;
	}

	.keyword-box .keyword-block .keyword-list-header {
		width: 94%;
		padding: 5px 3%;
		font-size: 13.5px;
		color: #333;
		display: flex;
		justify-content: space-between;
	}

	.keyword-box .keyword-block .keyword-list-header image {
		width: 20px;
		height: 20px;
	}

	.keyword-box .keyword-block .keyword {
		width: 94%;
		padding: 3px 3%;
		display: flex;
		flex-flow: wrap;
		justify-content: flex-start;
	}

	.keyword-box .keyword-block .hide-hot-tis {
		display: flex;
		justify-content: center;
		font-size: 14px;
		color: #6b6b6b;
	}

	.keyword-box .keyword-block .keyword>view {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 30px;
		padding: 0 10px;
		margin: 5px 10px 5px 0;
		height: 30px;
		font-size: 14px;
		background-color: rgb(242, 242, 242);
		color: #6b6b6b;
	}
</style>
