<template>
	<view>
		<form @submit="formSubmit">
		<view class="set-column mb2 mt20">
			<view class="item3">
				<text class="title">旧支付密码</text>
			</view>
			<view class="item4">
				<input password type="text" placeholder="输入旧支付密码" v-model="opwd" maxlength="20" />
			</view>
		</view>
		<view class="set-column mb2">
			<view class="item3">
				<text class="title">新支付密码</text>
			</view>
			<view class="item4">
				<input password type="text" placeholder="输入新支付密码" v-model="newpwd" maxlength="6" />
			</view>
		</view>
		<view class="set-column mb2">
			<view class="item3">
				<text class="title">确认支付密码</text>
			</view>
			<view class="item4">
				<input password type="text" placeholder="再次输入新支付密码" v-model="newpwd2" maxlength="6" />
			</view>
		</view>
		
		<button class="btn mt40" formType="submit" type="primary" :disabled="logining">确认修改</button>
		</form>
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
				opwd:'',
				newpwd:'',
				newpwd2:'',
				logining: false
			}				
		},
        computed: mapState(['sellerHasLogin']), 
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
        methods: {  
            async loadData() {  
                if (!this.sellerHasLogin) {  
                	uni.navigateTo({
                		url:'login',
                	})
                }
            },
			formSubmit: function (e) {
				var _this =this;
				
				if(_this.opwd.length<6||_this.opwd.length>20){ 
					uni.showToast({title: '请填写正确的旧密码',icon:"none"});
					return false; 
				}
				/* if(!(/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(_this.newpwd)) ){ 
					uni.showToast({title: '密码必须大于6位包含数字和字母',icon:"none"});
					return false; 
				} */
				if(!(/^[0-9]*$/.test(_this.newpwd) ||_this.newpwd.length!=6) ){ 
					uni.showToast({title: '密码必须6位数字',icon:"none"});
					return false; 
				}
				if(_this.newpwd!=_this.newpwd ){ 
					uni.showToast({title: '两次输入的密码不一致',icon:"none"});
					return false; 
				}
				_this.logining =true;
				console.log('-----check-----------');
				_this.$Request.post('seller_index/modify_ppwd',{opwd:_this.opwd,newpwd:_this.newpwd,newpwd2:_this.newpwd2}).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'修改成功！',
							duration:2000,
							success: function () {
								 setTimeout(function () {
									uni.redirectTo({
										url:'safeset',
									});
								 }, 2000);
							}
						});
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						_this.logining = false;
					}
				}).catch(function (err) {
					console.log(err);
				  });
			}
			 
        }  
    }  
</script> 
<style>
	page{background: #F5F5F5;}
</style>