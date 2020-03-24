<template>
	<view>
		<view class="cash-mode bf b-line mt30">
			<view class="item">
				<view class="wxpay"></view>
				<view class="content">
					<view class="name">微信支付账号</view>
					<view class="acc">请帮定您的微信提现账号</view>
				</view>
			</view>
		<view class="item2">
			<view class="add" @tap="toPage('payadd')"></view>
		</view>
	</view>
		<view class="cash-mode bf b-line">
			<view class="item">
				<view class="alipay"></view>
				<view class="content">
					<view class="name">支付宝账号</view>
					<view class="acc">fh****oh@163.com</view>
				</view>
			</view>
			<view class="item2">
				<view class="edit" @tap="toPage('payedit')"></view>
			</view>
	</view>
	<view class="tips mt10">
		<text>1. 平台暂仅支持支付宝、微信两种提现方式，均需进行设置方可正常使用；
		2. 提现方式为自动转账，平台商家完成交易后，资金会自动转账到您设置的提现账号里；
		</text>
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
				txwaylist:[],
				current:0
			}				
		},
		computed: mapState(['sellerHasLogin']),
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
		onShow(){
			 if (!this.sellerHasLogin) {  
				uni.navigateTo({
					url:'../login',
				})
			}
		},
        methods: {  
            async loadData() {  
				var _this = this;
                if (!this.sellerHasLogin) {  
					uni.navigateTo({
						url:'../login',
					})
                }
				
				_this.$Request.post('seller_fund/txwaylist').then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.txwaylist = res.datas.list;
					}
				}).catch(function (err) {
					console.log(err);
				  });
            },
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			checkTxWay(id){
				for (let i = 0; i < this.txwaylist.length; i++) {
					if (this.txwaylist[i].id === id) {
						this.current = id;
						this.txwaylist[i].is_default=0;
						//break;
					}
					this.txwaylist[i].is_default=0;
				}
				this.$Request.post('seller_fund/isdefaut',{id:id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.navigateTo({
							url:"tx", 
							success (res) { 
								let page = getCurrentPages().pop(); 
								if (page == undefined || page == null) { 
								  return ;
								 } 
								 page.onLoad() ;
							}
						})
						
					}
				});
			}
			 
        }  
    }  
</script> 

<style lang="scss">
	@import "../../../static/css/store.css";
	page{background: #f5f5f5;}
</style>