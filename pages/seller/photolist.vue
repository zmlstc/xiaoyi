<template>
	<view>
		<view class="catelist mc">
			<view class="cate" v-for="(item,index) in pic_list">
				<view class="pic">
					<view class="img"><image :src="item.ap_cover" mode="widthFix" class="photo mc"></image></view>
					<!-- <view class="photoname">{{item.ap_name}}</view> -->
				</view>
				<view class="bottom">
					<view class="edit" @tap="changecover(item.ap_id)">设为封面</view>
					<view class="del" @tap="deletephoto(item.ap_id)">删除</view>
				</view>
			</view>
		</view>
		<view class="btn mt40 upload" @click="upload">上传图片</view>
	</view>
</template>

<script>
	var _self;
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				id: '',
				pic_list: [],
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
			this.id = e.id;
			console.log('页面加载');
			this.loadData();
			let postData = {
				id: this.id
			}
			this.$Request.post('photos/album_pic_list', postData).then(res => {
				if (res.code == 200) {
					console.log(res);
					this.pic_list = res.datas.pic_list
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
			async loadData() {
				if (!this.sellerHasLogin) {
					uni.navigateTo({
						url: 'login',
					})
				} else {

				}
			},
			upload() {
				const _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['copressed'],
					success(res) {
						//因为有一张图片， 输出下标[0]， 直接输出地址
						var imgFiles = res.tempFilePaths[0];
						var upurl = 'https://www.fhlego.com/api/mobile/index.php/photos/image_upload?category_id=' + _this.id;
						console.log(upurl);
						console.log(imgFiles)

						let token = "";
						let stoken = "";
						token = uni.getStorageSync('userToken');
						stoken = uni.getStorageSync('sToken');
						//下面是上传到服务器的方法
						var uper = uni.uploadFile({
							// 需要上传的地址
							url: upurl,
							// filePath  需要上传的文件
							filePath: imgFiles,
							// category_id:'6',
							name: 'pic',
							header: {
								'xToken': token,
								'sToken': stoken
							},
							success(res1) {
								uni.showToast({
									title: '上传成功',
									duration: 2000
								});
								setTimeout(function() {
									uni.redirectTo({
										url: "/pages/seller/photolist?id=" + _this.id
									});
								}, 1500)

							}
						});
					}
				})
			},
			deletephoto(id) {
				var _this = this;
				uni.showModal({
					title: '系统提示',
					content: '确认要删除相片吗？',
					success: function(re) {
						if (re.confirm) {
							uni.showLoading({
								title: '正在删除...'
							});
							_this.$Request.post('photos/album_pic_del', {
								id: id
							}).then(res => {
								if (res.code == 200) {
									console.log(res);
									uni.hideLoading();
									uni.showToast({
										icon: 'none',
										title: '删除成功！',
										duration: 1500
									});
									setTimeout(function() {
										uni.redirectTo({
											url: "/pages/seller/photolist?id=" + _this.id
										});
									}, 500)
								} else {
									uni.showLoading({
										title: res.datas.re
									});
									setTimeout(function() {
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
			changecover(id) {
				var _this = this;
				_this.$Request.post('photos/change_album_cover', {
					id: id
				}).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: '设置成功！',
							duration: 1500
						});
						setTimeout(function() {
							uni.redirectTo({
								url: "/pages/seller/set-photo"
							});
						}, 500)
					} else {
						uni.showLoading({
							title: res.datas.re
						});
						setTimeout(function() {
							uni.hideLoading();
						}, 1500);
					}
				});
			},
		}
	}
</script>
<style>
	@import "../../static/css/set-photo.css";

	page {
		background: #F5F5F5;
	}
</style>
