<template>
	<view>
		<view class="comment">
			<view class="left-tab" :class="[showtype==0?'act':'']" @tap="showTab(0)">未评价</view>
			<view class="right-tab" :class="[showtype==1?'act':'']" @tap="showTab(1)">已评价</view>
		</view>
		<view v-if="showtype==0">
			<view class="show-box mb5" v-for="(item ,index) in orderlist":key="index">
				<view class="box-left">
					<view class="image" :style="{'background':'url('+item.store_avatar+')','background-size':'100%'}"></view>
					<view class="text-box">
						<view class="title">{{item.store_name}}</view>
						<view class="evaluate">
							<uni-rate disabled="true" size="14" :value="item.seval_scores" is_show_num="false" ></uni-rate>
						<view class="deal">￥<text class="amount">{{item.order_amount}}</text>{{item.payment_name}}</view>
						</view>
					</view>
				</view>
				<view class="box-right">
					<view class="date">{{item.date}}</view>
					<view class="date">{{item.time}}</view>
					<view class="text mt5" @tap="toEval(item.order_id)">评价</view>
				</view>
			</view>
		</view>
		<view  v-if="showtype==1">
			<view class="show-box2 mb5"  v-for="(item ,index) in datalist":key="index">
				<view class="box-left">
					<view class="image" :style="{'background':'url('+item.store_avatar+')','background-size':'100%'}"></view>
					<view class="date">{{item.date_txt}}</view>
					<view class="date">{{item.time_txt}}</view>
				</view>
				<view class="box-right">
					<view class="title">
						<text>{{item.store_name}}</text>
						<view class="icon" @tap="deleteEval(item.seval_id)"></view>
					</view>
					<view class="evaluate">
						<uni-rate disabled="true" size="14" :value="item.seval_scores" is_show_num="false" ></uni-rate>
					</view>
					<view class="content">{{item.seval_content}}</view>
					<view class="imgs" v-if="item.geval_image_240">
						<block v-for="(imgurl, key) in item.geval_image_240" :key="key">
							<view class="imgs-box"><image :src="imgurl" mode="widthFix" style="width: 100%;" @click="previewImg(imgurl,item.geval_image_240)"></image></view>
						</block>
					</view>
					<view class="shop-info" v-if="item.seval_explain!=''">
						<view class="text-box">
						<text>店家回复：</text>{{item.seval_explain}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="loading-text">{{ loadingText }}</view>
		
	</view>
</template>


<script>  
	import uniRate from "../../components/uni-rate/uni-rate.vue";
    import {  
        mapState,  
        mapMutations  
    } from 'vuex';  
    export default { 
		data() {
			return {
				orderlist:[],
				datalist:[],
				loadingText: '正在加载...',
				hasmore:true,
				curpage:1,
				showtype:0
			}				
		},
		components: {uniRate},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad() {
			console.log('页面加载');
			if (!this.hasLogin) {  
				uni.navigateTo({
					url:'login',
				});
				return false;
			}
			this.loadData();
		},
		  onBackPress(options) {
			  console.log('==onBackPress===');
			
		  },
         onUnload() {
             console.log('页面卸载');
         },
         onReachBottom() {
             console.log('正在加载中...');
			 this.curpage++;
			 this.loadData();
         },
         onPullDownRefresh() {
             uni.stopPullDownRefresh();
         },
        methods: {   
            async loadData() {  
				var _this = this;
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					if(this.showtype==1){
						this.showPinLunList();
					}else if(this.showtype==0){
						this.showOrderList();
					}
					
				}
            },
			showOrderList(){
				let _this = this;
				if(!this.hasmore){
					this.loadingText = '暂无更多信息';
					return false;
				}
				_this.$Request.post('member_evaluate/orderlist',{curpage:_this.curpage}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.hasmore =res.hasmore;
						console.log(_this.hasmore);
						let _orderlist = res.datas.order_list;
						for(var i=0;i<_orderlist.length;i++){
							_this.orderlist.push(_orderlist[i]);
						}
						if(!res.hasmore){
							_this.loadingText = '暂无更多信息';
						}
					}
				});
			},
			showPinLunList(){
				let _this = this;
				if(!this.hasmore){
					this.loadingText = '暂无更多信息';
					return false;
				}
				_this.$Request.post('member_evaluate/list',{curpage:_this.curpage}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.hasmore =res.hasmore;
						console.log(_this.hasmore);
						let _datalist = res.datas.eval_list;
						for(var i=0;i<_datalist.length;i++){
							_this.datalist.push(_datalist[i]);
						}
						if(!res.hasmore){
							_this.loadingText = '暂无更多信息';
						}
					}
				});
			},
			toEval: function(id) {
				uni.navigateTo({
					url:'comment?id='+id,
				})
			},
			showTab(t){
				uni.hideLoading();
				this.showtype=t;
				this.hasmore=true;
				this.loadingText = '正在加载...';
				this.datalist=[];
				this.orderlist=[];
				this.loadData();
			},
			previewImg(src,urls){
				uni.previewImage({
					current:src,
					urls
				})
			},
			deleteEval(id){
				var _this= this;
				
				uni.showModal({
					title: '提示',
					content: '确认要删除吗？',
					success: function (re) {
						if (re.confirm) {
							uni.showLoading({title:'正在删除...'});
							_this.$Request.post('member_evaluate/eval_delete',{eval_id:id}).then(res => {
								if (res.code == 200) {
									console.log(res);
									let len = _this.datalist.length;
									for(let i=0;i<len;i++){
										if(id==_this.datalist[i].seval_id){
											_this.datalist.splice(i, 1);
											break;
										}
									}
									uni.hideLoading();
								}
								else{
									uni.showLoading({title:res.datas.error+''});
									setTimeout(function () {
										uni.hideLoading();
									}, 1500);
								}
							});
						} else if (re.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
			}
			 
        }  
    }  
</script>  
<style lang="scss">
	page{background: #F5F5F5;}
</style>
