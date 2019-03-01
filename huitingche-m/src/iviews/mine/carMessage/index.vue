<template>
  <div>
    <!-- 车辆信息 -->
    <div class="plateNumberDiv">
      <!-- 车牌前两位 -->
      <div class="plateNumberFirst">
        <input maxlength="1" v-focus="focusStatus === index" v-model="item.key" :ref="'input' + index" type="text" @keyup="changeInput(index)" v-for="(item, index) in inputListFirst" :key="index">
      </div>
      <!-- 分割点 -->
      <div class="point">•</div>
      <!-- 车牌后五位 -->
      <div class="plateNumberLast">
        <input maxlength="1" v-focus="focusStatus === index" v-model="item.key" :ref="'input' + index" type="text" @keyup="changeInput(index)" v-for="(item, index) in inputListLast" :key="index">
      </div>
    </div>
    <x-button class="sureBtn">确定</x-button>
    <div class="remark">请绑定真实有效的车牌号,否则将无法正常使用车牌付费功能</div>
  </div>
</template>
<script>
import {XButton} from 'vux'
export default {
  components: {
    XButton
  },
  data () {
    return {
      focusStatus: 0,
      inputListFirst: [
        {
          key: ''
        },
        {
          key: ''
        }
      ],
      inputListLast: [
        {
          key: ''
        },
        {
          key: ''
        },
        {
          key: ''
        },
        {
          key: ''
        },
        {
          key: ''
        }
      ]
    }
  },
  directives: {
    focus: { // 自定义指令针对自动聚焦input
      update: function (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  methods: {
    // 车牌号输入计算
    changeInput (index) {
      if (this.inputList[index].key && this.inputList[index].key.length > 0) {
        this.focusStatus = index + 1
      } else {
        this.focusStatus = index - 1
      }
      if (index === 5) {
        // 如果是最后一位，就查询是否有该车位
        console.log('最后一位')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.plateNumberDiv{
  padding: 75px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  .point{
    padding: 0 10px;
  }
  .plateNumberFirst, .plateNumberLast{
    position: relative;
    background-size: 100%;
    height: 86px;
    input{
      width: 74px;
      height:86px;
      text-align:center;
      border: 1px solid #ddd;
    }
  }
}
</style>
