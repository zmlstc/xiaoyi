<template>
	<view class="mian">
		
		<view class="welcome mb40">
			<view class="title">欢迎入驻小易共享平台</view>
			<view class="text">花一分钟完成注册</view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5 f-r">企业性质</view>
			<view class="item6">
				<radio-group @change="radioChange">
					<radio color="#00BAAD" value="2"></radio><text class="ml5">个体</text>
					<radio color="#00BAAD" value="1" class="ml10"></radio><text class="ml5">企业</text>
				</radio-group>
			</view>
			
		</view>
		<view class="nav-reg b-line">
			<view class="item5 f-r">公司名称</view>
			<view class="item6"><input  placeholder="与营业执照一致" placeholder-class="pl-class" v-model="company_name" maxlength="30" /></view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5 f-r">社会信用代码</view>
			<view class="item6"><input  placeholder="填写18位信用代码" placeholder-class="pl-class" v-model="business_licence_number" maxlength="18" /></view>
		</view>
		<view class="nav-reg b-line" @click="showMulLinkageThreePicker">
			<view class="item5 f-r">所在地</view>
			<view class="item6">{{selectAreaTxt}}</view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5 f-r">法人代表</view>
			<view class="item6"><input  placeholder="填写法人代表姓名" placeholder-class="pl-class" v-model="company_user_name" maxlength="6" /></view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5 f-r">办公电话</view>
			<view class="item6"><input  placeholder="填写办公电话号码" placeholder-class="pl-class" v-model="contacts_phone" maxlength="18" /></view>
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
				<text v-if="company_user_name_pic==''" class="upload">+</text>正面扫描件</view>
		</view>
		<view class="nav-reg b-line">
			<view class="item5 f-r">法人身份证反面</view>
			<view class="item6" @tap="chooseUserImage2">
				<image v-if="company_user_name_pic2!=''" :src="company_user_name_pic2" :data-src="company_user_name_pic2" class="upload" ></image>
				<text v-if="company_user_name_pic2==''" class="upload">+</text>反面扫描件</view>
		</view>
		<view class="nav-reg b-line" @click="showMulLinkageTwoPicker">
			<view class="item5 f-r">经营行业</view>
			<view class="item6">{{selectStoreclassTxt}}<text class="text">返佣比例表</text></view>
		</view>
		<view class="btn mt40 mb20"  @tap="nextReg">确认提交</view>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm2="onConfirm2" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		 
	</view>
