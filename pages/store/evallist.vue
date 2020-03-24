<template>
	<view>
	<!-- 评论 -->
	<view class="evalution">
		<view class="evaluate-header">
		<view class="title">
			<text  style="margin-left: 10upx;">用户评价 ({{ storeInfo.eval_num }})</text>
		</view>
		<view class="total"  v-if="storeInfo.eval_num>0"><text>{{storeInfo.eval_manyi}}%满意</text></view>
		<view class="total" v-if="storeInfo.eval_num==0">无评价</view>
	</view>
		<view class="eva-list" >
			<view  v-for="(item, index) in evaList" :key="index" class="eva-item b-line">
				<image :src="item.member_avatar" mode="aspectFill" class="img"></image>
				<view class="eva-right">
					<view class="acc">
					<view class="name">{{item.member_name}}</view>
						<view class="start"><uni-rate disabled="true" size="14" margin="5" :value="item.seval_scores"></uni-rate></view>
						<view class="time">{{item.date_txt}}{{item.time_txt}}</view>
					</view>
					<text class="content">{{item.seval_content}}</text>
					<view class="imgs" v-if="item.geval_image_240">
						<block v-for="(imgurl, key) in item.geval_image_240" :key="key">
							<view class="imgs-box"><image :src="imgurl" mode="widthFix" @click="previewImg(imgurl,item.geval_image_240)"></image></view>
						</block>
					</view>
					<view class="reply bgc2" v-if="item.is_reply=='1'&&item.reply_del=='0'">
						<view class="title">官方回复：</view>
						<view class="content"  v-if="item.reply_del=='0'">{{item.seval_explain}}</view>
						<view class="date">
							<view class="icon"></view>
							<text>{{item.reply_date_txt}}</text><text class="ml5">{{item.reply_time_txt}}</text>
						</view>
					</view>
							
						</view>
					</view>
				</view>
			</view>
			
			<view class="loading-text">{{ loadingText }}</view>
		</view>
</template>


<script>
	import uniRate from "@/components/uni-rate/uni-rate.vue"
    import {  
        mapState,  
        mapMutations  
    } from 'vuex'; 
	export default {
		data() {
			return {
				store_id:0,
				storeInfo:{'eval_num':0,'eval_manyi':0},
				evaList:[],
				loadingText: '正在加载...',
				hasmore:true,
				curpage:1,
			};
		},
		components: {uniRate},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad(e){
			this.store_id=e.store_id;
			this.loadData(e);
			this.loadEval();
			
			
		},
         onReachBottom() {
			 this.curpage++;
			 this.loadEval();
         },
		methods:{
			loadData(e){
				let _this = this;
				_this.$Request.post('store/eval_info',{store_id:e.store_id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.storeInfo=res.datas.store_info;
					}
				});
			},
			loadEval() {  
				var _this = this;
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					if(!this.hasmore){
						this.loadingText = '暂无更多信息信息';
						return false;
					}
					_this.$Request.post('store/evallist',{curpage:_this.curpage,store_id:_this.store_id}).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.hasmore =res.hasmore;
							console.log(_this.hasmore);
							let _conslist = res.datas.list;
							for(var i=0;i<_conslist.length;i++){
								_this.evaList.push(_conslist[i]);
							}
							if(!this.hasmore){
								this.loadingText = '暂无更多信息信息';
								return false;
							}
						}
					});
				}
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
			}
			
		},
	}
</script>

<style lang="scss">
@import "../../static/css/store.css";
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
		.evalution{
			display:flex;
			flex-direction:column;
			background: #fff;
			padding:0;
		}
	
	.eva-item{
		display:flex;
		margin-left:40upx;
		padding: 40upx 20upx 40upx 0;
		.img{
			width: 60upx;
			height: 60upx;
			border-radius: 50px;
			flex-shrink: 0;
			border: 2upx solid #ccc;
			}
		}
	
	.evaluate-header {
		width: 100%;
		height: 80upx;
		display: flex;
		justify-content:space-between;
		padding: 20upx;
		align-items: center;
		box-sizing: border-box;
		border-bottom: 1upx solid #e5e5e5;
	}
	
	.evaluateBox .title {
		display: flex;
		align-items: center;
		color: #000000;
		font-size: 30upx;
	}
	.total {
		height: 100%;
		color: #999;
		font-size: 24upx;
		text{
			color: #00BAAD;
		}
	}	
.evaluate-content {
	color: #000;
	font-size: 28upx;
	text-align: left;
	margin-top: 10upx;
}
</style>
