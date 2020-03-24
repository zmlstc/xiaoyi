<template>
	<view>
		<view class="rebate-bar b-line">
			<view class="item">
				<text :class="[showtype==0?'tab':'']" @tap="showtab(0)">全部</text>
				<text :class="[showtype==1?'tab':'']" @tap="showtab(1)">商家</text>
				<text :class="[showtype==2?'tab':'']" @tap="showtab(2)">会员</text>
			</view>
			<view class="item2">
				<text>累计佣金：</text>
				<text class="tab">{{tg_predepoit}}</text>
			</view>
		</view>
		<view class="action-bar b-line" style="background-color: #F5F5F5;">
			<view class="sc-bar w50 mc">
				<input type="text" value="" :placeholder="placeholder" class="sc_area" v-model="keyword" />
				<view class="sc_submit" @tap="submitSearch">搜 索</view>
			</view>
		</view>
		<view>
			<view class="date-opt">
				<button @click="onShowDatePicker('range')" class="datebutton">选择日期范围</button>
				<view class="range">{{range[0]}} 至 {{range[1]}}</view>
			</view>
			<mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'开始'" :end-text="'结束'"
			 :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
		</view>
		<view class="rebate-list" v-for="(item ,index) in datalist" :key="index">
			<view class="item">
				<view class="shop" v-if="item.lg_type=='store_invite'"></view>
				<view class="mement" v-if="item.lg_type=='member_invite'"></view>
				{{item.show_text}}
			</view>
			<view class="item2">{{item.lg_add_time_text}}</view>
			<view class="item3"><text>￥</text>{{item.lg_av_amount}}</view>
		</view>

		<view class="loading-text">{{ loadingText }}</view>
	</view>
</template>


<script>
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			MxDatePicker
		},
		data() {
			return {
				datalist: [],
				loadingText: '正在加载...',
				hasmore: true,
				curpage: 1,
				tg_predepoit: '',
				showtype: 0,
				placeholder: '输入商家/会员名称',
				keyword: '',
				showPicker: false,
				range: [new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)],
				type: 'rangedate',
				value: ''
			}
		},
		computed: mapState(['hasLogin', 'userInfo']),
		onLoad() {
			console.log('页面加载');
			this.$Request.post('member_index/my_asset', {
				fields: 'tg_predepoit'
			}).then(res => {
				if (res.code == 200) {
					console.log(res);
					this.tg_predepoit = res.datas.tg_predepoit;
				}
			});
			this.loadData();
		},
		onReachBottom() {
			console.log('正在加载中...');
			this.curpage++;
			this.loadData();
		},
		onPageScroll() {
			console.log('页面滚动...');
		},
		onPullDownRefresh() {
			console.log('上拉刷新...');
			uni.stopPullDownRefresh();
		},
		methods: {
			async loadData() {
				var _this = this;
				console.log('===userInfo===' + this.hasLogin);
				console.log(this.userInfo);
				console.log(this.userInfo.token);
				if (!this.hasLogin) {
					uni.navigateTo({
						url: 'login',
					})
				} else {
					if (!this.hasmore) {
						this.loadingText = '暂无更多信息';
						//return false;
					}
					let postData = {
						curpage: _this.curpage,
						type: _this.showtype
					};
					//if (_this.keyword != '') {
						postData = {
							curpage: _this.curpage,
							type: _this.showtype,
							keyword: _this.keyword,
							daterange: _this.value
						};
					//}
					_this.$Request.post('member_fund/tglist', postData).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.predepoit = res.datas.amount;
							_this.hasmore = res.hasmore;
							console.log(_this.hasmore);
							let _datalist = res.datas.list;
							_this.datalist = [];
							for (var i = 0; i < _datalist.length; i++) {
								_this.datalist.push(_datalist[i]);
							}
							if (!res.hasmore) {
								_this.loadingText = '暂无更多信息';
							}
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
				}
			},
			onShowDatePicker(type) { //显示
				this.type = type;
				console.log(type);
				this.showPicker = true;
				this.value = this[type];
			},
			onSelected(e) { //选择
				var _this = this;
				this.showPicker = false;
				if (e) {
					this[this.type] = e.value;
					this.value = e.value;
					//选择的值
					console.log('value => ' + e.value);
					//原始的Date对象
					console.log('date => ' + e.date);
				}
				//
				_this.loadData();
			},
			toPage: function(url) {
				uni.navigateTo({
					url: url,
				})
			},
			showtab(t) {
				this.showtype = t;
				if (t == 0) {
					this.placeholder = '输入商家/会员名称';
				} else if (t == 1) {
					this.placeholder = '输入商家名称';
				} else if (t == 2) {
					this.placeholder = '输入会员名称';
				}
				this.hasmore = true;
				this.loadingText = '正在加载...';
				this.datalist = [];
				this.keyword = '';
				this.loadData();
			},
			submitSearch: function() {
				console.log(this.keyword);
				this.hasmore = true;
				this.loadingText = '正在加载...';
				this.datalist = [];
				this.loadData();
			},

		}
	}
</script>
<style lang="scss">
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
</style>
