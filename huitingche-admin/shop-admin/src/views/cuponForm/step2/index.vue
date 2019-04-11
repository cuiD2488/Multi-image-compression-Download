<template>
  <div>
    <div class="cuponContent">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <FormItem label="用户可领个数" prop="cuponMax">
          活动期间每个用户可领取<Input v-model="formValidate.cuponMax" placeholder="输入最多领取优惠券个数" style="width:50%;margin:0 10px;"></Input>个
        </FormItem>
        <FormItem label="优惠卷发放总量" prop="cuponUpperLimit">
          <Input v-model="formValidate.cuponUpperLimit" placeholder="优惠券数量" style="width:80%;margin:0 10px;"></Input>
        </FormItem>
        <FormItem label="同时使用">
            <i-switch v-model="formValidate.achieve" size="large" :true-value="1" :false-value="0">
              <span slot="open">On</span>
              <span slot="close">Off</span>
            </i-switch>
            用户可在一笔订单中，同时享受此优惠及本商户创建的其他微信支付优惠
        </FormItem>
        <FormItem label="商城通用">
            <i-switch v-model="formValidate.is_whole_field" size="large" :true-value="1" :false-value="0">
              <span slot="open">On</span>
              <span slot="close">Off</span>
            </i-switch>
            此优惠券是否在全商城范围内通用
        </FormItem>
         <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">下一步</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
          <Button @click="backOff('formValidate')" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
    </div>
  </div>
</template>
<style>
.cuponContent{
width: 60%;
padding:20px;
}
</style>

<script>
export default {
  data () {
    const isNumberFn = (rule, value, callbck) => {
      const regNumber = /^[0-9]*$/
      if (!regNumber.test(+value)) {
        return callbck(new Error('请输入数字'))
      } else {
        callbck()
      }
    }
    const totalCupon = (rule, value, callback) => {
      if (+value < +this.formValidate.cuponMax) {
        return callback(new Error('优惠券总数量不能低于单个用户最多领取数'))
      } else {
        callback()
      }
    }
    return {
      formValidate: {
        cuponMax: '',
        cuponUpperLimit: '',
        achieve: '',
        is_whole_field: ''
      },
      ruleValidate: {
        cuponMax: [
          { required: true, message: '请输入单个用户最多领取数', trigger: 'blur' },
          { validator: isNumberFn }
        ],
        cuponUpperLimit: [
          { required: true, message: '请输入优惠券总数量', trigger: 'blur' },
          { validator: isNumberFn },
          { validator: totalCupon }
        ],
        achieve: [
          { required: true, message: '请输入最低抵扣额' },
          { validator: isNumberFn }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      const _this = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          _this.$Message.success('Success!')
          let cuponeListForm = JSON.parse(sessionStorage.getItem('cuponeListForm'))
          for (let i in _this.formValidate) {
            console.log(i)
            for (let j in cuponeListForm) {
              if (i === j ) {
                cuponeListForm[i] = _this.formValidate[i]
              } else {
                cuponeListForm = {..._this.formValidate, ...cuponeListForm}
              }
            }
          }
          sessionStorage.setItem('cuponeListForm', JSON.stringify(cuponeListForm))
          _this.$router.push({name: 'cuponFormStep3'})
        } else {
          _this.$Message.error('Fail!');
        }
      })
    },
    // 返回上一步
    backOff () {
      console.log('上一部')
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  },
  mounted () {
  }
}
</script>