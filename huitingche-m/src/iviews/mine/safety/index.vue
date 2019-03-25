<template>
  <div class="page">
    <div class="showNow">
      <div class="showItem" @click="showEditPhone">
        <div class="left">修改手机号</div>
        <div class="right"><img :src="imgThrow1" alt=""></div>
      </div>
      <div class="phoneEdit" v-show="showPhone">
        <group>
          <x-input title="新手机号" class="weui-vcode" v-model="phoneNo" :show-clear="false">
          </x-input>
          <!-- <x-input title="手机号" class="weui-vcode" v-model="phoneNo">
          </x-input> -->
          <x-input title="验证码" class="weui-vcode" v-model="verificationCode" :show-clear="false">
            <x-button slot="right" @click.native="sendCode" type="primary" mini >发送验证码</x-button>
          </x-input>
          <!-- <x-input v-show="newPhoneInput" title="新手机号" class="weui-vcode" v-model="phoneNoNew">
          </x-input> -->
        </group>
        <x-button type="primary" class="sureBtn" @click.native="submitFnPhone">确定</x-button>
      </div>
      <div class="showItem" @click="showEditPassword">
        <div class="left">修改支付密码</div>
        <div class="right"><img :src="imgThrow2" alt=""></div>
      </div>
      <div class="passwordEdit" v-show="showPassword">
        <group>
          <x-input title="手机号" class="weui-vcode" v-model="phoneNo" :show-clear="false">
          </x-input>
          <x-input title="验证码" class="weui-vcode" v-model="verificationCode" :show-clear="false">
            <x-button slot="right" @click.native="sendCode" type="primary" mini :text="btnMessage"></x-button>
          </x-input>
          <x-input v-show="newPayCodeInput" title="新支付密码" class="weui-vcode" :show-clear="false" :type="password" v-model="newPayCode">
          </x-input>
        </group>
        <x-button type="primary" class="sureBtn" @click.native="submitFn">确定</x-button>
      </div>
    </div>
  </div>
</template>
<style>
.weui-cells{
  padding: 30px 20px !important;
  margin-top: 0 !important;
}
.sureBtn{
  margin: 30px 20px !important;
  width: 680px !important;
}
</style>

<style lang="less" scoped>
.page{
  padding-bottom: 120px;
}
.showNow {
  .showItem{
    display: flex;
    padding: 30px 20px;
    font-size: 28px;
    justify-content: center;
    .right{
      flex-grow: 1;
      img{
        float: right;
        padding-top: 10px;
        width: 30px;
        height: 28px;
      }
    }
  }
}
</style>

