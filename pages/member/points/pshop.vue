<template>
	<view>
		<view class="column4">
			<view class="item">
				<view class="title">可用积分</view>
				<text>{{memberpoints}}</text>
			</view>
			<view class="item2" @tap="toPage('pointorder')">
				<view class="my"></view>
				<text>我的兑换</text>
			</view>
			<view class="item2" @tap="toPage('pointslog')">
				<view class="list"></view>
				<text>积分明细</text>
			</view>
			<view class="item2" @tap="goDetail(39)">
				<view class="rule"></view>
				<text>积分政策</text>
			</view>
		</view>
		<view class="action-bar bf t-line b-line mb5">
			<!-- 定位城市 -->
			<view  @tap="toCity" class="addr">
				<view class="icon"></view>
				<text>{{ city }}</text>
			</view>
		<view style="width:73%; float:right;" >
			<sl-filter :independence="true" :color="titleColor" :themeColor="themeColor" :menuList.sync="menuList" @result="result"></sl-filter>
		</view>
		</view>
		
		<view class="show-box b-line mb2" v-for="(item ,index) in datalist":key="index">
			<view class="box-left">
				<image class="image" :src="item.pgoods_image" mode="aspectFill"></image>
				<view class="text-box">
					<view class="h3 clip-2">{{item.pgoods_name}}</view>
					<view class="shop-info">
						<view class="icon"></view>
						<text>{{item.store_name}}</text>
					</view>
					<view class="deal">
						<view class="integral fl"><view class="icon"></view>{{item.pgoods_points}}</view>
						<view class="money fl ml10"><view class="icon"></view>{{item.pgoods_price}}</view>
					</view>
				</view>
			</view>
			<view class="box-right">
				<view class="date"><text>{{item.pgoods_salenum}}</text>/{{item.pgoods_storage}}</view>
				<view class="dh mt10" @tap="toPage('pinfo?id='+item.pgoods_id)">立即兑换</view>
			</view>
		</view>
		<view class="loading-text">{{ loadingText }}</view>
	</view>
</template>

<script>
	import slFilter from '@/components/sl-filter/sl-filter.vue';
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
				memberpoints:'--', 
				city:'定位中',
				themeColor: '#000000',
				titleColor: '#666666',
				menuList: [
					{
						'title': '排序',
						'key': 'sort',
						'isSort': true,
						'reflexTitle': true,
						//'defaultSelectedIndex': 0,
						'detailList': [{
								'title': '默认排序',
								'value': '0'
							},
							{
								'title': '按人气高至低',
								'value': 'hot'
							},
							{
								'title': '按价值高至低',
								'value': 'pointsdesc'
							},
							{
								'title': '按结束时间降序',
								'value': 'etime'
							}
						]
					},
					{
						'title': '兑换',
						'key': 'isable',
						'isSort': true,
						'reflexTitle': true,
						//'defaultSelectedIndex': 0,
						'detailList': [{
								'title': '全部',
								'value': '0'
							},
							{
								'title': '我能兑换',
								'value': '1'
							}
						]
					}
				],
				bysort:'',
				isable:0
			}				
		},
		components: {slFilter},
        computed: mapState(['hasLogin','userInfo','Location']),  
		onLoad() {
			let _this = this;
			_this.city = _this.Location.city_name;
			console.log('页面加载');
			if (_this.hasLogin) { 
				_this.$Request.post('pointprod/getmemberinfo').then(res => {
					console.log(res);
					if (res.code == 200) {
						console.log(res);
						_this.memberpoints = res.datas.member.member_points;
					}
				 });
			}
			_this.loadData();
		},
		onShow() {
			let _this = this;
			if (_this.hasLogin) {
				_this.$Request.post('pointprod/getmemberinfo').then(res => {
					console.log(res);
					if (res.code == 200) {
						console.log(res);
						_this.memberpoints = res.datas.member.member_points;
					}
				 });
			}
			_this.loadData();
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
			result(val) {
				console.log(val);
				//console.log('filter_result:' + JSON.stringify(val));
				//this.filterResult = JSON.stringify(val, null, 2);
				let _data = JSON.parse(JSON.stringify(val));
				let _keys = Object.keys(_data);
				console.log(_keys);
				if(_keys[0]=='isable'){
					if(_data['isable']!=this.isable){
						this.isable=_data['isable'];
						//this.menuList[1].defaultSelectedIndex=
						this.clearData();
						this.loadData();
					}
				}else if(_keys[0]=='sort'){
					if(_data['sort']!=this.bysort){
						this.bysort=_data['sort'];
						this.clearData();
						this.loadData();
					}
				}
				
				/* for(var key in data){
					console.log(key);
					console.log(data[key]);
				} */
			},
			goDetail(id) {
			    uni.navigateTo({
			     url: '/pages/index/newsdetail?aid=' + id
			    })
			   },
			clearData(){
				this.datalist=[];
				this.loadingText='正在加载...';
				this.hasmore=true;
				this.curpage=1;
			},
            async loadData() {  
				let _this = this;
				console.log('===userInfo==='+this.hasLogin);
				console.log(this.userInfo);
				console.log(this.userInfo.token);
              
					if(!this.hasmore){
						this.loadingText = '暂无更多信息';
						//return false;
					}
					let postData={curpage:_this.curpage,cityid:_this.Location.city_id,isable:_this.isable,orderby:_this.bysort};
					console.log(postData);
					_this.$Request.post('pointprod/index',postData).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.hasmore =res.hasmore;
							console.log(_this.hasmore);
							let _datalist = res.datas.list;
							_this.datalist = [];
							for(var i=0;i<_datalist.length;i++){
								_this.datalist.push(_datalist[i]);
							}
							if(!res.hasmore){
								_this.loadingText = '暂无更多信息';
								return false;
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
				
            },
			toPage: function(url) {
				if (!this.hasLogin) {
					url="/pages/member/login";
				} 
				uni.navigateTo({
					url:url,
				})
				
			},
			toCity:function(){
				uni.navigateTo({
					url:"/pages/index/city?url=/pages/member/points/pshop"
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
			 
        }  
    }  
</script>  
<style lang="scss">
	page {background-color:#F5F5F5;}
	.addr {
		max-width:180upx;
		height:48upx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		padding: 8upx 0;
		float: left;
		overflow: hidden;
		font-size: 28upx;
		color: #666;
		.icon {
			width:32upx;
			height:32upx;
			margin-right: 5upx;
			background: url('https://www.fhlego.com/static/location.png') center no-repeat;                         
			background-size:100%;
		}
		text {
			display: flex;
			height:48upx;
			font-size:28upx;
			overflow: hidden;
		}
	}
</style>
