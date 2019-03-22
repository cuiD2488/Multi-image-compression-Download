<template>
  <div class="bindTel">
    <div>
      <!-- <img src="" alt=""> -->
    </div>
    <div style="text-align: center;
    color: #344567;
    font-size: .45rem;">
      举报违停
    </div>
    <XInput class="input" placeholder="车位编号" v-model="formData.positionNumber" :min="6" :max="6" required :show-clear="false"></XInput>
    <XInput class="input" placeholder="车牌号简称(前两位)" v-model="formData.abbreviation" :min="2" :max="8" required :show-clear="false"></XInput>
    <XInput class="input" placeholder="车牌号后5/6位" v-model="formData.numberPlate" :min="5" :max="6" required :show-clear="false"></XInput>
    <XInput class="input" placeholder="管理员编号" v-model="formData.managerNumber" :show-clear="false"></XInput>
    <x-textarea class="input" :max="20" v-model="formData.reasons" placeholder="请输入违章原因" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')"></x-textarea>
    <div class="inputImte">
      <p>上传证据</p>
      <div style="display: flex;flex-wrap: wrap;">
        <div class="imgContgent" style="" v-for="(item, index) in targetImg.identityCardFront" :key="index">
          <strong @click="removePictures(index)" style="">X</strong>
          <img style="width: 100%;height: 100%;" :src="'http://' + item" alt="">
        </div>
        <div class="uploadContent" v-if="loding.identityCardFront">
          <img src="../../../assets/addImg.jpg" alt="">
            <input accept="image/*" multiple type="file" @change="changePic('identityCardFront')" ref="identityCardFront"/>
        </div>
      </div>
    </div>
    <x-button type="primary" class="btn" @click.native="getBindTel">提交</x-button>
  </div>
</template>
<script>
import { AlertModule, XTextarea, Spinner, Group, Cell, XInput, XButton, Toast, XAddress, ChinaAddressV4Data, Value2nameFilter as value2name } from 'vux'
import {ApiAddPkViolation, ApiAddPictures} from '@/api'
// ApiUploadBanner,
export default {
  components: {
    XInput,
    XButton,
    Toast,
    XAddress,
    Spinner,
    Cell,
    Group,
    AlertModule,
    XTextarea
  },
  data () {
    return {
      types: ['lines'],
      addressData: ChinaAddressV4Data,
      targetImg: { // 之所以用对象是预防后面需求修改出现多个图片上传项
        businessLicense: '',
        identityCardFront: [],
        identityCardVerso: ''
      },
      formData: {
        positionNumber: '',
        abbreviation: '',
        numberPlate: '',
        reasons: '',
        violationImage: '',
        managerNumber: ''
      },
      loding: {
        identityCardFront: true
      },
      name: ''
    }
  },
  methods: {
    getName (value) {
      return value2name(value, ChinaAddressV4Data)
    },
    // 删除图片
    removePictures (index) {
      this.formData.violationImage = this.targetImg['identityCardFront'].join(',')
      this.targetImg['identityCardFront'].splice(index, 1)
      if (this.targetImg['identityCardFront'].length < 3) {
        this.loding.identityCardFront = true
      }
    },
    // 获取图片地址并展示
    async changePic (name) {
      if (this.targetImg[name].length === 2) {
        this.loding.identityCardFront = false
        this.$vux.toast.text('最多上传三张图片')
      }
      this.loding.businessLicense = true
      const fileDocument = this.$refs[name]
      let file = fileDocument.files[0]
      let param = new FormData()
      param.append('image', file)
      // param.append('imgType', 'file')
      console.log(param.get('file'))
      // const res = await ApiUploadBanner(param)
      const res1 = await ApiAddPictures(param)
      console.log(res1)
      // this.targetImg[name].push(res.imgPath)
      // 把图片数组转成字符串赋值给需要上传的时传的参数变量
      this.formData.violationImage = this.targetImg[name].join(',')
      // 获取bease64本地预览 笔记
      // let file = this.$refs[name]
      // this.targetReader[name] = new FileReader()
      // this.targetReader[name].onload = (evt) => {
      //   this.targetImg[name] = evt.target.result
      // }
      // console.log(333333333333)
      // this.targetReader[name].readAsDataURL(file.files[0])
      // // this.targetReader[name].readAsText(file[0])
      // console.log(this.$refs.formEnterprise)
    },
    onEvent () {
    },
    // 验证
    bindTel () {
    },
    // 提交
    async getBindTel () {
      // if (this.formData.positionNumber.length !== 6) {
      //   this.$vux.toast.text('车位编号为6位,请检查后重试')
      //   return
      // }
      const data = this.formData
      const res = await ApiAddPkViolation(data)
      console.log(res)
      if (res.code === 200) {
        this.$vux.toast.text('提交成功')
      } else {
        this.$vux.toast.text('提交失败，请确保网络正常')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.imgContgent{
  width: 33.33%;
  height: 140px;
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  strong{
    color: #929292;position: absolute;right: 10px;top: -10px;
  }
}
.bindTel {
    width: 100vw;
    padding-top: 1vh;
    height: 100vh;
    // background: url(../../../assets/bindLogo.png) no-repeat center center;
    background-size: 100%;
    background-position-y: 0;
    padding-bottom: 120px;
    background-color: #f7f7f7;
    box-sizing: border-box;
}
.input, .inputImte{
  border: 1px solid #ededed;
  width: 70%;
  margin: 10px auto;
  padding: 0.4rem ;
  color: #000;
  background: #fff;
  border-radius: 5px;
  // text-align:center;
  >p{
    padding:.2rem 0;color:#999;
    text-align: left;
  }
  .uploadContent{
      width: 33.33%;
      height: 140px;
      position: relative;
      padding: 10px;
      box-sizing: border-box;
      >img{
        width: 100%;
      }
      >input{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        opacity: 0;
        width: 100%;
      }
  }
}
.sendMsg {
  display: inline-block;
  position: absolute;
  right: 18%;
  bottom: 0.3rem;
  background: #ffad2c;
  border-radius: 1rem;
  color: #000;
  padding: 0.1rem 0.2rem;
  width: 2.2rem;
  text-align: center;
}
.checkBox {
  position: relative;
}
.btn {
  width: 70%;
  border-radius: 1rem;
  margin-top: 1rem;
  font-size: 28px;
}
.code {
  margin: 10px auto;
  width: 114px;
  height: 40px;
  border: 1px solid red;
}
</style>
<style scoped>
::-webkit-input-placeholder { /* WebKit, Blink, Edge */
  color: #000;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: #fff;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #fff;
}
:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: #fff;
}
</style>
