<template>
  <div class="rechargeContent">
    <!-- 充值页面 -->
    <div>
      <span>余额<strong style="color: red;font-size: 1.4rem;">0.00</strong>元</span>
    </div>
    <group>
      <x-input :show-clear="false" @on-change="changeMoney" style="border: 1px solid #ddd" title="充值金额：" v-model="moneyVal" placeholder="单次充值金额不得小于20元"></x-input>
    </group>
    <div>
      <x-button class="buttonContent" :class="{buttonBox: index === targetInde}" mini plain type="primary" @click.native="chooseMoney(index)" v-for="(item, index) in moneyButtonList" :key="index">{{item.value}}元</x-button>
    </div>
    <div style="margin-top: 2rem;">
      <x-button type="primary" :disabled="disabledBl">确定</x-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .rechargeContent{
    padding: 1rem;
    padding-top:4rem;
  }
  .buttonContent{
    margin-right: 1rem;
  }
  .buttonBox{
    border: 1px solid red;
    color: red;
  }
</style>

<script>
import { XInput, Group, XButton } from 'vux'
export default {
  components: {
    XInput,
    Group,
    XButton
  },
  data () {
    return {
      disabledBl: true,
      moneyVal: null,
      moneyButtonList: [
        {
          value: 50
        },
        {
          value: 100
        },
        {
          value: 200
        },
        {
          value: 500
        }
      ],
      targetInde: -1
    }
  },
  methods: {
    // 监听输入框变化
    changeMoney () {
      console.log(this.moneyVal)
      if (this.moneyVal) {
        this.disabledBl = false
      } else {
        this.disabledBl = true
        this.targetInde = -1
      }
    },
    // 选择金额
    chooseMoney (index) {
      console.log(index)
      this.targetInde = index
      this.moneyVal = this.moneyButtonList[index].value
    }
  }
}
</script>
