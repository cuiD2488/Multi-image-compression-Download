<template>
  <div class="page">
    <tab>
      <tab-item selected @on-item-click="getBillingDetail(2)">全部</tab-item>
      <tab-item @on-item-click="getBillingDetail(1)">入账</tab-item>
      <tab-item @on-item-click="getBillingDetail(0)">支出</tab-item>
    </tab>
    <!-- 充值记录 -->
    <div class="billingContent" v-if="billingList.length > 0">
      <div v-for="(item, index) in billingList" :key="index">
        <div class="itemLine">
          <div class="left">
            <div class="leftTitle">{{item.type === 1 ? '充值' : '停车付费'}}</div>
            <div class="leftTime">{{item.payCreateTime}}</div>
          </div>
          <div class="right" :class="item.type === 1 ? 'green' : 'red'">{{item.type === 1 ? '+' + item.payMoney : '-' + item.payMoney}}元</div>
        </div>
      </div>
    </div>
    <div v-else class="noData">
      <img src="@/assets/noData.png" alt="">
    </div>
  </div>
</template>
<script>
import {ApiQueryBill} from '@/api'
import { Tab, TabItem, XButton } from 'vux'

export default {
  components: {
    Tab,
    TabItem,
    XButton
  },
  data () {
    return {
      billingList: []
    }
  },
  methods: {
    // 获取账单明细
    async getBillingDetail (n) {
      let data = {
        userNumber: JSON.parse(sessionStorage.getItem('userInform')).userNumber
      }
      if (n === 0 || n === 1) {
        data.type = n
      }
      const res = await ApiQueryBill(data)
      if (res.code === 200 && res.data) {
        // 清空展示数据重新写入
        this.billingList = []
        let data = res.data
        for (let index in data) {
          data[index].payCreateTime = data[index].payCreateTime.substring(0, data[index].payCreateTime.length - 5)
          this.billingList.push(data[index])
        }
      } else {
        this.$vux.toast.text(res.msg)
      }
    }
  },
  mounted () {
    // 挂载完成后调用获取账单明细
    this.getBillingDetail()
  }
}
</script>
<style>
.page{
  min-height: calc(100% - 120px);
}
</style>

<style lang="less" scoped>
.page{
  background: #f6f6f6;
  padding-bottom: 120px;
  // min-height: calc(100% - 120px);
}
.parkingRecordContent{
  text-align: left;
  padding: 20px 0;
  font-size: 28px;
  >div {
    margin-bottom: 20px;
    background: #fff;
    padding: 40px 30px;
  }
  .location{
    padding-bottom: 15px;
  }
  .date{
    display: flex;
    justify-content: space-between;
    color: #898989;
    font-size: 24px;
  }
}
.delLine{
  display: flex;
  padding-top: 20px;
  line-height: 54px;
  // justify-content: space-between;
  .deleteDiv{
    flex-grow: 1;
    position: relative;
    .deleteBtn{
      position: absolute;
      right: 0;
    }
  }
}
.billingContent{
  margin-top: 10px;
  .itemLine{
    display: flex;
    padding: 35px 30px;
    text-align: left;
    background: #fff;
    margin-bottom: 10px;
    .leftTitle{
      font-size: 36px;
      color: #000;
    }
    .leftTime{
      font-size: 24px;
      color: #959595;
    }
    .right{
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 32px;
    }
    .red{
      color: #f00;
    }
    .green{
      color: #00b111;
    }
  }
}
.noData{
  height: 100%;
  text-align: center;
  padding: 0 30px;
  padding-top: 45%;
  img{
    width: 60%;
  }
}
</style>
