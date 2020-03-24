<template>
	<view class="content">
		<view></view>
          <view class="btn mt40" type="primary" @tap="open">扫描二维码</view>
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
				text: '',
				type:'scan-listener',
				result:''
				
			}
		},
        computed: mapState(['hasLogin','userInfo']),
		methods: {
		 	open() {
				
				this.toScan();
			}, 
			toScan(){
				let _this = this;
				uni.scanCode({
					success: function (res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						let url =  res.result;
						
						if(url.indexOf('pay_sid')>-1){
							if (!_this.hasLogin) {
								uni.showToast({
									icon: 'none',
									title:'您尚未登陆，请立即登陆或注册！',
									duration:2000,
								});
								uni.redirectTo({
									url:'login',
								});
								return false;
							}
							let id = url.replace('https://www.fhlego.com/mobile/index.php?pay_sid=','');
							console.log(id);
							if(/^\d+$/.test(id)){
								console.log('==='+id);
							}
							uni.navigateTo({
								url:"/pages/store/pay?store_id="+id,
							})
						}else if(url.indexOf('store_id')>-1){
							let id = url.replace('https://www.fhlego.com/mobile/index.php?store_id=','');
							console.log(id);
							if(/^\d+$/.test(id)){
								console.log('==='+id);
							}
							uni.navigateTo({
								url:"/pages/store/index?store_id="+id,
							})
						}else if(url.indexOf('ubm=')>-1){
							let bm = url.replace('https://www.fhlego.com/mobile/index.php?ubm=','');
							console.log(bm);
							uni.navigateTo({
								url:"/pages/member/register/userreg?bm="+bm,
							})
						}else if(url.indexOf('sbm=')>-1){
							let bm = url.replace('https://www.fhlego.com/mobile/index.php?sbm=','');
							console.log(bm);
							uni.navigateTo({
								url:"/pages/member/register/shopreg?bm="+bm,
							})
						}else if(url.indexOf('POINTS:')>-1){
							 if (!_this.sellerHasLogin) {  								
								uni.showToast({
									icon: 'none',
									title:'请先登录商家中心！',
									duration:2000,
								});
							}
							let info = url.replace('POINTS:','');
							uni.navigateTo({
								 url:'/pages/seller/pointconfirm?udata='+info
							 });
						}
						
					/* 	 uni.showLoading({title: '正在处理中...'});
					 */
					}
				});
			}
		},
		onReady() {
			// #ifdef APP-PLUS
			// #endif
		},
		onLoad() {
			
			this.toScan();
			
		},
		onBackPress() {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary')
			// #endif
		}

	}
</script>

<style>
	.content{
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
.btn{
	width: 50%;
}
</style>
