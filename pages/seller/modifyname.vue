<template>
	<view>
		<view v-if="state==1" style="position:absolute;background: #FFF;bottom: 0;top: 0;left: 0;right: 0;">
		<view class="state-pic mt20" >
			<view class="state2"></view>
			<view class="store-name mt20">{{newsname}}</view>
			<view class="text2 mt10">店铺名称审核中，请耐心等待</view>
			</view>
		</view>
		<view v-if="state==0">
		<view class="column bf mt20">
			<view class="item f-r">店铺名称</view>
			<view class="item4">
				<input :placeholder="storename" maxlength="80" v-model="newstorename" class="mt12 f-l"></input>
			</view>
		</view>
		<view class="column bf mt5" @tap="chooseImage">
			<view class="item">证照图片</view>
			<view class="item4">
				<image v-if="zz_url!=''" :src="zz_url" :data-src="zz_url" class="upload"  ></image>
				<text v-if="zz_url==''" class="ml10">上传名称变更后的营业执照</text>
				<view v-if="zz_url==''" class="upload"></view>
			</view>
		</view>
		<view class="column bf mt5" @tap="choosePzImage">
			<view class="item f-r">凭证上传</view>
			<view class="item4">
				<image v-if="pz_url!=''" :src="pz_url" :data-src="pz_url" class="upload"  ></image>
				<text v-if="pz_url==''" class="ml10">上传《店铺名称变更申明》</text>
				<view v-if="pz_url==''" class="upload"></view>
			</view>
		</view>
		<view class="tips"><text>1. 店铺名称每年最多修改{{allownum}}次，需平台审核；
		2.《店铺名称变更申明》需公司/个体法人或授权管理人签字并加盖公章。</text></view>
		<view class="btn mt40" v-if="allownum>0" @click="toPost">确认提交</view>
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
				storename:"",
				newstorename:"",
				newsname:"",
				allnum:0,
				allownum:0,
				state:0,
				zhizhao_pic:"",
				zz_url:"",
				pingzheng_pic:"",
				pz_url:""
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
						url:'login',
					})
                }else{
 					this.$Request.post('seller_index/modname').then(res => {
						if (res.code == 200) {
							console.log(res);
							this.storename=res.datas.store_name;
							this.allownum=res.datas.alownum;
							this.state=res.datas.state;
							this.newsname=res.datas.newname;
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
			toPost() { 
				
				if(this.newstorename.length<3){ 
					uni.showToast({title: '请填写正确店铺名称',icon:"none"});
					return false; 
				}
				
				if(this.zhizhao_pic==''){
					uni.showToast({title: '请上传营业执照',icon:"none"});
					return false; 
				}
				if(this.pingzheng_pic==''){
					uni.showToast({title: '请上传申请凭证',icon:"none"});
					return false; 
				}
				
				let postData={
					store_name:this.newstorename,zhizhao_pic:this.zhizhao_pic,pingzheng_pic:this.pingzheng_pic
				}
				this.$Request.post('seller_index/modname_save',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.navigateTo({
							url:'sellerinfo',
						})
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
			//选择图片营业执照
			chooseImage: async function() {
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					// #ifdef MP-WEIXIN
					sizeType: ['original'],
					// #endif
					count: 1,
					success: (res) => {
						this.zz_url=res.tempFilePaths[0];
						console.log(JSON.stringify(res.tempFilePaths));
						this.$Request.upLoadFile('store_joinin/image_upload',this.zz_url).then(res => {
							console.log(res);
							console.log('===upload======');
							if (res.code == 200) {
								console.log('===upload=2=====');
								uni.hideLoading();
								console.log(res);
								this.zhizhao_pic=res.datas.image_name;
								
							}else{
								uni.showToast({
									icon: 'none',
									title:res.datas.error,
									duration:2000
								});
								uni.hideLoading();
							}
						});
					}
				});
					
			},
			//选择图片 凭证
			choosePzImage: async function() {
					uni.chooseImage({
						sourceType: ['camera', 'album'],
						// #ifdef MP-WEIXIN
						sizeType: ['original'],
						// #endif
						count: 1,
						success: (res) => {
							this.pz_url=res.tempFilePaths[0];
							console.log(JSON.stringify(res.tempFilePaths));
							this.$Request.upLoadFile('store_joinin/image_upload',this.pz_url).then(res => {
								console.log(res);
								console.log('===upload======');
								if (res.code == 200) {
									console.log('===upload=2=====');
									uni.hideLoading();
									console.log(res);
									this.pingzheng_pic=res.datas.image_name;
									
								}else{
									uni.showToast({
										icon: 'none',
										title:res.datas.error,
										duration:2000
									});
									uni.hideLoading();
								}
							});
						}
					});
					
				}
			 
        }  
    }  
</script> 

<style>
	@import "../../static/css/store.css";
	page{background: #F5F5F5;}
</style>
