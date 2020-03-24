<template>
	<view>
		<view class="column bf mt20"  @tap="toPage('sellerinfo')">
			<view class="item f-r">商家信息</view>
			<view class="item4 f-r">
				<text></text>
				<view class="moer ml10"></view>
			</view>
		</view>
		<view class="column bf mt5"  @tap="toPage('bindmob')">
			<view class="item f-r">绑定手机</view>
			<view class="item4 f-r">
				<text>{{storeInfo.phone_show}}</text>
				<view class="moer ml10"></view>
			</view>
		</view>
		<view class="column bf mt5"  @tap="toPage('pwd')">
			<view class="item f-r">登录密码</view>
			<view class="item4 f-r">
				<text>修改</text>
				<view class="moer ml10"></view>
			</view>
		</view>
		<view class="column bf mt5"  @tap="toPage('tx/txway')">
			<view class="item f-r">支付设置</view>
			<view class="item4 f-r">
				<text></text>
				<view class="moer ml10"></view>
			</view>
		</view>
		<view class="btn mt40" @tap="toLogout">注销并转到会员中心</view>
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
				storeInfo:[]
			}				
		},
        computed: mapState(['sellerHasLogin','sellerInfo']),  
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
        methods: {  
            ...mapMutations(['sellerLogout','setSellerInfo']),  
            async loadData() {  
				let _this = this;
                if (!this.sellerHasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
 					this.$Request.post('seller_index/getsellerset').then(res => {
						if (res.code == 200) {
							console.log(res);
							let _sinfo = _this.sellerInfo;
							_sinfo.phone_show = res.datas.phone_show;
							_sinfo.phone = res.datas.phone;
							_sinfo.ppset = res.datas.ppset;
							_this.setSellerInfo(_sinfo);							
							_this.storeInfo = _sinfo;
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
				if(url=='ppwd' && this.storeInfo.ppset==0){
					url='findppwd'
				}
				uni.navigateTo({
					url:url,
				})
			},
			toLogout: function(url) {
				this.sellerLogout();
				uni.switchTab({
					url:'/pages/member/home',
				});
			}
			 
        }  
    }  
</script> 

<style>
	@import "../../static/css/store.css";
	page{background: #F5F5F5;}
</style>

