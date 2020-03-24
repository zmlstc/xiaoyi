<template>
	<view>
		<view class="set-column mb2 mt20" @tap="toPage('/pages/member/set/password')">
			<view class="item">
				<text>登录密码</text>
			</view>
			<view class="itme2"><text>修改</text><view class="icon"></view></view>
		</view>
		<view class="set-column mb2"  @tap="toSetPPay()">
			<view class="item">
				<text>支付密码</text>
			</view>
			<view class="itme2"><text>修改</text><view class="icon"></view></view>
		</view>
		<!--view class="set-column mb2">
			<view class="item">
				<text>指纹验证</text>
			</view>
			<view class="itme2"><switch color="#00BAAD"/></view>
		</view>
		<view class="set-column mb2">
			<view class="item">
				<text>刷脸验证</text>
			</view>
			<view class="itme2"><switch color="#00BAAD"/></view>
		</view>
		<view class="set-column mb2">
			<view class="item">
				<text>隐私保护</text>
			</view>
			<view class="itme2"><switch color="#00BAAD"/></view>
		</view-->
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
				pp_state:true
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
							_this.pp_state = res.datas.p_state;
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
			toSetPPay: function() {
				let url = '/pages/member/set/ppassword';
				if(!this.pp_state){
					url = '/pages/member/set/getppwd';
				}
				uni.navigateTo({
					url:url,
				})
			},
        }  
    }  
</script> 
<style lang="scss">
	page{background: #F5F5F5}
</style>