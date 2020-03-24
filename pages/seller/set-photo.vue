<template>
	<view>
		<view class="catelist mc">
			<view class="cate" v-for="(item,index) in cate">
				<view class="top" @tap="toPage('photolist?id='+item.ac_id)">
					<view class="img"><image :src="item.ac_cover" mode="widthFix" class="cateimg mc"></image></view>
					<view class="title">{{item.ac_name}}</view>
					<view class="num">共<text>{{item.count}}</text>张</view>
				</view>
				<view class="bottom mt10">
					<view class="edit" @tap="toPage('editphotolist?id='+item.ac_id)">编辑</view>
					<view class="del" @tap="deletephotolist(item.ac_id)">删除</view>
				</view>
			</view>
		</view>
		<view class="btn mt40 upload" @tap="toPage('newphotolist')">新建相册</view>
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
					})
				} else {
					this.$Request.post('photos/cate').then(res => {
						if (res.code == 200) {
							console.log(res);
							this.cate = res.datas.aclass_info
							//this.store_map_address_detail = res.datas.store.map_address_detail;
							// this.store_phone=res.datas.store.store_phone;
							// this.wtime_start=res.datas.store.wtime_start;
							// this.wtime_end=res.datas.store.wtime_end;
							// this.flist=res.datas.flist;
							// this.selectflist =res.datas.store.f_ids;
							//this.setUserInfo(res.datas);							
							//this.memberInfo = res.datas;
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
				}
			},
			toPost() {
				console.log(this.store_map_address_detail);
				let postData = {
					address_detail: this.store_map_address_detail
				}
				this.$Request.post('seller_index/updatemapdeatil', postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title: '修改成功！',
							duration: 2000
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: res.datas.error,
							duration: 2000
						});

					}
				});
			},
			deletephotolist(id){
				var _this= this;
				uni.showModal({
					title: '系统提示',
					content: '确认要删除该相册吗？相册内相片也将全部删除！',
					success: function (re) {
						if (re.confirm) {
							uni.showLoading({title:'正在删除...'});
							_this.$Request.post('photos/album_del',{id:id}).then(res => {
								if (res.code == 200) {
									console.log(res);
									uni.hideLoading();
									uni.showToast({
										icon: 'none',
										title: '删除成功！',
										duration: 2000
									});
									_this.loadData();
								}
								else{
									uni.showLoading({title:res.datas.re});
									setTimeout(function () {
										uni.hideLoading();
									}, 1500);
								}
							});
						} else if (re.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			toPage: function(url) {
				uni.navigateTo({
					url: url
				})
			}

		}
	}
</script>
<style>
	@import "../../static/css/set-photo.css";
	page {
		background: #F5F5F5;
	}
</style>
