<template>
	<view>
		<!-- <view class="column4 bf mb10 mt10">
			<view class="title">详细地址</view>
			<input auto-height placeholder="例如:文兴路128号401室" v-model="store_map_address_detail" maxlength="100"></input>
		</view> -->
		<view class="column bf" >
			<view class="item f-r">地理位置</view>
			<view class="item4 f-r" @tap="chooseLocation">
				<text>修改</text>
				<view class="moer ml10"></view>
			</view>
		</view>
		<view class="column bf mb10">
			<view class="item f-r">详细地址</view>
			<view class="item6"><input  maxlength="100" placeholder="例如:文兴路128号401室" v-model="store_map_address_detail" class="mt5 f-l"></input></view>
		</view>
		<!-- <view class="column bf mb10">
			<view class="item f-r">营业时间</view>
			<view class="item6">
				<picker style="float: left;" mode="time" :value="wtime_start" start="09:01" end="21:01" @change="bindTimeChangeStart">
					<view class="uni-input all-line">{{wtime_start}}</view>
				</picker>
				<view class="text" style="width:50upx;float:left;margin:10upx 8upx 0;">—</view>
				<picker style="float: left;" mode="time" :value="wtime_end" start="09:01" end="21:01" @change="bindTimeChangeEnd">
					<view class="uni-input all-line">{{wtime_end}}</view>
				</picker>
				</view>
		</view>
		<view class="column6 bf mb10">
			<view class="title">配套设施</view>
				<checkbox-group @change="checkboxChange">
					<label v-for="item in flist" :key="item.fid">
						<view class="opt">
							<view><checkbox color="#00BAAD" :value="item.fid" :checked="item.ischeck"></checkbox>{{item.fname}}</view>
						</view>
					</label>
			
			</checkbox-group>
			
		</view> -->
			<view class="btn mt40"  @click="toPost">确认提交</view>
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
				store_desc:'',
				store_phone:'',
				wtime_start:'',
				wtime_end: '',
				store_map_address_detail:'',
				flist:[],
				selectflist:[]
			}				
		},
        computed: mapState(['sellerHasLogin']),  
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
        methods: {  
            //...mapMutations(['logout','setUserInfo']),  
            async loadData() {  
                if (!this.sellerHasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
 					this.$Request.post('seller_index/getstoreintro').then(res => {
						if (res.code == 200) {
							console.log(res);
							this.store_map_address_detail = res.datas.store.map_address_detail;
							// this.store_phone=res.datas.store.store_phone;
							// this.wtime_start=res.datas.store.wtime_start;
							// this.wtime_end=res.datas.store.wtime_end;
							// this.flist=res.datas.flist;
							// this.selectflist =res.datas.store.f_ids;
							//this.setUserInfo(res.datas);							
							//this.memberInfo = res.datas;
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
			toPost() { 
				console.log(this.store_map_address_detail);
/* 				if(this.newstorename.length<3){ 
					uni.showToast({title: '请填写正确店铺名称',icon:"none"});
					return false; 
				}
				
				if(this.zhizhao_pic==''){
					uni.showToast({title: '请上传营业执照',icon:"none"});
					return false; 
				}
				if(this.pingzheng_pic==''){
					uni.showToast({title: '请上传申请凭证',icon:"none"});
					return false; 
				} */
				
				let postData={
					address_detail:this.store_map_address_detail
				}
				this.$Request.post('seller_index/updatemapdeatil',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'修改成功！',
							duration:2000
						});
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						
					}
				}); 			
			},
			bindTimeChangeStart: function(e) {
				this.wtime_start = e.target.value
			},
			bindTimeChangeEnd: function(e) {
				this.wtime_end = e.target.value
			},
			checkboxChange: function (e) {
			 	this.selectflist = e.detail.value;
				
				console.log('-----------');
				console.log(this.selectflist);

			},
			chooseLocation: function () {
				uni.chooseLocation({
					success: (res) => {
						console.log(res);
						this.$Request.post('seller_index/updatemap',{lng:res.longitude,lat:res.latitude,address:res.address}).then(res => {
							if (res.code == 200) {
								console.log(res);
							}
						}); 
						/* this.hasLocation = true,
							this.location = formatLocation(res.longitude, res.latitude),
							this.locationAddress = res.address */
					}
				})
			}
			 
        }  
    }  
</script>
<style>
	@import "../../static/css/store.css";
	page{background: #F5F5F5;}
</style>