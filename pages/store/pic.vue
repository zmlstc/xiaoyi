<template>
	<view>
		<!-- 使用首页分类的样式,调用商家图片管理的分类 -->
		<view class="uni-tab-bar"> 
			<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x >
				<view v-for="(tab,index) in tabClasslist" :key="tab.ac_id" :class="['swiper-tab-list',tabIndex==tab.ac_id ? 'active' : '']" :id="tab.ac_id"
				 :data-current="index" @click="tapTab(tab.ac_id)">{{tab.ac_name}}</view>
			</scroll-view>
		</view>
		<!--end-->
		<view class="photolist mc">
			<view class="photo" v-for="(item,index) in pic_list">
				<image :src="item.ap_cover" mode="widthFix" class="photoimg mc" :data-src="item.ap_cover" @tap="previewImage"></image>
			</view>
		</view>
		<!--end-->
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
				store_id:'',
				storeInfo:{'eval_num':0,'eval_manyi':0},
				evaList:[],
				fav:false,
				maskState: 0, //优惠券面板显示状态
				couponList: [],
				tabIndex: 0,
				seval_scores:-1,
				tabClasslist:[],
				pic_list_id:'',
				pic_list:[],
				preview_list:[]
			};
		},
		components: {uniRate},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad(e){
			this.store_id=e.store_id;
			var _this = this;
			
			_this.$Request.post('store/store_info',{store_id:_this.store_id}).then(res => {
				if (res.code == 200) {
					console.log(res);
					_this.storeInfo=res.datas.store_info;
					//_this.tabClasslist = res.datas.store_info.plist;
					let _tabClasslist = res.datas.store_info.plist;
					_this.tabClasslist = [];
					for(var i in _tabClasslist ) {
						_this.tabClasslist.push(_tabClasslist[i]);
					}
					console.log(_this.tabClasslist[0]['ac_id']);
					_this.pic_list_id = _this.tabClasslist[0]['ac_id'];
					this.tabIndex=_this.pic_list_id;
					
					_this.$Request.post('store/album_pic_list', {id:_this.pic_list_id,store_id:_this.store_id}).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.pic_list = res.datas.pic_list;
							_this.preview_list = [];
							for (let i = 0; i < _this.pic_list.length;i++) {
								_this.preview_list.push(_this.pic_list[i]['ap_cover']);
							}
							console.log(_this.pic_list)
						} else {
							uni.showToast({
								icon: 'none',
								title: res.datas.error,
								duration: 2000
							});
							uni.navigateTo({
								url: 'login',
							});
						}
					});
					//console.log(_this.tabClasslist);
					//console.log(_tabClasslist);
					//console.log(_this.pic_list_id);
					 uni.setNavigationBarTitle({
						title: _this.storeInfo.store_name
					}) 
				}
			});
			
			//this.loadData();
			console.log('onload');
			console.log(e);
			this.loaded = true;
		},
		methods:{
			loadData(){
				var _this = this;
				
				let postData = {
					id: _this.pic_list_id,
					store_id:_this.store_id
				}
				console.log(postData);
				_this.$Request.post('store/album_pic_list', postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.pic_list = res.datas.pic_list;
						_this.preview_list = [];
						for (let i = 0; i < _this.pic_list.length;i++) {
							_this.preview_list.push(_this.pic_list[i]['ap_cover']);
						}
						console.log(_this.pic_list)
					} else {
						uni.showToast({
							icon: 'none',
							title: res.datas.error,
							duration: 2000
						});
						uni.navigateTo({
							url: 'login',
						});
					}
				});
			},
			imageOnLoad(key,index){
				//this.$set(this.data[key][index], 'loaded', 'loaded');
			},
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src;
				uni.previewImage({
					current: current,
					urls: this.preview_list
				})
			},
			tapTab:function(id){
				console.log(id);
				this.pic_list_id = id;
				this.tabIndex=id;
				this.loadData();
			},
			stopPrevent(e){
				console.log('======stopPrevent=====');
				console.log(e);
			},		
		},
	}
</script>

<style lang="scss">
@import "../../static/css/set-photo.css";
@import "../../static/css/store.css";
	page{background: #f5f5f5;}
	//tab_store_class
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
		color: #555;
		font-size:32upx;
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
</style>

