<template>
	<view>
		<view class="column4 bf mb10 mt10">
			<view class="title">店铺简介</view>
			<textarea auto-height placeholder="输入店铺简介，不超过200个中文字" v-model="store_desc" maxlength="100"/>
		</view>
		<view class="column bf mb10">
			<view class="item f-r">店铺号码</view>
			<view class="item6"><input  maxlength="11" v-model="store_phone" class="mt5 f-l"></input></view>
		</view>
		<view class="column bf mb10">
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
			
		</view>
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
							this.store_desc=res.datas.store.store_desc;
							this.store_phone=res.datas.store.store_phone;
							this.wtime_start=res.datas.store.wtime_start;
							this.wtime_end=res.datas.store.wtime_end;
							this.flist=res.datas.flist;
							this.selectflist =res.datas.store.f_ids;
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
					store_phone:this.store_phone,store_desc:this.store_desc,wtime_start:this.wtime_start,wtime_end:this.wtime_end,
					fids:this.selectflist
				}
				this.$Request.post('seller_index/storeintro_save',postData).then(res => {
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

			}
			 
        }  
    }  
</script>
<style>
	@import "../../static/css/store.css";
	page{background: #F5F5F5;}
</style>