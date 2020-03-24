<template>
	<view>
		<view class="column3 bf b-line">
			<view class="item">
				<view class="title">累计收入</view>
				<view class="num">￥<text>{{storeInfo.sell_amount}}</text></view>
			</view>
			<view class="item2">
				<view class="title">客户量：<text>{{storeInfo.membernum}}</text></view>
				<view class="title">订单数：<text>{{storeInfo.ordernum}}</text></view>
			</view>
		</view>
		<view class="stroe-column bf">
			<view class="item">
				<view class="icon mc"  @click="show('right')"></view>
				<uni-drawer :visible="showRigth" mode="right" @close="closeDrawer('right')">
					<view class="close sx-title b-line"  @click="hide">
						<view class="more"></view>筛选
					</view>
					<view class="sx-list mt10">
						按日期查询
					</view>
					<view class="sx-list-cell">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="sx-list-cell-db">
								<view class="sx-input">{{date}}</view>
								<view class="date"></view>	
							</view>
						</picker>
					</view>
				<view class="sx-btn mc mt20 mb20" @click="search1">查询</view>
				<view class="sx-list t-line mb10"></view>
				<view class="sx-list">按日期区间查询</view>
						<view class="sx-list-cell">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bDateChangeStart">
							<view class="sx-list-cell-db">
								<view class="sx-input">{{s_date}}</view>
								<view class="date"></view>
							</view>
						</picker>
						</view>
						<view class="sx-list-cell">
							<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bDateChangeEnd">
								<view class="sx-list-cell-db">
									<view class="sx-input">{{e_date}}</view>
									<view class="date"></view>
								</view>
							</picker>
						</view>
				<view class="sx-list mt20">
					<view class="sx-btn fl" @click="search2">查询</view>
					<view class="sx-btn fr" @click="clearSearch">清空筛选</view>
				</view>
				</uni-drawer>
			</view>
			<view style="width: 75%;padding:14upx 0;">
				<view class="sc-bar">
					<input type="text" value="" :placeholder="placeholder" class="sc_area" v-model="keyword"/>
					<view class="sc_submit" @tap="submitSearch">搜 索</view>
				</view>
			</view>
		</view>
		
		<view v-for="(item ,index) in datalist" :key="index" class="sale-list bf mt5">
				<view class="item">
					<view class="num"><text>No.</text>{{item.order_sn}}</view>
					<view class="date">
						<view class="icon"></view>
						<text class="ml5">{{item.mothday}}</text><text class="ml5">{{item.hourmin}}</text>
					</view>
				</view>
				<view class="item2">
					<view class="left">
						<view class="name">
							<image class="icon" :src="item.member_avatar_url"></image>
							<text class="ml5">{{item.buyer_name}}</text>
						</view>
						<view class="pay">
						<view class="icon"></view>{{item.payment_name}}
						</view>
					</view>
					<view class="right">
						<view class="income"><text>￥</text>{{item.seller_money}}</view>
						<view class="expend"><text>佣金：</text>- {{item.yj_money}}</view>
					</view>
				</view>
				<view class="remind mt5" v-if="item.pay_comment"><text>备注：{{item.pay_comment}}</text></view>
		</view>

		<view class="loading-text">{{ loadingText }}</view>
	</view>
</template>

<script>  
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
    import {  
        mapState,  
        mapMutations  
    } from 'vuex';  
    export default {  
		data() {
			const currentDate = this.getDate({
				format: true
			});
			return {
				datalist:[],
				loadingText: '正在加载...',
				hasmore:true,
				curpage:1,
				storeInfo:[],
				showRigth: false,
				date:currentDate,
				s_date:currentDate,
				e_date:currentDate,
				searchType:0,
				placeholder: '输入订单号/会员名',
				keyword:''
			}				
		},
		components: {
			uniDrawer
		},
        computed: mapState(['sellerHasLogin']),  
		onLoad() {
			 console.log('页面加载');
			 this.$Request.post('seller_index/sellerstat',{fields:'predepoit'}).then(res => {
			  	if (res.code == 200) {
			  		console.log(res);
			  		this.storeInfo = res.datas.store_info;
			  	}
			  });
			this.loadData();
		},
		onShow() {
             console.log('页面显示..');
         },
         onReady(){
             console.log('页面初次显示');
         },
         onHide() {
             console.log('页面隐藏');
         },
         onUnload() {
             console.log('页面卸载');
         },
         onBackPress(){
             console.log('页面返回...');
         },
         onReachBottom() {
             console.log('下拉加载...');
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
				let _this = this;
				console.log('===sellerHasLogin==='+this.sellerHasLogin);
				
                if (!this.sellerHasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					if(!this.hasmore){
						this.loadingText = '暂无更多信息';
						return false;
					}
					let postData = {curpage:_this.curpage,sdate:_this.s_date,edate:_this.e_date,date:_this.date,stype:_this.searchType};
					if(_this.keyword!=''){
						postData = {curpage:_this.curpage,keyword:_this.keyword,sdate:_this.s_date,edate:_this.e_date,date:_this.date,stype:_this.searchType};
					}
					this.$Request.post('seller_order/order_list',postData).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.hasmore =res.hasmore;
							console.log(this.hasmore);
							let _datalist = res.datas.list;
							for(var i=0;i<_datalist.length;i++){
								_this.datalist.push(_datalist[i]);
							}
						}
						else{
							uni.showToast({
								icon: 'none',
								title:res.datas.error,
								duration:2000
							});
							uni.navigateTo({
								url:'login',
							});
						}
					});
				}
            },
			search1(){
				this.searchType=1;
				this.hasmore=true;
				this.loadingText = '正在加载...';
				this.datalist=[];
				this.hide();
				this.loadData();
			},
			search2(){
				this.searchType=2;
				this.hasmore=true;
				this.loadingText = '正在加载...';
				this.datalist=[];
				this.hide();
				this.loadData();
				
			},
			clearSearch(){
				this.searchType=0;
				this.hide()
				this.hasmore=true;
				this.loadingText = '正在加载...';
				this.datalist=[];
				this.loadData();
			},
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			show(e) {
				this.showRigth = true;
			},
			closeDrawer(e) {
				this.showRigth = false;
				
			},
			hide() {
				this.showRigth = false;
			},
			bindDateChange: function(e) {
				this.date = e.target.value
				console.log(this.date);
			},
			bDateChangeStart: function(e) {
				this.s_date = e.target.value
				console.log(this.s_date);
			},
			bDateChangeEnd: function(e) {
				this.e_date = e.target.value
				console.log(this.e_date);
			},
			submitSearch: function() {
				this.hasmore=true;
				this.loadingText = '正在加载...';
				this.datalist=[];
				this.loadData();
			},
			getDate(type) {
				const date = new Date();

				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;

				return `${year}-${month}-${day}`;
			}
			 
        }  
    }  
</script>  
<style>
	@import "../../static/css/store.css";
</style>
<style lang="scss">
page{background: #f5f5f5}
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
