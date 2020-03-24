<template>
	<view>
		<view class="action-bar mb10 mt10">
			<view style="width:100%;">
			<sl-filter :independence="true" :color="titleColor" :themeColor="themeColor" :menuList.sync="menuList" @result="result"></sl-filter>
			</view>
		</view>
		<view v-for="(item ,index) in list" :key="index">
	<view class="txlist">
		<view class="item fl">
			<view class="num"><text>NO.</text>{{item.pdc_sn}}</view>
			<view class="money">{{item.pdc_amount}}元<text class="date" v-if="item.pdc_payment_state==1">{{item.pdc_payment_time_text}}</text>
			<text class="date" v-if="item.pdc_payment_state==0">{{item.pdc_add_time_text}}</text>
			</view>
		</view>
		<view class="item2 fr">
			<view class="txtype"><view class="icon"></view>{{item.pdc_b_text}}</view>
			<view class="state"><text>状态：</text>{{item.pdc_payment_state_text}}</view>
		</view>
	</view>
	</view>
		<view class="loading-text">{{ loadingText }}</view>
	</view>
</template>


<script>  
	import slFilter from '@/components/sl-filter/sl-filter.vue';
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
				//控制滑动效果
				theIndex:null,
				oldIndex:null,
				isStop:false,
				menuList: [
					{
						'title': '排序',
						'key': 'sort',
						'isSort': true,
						'reflexTitle': true,
						'detailList': [{
								'title': '默认排序',
								'value': ''
							},
							{
								'title': '兑换时间升',
								'value': 'dhasc'
							},
							{
								'title': '兑换时间降',
								'value': 'dhdesc'
							},
							{
								'title': '到期时间升',
								'value': 'dqasc'
							},
							{
								'title': '到期时间降',
								'value': 'dqdesc'
							}
						]
					},
					{
						'title': '状态',
						'key': 'state',
						'isSort': true,
						'reflexTitle': true,
						'detailList': [{
								'title': '全部',
								'value': '0'
							},
							{
								'title': '成功',
								'value': '1'
							},
							{
								'title': '未成功',
								'value': '2'
							},
							{
								'title': '审核中',
								'value': '3'
							}
						]
					}
				],
				bysort:'',
				state:0
			}				
		},
		components: {slFilter},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
         onReachBottom() {
             console.log('下拉加载...');
			 this.curpage++;
			 this.loadData();
         },
         onPageScroll(){
             console.log('页面滚动...');
         },
         onPullDownRefresh() {
             console.log('上拉刷新...');
             uni.stopPullDownRefresh();
         },
        methods: {   
			result(val) {
				console.log(val);
				let _data = JSON.parse(JSON.stringify(val));
				let _keys = Object.keys(_data);
				console.log(_keys);
				if(_keys[0]=='state'){
					if(_data['state']!=this.state){
						this.state=_data['state'];
						this.clearData();
						this.loadData();
					}
				}else if(_keys[0]=='sort'){
					if(_data['sort']!=this.bysort){
						this.bysort=_data['sort'];
						this.clearData();
						this.loadData();
					}
				}
			}, 
			clearData(){
				this.list =[];
				this.loadingText='正在加载...';
				this.hasmore=true;
				this.curpage=1;
			}, 
            async loadData() {  
				var _this = this;
				console.log('===userInfo==='+this.hasLogin);
				console.log(this.userInfo);
				console.log(this.userInfo.token);
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					if(!this.hasmore){
						this.loadingText = '暂无更多信息';
						return false;
					}
					_this.$Request.post('member_fund/pdcashlist',{curpage:_this.curpage,state:_this.state,bysort:_this.bysort}).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.hasmore =res.hasmore;
							console.log(_this.hasmore);
							let _list = res.datas.list;
							for(var i=0;i<_list.length;i++){
								_this.list.push(_list[i]);
							}
							if(!_this.hasmore){
								_this.loadingText = '暂无更多信息';
							}
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
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			//控制左滑删除效果-begin
			touchStart(index,event){
				console.log('====touchStart====');
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX,event.touches[0].pageY];
			},
			touchMove(index,event){
				console.log('====touchMove====');
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
				
				if(this.isStop||Math.abs(moveX)<5){
					return ;
				}
				if (Math.abs(moveY) > Math.abs(moveX)){
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}
				
				if(moveX<0){
					this.theIndex = index;
					this.isStop = true;
				}else if(moveX>0){
					if(this.theIndex!=null&&this.oldIndex==this.theIndex){
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(()=>{
							this.oldIndex = null;
						},150)
					}
				}
			},
			touchEnd(index,$event){
				console.log('====touchEnd====');
				//结束禁止触发效果
				this.isStop = false;
			},
			//控制左滑删除效果-end
			deleteVoucher(voucher_id){
				var _this = this;
				console.log('====deleteVoucher====');
				_this.$Request.post('member_voucher/voucherdelete',{voucher_id:voucher_id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						let len = _this.list.length;
						for(let i=0;i<len;i++){
							if(voucher_id==_this.list[i].voucher_id){
								_this.list.splice(i, 1);
								break;
							}
						}
						_this.oldIndex = null;
						_this.theIndex = null;
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
<style lang="scss">
	page{position: relative;background: #F5F5F5}
	@font-face {font-family:"HMfont-home";src:url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAOEAAsAAAAAB7wAAAM1AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqDAIJNATYCJAMQCwoABCAFhG0HPhu1BsiOw7jha84s8T+CgOyq6unevTlAeAkRhAhQBjj8eJfmMg/oB5whSgaFspy7AqbpwE3Py3/j9j+X07uGyFHr21lua9HYi9rUCzDeGtBYmw4o0AJJ0BvGLmiJxyEAC3yIQhSVPL9BF4U5TgBi7ChtQzfjQKFYWEdgrFiqEBsxoGurtMfAhuD74g8JQgcNg8ScWjf8xoPz7/nfD8iFpoV0eQi86XQAWwUSiAIUiJGVhgEaUSAKiYXau0kKoKOjwVRthd8PmExIBRvmWH95INCQIIyYqVYAJKGghO/5Dg4B3wtxaPD9QAoS4IOM1gEzYBbAMkT16iIQGPxsopS5ScAcK23LiaBDpzyk1aGLHtsvhVrL7adDD55016wPXnDfcr7T3lcE2TVcP2fNhZM7WeiEhVp44vx9C5vVD6+eEgaLTZvEot3HL1lawlnXLK3XnISDllbWwmrmGjlRLdxq2bpme1RAeqXtzWh6g0F//wCCnRiN2diwr2+Yse3iEs20g05Q5tT0BikOXwKf79vsoEvb6p6xjVhHP92nwDJmX+9hwsf26dXbPiNvZ/98x67/+5T+ev0aWxbXCwOX41zLxia+O73B6Y57fN1u6GvN+Zmbc8XITigTAcB0Rl6X8QB4hDgEpoXypZz2q37D5FVnVa9t1n/dUgHw8uKMq9BmWqjoJoP3zevM+zG8jmVKE5hKpRShw9WTFZW04D7TscAC+B0RcOD9FHLnzqkg0HFOQMMMb5DoBKGKGgUGLEkCIzq5YEEkpastcWQyDYQyByJYBkBgx2nQsOEaSOx4girqOzDgwj8wYickWNAiHLe0JESMsiicTLaQh84PBm6WKlst/TD9hXQV25wWBLQP4jJw435MXD58RynxFDPKT30golBxluAtOI3iOMOcs5Bc2fFF8sPd2OFVBO24WQJ9CmEIG4HwQAb4ARmFS0aK8qoL/cLnXyA0FTE23FBSZf+AYEqCzpF4YojrgN5J004lt/LKFD7RHDAVQYEMh8lIQErAICImJgOZWD0ohHARdhg5wJdzSKxVaXhX6c7y8uQN1wAWmLOU0IQUShiQo0fZTceadqaMdP2uXwEAAAAA') format('woff2');}
	.icon {
		font-family:"HMfont-home" !important;
		font-size:48upx;
		font-style:normal;
		color:#000000;
		&.shanchu {
			&:before{content:"\e6a4";}
		}
	}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
		z-index: 4;
		border: 0;
		.menu{
			.icon{
				color: #fff;
			}
			position: absolute;
			width:25%;
			height: 100%;
			right: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color:#00BAAD;
			color: #fff;
			z-index: 2;
		}
		.carrier{
			@keyframes showMenu {
				0% {transform: translateX(0);}100% {transform: translateX(-30%);}
			}
			@keyframes closeMenu {
				0% {transform: translateX(-30%);}100% {transform: translateX(0);}
			}
			&.open{
				animation: showMenu 0.25s linear both;
			}
			&.close{
				animation: closeMenu 0.15s linear both;
			}
			background-color: #fff;
			position: absolute;
			width: 100%;
			padding: 0 0;
			height: 100%;
			z-index: 3;
			display: flex;
			align-items: center;
		}
	}
</style>

