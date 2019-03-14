<template>
  <div class="page">
    <tab>
      <tab-item selected @on-item-click="getParkRecord">全部订单</tab-item>
      <tab-item @on-item-click="getParkRecord(1)">已完成</tab-item>
      <tab-item @on-item-click="getParkRecord(2)">欠费记录</tab-item>
      <tab-item @on-item-click="illegalFlag = true">违章查询</tab-item>
    </tab>
    <!-- 停车记录 -->
    <div class="parkingRecordContent" v-if="recordList.length > 0 && !illegalFlag">
      <div v-for="(item, index) in recordList" :key="index" v-if="item.orderStatus">
        <div class="location">{{item.city + item.county + item.detailedAddress + item.parkingLotName}}</div>
        <div class="date">
          <span>停车时间：</span>
          <span>{{item.enterTime}} 至 {{item.outTime}}</span>
        </div>
        <div class="date">
          <div>预付金额：<span style="color:#000">{{item.orderMoney}}元</span></div>
          <div>实付金额：<span style="color:#000">{{item.actualPayMoney}}元</span></div>
        </div>
        <div class="delLine">
          <div>{{item.orderStatus === 0 ? '待支付' : item.orderStatus === 1 ? '支付成功' : '待补缴'}}</div>
          <div class="deleteDiv">
            <x-button @click.native="deleteOrder(item.orderNumber)" type="primary" mini text="删除" class="deleteBtn"></x-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 违停记录 -->
    <div v-else-if="illegalFlag">
      <div class="illegalDiv">
        <x-input class="weui-vcode" v-model="carNumber" placeholder="请输入查询的车牌号">
          <x-button slot="right" @click.native="sureBtn" type="primary" mini text="确定"></x-button>
        </x-input>
      </div>
      <div class="showDiv" v-if="illegalList.length > 0">
        <div v-for="(item, index) in illegalList" :key="index">
          <div class="location">{{item.city + item.county + item.detailedAddress + item.parkingLotName}}</div>
          <div class="date">
            <span>违停时间：</span>
            <span>{{item.violationCreateTime}}</span>
          </div>
          <div class="date">
            <div>违停原因：<span style="color:#000">{{item.reasons}}</span></div>
            <div>停车场编号：<span style="color:#000">{{item.parkingLotNumber}}</span></div>
          </div>
          <div class="illegaImg">
            <div class="title">违停拍照：</div>
            <swiper :list="illegalList[index].violationImage" style="width:85%;margin:0 auto;" :aspect-ratio="500/800" dots-position="center"></swiper>
            <!-- <div v-for="index1 of illegalList[index].violationImage" :key="index1">
              <img :src="index1" alt="">
            </div> -->
          </div>
          <!-- <div class="delLine">
            <div>{{item.orderStatus === 0 ? '待支付' : item.orderStatus === 1 ? '支付成功' : '待补缴'}}</div>
            <div class="deleteDiv">
              <x-button @click.native="deleteOrder(item.orderNumber)" type="primary" mini text="删除" class="deleteBtn"></x-button>
            </div>
          </div> -->
        </div>
      </div>
      <div v-else class="noData">
        <img src="@/assets/noData.png" alt="">
      </div>
    </div>
    <div v-else class="noData">
      <img src="@/assets/noData.png" alt="">
    </div>
  </div>
</template>
<script>
import {ApiQueryPkOrder, ApiDeletePkOrder, ApiQueryPkViolation} from '@/api'
import { Tab, TabItem, XButton, XInput, Swiper } from 'vux'

export default {
  components: {
    Tab,
    TabItem,
    XButton,
    XInput,
    Swiper
  },
  data () {
    return {
      recordList: [],
      illegalFlag: false,
      carNumber: null,
      illegalList: []
    }
  },
  methods: {
    // 获取停车记录
    async getParkRecord (n) {
      this.illegalFlag = false
      let data = {
        userNumber: JSON.parse(sessionStorage.getItem('userInform')).userNumber,
        col: 1
      }
      if (n) {
        data.orderStatus = n
      }
      const res = await ApiQueryPkOrder(data)
      if (res.code === 200 && res.data) {
        // 清空展示数据重新写入
        this.recordList = []
        let data = res.data.data
        for (let index in data) {
          // 判断是否含有进出车时间,没有不展示
          if (data[index].enterTime && data[index].outTime) {
            data[index].enterTime = data[index].enterTime.substring(0, data[index].enterTime.length - 5)
            data[index].outTime = data[index].outTime.substring(0, data[index].outTime.length - 5)
            this.recordList.push(data[index])
          }
        }
      } else {
        this.$vux.toast.text(res.msg)
      }
    },
    // 删除停车记录
    async deleteOrder (orderNumber) {
      let data = {
        orderNumber: orderNumber
      }
      const res = await ApiDeletePkOrder(data)
      if (res.code === 200) {
        this.$vux.toast.text('删除成功')
        this.getParkRecord()
      } else {
        this.$vux.toast.text(res.msg)
      }
    },
    // 查询违章信息
    async sureBtn () {
      let data = {
        vendorId: +JSON.parse(sessionStorage.getItem('userInform')).vendorId,
        numberPlate: this.carNumber
      }
      const res = await ApiQueryPkViolation(data)
      if (res.code === 200 && res.data) {
        let imgArr = []
        let imgList = []
        let imgData = {}
        for (let index in res.data.data) {
          // 将图片字符串转换为数组
          imgArr = res.data.data[index].violationImage.split(',')
          // 将数组内容封装成list
          for (let index1 in imgArr) {
            imgData = {
              img: imgArr[index1]
            }
            imgList.push(imgData)
          }
          res.data.data[index].violationImage = imgList
          // 将图片存入展示数组
          this.illegalList.push(res.data.data[index])
        }
      }
    }
  },
  mounted () {
    // 挂载完成后调用获取停车信息接口
    this.getParkRecord()
  }
}
</script>
<style lang="less" scoped>
.page{
  background: #f6f6f6;
  // height:100%;
  padding-bottom: 120px;
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
.noData{
  height: 100%;
  text-align: center;
  padding: 0 30px;
  padding-top: 45%;
  img{
    width: 60%;
  }
}
.showDiv{
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
.illegaImg{
  img{
    width: 200px;
  }
}
</style>
<style>
.page{
  min-height: calc(100% - 120px);
}
.illegalDiv{
  background: #fff;
  font-size: 28px;
  margin: 10px 20px;
  border: 1px solid #f5f5f5;
  border-radius: 10px;
}
.weui-cell{
  background: #fff;
}
button.weui-btn, input.weui-btn{
  margin: 0;
}
</style>