</template>
<script>
	import mpvuePicker from '../../../components/mpvue-picker/mpvuePicker.vue';
	import mpvueCityPicker from '../../../components/mpvue-citypicker/mpvueCityPicker.vue'

	export default {
		components: {mpvuePicker,
			mpvueCityPicker
		},
		data() {
			return {
				company_type:0,
				company_name:"",
				business_licence_number:"",
				selectAreaTxt:"请选择所在区域",
				company_user_name:"",
				contacts_phone:"",
				//title : "mpvue-picker 使用示例",
				mulLinkageTwoPicker: [],
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#007AFF',
				pickerText: '',
				mode: '',
				deepLength: 1,
				pickerValueDefault: [0],
				pickerValueArray:[],
				selectStoreclassTxt:"选择所属行业",
				organization_code_electronic:"",
				company_user_name_pic:"",
				company_user_name_pic2:"",
				provId:0,
				cityId:0,
				areaId:0,
				storeClassId:0,
				storeClassId2:0,
				tky:'',
				organization_pic:'',
				user_pic:'',
				user_pic2:''
			};
		},
		onLoad(e){
			var _this=this;
			console.log('------------');
			_this.tky=e.tk;
			_this.$Request.post('store_joinin/getstoreclass').then(res => {
				if (res.code == 200) {
					console.log(res);
					_this.mulLinkageTwoPicker =res.datas;
				}
			});
		},
		methods: {
			onCancel(e) {
				console.log(e)
			},
			radioChange: function(evt) {
				this.company_type=evt.target.value;
				console.log(evt.target.value);
				
			},
			// 二级联动选择
			showMulLinkageTwoPicker() {
				this.pickerValueArray = this.mulLinkageTwoPicker
				this.mode = 'multiLinkageSelector'
				this.deepLength = 2
				this.pickerValueDefault = [0, 0]
				this.$refs.mpvuePicker.show()
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
				this.cityId=e.cityCode;
				this.areaId=e.areaCode;
			},
			onConfirm2(e) {
				console.log(e);
				this.selectStoreclassTxt = e.name;//JSON.stringify(e).name;
				this.storeClassId=e.value[0];
				this.storeClassId2=e.value[1];
				console.log(e.name);
			},
			//选择图片
			chooseImage: async function() {
				var _this = this;
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					// #ifdef MP-WEIXIN
					sizeType: ['original'],
					// #endif
					count: 1,
					success: (res) => {
						//this.imageList = this.imageList.concat(res.tempFilePaths);
						_this.organization_code_electronic=res.tempFilePaths[0];
						console.log(JSON.stringify(res.tempFilePaths));
						_this.$Request.upLoadFile('store_joinin/image_upload',_this.organization_code_electronic).then(res => {
							console.log(res);
							console.log('===upload======');
							if (res.code == 200) {
								console.log('===upload=2=====');
								uni.hideLoading();
								console.log(res);
								_this.organization_pic=res.datas.image_name;
								
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
				var _this = this;
					uni.chooseImage({
						sourceType: ['camera', 'album'],
						// #ifdef MP-WEIXIN
						sizeType: ['original'],
						// #endif
						count: 1,
						success: (res) => {
							//this.imageList = this.imageList.concat(res.tempFilePaths);
							_this.company_user_name_pic=res.tempFilePaths[0];
							console.log(JSON.stringify(res.tempFilePaths));
							_this.$Request.upLoadFile('store_joinin/image_upload',_this.company_user_name_pic).then(res => {
								console.log(res);
								console.log('===upload======');
								if (res.code == 200) {
									console.log('===upload=2=====');
									uni.hideLoading();
									console.log(res);
									_this.user_pic=res.datas.image_name;
									
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
			//选择图片 身份证照片反面
			chooseUserImage2: async function() {
				var _this = this;
					uni.chooseImage({
						sourceType: ['camera', 'album'],
						// #ifdef MP-WEIXIN
						sizeType: ['original'],
						// #endif
						count: 1,
						success: (res) => {
							//this.imageList = this.imageList.concat(res.tempFilePaths);
							_this.company_user_name_pic2=res.tempFilePaths[0];
							console.log(JSON.stringify(res.tempFilePaths));
							_this.$Request.upLoadFile('store_joinin/image_upload',_this.company_user_name_pic2).then(res => {
								console.log(res);
								console.log('===upload======');
								if (res.code == 200) {
									console.log('===upload=2=====');
									uni.hideLoading();
									console.log(res);
									_this.user_pic2=res.datas.image_name;
									
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
				let user_pic2 = this.user_pic2;

				
				
				if(this.company_type==0){
					uni.showToast({title: '请选择企业类型',icon:"none"});
					return false; 
				}
				if(!(/^[\u4e00-\u9fa5\(.*\)]{6,20}$/.test(this.company_name))){ 
					uni.showToast({title: '请填写正确公司名称',icon:"none"});
					return false; 
				}
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
					uni.showToast({title: '请填写正确的电话号码',icon:"none"});
					return false; 
				}
				if(this.provId==0||this.cityId==0||this.areaId==0){
					uni.showToast({title: '请选择地区',icon:"none"});
					return false; 
				}
				if(this.storeClassId==0||this.storeClassId2==0){
					uni.showToast({title: '请选择行业',icon:"none"});
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
				if(this.user_pic2==''){
					uni.showToast({title: '请上传法人身份证照片反面',icon:"none"});
					return false; 
				}

				let postData={
					company_name:this.company_name,company_province_id:this.provId,contacts_phone:this.contacts_phone,company_user_name:this.company_user_name,
					scid1:this.storeClassId,scid2:this.storeClassId2,scinfo:this.selectStoreclassTxt,company_user_name_pic:user_pic,company_user_name_pic2:user_pic2,
					company_type:this.company_type,company_city_id:this.cityId,company_area_id:this.areaId,organization_code_electronic:organization_pic,
					company_address:this.selectAreaTxt,business_licence_number:this.business_licence_number,tky:this.tky
				}
				
			   
				this.$Request.post('store_joinin/step2',postData).then(res => {
					if (res.code == 200) {
						console.log(res);
						//this.setUserInfo(res.datas);							
						//this.memberInfo = res.datas;
						//this.showNext=true;
						uni.navigateTo({
							url:'shopreg3?tk='+res.datas.tk,
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
	@import "../../../static/css/register.css";
</style>

