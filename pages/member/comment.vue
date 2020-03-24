<template>
	<view>
		<view class="column">
			<view class="title">
				<text>{{store_name}}</text>
			</view>
		</view>
		<view class="dafen">
		<view class="tip">请选择星级为店铺评分</view>
		<view class="start"><uni-rate size="24" :value="ratenum" @change="onChange" is_show_num="false" ></uni-rate></view>
		</view>
		<view class="column3">
			<textarea maxlength="500" placeholder="写出您对该商家的评价,最多不超过500个字" v-model="input_content"></textarea>
		</view>
			<view class="upload">
				<view class="uni-list list-pd b-line">
					<view class="uni-list-cell cell-pd">
						<view class="uni-uploader">
							<view class="uni-uploader-head">
								<view class="uni-uploader-title">图片上传（每张图片不超过2M）</view>
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
		
		<view class="column">
			<view class="hide">
				<checkbox-group @change="checkboxChange">
				<checkbox value="1" color="#00BAAD" /><text>匿名</text>
				</checkbox-group>
			</view>
			<text class="tip">你写的评价会以匿名的形式展现</text>
		</view>
		<button class="btn mt40 mb20"  @tap="publish" :disabled="logining">确认提交</button>
	</view>
</template>

<script>
	import uniRate from "../../components/uni-rate/uni-rate.vue";
	import {  
	    mapState,  
	    mapMutations  
	} from 'vuex'; 
	
	export default {
			data() {
				return {
					imageList: [],
					postImageList:[],
					ratenum:5,
					countIndex: 8,
					count: [1, 2, 3, 4, 5, 6],
					input_content:'',
					anony:0,
					logining: false,
					order_id:0,
					store_name:''
				}
			},	
			components: {uniRate},
			computed: mapState(['hasLogin','userInfo']),  
			onLoad(e) {
				this.order_id=e.id;
				if (!this.hasLogin) {  
					uni.navigateTo({
						url:'login',
					});
					return false;
				}
				this.loadData();
			},
			methods: {
				async loadData() {
					var _this = this;
					_this.$Request.post('member_evaluate/pinlun',{order_id:_this.order_id}).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.store_name=res.datas.store_info.store_name;
						}else{
							uni.showLoading({title:res.datas.error+''});
							setTimeout(function () {
								uni.navigateBack();
							}, 1500);
						}
					});
					
				},
				onChange(e) {
					console.log('rate发生改变:' + JSON.stringify(e));
					this.ratenum = e.value;
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
						count: 1,//_this.imageList.length + _this.count[_this.countIndex] > 6 ? 6 - _this.imageList.length : _this.count[_this.countIndex],
						success: (result) => {		
							uni.showLoading({title:'图片处理中...'});
							console.log(JSON.stringify(result.tempFilePaths));
							_this.$Request.upLoadFile('eval_album/file_upload',result.tempFilePaths[0]).then(res => {
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
									}, 2000);
								}
								//uni.hideLoading();
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
				publish() {  
					let _this = this;
					if (!this.input_content) {
						uni.showModal({ content: '内容不能为空', showCancel: false, });
						return;
					}
					
					uni.showLoading({title:'发布中'});
					_this.logining = true;
				
					let postData={
						order_id:this.order_id,score:this.ratenum,comment:this.input_content,evaluate_image:this.postImageList,
						anony:this.anony
					}				   
					this.$Request.post('member_evaluate/save',postData).then(res => {
						if (res.code == 200) {
							console.log(res);
							uni.showLoading({title:'发布成功！！'});
							setTimeout(function () {
								uni.navigateTo({
									url:'evallist',
								})
							}, 1500);
							
						}
						else{
							uni.showToast({
								icon: 'none',
								title:res.datas.error,
								duration:2000,
								success: function () {
									 setTimeout(function () {
										uni.navigateTo({
											url:'txway',
										});
									 }, 2000);
								}
							});
							uni.hideLoading();
							_this.logining = false;
						}
					}); 
					
					
				},
			checkboxChange(e){
				console.log(e.detail.value[0]);
				if(e.detail.value.length>0)
				{
					this.anony = 1;
				}else{
					this.anony = 0;
				}
			}
			}
		}
</script>

<style lang="scss">
	page{background: #F5F5F5;}
	.dafen {width:90%;padding:10upx 5%;margin:10upx 0;background: #FFF;overflow: hidden;}
	.dafen .tip{width:100%;line-height:48upx;text-align: center;color: #ccc;font-size:24upx;}
	.dafen .start{width:45%;margin:0 auto;}
	.dafen .start text{margin-left: 10upx;font-size:48upx;line-height:74upx;}
	
	.cell-pd {
		padding: 20upx 30upx;
	}

	.uni-textarea {
		width: auto;
		padding: 20upx 25upx;
		line-height: 1.6;
		height: 150upx;
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