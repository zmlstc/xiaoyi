<template>
	<view>
		<view class="feedback">
			<view class="title"><text>*</text>意见类型</view>
			<view class="item bf">
				<picker @change="showWayList" :value="index" :range="list" range-key="f_name">
					<view class="uni-input">{{selectTxt}}</view>
				</picker>
			</view>
			<view class="title"><text>*</text>问题和意见</view>
			<textarea auto-height placeholder="请详细描述您的问题和意见..." v-model="input_content" />
			<view class="title">图片上传（选填，提供问题截图，单张不超过2M）</view>
			<view >
				<view class="uni-list list-pd">
					<view class="uni-list-cell cell-pd">
						<view class="uni-uploader">
							<view class="uni-uploader-head">
								<view class="uni-uploader-title"></view>
								<view class="uni-uploader-info">{{imageList.length}}/6</view>
							</view>
							<view class="uni-uploader-body">
								<view class="uni-uploader__files">
									<block v-for="(image,index) in imageList" :key="index">
										<view class="uni-uploader__file" style="position: relative;">
											<image class="uni-uploader__img" mode="aspectFill" :src="image" :data-src="image" @tap="previewImage"></image>
											<view class="close-view" @click="close(index)">×</view>
										</view>
									</block>
									<view class="uni-uploader__input-box" v-show="imageList.length < 6">
										<view class="uni-uploader__input" @tap="chooseImage"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="title">联系方式（选填,方便我们联系您）</view>
			<input type="text" placeholder="手机号码/QQ/电子邮箱" placeholder-class="pl-class" v-model="lxway"></input>
		</view>
		<button class="btn mt40" bindtap="sumbit" hover-class="btn-hover" @tap="publish" :disabled="logining">提交</button>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm2="onConfirm2" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
	<view class="copyright">Copyright © 2016-2020 UP. All Rights Reserved.</view>
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
				imageList: [],
				postImageList:[],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6],
				input_content:'',
				logining: false,
				lxway:'',
				selectTxt:"选择反馈类型",
				list: [],
				index: -1
			}
		},
		computed: mapState(['hasLogin','userInfo']), 	
		onLoad() {
				if (!this.hasLogin) {  
					uni.navigateTo({
						url:'../login',
					});
					return false;
				}
				this.loadData();
		},
		methods: {
			loadData() {
				var _this = this;
				_this.$Request.post('member_feedback/class').then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.list=res.datas.list;
					}
				});
				
			},
			publish() {  
				let _this = this;
				if (!this.input_content || this.input_content=='') {
					uni.showModal({ content: '内容不能为空', showCancel: false, });
					return;
				}
				if (this.index<0) {
					uni.showModal({ content: '请选择反馈类型', showCancel: false, });
					return;
				}
				
				uni.showLoading({title:'正在处理中...'});
				_this.logining = true;
			
				let postData={
					feedback:this.input_content,fb_image:this.postImageList,lxway:this.lxway,
					fbclass:this.list[this.index].f_name,fbclass_id:this.list[this.index].f_id
				}				   
				this.$Request.post('member_feedback/feedback_add',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showLoading({title:'提交成功！！'});
						setTimeout(function () {
							uni.navigateBack();
						}, 1500);
						
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
						uni.hideLoading();
						_this.logining = false;
					}
				}); 
				
				
			},
			
			chooseImage: async function() {
				let _this = this;
				if (this.imageList.length === 6) {
					return false;
				}
				uni.chooseImage({
						sourceType: ['camera', 'album'],
						// #ifdef MP-WEIXIN
						sizeType: ['original'],
						// #endif
					count: _this.imageList.length + _this.count[_this.countIndex] > 6 ? 6 - _this.imageList.length : _this.count[_this.countIndex],
					success: (result) => {		
						uni.showLoading({title:'图片处理中...'});
						console.log(JSON.stringify(result.tempFilePaths));
						_this.$Request.upLoadFile('member_feedback/file_upload',result.tempFilePaths[0]).then(res => {
							console.log(res);
							console.log('===upload======');
							if (res.code == 200) {
								console.log('===upload=2=====');
								uni.hideLoading();
								console.log(res);
								_this.imageList = _this.imageList.concat(result.tempFilePaths)//非APP平台不支持自定义压缩,暂时没有处理,可通过uni-app上传组件的sizeType属性压缩
								
								_this.postImageList = _this.postImageList.concat(res.datas.file_name);
								
							}else{
								uni.showLoading({title:res.datas.error+''});
								setTimeout(function () {
									uni.hideLoading();
								}, 1500);
							}
						});
					}
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src;
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			close(e){
				this.imageList.splice(e,1);
				this.postImageList.splice(e,1);
			},
			showWayList(e) {
				console.log('选择值为：' + e.target.value)
				this.index = e.target.value;
				this.selectTxt = this.list[this.index].f_name;
			},
		}
	}
</script>

<style>
	page{background: #F5F5F5;}
	
	.cell-pd {
		padding: 20upx 30upx;
	}

	.uni-list::before {
		height: 0;
	}
	.uni-list:after {
		height: 0;
	}
	.list-pd {
		margin-top: 0;
	}
	.close-view{
	    text-align: center;
		line-height:30upx;
		height: 35upx;
		width: 35upx;
		background: #ef5350;
		color: #FFFFFF;
		position: absolute;
		top: 1upx;
		right: 1upx;
		font-size: 35upx;
		border-radius: 8upx;
	}
</style>
