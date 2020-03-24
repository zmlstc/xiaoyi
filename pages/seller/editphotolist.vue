<template>
	<view>
		<view class="column bf">
			<view class="item f-r">名称</view>
			<view class="item4"><input v-model="ac_name" class="mt5 f-l"></input></view>
		</view>
		<view class="column bf">
			<view class="item f-r">描述</view>
			<view class="item4"><input v-model="ac_des" class="mt5 f-l"></input></view>
		</view>
		<view class="column bf">
			<view class="item f-r">排序</view>
			<view class="item4"><input v-model="ac_sort" class="mt5 f-l"></input></view>
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
		onLoad(e) {
			console.log('页面加载');
			this.loadData();
			this.id = e.id;
			let postData = {
				id: e.id
			}
			this.$Request.post('photos/album_pic_list', postData).then(res => {
				if (res.code == 200) {
					console.log(res);
					this.ac_name = res.datas.class_info.ac_name;
					this.ac_des = res.datas.class_info.ac_des
					this.ac_sort = res.datas.class_info.ac_sort
				} else {
					uni.showToast({
						icon: 'none',
						title: res.datas.error,
						duration: 2000
					});
					uni.navigateTo({
						url: 'login',
					});
				}
			});
			
		},
		methods: {
			//...mapMutations(['logout','setUserInfo']),  
			async loadData(e) {
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
					id: _this.id
				}
				console.log(postData);
				this.$Request.post('photos/album_edit_save', postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title: '修改成功！',
							duration: 2000
						});
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
