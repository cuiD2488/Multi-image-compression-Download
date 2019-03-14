<template>
  <div class="loginContent">
    <div style="    position: absolute;
    top: 100px;
    font-size: 40px;
    color: #fff;">
      <p>
        云尚智能停车系统
      </p>
    </div>
    <div class="loginForm">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
      <FormItem prop="user">
        <Input type="text" v-model="formInline.user" placeholder="请输入账号">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="formInline.password" placeholder="请输入密码" @on-enter="handleSubmit('formInline')">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem label="记住密码" style="width:100%">
        <i-switch v-model="historyPsw" @on-change="savePsw" />
      </FormItem>
      <!-- <div><span style="color:blue;cursor:pointer" @click="OpenAlert">忘记密码?</span></div> -->
      <FormItem style="text-align:right;width:100%;">
        <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
        <Button type="primary" @click="$router.push({name: 'regist'})">注册</Button>
      </FormItem>
    </Form>
    </div>
    <!-- <changePassword ref="changePassword" :showChange="showChange">
    </changePassword> -->
  </div>
</template>
<script>
// import {ApiLogin} from '@/api'
// import changePassword from '@/components/changePassword'
export default {
  components: {
    // changePassword
  },
  data () {
    return {
      historyPsw: true,
      showChange: false,
      formInline: {
        user: localStorage.getItem('user') ? localStorage.getItem('user') : '',
        password: localStorage.getItem('pswd') ? localStorage.getItem('pswd') : ''
      },
      ruleInline: {
        user: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', max: 12, trigger: 'blur' },
          { type: 'string', min: 6, message: '密码最少六位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 记住密码
    savePsw (val) {
    },
    OpenAlert () {
      this.$refs.changePassword.openChangeClose()
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.submitLogin()
        } else {
          this.$Message.error('登录失敗,请检查账号密码是否错误!')
        }
      })
    },
    // 登录
    async submitLogin () {
      // const data = {
      //   enterpriseTel: this.formInline.user,
      //   enterprisePassword: this.formInline.password
      // }
      // const res = await ApiLogin(data)
      // if (res.code === 200) {
      //   if (this.historyPsw) {
      //     localStorage.setItem('user', this.formInline.user)
      //     localStorage.setItem('pswd', this.formInline.password)
      //   } else {
      //     localStorage.removeItem('user')
      //     localStorage.removeItem('pswd')
      //   }
      //   this.$Message.success('登录成功!')
      //   sessionStorage.setItem('userInfo', JSON.stringify(res.data))
      //   await this.$store.commit('GETUSERINFO', res.data)
      //   setTimeout(() => {
      //     this.$router.push({name: 'home'})
      //   }, 1000)
      // } else {
      //   this.$Message.error('登录失敗,请检查账号密码是否错误')
      //   return false
      // }
    }
  }
}
</script>
<style lang="less" scoped>
.loginContent{
  display:flex;
  align-items: center;
  justify-content: center;
  height:100%;
  // background: linear-gradient(#ddd7d7, #4ca7ab);
  background: linear-gradient(#0cffdd, #0b9a9a);
  background: url('../../assets/bg.jpg');
  .loginForm{
    width: 23%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 5%;
    box-shadow: 0px 0px 15px #f8f0f0;
    border-radius: 4px;
  }
}
</style>
