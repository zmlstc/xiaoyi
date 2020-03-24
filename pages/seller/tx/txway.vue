<template>
	<view>
		<view class="cash-mode bf b-line"  v-for="(item ,index) in txwaylist" :key="index" >
			<view class="item">
				<view :class="item.bill_type_code"></view>
				<view class="content">
					<view class="name" v-if="item.bill_type_code=='wxpay'">微信提现</view>
					<view class="name" v-if="item.bill_type_code=='alipay'">支付宝账号</view>
					<view class="acc">{{item.bill_type_number_txt}}</view>
				</view>
			</view>
			
			<view class="item2">
				<view class="edit" @tap="toPage('alipay?id='+item.id)" v-if="item.bill_type_code=='alipay'"></view>
				<view class="edit" @tap="toPage('wxpay?id='+item.id)" v-if="item.bill_type_code=='wxpay'"></view>
			</view>
		</view>
		<view class="cash-mode bf b-line"  v-if="have_wx==0">
				<view class="item">
					<view class="wxpay"></view>
					<view class="content">
						<view class="name">微信支付账号</view>
						<view class="acc">请帮定您的微信提现账号</view>
					</view>
				</view>
			<view class="item2">
				<view class="add" @tap="toPage('wxpay')"></view>
			</view>
		</view>
		<view class="cash-mode bf b-line" v-if="have_alipay==0">
			<view class="item">
				<view class="alipay"></view>
				<view class="content">
					<view class="name">支付宝账号</view>
					<view class="acc">请帮定您的微信提现账号</view>
				</view>
			</view>
			<view class="item2">
				<view class="add" @tap="toPage('alipay')"></view>
			</view>
		</view>
		
		
	<!--view class="btn mt20 mb20" @tap="toPage('txtype')">添加提现方式</view-->
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
				current:0,
				have_wx:0,
				have_alipay:0
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
						_this.have_alipay = res.datas.alipay;
						_this.have_wx = res.datas.wx
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
				/* for (let i = 0; i < this.txwaylist.length; i++) {
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
				}); */
			}
			 
        }  
    }  
</script> 
<style lang="scss">
	@import "../../../static/css/store.css";
	page{background: #f5f5f5;}
</style>