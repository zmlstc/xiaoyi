<template>
	<view class="content">
		<view class="share-bar b-line">
			<view class="item">共<text>{{num}}</text>位</view>
			<view class="item2">
				<view class="sc-bar">
					<input type="text" value="" :placeholder="placeholder" class="sc_area" v-model="keyword" />
					<view class="sc_submit" @tap="submitSearch">搜 索</view>
				</view>	
			</view>
		</view>
		<view class="share-list b-line"  v-for="(item ,index) in list":key="index">
			<view class="item">
				<image class="icon fl" :src="item.avatar"></image>
				<text class="ml10 fl">{{item.nickname}}</text>
			</view>
			<view class="date fr f-r">{{item.date}}</view>
		</view>
		<view class="loading-text">{{ loadingText }}</view>
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
				num:0,
				placeholder: '输入会员名称',
				keyword:''
			}				
		},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad() {
			console.log('页面加载');
			this.loadInvietNum();
			this.loadData();
		},
         onReachBottom() {
			 this.curpage++;
			 this.loadData();
         },
        methods: {  
			loadInvietNum(){
				let _this = this;
				let postData = {};
				if(_this.keyword!=''){
					postData = {keyword:_this.keyword};
				}
				_this.$Request.post('member_invite/minvitenum',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.num=res.datas.num;
					}
				});
			},
            async loadData() {  
				var _this = this;
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					if(!this.hasmore){
						this.loadingText = '暂无更多信息信息';
						return false;
					}
					let postData = {curpage:_this.curpage};
					if(_this.keyword!=''){
						postData = {curpage:_this.curpage,keyword:_this.keyword};
					}
					_this.$Request.post('member_invite/memberlist',postData).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.hasmore =res.hasmore;
							console.log(_this.hasmore);
							let _conslist = res.datas.list;
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
			submitSearch: function() {
				this.hasmore=true;
				this.loadingText = '正在加载...';
				this.list=[];
				this.loadInvietNum();
				this.loadData();
			},
			 
        }  
    }  
</script> 
<style lang="scss">
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
	}
</style>
