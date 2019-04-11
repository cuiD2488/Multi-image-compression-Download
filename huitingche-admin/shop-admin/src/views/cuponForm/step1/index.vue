<template>
  <div>
    <div class="cuponContent">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="活动名称" prop="nameActivity">
          <Input v-model="formValidate.nameActivity" placeholder="活动名称"></Input>
        </FormItem>
        <FormItem label="面额" prop="nameMoney">
          <Input v-model="formValidate.nameMoney" placeholder="面额"></Input>
        </FormItem>
        <FormItem label="使用门槛" prop="limit">
          消费满<Input v-model="formValidate.limit" placeholder="使用门槛" style="width:60%;margin:0 10px;"></Input>元可使用
        </FormItem>
        <FormItem label="可用时间">
          <Row>
            <Col span="11">
              <FormItem prop="dateBging">
                <DatePicker type="date" placeholder="开始时间" v-model="formValidate.dateBging"></DatePicker>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem prop="dateEnd">
                <DatePicker type="date" placeholder="结束时间" v-model="formValidate.dateEnd"></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="填写活动备注"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">下一步</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
    </div>
  </div>
</template>
<style>
.cuponContent{
width: 40%;
padding:20px;
margin-left:20px;
}
</style>

<script>
import {ApiFindCouponName} from '@/api'
export default {
  props: {
    current: Number
  },
  data () {
    const isNumberFn = (rule, value, callbck) => {
      const regNumber = /^[0-9]*$/
      if (!regNumber.test(+value)) {
        return callbck(new Error('请输入数字'))
      } else {
        callbck()
      }
    }
    const findCouponName = async(rule, value, callback) => {
      console.log(this.userInfo)
      console.log(this)
      const data = {
        enterpriseId: this.userInfo.id,
        coupon_name: value 
      }
      const res = await ApiFindCouponName(data)
      if (res.errorCode === 1) {
        return callback(new Error('优惠券名称已存在'))
      } else {
        callback()
      }
      console.log(res)
    }
    const validatorLimit = async(rule, value, callback) => {
      if (+value < +this.formValidate.nameMoney) {
        return callback(new Error('优惠券面额不能大于满减金额'))
      }
    }
    return {
      userInfo:  this.$cookies.get('userInfo'),
      formValidate: {
        nameActivity: '',
        nameMoney: '',
        limit: '',
        dateBging: '',
        dateEnd: '',
        desc: ''
      },
      ruleValidate: {
        nameActivity: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { validator: findCouponName, trigger: 'blur' }
        ],
        nameMoney: [
          { required: true, message: '请输入优惠券面额', trigger: 'blur' },
          { validator: isNumberFn }
        ],
        limit: [
          { required: true, message: '请输入门槛金额', trigger: 'blur' },
          { validator: isNumberFn, tigger: 'blur' },
          { validator: validatorLimit, tigger: 'blur' }
        ],
        dateBging: [
          { required: true, type: 'date', message: '请选择有限期', trigger: 'change' }
        ],
        dateEnd: [
          { required: true, type: 'date', message: '请选择有限期', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      let cuponeListForm = []
      this.$refs[name].validate((valid) => {
        if (valid) {
          cuponeListForm = [...this.formValidate, ...cuponeListForm]
          sessionStorage.setItem('cuponeListForm', JSON.stringify(this.formValidate))
          this.$router.push({name: 'cuponFormStep2'})
          this.$Message.success('Success!');
        } else {
          this.$Message.error('请输入优惠券基础规则!');
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  },
  mounted () {
    console.log(this.current)
  }
}
</script>