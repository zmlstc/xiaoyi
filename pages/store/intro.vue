<template>
	<view>
		<view class="column bf mb2 mt10">
			<view class="item font-r">店铺名称</view>
			<view class="item3">{{storeInfo.store_name}}</view>
		</view>
		<view class="column4 bf mb2">
			<view class="title">店铺简介</view>
			<view class="content">{{storeInfo.store_desc}}</view>
		</view>
		<view class="column bf mb2">
			<view class="item font-r">营业时间</view>
			<view class="item3">{{storeInfo.yy_time_txt}}</view>
		</view>
		<view class="column bf mb2" @tap="toLocation">
			<view class="item font-r">地图/导航</view>
			<view class="item3 clip">{{storeInfo.map_address}}</view>
		</view>
		<view class="column bf mb2">
			<view class="item font-r">店铺号码</view>
			<view class="item3">{{storeInfo.store_phone}}</view>
		</view>
		<view class="facilities bf">
			<view class="title">配套设施</view>
			<view class="opt">
				<view v-for="(item, index) in storeInfo.flist" :key="index" class="box" >
					<img class="num" :src="item.img" />
					<view class="text">{{item.f_name}}</view>
				</view>	
			</view>
			
			
			
		</view>
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
				loaded: false,
				currentEpd: 1,
				store_id:0,
				storeInfo:{'eval_num':0,'eval_manyi':0},
			};
		},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad(e){
			this.store_id=e.store_id;
			this.loadData(e);
			console.log('onload');
			console.log(e);
			this.loaded = true;
			
			
		},
		methods:{
			loadData(e){
				let _this = this;
				_this.$Request.post('store/store_intro',{store_id:e.store_id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.storeInfo=res.datas.store_info;
						_this.fav = res.datas.is_favorate;
						_this.evaList = res.datas.evaList;
						_this.couponList = res.datas.store_info.vtlist;
						 uni.setNavigationBarTitle({
							title: _this.storeInfo.store_name
						}) 
					}
				});
			},
			imageOnLoad(key,index){
				//this.$set(this.data[key][index], 'loaded', 'loaded');
			},
			toLocation: function () {
				uni.openLocation({
					latitude: parseFloat(this.storeInfo.map_lat),
					longitude: parseFloat(this.storeInfo.map_lng),
					success: function () {
						console.log('success');
					}
				});
			},
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			previewImg(src,urls){
				uni.previewImage({
					current:src,
					urls
				})
			},
			stopPrevent(e){
				console.log('======stopPrevent=====');
				console.log(e);
			},
		},
	}
</script>
<style>
	@import "../../static/css/index.css";
</style>
<style lang="scss">
	page{ background: #F5F5F5;}
</style>

