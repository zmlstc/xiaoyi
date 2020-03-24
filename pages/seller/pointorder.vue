<template>
	<view>
		<view class="column bf b-line">
			<view class="item5" @tap="toScan"></view>
			<view class="item6">
				<view class="sc-bar">
					<input type="text" value="" :placeholder="placeholder" class="sc_area" v-model="keyword"/>
					<view class="sc_submit" @tap="submitSearch">搜 索</view>
				</view>
			</view>
			<view class="item7" @click="show('right')"></view>
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
		<view v-for="(item ,index) in datalist" :key="index">
		<view class="exchange-list mb2">
			<view class="item">
				<image class="pic" :src="item.point_goodsimage" mode="aspectFill"></image>
				
			<view class="content">
				<view class="name clip-2">{{item.point_goodsname}}</view>
				<view class="tip">
					<view class="tx1"><icon class="tx"></icon>{{item.point_buyername}}</view>
					<view class="jf1 ml10"><icon class="jf"></icon>{{item.point_allpoint}}</view>
				</view>
			</view>
			</view>
			<view class="item2">
				<view class="dh">
				<view class="icon"></view>
				<view class="date">{{item.point_adddate}}</view>
				<view class="date">{{item.point_addtime}}</view>
				</view>
				<view class="lq mt5">
				<view class="icon"></view>
				<view class="date"><text>{{item.point_finnsheddate}}</text></view>
				<view class="date"><text>{{item.point_finnshedtime}}</text></view>
				</view>
			</view>
		</view>
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
				loadingText: '正在加载 ...',
				hasmore:true,
				curpage:1,
				storeInfo:[],
				showRigth: false,
				date:currentDate,
				s_date:currentDate,
				e_date:currentDate,
				searchType:0,
				placeholder: '输入会员昵称',
				keyword:''
			}				
		},
		components: {
			uniDrawer
		},
        computed: mapState(['sellerHasLogin']),  
		onLoad() {
			 console.log('页面加载');
			
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
         onShareAppMessage() {
             console.log('分享!');
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
					this.$Request.post('seller_pointorder/orderlist',postData).then(res => {
						if (res.code == 200) {
							console.log(res);
							this.hasmore =res.hasmore;
							console.log(_this.hasmore);
							if(!this.hasmore){
								this.loadingText = '暂无更多信息';
								
							}
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
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			toScan(){
				let _this = this;
				uni.scanCode({
					onlyFromCamera: true,
					success: function (res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						 uni.showLoading({title: '正在处理中...'});
						 let scan_info = res.result;
						 let info = scan_info.replace('POINTS:','');
						uni.hideLoading();
						 uni.navigateTo({
							url:'pointconfirm?udata='+info, 
							success (res) {
								uni.hideLoading();
							}
						});
					}
				});
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
page{background: #F5F5F5}
</style>