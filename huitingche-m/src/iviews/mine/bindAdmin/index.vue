<template>
  <div class="page">
    <group>
      <x-input title="管理员姓名" class="weui-vcode" v-model="manageName">
      </x-input>
      <x-input title="手机号" class="weui-vcode" v-model="phoneNo">
      </x-input>
      <x-input title="验证码" class="weui-vcode" v-model="verificationCode">
        <x-button slot="right" @click.native="sendCode" type="primary" mini :text="btnMessage"></x-button>
      </x-input>
      <x-input title="后台登录密码" class="weui-vcode" type="password" v-model="password">
      </x-input>
      <x-input title="再次登录密码" class="weui-vcode passwordAgain" type="password" v-model="passwordAgain">
      </x-input>
    </group>
    <x-button type="primary" style="margin-top: 1rem;" @click.native="submitFn">确定</x-button>
    <loading :show="showLoading" text="请稍后"></loading>
  </div>
</template>

<script>
import {ApiWxLogin, ApiRegisterByAdminQrCode, ApiRegisterByManageNumberQrCode, ApiFindParkingLotNumberLByLot, ApiGetVerificationCode, ApiQueryPkUser, ApiQueryParkingLotManager} from '@/api'
import {Loading, XInput, Group, XButton} from 'vux'
import md5 from 'js-md5'

export default {
  components: {
    Loading,
    XInput,
    Group,
    XButton
  },
  data () {
    return {
      // Loading组件控制flag
      showLoading: false,
      // 表单输入值
      manageName: '',
      phoneNo: '',
      verificationCode: '',
      password: '',
      passwordAgain: '',
      // url中state参数 最后一位为判断管理员等级用 最后一位之前为停车场编号
      state: '',
      // userInform: JSON.parse(sessionStorage.getItem('userInform')),
      userInform: null,
      // 发送验证码文字
      btnMessage: '发送验证码'
    }
  },
  methods: {
    // 获取vendorId
    async getVendorId (code, state, flag) {
      if (flag === '1') {
        // 如果末尾标识值为1,则为系统管理员授权停车场管理员
        let data = {
          parkingLotNumber: state.slice(0, state.length - 1)
        }
        const res = await ApiFindParkingLotNumberLByLot(data)
        if (res.code === 200) {
          this.wxLogin(code, res.data.vendorId)
        } else {
          this.$vux.toast.text('请求错误')
        }
      } else {
        // 如果末尾标识值为2,则为停车场管理员授权路段管理员
        let data = {
          managerNumber: state.slice(0, state.length - 1)
        }
        const res = await ApiQueryParkingLotManager(data)
        if (res.code === 200) {
          this.wxLogin(code, res.data.vendorId)
        } else {
          this.$vux.toast.text('请求错误')
        }
      }
    },
    // 微信登录接口
    async wxLogin (code, state) {
      if (sessionStorage.getItem('userInform')) {
        return
      }
      let data = {
        code: code,
        state: state
      }
      const res = await ApiWxLogin(data)
      if (res.code === 200) {
        // this.userInform = res.data
        // 通过接口获取用户信息并存储至缓存中
        sessionStorage.setItem('userInform', JSON.stringify(res.data))
        this.userInform = JSON.parse(JSON.stringify(res.data))
      } else {
        this.$vux.toast.text('微信登录失败请刷新后重试')
      }
      this.showLoading = false
    },
    // 发送验证码
    async sendCode () {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneNo))) {
        this.$vux.toast.text('输入的手机号有误,请核对后再试')
        return
      }
      const data = {
        phone: this.phoneNo
      }
      if (this.btnMessage === '发送验证码' || this.btnMessage === '重新获取') {
        // 调用发送短信接口
        const res = await ApiGetVerificationCode(data)
        // 倒计时定时器
        let time = 60
        let interval = setInterval(() => {
          if (time === 1) {
            clearInterval(interval)
            this.btnMessage = '重新获取'
            return
          }
          this.btnMessage = --time + 's'
        }, 1000)
        if (res.code === 200) {
          // 存储获得的验证码
          this.getCode = res.data
          this.$vux.toast.text('短信发送成功')
        } else {
          this.$vux.toast.text('短信发送失败请稍后再试')
        }
      }
    },
    // 注册手机号
    async submitFn () {
      let res = null
      if (this.password !== this.passwordAgain) {
        this.$vux.toast.text('两次输入的支付密码不同,请核对后再试')
        return
      }
      // console.log(this.userInform)
      // console.log(this.userInform.openId)
      if (this.getCode === this.verificationCode) {
        let data = {
          parkingLotNumber: this.state.slice(0, this.state.length - 1),
          manageName: this.manageName,
          phone: this.phoneNo,
          password: md5(this.password),
          openId: this.userInform.openId,
          wxNickName: this.userInform.nickName,
          headImageUrl: this.userInform.headImgUrl
        }
        // console.log(data)
        if (this.state.slice(this.state.length - 1, this.state.length) === '1') {
          res = await ApiRegisterByAdminQrCode(data)
        } else {
          res = await ApiRegisterByManageNumberQrCode(data)
        }
        if (res.code === 200) {
          this.$vux.toast.text('注册成功')
          this.queryPkUser()
        } else {
          this.$vux.toast.text('注册失败')
        }
      } else {
        this.$vux.toast.text('验证码不正确,请核对后再试')
      }
    },
    // 根据openId获取用户信息
    async queryPkUser () {
      let data = {
        openId: JSON.parse(sessionStorage.getItem('userInform')).openId
      }
      const res = await ApiQueryPkUser(data)
      if (res.code === 200) {
        // 通过接口获取用户信息并存储至缓存中
        sessionStorage.removeItem('userInform')
        sessionStorage.setItem('userInform', JSON.stringify(res.data))
        this.$router.push({name: 'mine'})
      } else {
        this.$vux.toast.text('登录失败请刷新后重试')
      }
    }
  },
  created () {
    // 从字符串中截取相关参数
    let url = location.search // 获取url中"?"符后的字串
    let theRequest = {}
    if (url.indexOf('?') !== -1) {
      let str = url.substr(1)
      let strs = str.split('&')
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
        // 获取中文参数转码<span style="font-family: Arial, Helvetica, sans-serif;">decodeURI</span>，（unescape只针对数字，中文乱码)
      }
    }
    // 根据url中的参数获取用户信息
    let flag = theRequest.state.slice(theRequest.state.length - 1, theRequest.state.length)
    this.getVendorId(theRequest.code, theRequest.state, flag)
    this.state = theRequest.state
    // 获取页面原始高度
    sessionStorage.setItem('windowHeight', JSON.stringify(document.documentElement.clientHeight))
  }
}
</script>

<style>
.page{
  height: calc(100% - 120px);
}
.passwordAgain .weui-label{
  width: 200px;
}
</style>
