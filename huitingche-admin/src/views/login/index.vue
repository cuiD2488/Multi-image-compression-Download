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
          <Input prefix="ios-contact" type="text" v-model="formInline.user" placeholder="请输入账号"/>
        </FormItem>
        <FormItem prop="password">
          <Input prefix="ios-keypad" type="password" v-model="formInline.password" placeholder="请输入密码" @on-enter="handleSubmit('formInline')" />
        </FormItem>
        <!-- <FormItem label="记住密码" style="width:100%">
          <i-switch v-model="historyPsw" @on-change="savePsw" />
        </FormItem> -->
        <!-- <div><span style="color:blue;cursor:pointer" @click="OpenAlert">忘记密码?</span></div> -->
        <FormItem style="text-align:right;width:100%;">
          <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
          <!-- <Button type="primary" @click="$router.push({name: 'regist'})">注册</Button> -->
          <Button type="primary" @click="showForgetPassword">忘记密码</Button>
        </FormItem>
      </Form>
    </div>
    <!-- <Modal
      v-model="showForgetPassword"
      title="编辑车位信息"
      @on-ok="editParkingPosition"
      @on-cancel="showForgetPassword = false">
      <div>
          <Form ref="formValidate" :model="editParkingPositionForm" :label-width="100">
            <FormItem label="停车场名称">
              <Input v-model="editParkingPositionForm.parkingLotName" placeholder="请输入停车场名称" disabled></Input>
            </FormItem>
            <FormItem label="停车场编号">
              <Input v-model="editParkingPositionForm.parkingLotNumber" placeholder="请输入停车场编号" disabled></Input>
            </FormItem>
            <FormItem label="泊位号">
              <Input v-model="editParkingPositionForm.positionNumber" placeholder="请输入泊位号"></Input>
            </FormItem>
            <FormItem label="设备编号">
              <Input v-model="editParkingPositionForm.deviceId" placeholder="请输入设备编号"></Input>
            </FormItem>
            <FormItem label="地磁编号">
              <Input v-model="editParkingPositionForm.geomagnetismNumber" placeholder="请输入地磁编号"></Input>
            </FormItem>
            <FormItem label="路段管理员">
              <Input v-model="editParkingPositionForm.managerName" placeholder="请输入路段管理员" disabled></Input>
            </FormItem>
            <FormItem label="管理员联系方式">
              <Input v-model="editParkingPositionForm.managerNumber" placeholder="请输入管理员联系方式" disabled></Input>
            </FormItem>
            <FormItem label="创建时间">
              <Input v-model="editParkingPositionForm.createTime" placeholder="请输入创建时间" disabled></Input>
            </FormItem>
        </Form>
      </div>
    </Modal> -->
    <!-- <changePassword ref="changePassword" :showChange="showChange">
    </changePassword> -->
  </div>
</template>
<script>
import {ApiManagerLogin} from '@/api'
// import changePassword from '@/components/changePassword'
import md5 from 'js-md5'
export default {
  components: {
    // changePassword
  },
  data () {
    return {
      // historyPsw: false,
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
      },
      // 忘记密码弹窗
      showForgetPassword: false
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
      this.$Message.loading('登录中...')
      const data = {
        phone: this.formInline.user,
        // password: this.formInline.password
        password: md5(this.formInline.password)
      }
      const res = await ApiManagerLogin(data)
      console.log(res)
      if (res.code === 200) {
        // 是否记住密码
        if (this.historyPsw) {
          localStorage.setItem('user', this.formInline.user)
          localStorage.setItem('pswd', this.formInline.password)
        } else {
          localStorage.removeItem('user')
          localStorage.removeItem('pswd')
        }
        this.$Message.success('登录成功!')
        sessionStorage.setItem('userInfo', JSON.stringify(res.data))
        this.$store.commit('GETUSERINFO', res.data)
        setTimeout(() => {
          this.$router.push({name: 'parkingRecord'})
        }, 1000)
      } else {
        this.$Message.error('登录失敗,请检查账号密码是否错误')
        return false
      }
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
