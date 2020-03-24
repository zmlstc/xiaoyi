<template>
	<view class="mian">
		
		<view class="welcome mb40">
			<view class="title">欢迎入驻小易共享平台</view>
			<view class="text">花一分钟完成注册</view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5">店铺名称</view>
			<view class="item6">
				<input  placeholder="店铺名称2-12个字符" placeholder-class="pl-class" v-model="store_name" maxlength="50" /></view>
			</view>
		<view class="nav-reg b-line">
			<view class="item5">用户名</view>
			<view class="item6">
				<input placeholder="店铺登录名4-10个字符" placeholder-class="pl-class" @blur="checkseller_name" v-model="seller_name" maxlength="20" minlength="6" /></view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5">密码</view>
			<view class="item6">
				<input class="input-text" @blur="checkpwd1" password  placeholder="填写商家登录密码" placeholder-class="pl-class" v-model="pwd" maxlength="20" /></view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5">确认密码</view>
			<view class="item6">
				<input class="input-text" @blur="checkpwd2" password placeholder="重复确认密码" placeholder-class="pl-class" v-model="pwd2" maxlength="20" /></view>
		</view>
		<view class="btn mt40 mb20"  @click="shopReg">完成入驻</view>
	</view>
</template>
<script> 
    export default {  
		data() {
			return {
				store_name:'',
				seller_name:'',
				pwd:'',
				pwd2:'',
				tky:''
			}				
		},
		onLoad(e) {
			 console.log('页面加载');
			 this.tky=e.tk;
			//this.loadData();
		},
        methods: { 
			checkseller_name(e){
				let _seller_name= e.detail.value;
				console.log(_seller_name);
			/* 	if(!(/(?=.*\d+)^[a-zA-Z]\w{5,11}$/.test(_seller_name))){ 
					uni.showToast({title: '登陆名以字母开头包含数字',icon:"none"});
					return false; 
				} */
				if(_seller_name.length<4||_seller_name.length>20){ 
						uni.showToast({title: '登陆名为4-20位字符',icon:"none"});
						return false; 
					}
				
				this.$Request.post('store_joinin/check_seller_name',{seller_name:_seller_name,type:1}).then(res => {
					if (res.code == 200) {
						console.log(res);
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						
					}
				});
			},
			/* checknickname(e){
				let _nickname= e.detail.value;
				if(!(/[^\u4e00-\u9fa5a-zA-Z\d,\_-]+/.test(_nickname)) ){ 
					uni.showToast({title: '昵称必须为中文',icon:"none"});
					return false; 
				}
			}, */
			checkpwd1(e){
				///^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/
				let _pwd1= e.detail.value;
				if(!(/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(_pwd1)) ){ 
					uni.showToast({title: '密码必须大于6位且包含数字和字母',icon:"none"});
					return false; 
				}
			},
			checkpwd2(e){
				if(this.pwd!=this.pwd2 ){ 
					uni.showToast({title: '两次输入的密码不一致',icon:"none"});
					return false; 
				}
			},
			shopReg(){
				/* if(!(/(?=.*\d+)^[a-zA-Z]\w{5,11}$/.test(this.seller_name))){ 
					uni.showToast({title: '用户名以字母开头包含数字',icon:"none"});
					return false; 
				} */
				if(this.seller_name.length<4||this.seller_name.length>20){ 
						uni.showToast({title: '登陆名为4-20位字符',icon:"none"});
						return false; 
					}
				if(this.store_name.length<2){ 
					uni.showToast({title: '店铺名称为2-12个字符',icon:"none"});
					return false; 
				}
				if(!(/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(this.pwd)) ){ 
					uni.showToast({title: '密码必须大于6位包含数字和字母',icon:"none"});
					return false; 
				}
				if(this.pwd!=this.pwd2 ){ 
					uni.showToast({title: '两次输入的密码不一致',icon:"none"});
					return false; 
				}
				
				let postData={seller_name:this.seller_name,store_name:this.store_name,type:1,
						seller_pwd:this.pwd,tky:this.tky};
				this.$Request.post('store_joinin/step4',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'已完成店铺入驻申请，请等待平台审核！',
							duration:3000,
							success: function () {
								 setTimeout(function () {
									uni.switchTab({
										url:'/pages/index/index',
									});
								 }, 2000);
							}
						});
						/* uni.switchTab({
							url:'/pages/index/index',
						}); */
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						
					}
				});
				
				
			}
			 
        }  
    }  
</script> 

<style>
	@import "../../../static/css/register.css";
</style>
