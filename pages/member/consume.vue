<template>
	<view>
		<view>
			<view class="date-opt">
				<button @click="onShowDatePicker('range')" class="datebutton">选择日期范围</button>
				<view class="range">{{range[0]}} 至 {{range[1]}}</view>
			</view>
			<mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'开始'" :end-text="'结束'"
			 :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
		</view>
		<view class="show-box mb2 row" v-for="(item ,index) in conslist" :key="index">
			<!-- 删除按钮 -->
			<view class="menu" @tap.stop="deleteOrder(item.order_id)">
				<view class="icon shanchu"></view>
			</view>
			<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)"
			 @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
				<view class="box-left" @tap="toStore(item.store_id)">
					<view class="image" :style="{'background':'url('+item.store_avatar+')','background-size':'100%'}"></view>
					<view class="text-box ml5">
						<view class="title">{{item.store_name}}</view>
						<view class="shop-info">
							<view class="place"></view>
							<text class="clip">{{item.map_address}}</text>
						</view>
						<view class="deal mt5">￥<text>{{item.order_amount}}</text>{{item.payment_name}}</view>
					</view>
					<view class="remind mt5" v-if="item.pay_comment"><text>备注：{{item.pay_comment}}</text></view>
				</view>
				<view class="box-right">
					<view class="date">{{item.date}}</view>
					<view class="date">{{item.time}}</view>
				</view>
			</view>
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
				conslist: [],
				loadingText: '正在加载...',
				hasmore: true,
				curpage: 1,
				//控制滑动效果
				theIndex: null,
				oldIndex: null,
				isStop: false,
				showPicker: false,
				range: [new Date().toISOString().slice(0, 10), new Date().toISOString().slice(0, 10)],
				type: 'rangedate',
				value: ''
			}
		},
		computed: mapState(['hasLogin', 'userInfo']),
		onLoad() {
			console.log('页面加载');
			this.loadData();
		},
		onReachBottom() {
			console.log('下拉加载...');
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
				if (!this.hasLogin) {
					uni.navigateTo({
						url: 'login',
					})
				} else {
					if (!this.hasmore) {
						this.loadingText = '暂无更多信息信息';
						//return false;
					}
					_this.$Request.post('member_order/orderlist', {
						curpage: _this.curpage,
						daterange:_this.value
					}).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.hasmore = res.hasmore;
							console.log(_this.hasmore);
							let _conslist = res.datas.order_list;
							_this.conslist = [];
							for (var i = 0; i < _conslist.length; i++) {
								_this.conslist.push(_conslist[i]);
							}
							if (!this.hasmore) {
								this.loadingText = '暂无更多信息信息';
								//return false;
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
				_this.loadData();
			},
			toPage: function(url) {
				uni.navigateTo({
					url: url,
				})
			},
			toStore: function(id) {
				uni.navigateTo({
					url: '/pages/store/index?store_id=' + id,
				})
			},
			//控制左滑删除效果-begin
			touchStart(index, event) {
				console.log('====touchStart====');
				//多点触控不触发
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
			},
			touchMove(index, event) {
				console.log('====touchMove====');
				//多点触控不触发
				if (event.touches.length > 1) {
					this.isStop = true;
					return;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];

				if (this.isStop || Math.abs(moveX) < 5) {
					return;
				}
				if (Math.abs(moveY) > Math.abs(moveX)) {
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}

				if (moveX < 0) {
					this.theIndex = index;
					this.isStop = true;
				} else if (moveX > 0) {
					if (this.theIndex != null && this.oldIndex == this.theIndex) {
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(() => {
							this.oldIndex = null;
						}, 150)
					}
				}
			},
			touchEnd(index, $event) {
				console.log('====touchEnd====');
				//结束禁止触发效果
				this.isStop = false;
			},
			//控制左滑删除效果-end
			deleteOrder(orderid) {
				var _this = this;
				console.log('====deleteOrder====');
				_this.$Request.post('member_order/orderdelete', {
					orderid: orderid
				}).then(res => {
					if (res.code == 200) {
						console.log(res);
						let len = _this.conslist.length;
						for (let i = 0; i < len; i++) {
							if (orderid == _this.conslist[i].order_id) {
								_this.conslist.splice(i, 1);
								break;
							}
						}
						/* this.selectedList.splice(this.selectedList.indexOf(orderid), 1);
						this.sum(); */
						_this.oldIndex = null;
						_this.theIndex = null;
					} else {
						uni.showToast({
							icon: 'none',
							title: res.datas.error,
							duration: 2000
						});
					}
				});

			}

		}
	}
