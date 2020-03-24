<template>
	<view>
		<view class="comment">
			<view class="left-tab" :class="[replytype==0?'act':'']" @tap="showTab(0)">未回复</view>
			<view class="right-tab" :class="[replytype==1?'act':'']" @tap="showTab(1)">已回复</view>
		</view>
		<view v-if="replytype==1" class="reply-list mb20"  v-for="(item ,index) in datalist":key="index">
			<view class="head">
				<view class="mement">
				<image class="avatar" :src="item.member_avatar"></image>
				<view class="name ml10">{{item.member_name}}</view>
				<view class="start">
					<uni-rate disabled="true" size="14" :value="item.seval_scores" is_show_num="false" ></uni-rate>
				</view>
				</view>
				<view class="date">
					<view class="icon"></view><text>{{item.date_txt}}</text><text class="ml5">{{item.time_txt}}</text>
				</view>
			</view>
			<view class="content">
				{{item.seval_content}}
			</view>
				<view class="imgs" v-if="item.geval_image_240">
					<block v-for="(imgurl, key) in item.geval_image_240" :key="key">
						<view class="imgs-box"><image :src="imgurl" mode="widthFix" @click="previewImg(imgurl,item.geval_image_240)"></image></view>
					</block>
				</view>
			<view class="reply bgc2" v-if="item.is_reply=='1'">
				<view class="title">回复：</view>
				<view class="content"  v-if="item.reply_del=='0'">{{item.seval_explain}}</view>
				<view class="content"  v-if="item.reply_del=='1'">回复已删除</view>
				<view class="date">
					<view class="icon"></view>
					<text>{{item.reply_date_txt}}</text><text class="ml5">{{item.reply_time_txt}}</text>
					<view class="del" @tap="delseval(item.seval_id)"></view>
				</view>
			</view>
		</view>
		
		<view class="reply-list show-box2 mb5" v-if="replytype==0"  v-for="(item ,index) in elist":key="index">
			<view class="box-left">
				<view class="image" :style="{'background':'url('+item.member_avatar+')','background-size':'100%'}"></view>
				<view class="date">{{item.date_txt}}</view>
				<view class="date">{{item.time_txt}}</view>
			</view>
			<view class="box-right">
				<view class="title">
					<view class="name">{{item.member_name}}</view>
				<view class="start">
					<uni-rate disabled="true" size="14" :value="item.seval_scores" is_show_num="false" ></uni-rate>
				</view>
					<view class="reply" @tap="toShow(item.seval_id)">回复</view>
				</view>
				<view class="content">{{item.seval_content}}</view>
				<view class="imgs" v-if="item.geval_image_240">
					<block v-for="(imgurl, key) in item.geval_image_240" :key="key">
						<view class="imgs-box"><image :src="imgurl" mode="widthFix" style="width: 100%;" @click="previewImg(imgurl,item.geval_image_240)"></image></view>
					</block>
				</view>
				<view class="reply bgc2" v-if="isshowreply==item.seval_id">
					<view class="title">回复：</view>
					<view class="content">
						<textarea placeholder-style="color:#c9c9c9" @input="inputChange" auto-height placeholder="输入回复内容..."/>
					</view>
					<button class="btn mt40" @click="formSubmit" :disabled="logining">提交</button>
				</view>
			</view>
			<!--view class="head">
				<view class="mement">
					<image class="avatar" :src="item.member_avatar"></image><text class="ml10">{{item.member_name}}</text>
				</view>
				<view class="reply" @tap="toShow(item.seval_id)">回复</view>
			</view>
			<view class="content">
				{{item.seval_content}}
			</view>
			<view class="reply bg-color2" v-if="isshowreply==item.seval_id">
				<view class="title">回复：</view>
				<view class="content">
					<textarea placeholder-style="color:#c9c9c9" @input="inputChange" auto-height placeholder="输入回复内容..."/>
				</view>
				<button class="btn mt40" @click="formSubmit" :disabled="logining">提交</button>
			</view-->
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
				datalist:[],
				elist:[],
				loadingText: '正在加载...',
				hasmore:true,
				curpage:1,
				replytype:0,
				replyTxt:'',
				logining: false,
				isshowreply:0
			}				
		},
		components: {uniRate},
        computed: mapState(['sellerHasLogin']),  
		onLoad() {
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
				console.log('===sellerHasLogin==='+this.sellerHasLogin);
				
                if (!this.sellerHasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					if(this.replytype==1){
						this.showReply();
					}else if(this.replytype==0){
						this.showNoReply();
					}
				}
            },
			previewImg(src,urls){
				uni.previewImage({
					current:src,
					urls
				})
			},
			showNoReply(){
					if(!this.hasmore){
						this.loadingText = '暂无更多信息';
						return false;
					}
					this.$Request.post('seller_evaluate/list',{curpage:this.curpage,type:0}).then(res => {
						if (res.code == 200) {
							console.log(res);
							this.hasmore =res.hasmore;
							console.log(this.hasmore);
							let _elist = res.datas.eval_list;
							for(var i=0;i<_elist.length;i++){
								this.elist.push(_elist[i]);
							}
							if(!this.hasmore){
								this.loadingText = '暂无更多信息';
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
			showReply(){
					if(!this.hasmore){
						this.loadingText = '暂无更多信息';
						return false;
					}
					this.$Request.post('seller_evaluate/list',{curpage:this.curpage,type:1}).then(res => {
						if (res.code == 200) {
							console.log(res);
							this.hasmore =res.hasmore;
							console.log(this.hasmore);
							let _datalist = res.datas.eval_list;
							for(var i=0;i<_datalist.length;i++){
								this.datalist.push(_datalist[i]);
							}
							if(!this.hasmore){
								this.loadingText = '暂无更多信息';
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
			showTab(t){
				uni.hideLoading();
				this.replytype=t;
				this.hasmore=true;
				this.loadingText = '正在加载...';
				this.datalist=[];
				this.elist=[];
				this.loadData();
			},inputChange(e){
				this.replyTxt = e.detail.value;
			},
			formSubmit: function (e) {
				var _this =this;
				if(this.replyTxt ==''){ 
					uni.showToast({title: '请填写回复内容',icon:"none"});
					return false; 
				}
				if(this.isshowreply ==0){ 
					uni.showToast({title: '回复编号错误',icon:"none"});
					return false; 
				}
				
				 uni.showLoading({title: '正在处理中...'});
			    _this.logining =true;          
				_this.$Request.post('seller_evaluate/save',{explain:_this.replyTxt,id:_this.isshowreply}).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'回复成功！',
							duration:3000,
							success: function () {
								 setTimeout(function () {
									let len = _this.elist.length;
									for(let i=0;i<len;i++){
										if(_this.isshowreply==_this.elist[i].seval_id){
											_this.elist.splice(i, 1);
											break;
										}
									}
									
									_this.logining =false;
								 }, 2000);
							}
						});
						
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000,
							success: function () {
								_this.logining =false;
							}
						});
						
					}
					uni.hideLoading();
				});
			},
			toShow(id){
				this.isshowreply=id;
				this.replyTxt ='';
			},
			delseval(id){
				let _this= this;
				uni.showModal({
					title: '提示',
					content: '确认要删除吗？',
					success: function (res) {
						if (res.confirm) {
							 uni.showLoading({title: '正在处理中...'});
							_this.$Request.post('seller_evaluate/delevl',{id:id}).then(res => {
								if (res.code == 200) {
									console.log(res);
									uni.showToast({
										icon: 'none',
										title:'删除成功！',
										duration:3000,
										success: function () {
											 setTimeout(function () {
												let len = _this.datalist.length;
												for(let i=0;i<len;i++){
													if(id==_this.datalist[i].seval_id){
														_this.datalist[i].reply_del=1;
														break;
													}
												}
												
												_this.logining =false;
											 }, 2000);
										}
									});
									
								}
								else{
									uni.showToast({
										icon: 'none',
										title:res.datas.error,
										duration:2000,
										success: function () {
											_this.logining =false;
										}
									});
									
								}
								uni.hideLoading();
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
			}
			 
        }  
    }  
</script>  
<style>
	@import "../../static/css/store.css";
	page{background: #F5F5F5;}

.imgs {display:flex;flex-wrap: wrap;margin:20upx 0;justify-content: flex-start;}
.imgs .imgs-box {width:98upx;height:98upx;margin-right:10upx;box-sizing: border-box;background: #ccc;overflow: hidden;text-align:center;border: 2upx #ccc solid;display:flex;}
.imgs .imgs-box image{width:98upx;height:auto;align-items: center;flex-direction:column;}
</style>

