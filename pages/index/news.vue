<template>
	<view class="uni-tab-bar">
		<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
			<view v-for="(tab,index) in tabBars" :key="tab.ac_id" :class="['swiper-tab-list',tabIndex==tab.ac_id ? 'active' : '']" :id="tab.ac_id"
			 :data-current="tab.ac_id" @click="tapTab(tab.ac_id)">{{tab.ac_name}}</view>
		</scroll-view>
		
		<view class="s-row">
			<view class="s-col is-col-24">
				<view class="s-list has-mgt-0">
					<view class="is-item " v-for="(item,index) in newsitems" :key="index" @tap="goDetail(item)">
						<view class="is-item-bd is-block is-oneline" >
							<view class="news"><view class="icon"></view>{{item.article_title}}</view>
						</view>
					</view>
		
				</view>
			</view>
		</view>
		
	</view>
</template>
<script>
	
	export default {
		data() {
			return {
				loadingText: {
					contentdown: "上拉显示更多",
					contentrefresh: "正在加载...",
					contentnomore: "没有更多数据了"
				},
				scrollLeft: 0,
				isClickChange: false,
				tabIndex: 0,
				newsitems: [],
				tabBars: []
			}
		},
		onLoad: function() {
			var _this = this;
			_this.$Request.post('article').then(res => {
				if (res.code == 200) {
					console.log(res);
					_this.tabBars = res.datas.article_class;
					_this.newsitems = res.datas.list;
					_this.tabIndex = res.datas.index_id;
				}
			});
		},
		methods: {
			goDetail(e) {
				uni.navigateTo({
					url: '/pages/index/newsdetail?aid=' + e.article_id
				})
			},
			
			async changeTab(e) {
				console.log(e);
			},
			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select('#' + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				});
			},
			async tapTab(index) { 
				let _this = this;
				if (this.tabIndex === index) {
					return false;
				} else {
					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft
					this.scrollLeft = tabBarScrollLeft;
					this.isClickChange = true;
					this.tabIndex = index;
					_this.$Request.post('article/article_list',{ac_id:index}).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.newsitems = res.datas.article_list;
						}
					});
				}
			}
		}
	}
</script>

<style>
	.s-row {
		position: relative;
		margin-left: 0;
		margin-right: 0;
		height: auto;
		zoom: 1;
		display: block;
	}
	
	.s-row::after,
	.s-row::before {
		content: "";
		display: table;
	}
	
	.s-row::after {
		clear: both;
		visibility: hidden;
		font-size: 0;
		height: 0;
	}
	.s-col {
		flex-direction: column;
	}
	.is-col-24 {
		float: left;
		-webkit-box-flex: 0;
		-ms-flex: 0 0 auto;
		flex: 0 0 auto;
	}
	.is-col-24 {
		display: block;
		width: 100%;
	}
	.s-list {
		margin-top: 40rpx;
		background-color: #fff;
		line-height: 1.5;
		font-size: 32rpx;
		overflow: hidden;
		position: relative;
	}
	
	.s-list:before {
		top: 0;
		border-top: 1px solid #dcdee2;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}
	
	.s-list:after,
	.s-list:before {
		content: " ";
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
		color: #dcdee2;
		z-index: 2;
	}
	
	.s-list:after {
		bottom: 0;
		border-bottom: 1px solid #dcdee2;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}
	.has-mgt-0 {
		margin-top: 0rpx !important;
	}
	
	.is-item {
		padding: 20rpx 30rpx;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		text-decoration: none;
		color: #353535;
		-webkit-tap-highlight-color: transparent;
	}
	
	.is-item:before {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1px solid #dcdee2;
		color: #dcdee2;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		left: 30rpx;
		z-index: 2;
	}
	
	.is-item:first-child:before,
	.is-item-line:first-child:before {
		display: none !important;
	}
	
	.is-item-bd {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
	}
</style>
