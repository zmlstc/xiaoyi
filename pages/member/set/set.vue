<template>
	<view>
		<view class="set-column mb2 mt10" @tap="toPage('userset')">
			<view class="item">个人信息</view>
			<view class="itme2">会员ID:{{memberInfo.user_name}}<view class="icon"></view></view>
		</view>
		<view class="set-column mb2"  @tap="toPage('mbind')">
			<view class="item">绑定手机</view>
			<view class="itme2">{{memberInfo.mobile}}<view class="icon"></view></view>
		</view>
		<!--<view class="set-column mb2">
			<view class="item">关联账号</view>
			<view class="itme2">绑定/解除<view class="icon"></view></view>
		</view>-->
		<view class="set-column mb10"  @tap="toPage('safeset')">
			<view class="item">安全设置</view>
			<view class="itme2"><view class="icon"></view></view>
		</view>
		<view class="set-column mb2"  @tap="toPage('feedback')">
			<view class="item">意见反馈</view>
			<view class="itme2"><view class="icon"></view></view>
		</view>
		<view class="set-column mb2"  @tap="toPage('about')">
			<view class="item">关于我们</view>
			<view class="itme2"><view class="icon"></view></view>
		</view>
		<view class="btn mt40" hover-class="btn-hover" @tap="toLogout">退出登录</view>
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
				memberInfo:[]
			}				
		},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
        methods: {  
            ...mapMutations(['logout','setUserInfo']),  
            async loadData() {  
				var _this = this;
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'../login',
					})
                }else{
					_this.$Request.post('member_account').then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.setUserInfo(res.datas);							
							_this.memberInfo = res.datas;
						}
						else{
							uni.showToast({
								icon: 'none',
								title:res.datas.error,
								duration:2000
							});
							uni.navigateTo({
								url:'../login',
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
			toLogout: function(url) {
				this.logout();
				uni.navigateTo({
					url:'../login',
				});
			},
			toBack(url){
				uni.switchTab({
					url:'/pages/member/home', 
					success (res) {
							const currentPages = getCurrentPages()  
							console.log(currentPages[0]);  
							currentPages[0].onLoad({  
								...currentPages[0].options  
							})
					}
				})
			}
			 
        }  
    }  
</script> 

<style lang="scss">
	page{background: #F5F5F5}
</style>