<script>
import md5 from 'js-md5'
import {ApiGetVerificationCode, ApiUpdatePhone} from '@/api'
import {XButton, XInput, PopupHeader, Popup, TransferDom, Group, Radio} from 'vux'
export default {
  components: {
    XButton,
    XInput,
    PopupHeader,
    Popup,
    TransferDom,
    Group,
    Radio
  },
  data () {
    return {
      // 箭头图标
      imgThrow1: require('@/assets/downThrow.png'),
      imgThrow2: require('@/assets/downThrow.png'),
      // 隐藏内容标识
      showPhone: false,
      showPassword: false,
      // 输入的手机号码
      phoneNo: null,
      // 验证码
      verificationCode: null,
      // 接口请求到的验证码
      getCode: null,
      // 输入的新手机号码
      // phoneNoNew: null,
      // 输入新手机号的输入框
      newPhoneInput: false,
      // 输入的新支付密码
      newPayCode: null,
      // 输入新支付密码的输入框
      newPayCodeInput: false,
      // 发送验证码文字
      btnMessage: '发送验证码'
    }
  },
  methods: {
    showEditPhone () {
      // 箭头图片翻转判断
      if (this.showPhone) {
        this.imgThrow1 = require('@/assets/downThrow.png')
        this.showPhone = false
        this.imgThrow2 = require('@/assets/downThrow.png')
      } else {
        this.imgThrow1 = require('@/assets/upThrow.png')
        this.showPhone = true
        this.imgThrow2 = require('@/assets/downThrow.png')
        this.showPassword = false
      }
    },
    showEditPassword () {
      // 箭头图片翻转判断
      if (this.showPassword) {
        this.imgThrow1 = require('@/assets/downThrow.png')
        this.imgThrow2 = require('@/assets/downThrow.png')
        this.showPassword = false
      } else {
        this.imgThrow1 = require('@/assets/downThrow.png')
        this.showPhone = false
        this.imgThrow2 = require('@/assets/upThrow.png')
        this.showPassword = true
      }
    },
    // 发送验证码
    async sendCode () {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneNo))) {
        this.$vux.toast.text('输入的手机号有误,请核对后再试')
        return
      }
      let data = {
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
          // 展示新手机号码的输入框
          // this.newPhoneInput = true
          // 展示新支付密码的输入框
          this.newPayCodeInput = true
        } else {
          this.$vux.toast.text('短信发送失败请稍后再试')
        }
      }
    },
    // 比较验证码是否正确 (略多于可以去掉,提前验证验证码正确)
    // compareCode () {
    //   if (this.getCode !== this.verificationCode) {
    //     this.$vux.toast.text('您输入的验证码有误请核对后再试')
    //   }
    // },
    // 修改支付密码
    async submitFn () {
      if (this.getCode === this.verificationCode) {
        let data = {
          id: +JSON.parse(sessionStorage.getItem('userInform')).id,
          payPassword: md5(this.newPayCode)
        }
        const res = await ApiUpdatePhone(data)
        if (res.code === 200) {
          // 清空所有输入的数据
          this.newPayCode = null
          this.phoneNo = null
          this.verificationCode = null
          this.$vux.toast.text('修改成功')
          this.$router.push({name: 'mine'})
        } else {
          this.$vux.toast.text('修改失败请刷新后重试')
        }
      } else {
        this.$vux.toast.text('验证码不正确,请核对后再试')
      }
    },
    // 提交修改手机号码
    async submitFnPhone () {
      if (this.getCode === this.verificationCode) {
        let data = {
          id: +JSON.parse(sessionStorage.getItem('userInform')).id,
          userId: this.phoneNo
        }
        const res = await ApiUpdatePhone(data)
        if (res.code === 200) {
          // 清空所有输入的数据
          this.phoneNo = null
          this.verificationCode = null
          // 修改成功将手机号重写至缓存
          let userInform = JSON.parse(sessionStorage.getItem('userInform'))
          userInform.userId = this.phoneNo
          sessionStorage.removeItem('userInform')
          sessionStorage.setItem('userInform', JSON.stringify(userInform))
          this.$vux.toast.text('修改成功')
          this.$router.push({name: 'mine'})
        } else {
          this.$vux.toast.text('修改失败请刷新后重试')
        }
      } else {
        this.$vux.toast.text('验证码不正确,请核对后再试')
      }
    }
    // 获取用户支付密码用于校验
    // async getPassword () {
    //   let data = {
    //     userNumber: JSON.parse(sessionStorage.getItem('userInform')).userNumber,
    //   }
    // }
  },
  created () {
    // 调用获取用户支付密码接口
    // this.getPassword()
  }
  // ,
  // mounted () {
  //   // 安卓手机键盘吊起挡住输入框
  //   const that = this
  //   window.onresize = () => {
  //     return (() => {
  //       // let fullHeight = sessionStorage.getItem('windowHeight')
  //       window.fullHeight = document.documentElement.clientHeight
  //       that.fullHeight = window.fullHeight
  //       alert()
  //       if (that.fullHeight < this.originHeight - 50) {
  //         document.getElementById('foot').style.display = 'none'
  //       } else {
  //         document.getElementById('foot').style.display = 'block'
  //         // document.getElementsByClassName('showPage').scrollIntoView(false)
  //       }
  //     })()
  //   }
  // }
}
</script>
<style lang="less" scoped>
</style>
