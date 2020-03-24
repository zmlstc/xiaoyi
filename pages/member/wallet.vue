<template>
	<view>
	<view class="help">
		<view class="icon"></view>
		<text>帮助</text>
	</view>
	<view class="top-nav f-c">
			<view class="back2"  @tap="toBack"></view>
			<view class="title">我的钱包</view>
		</view>
		<view class="wallet-top mb20">
		<view class="place" style="height:200upx;"></view>
			<view class="w-box">
				<view class="item">
					<view class="title">账户余额<view class="icon"></view></view>
					<view class="cash">
						<view class="num" @tap="toPage('/pages/member/tx/tx')"><text>￥</text>{{predepoit}}</view>
						<view class="icon"></view>
					</view>
				</view>
				<view class="item2">
					<view class="today">
						<view class="title" v-if="percent > 0"><view class="h3">今日收入</view><view class="yoy up">{{percent}}%</view></view>
						<view class="title" v-if="percent < 0"><view class="h3">今日收入</view><view class="yoy down">{{percent}}%</view></view>
						<view class="title" v-if="percent == 0"><view class="h3">今日收入</view><view class="zero">+{{percent}}</view></view>
						<view class="num"><text>￥</text>{{tgtoday}}</view>
					</view>
					<view class="total" @tap="toPage('flstat')">
						<view class="title">累计收入</view>
						<view class="num"><text>￥</text>{{tg_predepoit}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="wallet-place"></view>
		<view class="wallet-list" v-for="(item ,index) in datalist":key="index">
			<view class="list b-line">
				<view class="item">
					<view class="info"><text>{{item.lg_desc}}</text></view>
					<view class="date">{{item.lg_add_time_text}}</view>
				</view>
				<view class="item2">
					<text v-if="item.lg_av_amount<0" style="color:#1E90FF;">{{item.lg_av_amount}}</text>
					<text v-if="item.lg_av_amount>0">{{item.lg_av_amount}}</text>
				</view>
			</view>
			
		</view>
		<view class="loading-text mt40">{{ loadingText }}</view>
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
				datalist:[],
				loadingText: '正在加载...',
				hasmore:true,
				curpage:1,
				predepoit:'',
				tg_predepoit:'',
				tgtoday:0,
				percent:0
			}				
		},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad() {
			console.log('页面加载');
			this.$Request.post('member_index/my_asset',{fields:'predepoit'}).then(res => {
			 	if (res.code == 200) {
			 		console.log(res);
					this.predepoit = res.datas.predepoit;
			 		this.tg_predepoit = res.datas.tg_predepoit;
			 	}
			 });
			 // 获取今日收入
			 this.$Request.post('member_fund/tgtoday').then(res => {
			  	if (res.code == 200) {
			  		console.log(res);
			  		this.tgtoday = res.datas.amount;
					this.percent = 0;
					console.log(this.percent)
			  	}
			  });
			this.loadData();
		},
         onReachBottom() {
             console.log('正在加载中...');
			 this.curpage++;
			 this.loadData();
         },
         onPageScroll(){
             console.log('页面滚动...');
         },
         onPullDownRefresh() {
             console.log('上拉刷新...');
             uni.stopPullDownRefresh();
         },
        methods: {   
            async loadData() {  
				var _this = this;
				console.log('===userInfo==='+this.hasLogin);
				console.log(this.userInfo);
				console.log(this.userInfo.token);
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					if(!this.hasmore){
						this.loadingText = '暂无更多信息';
						return false;
					}
					_this.$Request.post('member_fund/predepositlog',{curpage:_this.curpage}).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.hasmore =res.hasmore;
							if(!res.hasmore){
								_this.loadingText = '暂无更多信息';
							}
							let _datalist = res.datas.list;
							for(var i=0;i<_datalist.length;i++){
								_this.datalist.push(_datalist[i]);
							}
						}
						else{
							uni.showToast({
								icon: 'none',
								title:''+res.datas.error,
								duration:2000
							});
							uni.navigateTo({
								url:'login',
							});
						}
					});
				}
            },
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			toBack: function() {
				uni.switchTab({
					url:'/pages/member/home',
				})
			}
		},
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
	.zero {
		color: #2C405A;
		}
</style>

