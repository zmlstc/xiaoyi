<template>
	<view>
		<form @submit="formSubmit">
		<view class="set-column mb2 mt20">
			<view class="item3">
				<text class="title">旧密码</text>
			</view>
			<view class="item4">
				<input password type="text" placeholder="输入旧登陆密码" v-model="opwd" maxlength="20" />
			</view>
		</view>
		<view class="set-column mb2">
			<view class="item3">
				<text class="title">新密码</text>
			</view>
			<view class="item4">
				<input password type="text" placeholder="输入新登陆密码" v-model="newpwd" maxlength="20" />
			</view>
		</view>
		<view class="set-column mb2">
			<view class="item3">
				<text class="title">确认密码</text>
			</view>
			<view class="item4">
				<input password type="text" placeholder="再次输入新登陆密码" placeholder-class="pl-class" v-model="newpwd2" maxlength="20" />
			</view>
		</view>
	
		
		<button class="btn mt40" formType="submit"  bindtap="sumbit" :disabled="logining">确认修改</button>
		<view class="warn mt10"><text   @tap="toPage('/pages/member/findpwd')">忘记密码？</text></view>
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
        computed: mapState(['hasLogin','userInfo']),
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
        methods: {  
			...mapMutations(['logout','setUserInfo']),
            async loadData() {  
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'../login',
					})
                }else{
					this.memberInfo = this.userInfo;

				}
            },
			formSubmit: function (e) {
				var _this =this;
				
				if(_this.opwd.length<6||_this.opwd.length>20){ 
					uni.showToast({title: '请填写正确的旧密码',icon:"none"});
					return false; 
				}
				if(!(/^(?=.*?[a-z)(?=.*>[A-Z])(?=.*?[0-9])[a-zA_Z0-9]{6,10}$/.test(_this.newpwd)) ){ 
					uni.showToast({title: '密码必须大于6位包含数字和字母',icon:"none"});
					return false; 
				}
				if(_this.newpwd!=_this.newpwd2 ){ 
					uni.showToast({title: '两次输入的密码不一致',icon:"none"});
					return false; 
				}
				_this.logining =true;
				console.log('-----check-----------');
				_this.$Request.post('member_account/modify_pwd',{opwd:_this.opwd,newpwd:_this.newpwd,newpwd2:_this.newpwd2}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.logout();
						uni.showToast({
							icon: 'none',
							title:'修改成功！',
							duration:2000,
							success: function () {
								 setTimeout(function () {
									uni.redirectTo({
										url:'../login',
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
			},
			toPage(url){
				uni.navigateTo({
					url:url
				})
			},
			 
        }  
    }  
</script> 
<style>
	page{background: #F5F5F5;}
</style>