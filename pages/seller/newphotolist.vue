<template>
	<view>
		<view class="column bf mt10">
			<view class="item f-r">名称</view>
			<view class="item4"><input v-model="ac_name" placeholder="输入相册名称" placeholder-class="pl-class" class="mt5 f-l"></input></view>
		</view>
		<!--view class="column bf">
			<view class="item f-r">描述</view>
			<view class="item4"><input v-model="ac_des" placeholder="输入相册描述(选填)" placeholder-class="pl-class" class="mt5 f-l"></input></view>
		</view-->
		<view class="column bf">
			<view class="item f-r">排序</view>
			<view class="item4"><input type="number" maxlength="3" v-model="ac_sort" placeholder="输入相册序号,数字越大越靠前" placeholder-class="pl-class" class="mt5 f-l"></input></view>
		</view>
		<view class="btn mt40" @click="toPost">确认提交</view>
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
				id: '',
				ac_des: '',
				ac_sort: '',
				ac_name: '',
				cate: [],
				store_desc: '',
				store_phone: '',
				wtime_start: '',
				wtime_end: '',
				store_map_address_detail: '',
				flist: [],
				selectflist: []
			}
		},
		computed: mapState(['sellerHasLogin']),
		onLoad() {
			console.log('页面加载');
			this.loadData();
		},
		methods: {
			//...mapMutations(['logout','setUserInfo']),  
			async loadData() {
				if (!this.sellerHasLogin) {
					uni.navigateTo({
						url: 'login',
					});
				} else {
					
				}
			},
			toPost() {
				var _this = this;
				let postData = {
					name: this.ac_name,
					description: this.ac_des,
					sort: this.ac_sort,
				}
				console.log(postData)
				this.$Request.post('photos/album_add_save', postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title: '添加成功！',
							duration: 2000
						});
						_this.loadData();
						setTimeout(function() {
							uni.redirectTo({
								url: "/pages/seller/set-photo"
							});
						}, 1500)
					} else {
						uni.showToast({
							icon: 'none',
							title: res.datas.error,
							duration: 2000
						});
						
					}
				});
			},
			toPage: function(url, id) {
				uni.navigateTo({
					url: url + '?id=' + id,
				})
			}

		}
	}
</script>
<style>
	@import "../../static/css/store.css";
	@import "../../static/css/set-photo.css";

	page {
		background: #F5F5F5;
	}
</style>