</script>
<style lang="scss">
	page {
		position: relative;
		background: #F5F5F5
	}

	@font-face {
		font-family: "HMfont-home";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAOEAAsAAAAAB7wAAAM1AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqDAIJNATYCJAMQCwoABCAFhG0HPhu1BsiOw7jha84s8T+CgOyq6unevTlAeAkRhAhQBjj8eJfmMg/oB5whSgaFspy7AqbpwE3Py3/j9j+X07uGyFHr21lua9HYi9rUCzDeGtBYmw4o0AJJ0BvGLmiJxyEAC3yIQhSVPL9BF4U5TgBi7ChtQzfjQKFYWEdgrFiqEBsxoGurtMfAhuD74g8JQgcNg8ScWjf8xoPz7/nfD8iFpoV0eQi86XQAWwUSiAIUiJGVhgEaUSAKiYXau0kKoKOjwVRthd8PmExIBRvmWH95INCQIIyYqVYAJKGghO/5Dg4B3wtxaPD9QAoS4IOM1gEzYBbAMkT16iIQGPxsopS5ScAcK23LiaBDpzyk1aGLHtsvhVrL7adDD55016wPXnDfcr7T3lcE2TVcP2fNhZM7WeiEhVp44vx9C5vVD6+eEgaLTZvEot3HL1lawlnXLK3XnISDllbWwmrmGjlRLdxq2bpme1RAeqXtzWh6g0F//wCCnRiN2diwr2+Yse3iEs20g05Q5tT0BikOXwKf79vsoEvb6p6xjVhHP92nwDJmX+9hwsf26dXbPiNvZ/98x67/+5T+ev0aWxbXCwOX41zLxia+O73B6Y57fN1u6GvN+Zmbc8XITigTAcB0Rl6X8QB4hDgEpoXypZz2q37D5FVnVa9t1n/dUgHw8uKMq9BmWqjoJoP3zevM+zG8jmVKE5hKpRShw9WTFZW04D7TscAC+B0RcOD9FHLnzqkg0HFOQMMMb5DoBKGKGgUGLEkCIzq5YEEkpastcWQyDYQyByJYBkBgx2nQsOEaSOx4girqOzDgwj8wYickWNAiHLe0JESMsiicTLaQh84PBm6WKlst/TD9hXQV25wWBLQP4jJw435MXD58RynxFDPKT30golBxluAtOI3iOMOcs5Bc2fFF8sPd2OFVBO24WQJ9CmEIG4HwQAb4ARmFS0aK8qoL/cLnXyA0FTE23FBSZf+AYEqCzpF4YojrgN5J004lt/LKFD7RHDAVQYEMh8lIQErAICImJgOZWD0ohHARdhg5wJdzSKxVaXhX6c7y8uQN1wAWmLOU0IQUShiQo0fZTceadqaMdP2uXwEAAAAA') format('woff2');
	}

	.icon {
		font-family: "HMfont-home" !important;
		font-size: 40upx;
		font-style: normal;
		color: #000000;

		&.shanchu {
			&:before {
				content: "\e6a4";
			}
		}

	}

	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
		z-index: 4;
		border: 0;

		.menu {
			.icon {
				color: #fff;
			}
			position: absolute;
			width: 20%;
			height: 100%;
			right: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #00BAAD;
			color: #fff;
			z-index: 2;
		}

		.carrier {
			@keyframes showMenu {
				0% {
					transform: translateX(0);
				}

				100% {
					transform: translateX(-20%);
				}
			}
			@keyframes closeMenu {
				0% {
					transform: translateX(-20%);
				}

				100% {
					transform: translateX(0);
				}
			}

			&.open {
				animation: showMenu 0.25s linear both;
			}

			&.close {
				animation: closeMenu 0.15s linear both;
			}

			background-color: #fff;
			position: absolute;
			width:94%;
			padding:0 3%;
			height:100%;
			z-index:9;
			left:0;
			display: flex;
			align-items: center;
		}
	}
</style>
