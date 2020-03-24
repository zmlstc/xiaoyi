<template>
	<view>
		<view class="sign-in">
			<view class="tip">共签到<text>{{info.num}}</text>次，累计获得<text>{{info.points}}</text>积分</view>
			<view class="button no" v-if="info.type==1" @tap="signin">今日未签到</view>
			<view class="button over" v-if="info.type==0">今日已签到</view>
		</view>
		<view class="frame">
			<dd></dd>
			<view class="sign-h3 mb10">签到记录</view>
			<view class="info" v-for="(item ,index) in list":key="index">
				<view class="left">签到成功，获得积分 {{item.sl_points}} 点</view>
				<view class="right">{{item.sl_addtime_text}}</view>
			</view>
			
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
				list:[],
				loadingText: '正在加载...',
				hasmore:true,
				curpage:1,
				isStop:false,
				info:[]
			}				
		},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad() {
			 console.log('页面加载');
			this.loadData();
			this.loadlist();
		},
         onReachBottom() {
			 this.curpage++;
			 this.loadlist();
         },
        methods: {   
            async loadData() {  
				var _this = this;
				console.log('===userInfo==='+this.hasLogin);
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					_this.$Request.post('member_signin').then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.info =res.datas;
							
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
			loadlist() {  
				var _this = this;
				console.log('===userInfo==='+this.hasLogin);
			    if (!this.hasLogin) {  
					uni.navigateTo({
						url:'login',
					})
			    }else{
					if(!this.hasmore){
						this.loadingText = '暂无更多信息信息';
						return false;
					}
					_this.$Request.post('member_signin/signin_list',{curpage:_this.curpage}).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.hasmore =res.hasmore;
							console.log(_this.hasmore);
							let _conslist = res.datas.signin_list;
							for(var i=0;i<_conslist.length;i++){
								_this.list.push(_conslist[i]);
							}
							if(!this.hasmore){
								this.loadingText = '暂无更多信息信息';
								return false;
							}
						}
					});
				}
			},
			signin(){
				let _this = this;
				
				_this.$Request.post('member_signin/signin_add').then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.curpage =1;
						_this.list=[];
						_this.hasmore =true;
						_this.loadData();
						_this.loadlist();
						uni.showToast({
							icon: 'none',
							title:'签到成功！',
							duration:2000
						});
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
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			 
        }  
    }  
</script> 

<style>
	page{background: #F5F5F5;}
</style>
