<template>
	<view>
		<view class="column bf mt20 mb2">
			<view class="item f-r">优惠券名</view>
			<view class="item4">
				<input placeholder="填写优惠券名称，不超过14个字" placeholder-class="pl-class" v-model="title" maxlength="14" class="w80"/>
			</view>
		</view>
		<view class="column bf mb2">
			<view class="item f-r">面额</view>
			<view class="item4">
				<picker @change="bindPickerChange" :value="index" :range="pricelist">
					<view class="select">{{pricelist[index]}} 元</view>
				</picker>
			</view>
		</view>
		<view class="column bf mb2">
			<view class="item f-r">消费金额</view>
			<view class="item4 f-l">
				<input placeholder="消费金额" type="digit" placeholder-class="pl-class" v-model="t_limit" maxlength="5" class="fl w30 fc"/>元
			</view>
		</view>
		<view class="column bf mb2">
			<view class="item f-r">有效期限</view>
			<view class="item4">
				<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
					<view class="select">{{date}}</view>
				</picker>
			</view>
		</view>
		<view class="column bf mb2">
			<view class="item f-r">发放数量</view>
			<view class="item4 f-l">
				<input placeholder="1" type="number" placeholder-class="pl-class" v-model="total" maxlength="4"  class="fl w15 fc"/>张
			</view>
		</view>
		<view class="column bf mb2">
			<view class="item f-r">每人限领</view>
			<view class="item4 f-l">
				<input placeholder="1" type="number" placeholder-class="pl-class" v-model="eachlimit" maxlength="4" class="fl w15 fc"/>张
			</view>
		</view>
		<!--view class="column bf mb2">
			<view class="item f-r">使用规则</view>
			<view class="item4">
				<text>每次消费使用一次</text>
			</view>
		</view-->
		<view class="tips">
			<text>提交后仅可删除无法修改，请确认设置正确；
			每次消费仅可使用1张优惠券。</text>
		</view>
		<button class="btn mt40 mb20" @click="formSubmit" :disabled="logining">确认提交</button>
	</view>
</template>

<script>  
    import {  
        mapState,  
        mapMutations  
    } from 'vuex';  
    export default {  
		data() {
			const currentDate = this.getDate({format: true});
			return {
				title:'',
				price:'',
				t_limit:'',
				total:'',
				pricelist:[],
				index:0,
				logining: false,
				date: currentDate,
				eachlimit:1
			}				
		},
		computed:mapState(['sellerHasLogin']), 
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
		
        methods: {   
            async loadData() {  
				let _this=this;
				console.log('===sellerHasLogin==='+this.sellerHasLogin);
				
                if (!_this.sellerHasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					_this.$Request.post('seller_voucher/voucher_add').then(res => {
						if (res.code == 200) {
							console.log(res);
							//this.login(res.datas);
							_this.pricelist = res.datas.price_list;
							_this.price = _this.pricelist[0];
						}
						else{
							uni.showToast({
								icon: 'none',
								title:res.datas.error,
								duration:3000,
								success: function () {
									 setTimeout(function () {
										uni.navigateTo({
											url:'/pages/seller/seller',
										});
									 }, 2000);
								}
							});
							
						}
					});
				}
            },
			formSubmit: function (e) {
				var _this =this;
				if(this.title ==''){ 
					uni.showToast({title: '请填写优惠券名称',icon:"none"});
					return false; 
				}
				if(this.price ==''){ 
					uni.showToast({title: '请填写优惠券金额',icon:"none"});
					return false; 
				}
				if(this.t_limit ==''){ 
					uni.showToast({title: '请填写优惠券消费限额',icon:"none"});
					return false; 
				}
				if(this.total ==''){ 
					uni.showToast({title: '请填写优惠券发放数量',icon:"none"});
					return false; 
				}
				if(this.eachlimit ==''){ 
					uni.showToast({title: '请填写优惠券每人限领数量',icon:"none"});
					return false; 
				}
				
				_this.logining =true;
				let postData={t_title:_this.title,t_total:_this.total,t_price:_this.price,t_limit:_this.t_limit,
						t_enddate:_this.date,t_eachlimit:_this.eachlimit};
				_this.$Request.post('seller_voucher/voucher_save',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'添加成功！',
							duration:3000,
							success: function () {
								 setTimeout(function () {
									uni.redirectTo({
										url:'coupon',
									});
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
				});
			
				
			},
			bindPickerChange: function(e) {
				console.log(e);
				this.index = e.target.value;
				this.price = this.pricelist[e.target.value];
			},
			bindDateChange: function(e) {
				this.date = e.target.value
				console.log(this.date);
			},	
			getDate(type) {
				const date = new Date();
			
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
			
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
			
				return `${year}-${month}-${day}`;
			}
			 
        }  
    }  
</script>  

<style>
	@import "../../../static/css/store.css";
	page{background: #F5F5F5;}
</style>
