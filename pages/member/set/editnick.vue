<template>
	<view>
		<form @submit="formSubmit">
		<view class="set-column mb5 mt20">
			<view class="item3">
				<text class="title">昵称</text>
			</view>
			<view class="item4">
				<input type="text" focus='{true}' :value="memberInfo.nickname" maxlength="10" data-key="username" name="username"/>
			</view>
		</view>
		<view class="tips">
			<view class="icon"></view>
			<text>以中文或英文字母开头，限2-10个汉字。昵称修改次数不限。</text>
		</view>
		<button class="btn mt40" formType="submit" bindtap="sumbit" hover-class="btn-hover">确认提交</button>
		</form>
	</view>
</template>
<script>
 let graceChecker = require("../../../static/js/graceChecker.js");
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
			...mapMutations(['setUserInfo']),
            async loadData() {  
                if (!this.hasLogin) {  
					uni.redirectTo({
						url:'../login',
					})
                }else{
					this.memberInfo = this.userInfo;

				}
            },
			formSubmit: function (e) {
				var _this =this;
				var formData = e.detail.value;
				console.log(formData);
				var rule = [
					{name:"username", checkType : "string", checkRule:"2,8",  errorMsg:"昵称必须为2-8个字符"}
				];
				var checkRes = graceChecker.check(formData, rule);
				if(!checkRes){
					uni.showToast({ title: graceChecker.error, icon: "none" });
					return false;
				}
				console.log('-----check-----------');
				_this.$Request.post('member_account/editnick',{nickname:formData.username,client:'wap'}).then(res => {
					if (res.code == 200) {
						console.log(res);
						let user_info = _this.userInfo;
						user_info.nickname = formData.username;
						_this.setUserInfo(user_info);
						uni.showToast({
							icon: 'none',
							title:'修改成功！',
							duration:2000,
							success: function () {
								 setTimeout(function () {
									uni.redirectTo({
										url:'userset',
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
<style lang="scss">
	page{background: #F5F5F5}
</style>