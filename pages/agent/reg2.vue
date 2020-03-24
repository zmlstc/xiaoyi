<template>
	<view class="mian">
		
		<view class="welcome mb40">
			<view class="title">欢迎您加入小易共享大家庭</view>
			<view class="text">互联网O2O模式 新零售践行者</view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5 f-r">社会信用代码</view>
			<view class="item6"><input  placeholder="填写18位信用代码" v-model="business_licence_number" maxlength="18" /></view>
		</view>
		<view class="nav-reg b-line" @click="showMulLinkageThreePicker">
			<view class="item5 f-r">所在地</view>
			<view class="item6">{{selectAreaTxt}}</view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5 f-r">法人代表</view>
			<view class="item6"><input  placeholder="填写法人代表姓名" v-model="company_user_name" maxlength="6" /></view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5 f-r">办公电话</view>
			<view class="item6"><input  placeholder="填写办公电话号码" v-model="contacts_phone" maxlength="18" /></view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5 f-r">营业执照</view>
			<view class="item6" @tap="chooseImage">
				<image v-if="organization_code_electronic!=''" :src="organization_code_electronic" :data-src="organization_code_electronic" class="upload"  ></image>
				<text v-if="organization_code_electronic==''" class="upload">+</text>上传扫描件</view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5 f-r">法人身份证</view>
			<view class="item6" @tap="chooseUserImage">
				<image v-if="company_user_name_pic!=''" :src="company_user_name_pic" :data-src="company_user_name_pic" class="upload" ></image>
				<text v-if="company_user_name_pic==''" class="upload">+</text>正反面扫描件</view>
		</view>
		<view class="btn mt40"  @tap="nextReg">确认提交</view>
	
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		 
	</view>
</template>


<script>
	import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'

	export default {
		components: {mpvueCityPicker
		},
		data() {
			return {
				business_licence_number:"",
				selectAreaTxt:"请选择所在区域",
				company_user_name:"",
				contacts_phone:"",
				//mulLinkageTwoPicker: [],
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#007AFF',
				organization_code_electronic:"",
				company_user_name_pic:"",
				provId:0,
				cityId:0,
				areaId:0,
				tky:'',
				organization_pic:'',
				user_pic:''
			};
		},
		onLoad(e){
			console.log('------------');
			this.tky=e.tk;

		},
		methods: {
			onCancel(e) {
				console.log(e)
			},
			// 三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {
				console.log(e);
				this.selectAreaTxt = e.name;//JSON.stringify(e).name;
				console.log(e.name);
				this.provId=e.provinceCode;
				this.cityId=e.provinceCode;
				this.areaId=e.areaCode;
			},
			//选择图片
			chooseImage: async function() {
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					// #ifdef MP-WEIXIN
					sizeType: ['original'],
					// #endif
					count: 1,
					success: (res) => {
						//this.imageList = this.imageList.concat(res.tempFilePaths);
						this.organization_code_electronic=res.tempFilePaths[0];
						console.log(JSON.stringify(res.tempFilePaths));
						this.$Request.upLoadFile('agent_joinin/image_upload',this.organization_code_electronic).then(res => {
							console.log(res);
							console.log('===upload======');
							if (res.code == 200) {
								console.log('===upload=2=====');
								uni.hideLoading();
								console.log(res);
								this.organization_pic=res.datas.image_name;
								
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
			//选择图片 身份证照片
			chooseUserImage: async function() {
					uni.chooseImage({
						sourceType: ['camera', 'album'],
						// #ifdef MP-WEIXIN
						sizeType: ['original'],
						// #endif
						count: 1,
						success: (res) => {
							//this.imageList = this.imageList.concat(res.tempFilePaths);
							this.company_user_name_pic=res.tempFilePaths[0];
							console.log(JSON.stringify(res.tempFilePaths));
							this.$Request.upLoadFile('agent_joinin/image_upload',this.company_user_name_pic).then(res => {
								console.log(res);
								console.log('===upload======');
								if (res.code == 200) {
									console.log('===upload=2=====');
									uni.hideLoading();
									console.log(res);
									this.user_pic=res.datas.image_name;
									
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
			nextReg() {  
				let organization_pic=this.organization_pic;
				let user_pic = this.user_pic;

				console.log('----');
				if(!(/^[\u4e00-\u9fa5()]{2,10}$/.test(this.company_user_name))){ 
					uni.showToast({title: '请填写正确的法人姓名',icon:"none"});
					return false; 
				}
				
				if(!(/^[A-Za-z0-9]+$/.test(this.business_licence_number)) ||this.business_licence_number.length!=18){ 
					uni.showToast({title: '请填写正确的统一信用号',icon:"none"});
					return false; 
				}
				if(this.contacts_phone.length<8){ 
					uni.showToast({title: '请填写电话号码',icon:"none"});
					return false; 
				}
				if(this.provId==0||this.cityId==0||this.areaId==0){
					uni.showToast({title: '请选择地区',icon:"none"});
					return false; 
				}
				if(this.organization_pic==''){
					uni.showToast({title: '请上传营业执照',icon:"none"});
					return false; 
				}
				if(this.user_pic==''){
					uni.showToast({title: '请上传法人身份证照片',icon:"none"});
					return false; 
				}

				let postData={
					company_province_id:this.provId,contacts_phone:this.contacts_phone,company_user_name:this.company_user_name,
					company_user_name_pic:user_pic,
					company_city_id:this.cityId,company_area_id:this.areaId,organization_code_electronic:organization_pic,
					company_address:this.selectAreaTxt,business_licence_number:this.business_licence_number,tky:this.tky
				}
				
			   
				this.$Request.post('agent_joinin/step2',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.showToast({
							icon: 'none',
							title:'资料提交成功，等待审核',
							duration:2000,
							success() {
								uni.switchTab({
									url:"/pages/member/home"
								})
							}
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
				
				
			}
		},
    onBackPress() {
      if (this.$refs.mpvueCityPicker.showPicker) {
      	this.$refs.mpvueCityPicker.pickerCancel();
        return true;
      }
    },
		onUnload() {
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		}
	};
</script>


<style>
	@import "../../static/css/register.css";
</style>

