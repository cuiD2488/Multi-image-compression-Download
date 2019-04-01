<template>
  <div style="background:#f6f6f6;">
    <!-- 绑定手机号 -->
    <div class="bindTelTitle">首次登陆请绑定手机号</div>
    <div class="bindTelContent">
      <group>
      <!-- <x-input title="验证码">
        <img slot="right-full-height" src="https://ws1.sinaimg.cn/large/663d3650gy1fq684go3glj203m01hmwy.jpg">
      </x-input> -->
        <x-input title="手机号" class="weui-vcode" v-model="phoneNo">
        </x-input>
        <x-input title="验证码" class="weui-vcode" v-model="verificationCode">
          <x-button slot="right" @click.native="sendCode" type="primary" mini :text="btnMessage"></x-button>
        </x-input>
        <x-input title="支付密码" class="weui-vcode" type="password" v-model="payCode">
        </x-input>
        <x-input title="再次输入支付密码" class="weui-vcode" type="password" v-model="payCodeAgain">
        </x-input>
      </group>
      <div class="agreement">
        <check-icon :value.sync="agreement1">我已阅读并同意<router-link to="/">路内停车服务协议</router-link></check-icon>
        <br>
        <check-icon :value.sync="agreement2">我已阅读并同意<router-link to="/">销户退费说明</router-link></check-icon>
      </div>
      <x-button type="primary" style="margin-top: 1rem;" :disabled="!(agreement1 && agreement2)" @click.native="submitFn">确定</x-button>
    </div>
    <!-- <div class="footMessg">
      <p>技术支持：深圳市云天数字科技有限公司</p>
    </div> -->
  </div>
</template>
<script>
import md5 from 'js-md5'
import { XInput, Group, XButton, Cell, CheckIcon } from 'vux'
import {ApiGetVerificationCode, ApiUpdatePhone, ApiQueryPkUser} from '@/api'
export default {
  components: {
    XInput,
    XButton,
    Group,
    Cell,
    CheckIcon
  },
  data () {
    return {
      agreement1: false,
      agreement2: false,
      phoneNo: '',
      verificationCode: '',
      // 输入支付密码
      payCode: '',
      payCodeAgain: '',
      // 发送验证码文字
      btnMessage: '发送验证码',
      // 模板id
      modelId: ''
    }
  },
  methods: {
    // 发送验证码
    async sendCode () {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneNo))) {
        this.$vux.toast.text('输入的手机号有误,请核对后再试')
        return
      }
      const data = {
        phone: this.phoneNo,
        modelId: 146613
        // verificationCode: this.verificationCode
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
      if (this.payCode !== this.payCodeAgain) {
        this.$vux.toast.text('两次输入的支付密码不同,请核对后再试')
        return
      }
      if (this.getCode === this.verificationCode) {
        let data = {
          id: +JSON.parse(sessionStorage.getItem('userInform')).id,
          userId: this.phoneNo,
          payPassword: md5(this.payCode)
        }
        const res = await ApiUpdatePhone(data)
        if (res.code === 200) {
          this.$vux.toast.text('注册成功')
          this.queryPkUser()
          // this.$router.push({name: 'mine'})
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
  }
  // mounted () {
  //   this.submitFn()
  // }
}
</script>
<style>
.weui-cell{
  padding: 30px 20px!important;
  /* font-size: 24px!important; */
}
.bindTelContent > .weui-btn{
  margin: 20px;
  width: 680px;
}
.weui-btn{
  margin-top: 0 !important;
}
.weui-icon{
  font-size: 40px !important;
}
.vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before{
  color: #7cd1ef !important;
}
</style>
<style lang="less" scoped>
  .bindTelTitle{
    height: 160px;
    line-height: 160px;
    font-size: 30px;
    background: #fff;
    text-align: left;
    padding-left: 30px;
}
.agreement{
  text-align: left;
  padding-left: 30px;
  padding: 60px 0;
  font-size: 28px;
}
  .footMessg{
    position: absolute;
    bottom: 150px;
    text-align: center;
    width: 100%;
    color: #999;
    font-size: 30px;
  }
</style>
