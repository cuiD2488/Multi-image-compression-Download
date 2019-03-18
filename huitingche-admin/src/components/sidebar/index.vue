<style lang="less" scoped>
@import './index.less';
</style>
<template>
  <div class="sidebar">
    <div class="sidebar-left">
      <Menu active-key="1" :active-name="$route.name" @on-select="handleMenuItemSelect">
        <Menu-item name="parkingList" key="1" v-if="userInfo.role === 1">
          <Icon type="document-text"></Icon>
          停车场管理
        </Menu-item>
        <Menu-item name="pakingMGTlist" key="2">
           <Icon type="chatbubbles"></Icon>
          车位管理列表
        </Menu-item>
        <Menu-item name="parkingRecord" key="3" v-if="userInfo.role === 1 || userInfo.role === 2">
           <Icon type="document-text"></Icon>
          停车记录
        </Menu-item>
        <!-- <Menu-item name="menuAuthorization" key="4" v-if="userInfo.role === 1">
          <Icon type="heart-broken"></Icon>
          停车场管理员授权
        </Menu-item> -->
        <!-- <Menu-item name="unpaid" key="5" v-if="userInfo.role === 1 || userInfo.role === 2">
           <Icon type="heart-broken"></Icon>
              待支付停车记录
        </Menu-item> -->
        <!-- <Menu-item name="deviceMGT" key="3">
           <Icon type="heart"></Icon>
                设备管理
        </Menu-item> -->
        <Menu-item name="parkingChargeRecord" key="6" v-if="userInfo.role === 1 || userInfo.role === 2">
          <Icon type="heart-broken"></Icon>
                停车收费记录
        </Menu-item>
        <!-- <Menu-item name="parkingFeesReport" key="6">
          <Icon type="heart-broken"></Icon>
                车位收费统计报表
        </Menu-item> -->
        <!-- <Menu-item name="carflow" key="7">
          <Icon type="heart-broken"></Icon>
                车流量统计报表
        </Menu-item> -->
        <Menu-item name="violationrecord" key="7" v-if="userInfo.role === 1 || userInfo.role === 2">
          <Icon type="heart-broken"></Icon>
          违章记录
        </Menu-item>
        <Menu-item name="userInfo" key="8" v-if="userInfo.role === 1 || userInfo.role === 2">
          <Icon type="heart-broken"></Icon>
          用户管理
        </Menu-item>
        <Menu-item name="role" key="9" v-if="userInfo.role === 1 || userInfo.role === 2">
          <Icon type="heart-broken"></Icon>
          体制内人员管理
        </Menu-item>
         <!-- <Menu-item name="chargerules" key="10">
            <Icon type="heart-broken"></Icon>
                停车场收费规则
        </Menu-item> -->
        <!-- <Menu-item name="merchant" key="13">
            <Icon type="heart-broken"></Icon>
                子商户管理
        </Menu-item> -->
      </Menu>
    </div>
    <div class="secondbar">
        <div class="secondbar-title">
            <Breadcrumb-item >{{$route.meta.title}}</Breadcrumb-item>
        </div>
        <div class="secondbar-data">
            <span>{{nowTime}}</span>
        </div>
  </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      nowTime: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    handleMenuItemSelect (name) {
      this.$router.push({name})
    },
    // 获取当前时间函数
    timeFormate (timeStamp) {
      let year = new Date(timeStamp).getFullYear()
      let month = new Date(timeStamp).getMonth() + 1 < 10 ? '0' + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1
      let date = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
      this.nowTime = year + '年' + month + '月' + date + '日'
    },
    // 定时器函数
    nowTimes () {
      this.timeFormate(new Date())
      setInterval(this.nowTimes, 30 * 1000)
    }
  },
  mounted () {
    this.nowTimes()
  }
}
</script>
