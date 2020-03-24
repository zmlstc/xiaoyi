<template>
	<view>
		<view class="help">
			<view class="icon"></view>
			<text>帮助</text>
		</view>
		<view class="t-wrapper">
		<view class="top-nav">
			<view class="blank"></view>
			<view class="title f-c">个人中心</view>
		</view>
		<view class="place"></view>
		<view class="top-content">
			<view class="setting" @tap="toPage('set/set')"></view>
			<view class="store-login" @tap="toPage('/pages/seller/seller')">我是商家</view>
			<view class="messge" @tap="toPage('msg/mlist')">
				<view class="msg-tis" v-if="sysnum>0">{{sysnum}}</view>
			</view>
		</view>
		<view class="mement-info">
			<view class="left-info">
				<image class="avatar" :src="memberInfo.avatar" @tap="toPage('set/userset')"></image>
				<view class="content">
					<view class="name"><text>{{memberInfo.nickname}}</text><view class="alter ml5" @tap="toPage('set/editnick')"></view></view>
					<view class="level">会员ID：<text>{{memberInfo.user_name}}</text></view>
				</view>
			</view>
			<view class="signin" @tap="toPage('signin')">
				<view class="icon"></view>
				<view class="title">每日签到</view>
			</view>
		</view>
		<view class="changyong">
			<view class="function" @tap="toPage('fav_store')">
				<view class="num">{{allfavnum}}</view>
				<view class="title">我的收藏</view>
			</view>
			<view class="function" @tap="toPage('evallist')">
				<view class="num">{{pinglunnum}}</view>
				<view class="title">我的评价</view>
			</view>
			<view class="function" @tap="toPage('viewslist')">
				<view class="num">1123</view>
				<view class="title">浏览历史</view>
			</view>
		</view>

		<!--view class="news">
			<view class="icon"></view>
			<swiper class="content" style="height:44px;" vertical="true" autoplay="true" circular="true" interval="3000" display-multiple-items=2>
				<swiper-item class="content"  v-for="(item, index) in artlist" :key="index" @tap="toPage('/pages/index/newsdetail?aid='+item.article_id)">
						<view class="tag">{{item.ac_name}}</view><text class="title">{{item.article_title}}</text><text class="date">{{item.article_time_txt}}</text>
						
				</swiper-item>
			</swiper>
		</view-->
		</view>
		<view class="place"></view>
		<view class="invite">
			<view class="mement" @tap="toInvitePage('invite')">
				<view class="icon"></view>
				<view class="text">
				<view class="title">邀请好友加入</view>
				<view class="exp">共享资源变现</view>
				</view>
			</view>
			<view class="shop" @tap="toInvitePage('invite?t=shop')">
				<view class="icon"></view>
				<view class="text">
				<view class="title">邀请商家入驻</view>
				<view class="exp">一劳永逸资源</view>
				</view>				
			</view>
		</view>
		
		<view class="b-wrapper">
			<view class="content">
				<view class="function" @tap="toPage('consume')">
					<view class="jilu"></view>
					<view class="title">消费记录</view>
				</view>
				<view class="function" @tap="toPage('wallet')">
					<view class="wallet"></view>
					<view class="title">我的钱包</view>
				</view>
				<view class="function" @tap="toPage('tx/txlist')">
					<view class="tx-list"></view>
					<view class="title">提现记录</view>
				</view>
				<view class="function" @tap="toInvitePage('invite')">
					<view class="share"></view>
					<view class="title">我的分享</view>
				</view>
				<view class="function" @tap="toPage('coupon')">
					<view class="coupon"></view>
					<view class="title">优惠券</view>
				</view>
				<view class="function" @tap="toTab('points/pshop')">
					<view class="integral"></view>
					<view class="title">积分兑换</view>
				</view>
				<!--view class="function" @tap="toPage('points/myact')">
					<view class="myact"></view>
					<view class="title">我的活动</view>
				</view-->
				<view class="function" @tap="toPage('set/feedback')">
					<view class="feedback"></view>
					<view class="title">意见反馈</view>
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
				memberInfo:[],
				sysnum:0,
				artlist:[],
				allfavnum:0, //收藏数 
				pinglunnum:0 //评价数
			}				
		},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad() {
			 console.log('页面加载 ');
			this.loadData();
			
		},
		onShow() {
             console.log('页面显示..');
			  if (!this.hasLogin) {  
			 	uni.navigateTo({
			 		url:'login',
			 	})
			 }
			
			//this.memberInfo = this.userInfo;
			
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
				var _this=this;
				console.log('===userInfo==='+this.hasLogin);
				console.log(this.userInfo);
				console.log(this.userInfo.token);
                if (!_this.hasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					_this.$Request.post('member_index').then(res => {
						if (res.code == 200) {
							console.log(res);
							//this.login(res.datas);
							_this.memberInfo = res.datas.member_info;
							_this.artlist =res.datas.artlist;
							_this.sysnum =res.datas.sysnum;
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
				// 我的收藏
				_this.$Request.post('member_favorites_store/allfavnum').then(res => {
						console.log(res);
						_this.allfavnum =res.datas.allfavnum;
						console.log(_this.allfavnum);
				});
				//我的评价
				_this.$Request.post('member_evaluate/listnum').then(res => {
						console.log(res);
						_this.pinglunnum =res.datas.allnum;
				});
            },
			toPage: function(url) {
				console.log(url)
				uni.navigateTo({
					url:url
				})	
			},
			toTab:function(url) {
				// uni.switchTab({ 
				// 	url:url
				// }); 
				uni.switchTab({ 
					url:url,
					success:(res)=> { 
						 var page = getCurrentPages().pop();
						 if (page == undefined || page == null) return;
						 page.onLoad();
					  }
				}); 
			},
			toInvitePage: function(url) {
				/* if(this.memberInfo.is_realverify!='1'){
					uni.showToast({
						icon: 'none',
						title:'请先实名验证！',
						duration:2000,
						success: function () {
							 setTimeout(function () {
								uni.navigateTo({
									url:'set/realverify',
								});
							 }, 1500);
						}
					});
				}else{ */
					uni.navigateTo({
						url:url,
					})
				//}
			}
			 
        }  
    }  
</script>