<template>
  <div class="homePage">
    <div class="searchLine">
      <!-- 搜索栏 -->
      <search
      class="searchClass"
      @result-click="resultClick"
      @on-change="getResult"
      :results="results"
      v-model="searchValu"
      position="absolute"
      auto-scroll-to-top
      placeholder="搜目的地，找停车场"
      @on-focus="onFocus"
      @on-cancel="onCancel"
      @on-submit="onSubmit"
      ref="search">
        <div slot="left">
          <div v-if="nowLocal" class="picWord"><img src="../../assets/navigation.png" alt=""><span>{{nowLocal}}</span></div>
          <div v-else class="picWord"><img src="../../assets/navigation.png" alt="">获取中</div>
        </div>
      </search>
    </div>
    <div>
      <!-- 广告图 -->
      <div class="bannerContent" @click="$router.push({name: 'Intelligence'})">
        <img src="../../assets/banner.png" alt="">
      </div>
    </div>
    <div>
      <!-- 导航栏 -->
      <div class="navContent">
        <div v-for="(item, index) in muenList" :key="index" @click="toLocation(item)">
          <div class="navImgContent">
            <img :src="item.icon">
          </div>
          <div>
            <span>{{item.text}}</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <!-- 停车方式 -->
      <!-- <div class="doubleBox">
        <div class="leftBox">
          <div class="inside">
            <img src="../../assets/earlyWarning.png" alt=""><div>预付费停车</div>
          </div>
        </div>
        <div class="rightBox">
          <div class="inside">
            <img src="../../assets/after.png" alt=""><div>后付费停车</div>
          </div>
        </div>
      </div> -->
    </div>
    <div>
      <!-- 信息中心 -->
      <div class="messageHead">
        <img src="../../assets/gonggao.png" alt=""><span>信息中心</span>
      </div>
      <div class="messageContent">
        <p v-for="(item, index) in noticeList" :key="index">
          <span v-text="'您于' + item.payCreateTime"></span>
          <span v-text="item.type === 0 ? '停车消费' + item.payMoney + '元' : '充值' + item.payMoney + '元'"></span>
        </p>
      </div>
    </div>
    <loading :show="showLoading" text="请稍后"></loading>
  </div>
</template>
<script>
import AMap from 'AMap'
import {ApiWxLogin, ApiQueryBill} from '@/api'
import {Search, Loading} from 'vux'

export default {
  components: {
    Search,
    Loading
  },
  data () {
    return {
      // 微信登录code
      // code: null,
      // 厂商id
      // state: null,
      results: [],
      searchValu: '',
      muenList: [
        {
          icon: require('../../assets/stop.png'),
          text: '我要停车',
          routeName: 'Intelligence'
        },
        {
          icon: require('../../assets/fiyting.png'),
          text: '优惠加油',
          routeName: null,
          url: null
        },
        {
          icon: require('../../assets/wash.png'),
          text: '车辆服务',
          routeName: null
        },
        {
          icon: require('../../assets/violation.png'),
          text: '违章查缴',
          routeName: null,
          url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6bfe76eabcf9e5e3&redirect_uri=http%3A%2F%2Fweixin.checar.cn%2Fweixin%2Fembed%2FtwoindexAction%21weixin.action&response_type=code&scope=snsapi_base&state=73920#wechat_redirect'
        },
        {
          icon: require('../../assets/shoppingMall.png'),
          text: '本地优选',
          routeName: null,
          url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8ad03862eab34cf0&redirect_uri=http://cyc8.cn/getOpenIdByYSSHWxMenu.json?appid=wx8ad03862eab34cf0&response_type=code&scope=snsapi_base&state=13#wechat_redirect'
        },
        {
          icon: require('../../assets/aroundSever.png'),
          text: '周边服务',
          routeName: 'aroundServer',
          url: null
        },
        {
          icon: require('../../assets/warning.png'),
          text: '一键报警',
          routeName: null,
          url: null
        },
        {
          icon: require('../../assets/booking.png'),
          text: '生活助手',
          routeName: 'lifeAssistant'
          // url: 'http://m.ctrip.com/html5/?allianceid=834861&sid=1399502&popup=close&autoawaken=close'
        }
      ],
      noticeList: [
      ],
      // loading展示标识
      showLoading: true,
      // 展示地理位置
      nowLocal: null
    }
  },
  methods: {
    // 微信登录接口
    async wxLogin (code, state) {
      if (sessionStorage.getItem('userInform')) {
        this.showLoading = false
        return
      }
      let data = {
        code: code,
        state: state
      }
      const res = await ApiWxLogin(data)
      if (res.code === 200) {
        // 通过接口获取用户信息并存储至缓存中
        sessionStorage.setItem('userInform', JSON.stringify(res.data))
      } else {
        this.$vux.toast.text('微信登录失败请刷新后重试')
      }
      this.showLoading = false
    },
    // 查询扣费停车信息
    async queryBill () {
      const data = {
        userNumber: sessionStorage.getItem('userInform') ? JSON.parse(sessionStorage.getItem('userInform')).userNumber : ''
      }
      const res = await ApiQueryBill(data)
      if (res.code === 200) {
        this.noticeList = res.data
      }
    },
    // 导航跳转
    toLocation (item) {
      console.log(233)
      if (item.routeName) {
        this.$router.push({name: item.routeName})
      } else if (item.url) {
        location.href = item.url
      } else {
        this.$vux.toast.text('持续开发中，敬请期待')
        this.$store.commit('GETUSERINFO', 'test')
      }
    },
    getResult () {
    },
    onFocus () {
    },
    onCancel () {
    },
    onSubmit () {
    },
    resultClick () {
    },
    // 获取用户地理位置
    getLocation () {
      let _this = this
      this.$vux.loading.show({
        text: '获取定位...'
      })
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          showCircle: true,
          buttonPosition: 'LB', // 定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 350), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: false // 定位成功后是否自动调整地图视野到定位点
        })
        // 获取用户当前的精确位置信息，当回调函数中的status为complete的时候表示定位成功，result为GeolocationResult对象;
        // 当回调函数中的status为error的时候表示定位失败，result为GeolocationError对象；
        geolocation.getCurrentPosition(function (status, result) {
          if (status === 'complete') {
            // 关闭loading
            _this.$vux.loading.hide()
            // console.log(result)
            _this.nowLocal = result.addressComponent.district
          } else {
            _this.$vux.loading.hide()
            _this.$vux.toast.text('定位失败')
          }
        })
      })
    }
  },
  mounted () {
    this.getLocation()
  },
  created () {
    // 从字符串中截取相关参数
    let url = location.search // 获取url中"?"符后的字串
    let theRequest = {}
    if (url.indexOf('?') !== -1) {
      let str = url.substr(1)
      // alert(str);
      let strs = str.split('&')
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1])
        // 获取中文参数转码<span style="font-family: Arial, Helvetica, sans-serif;">decodeURI</span>，（unescape只针对数字，中文乱码)
      }
    }
    // 根据url中的参数获取用户信息
    this.wxLogin(theRequest.code, theRequest.state)
    // this.code = theRequest.code
    // this.state = theRequest.state
    // // 在本地缓存中存入code
    // sessionStorage.setItem('code', theRequest.code)
    // 在本地缓存中存入厂商id
    sessionStorage.setItem('state', theRequest.state)
    this.queryBill()
    // 获取页面原始高度
    sessionStorage.setItem('windowHeight', JSON.stringify(document.documentElement.clientHeight))
  }
}
</script>
<style lang="less" scoped>
.homePage{
  padding-bottom: 120px;
}
.searchLine{
  // height: 102px;
  background-color: #e9e9ee;
  padding: 15px 0;
}
.bannerContent{
  height: 274px;
  img{
    width:100%;
    height:100%;
  }
}
.navContent{
  display:flex;
  justify-content: flex-start;
  flex-wrap:wrap;
  // margin-bottom: 1rem;
  >div{
    width:21%;
    // height: 5rem;
    margin: 0 2%;
    padding: 40px 0;
    // font-size: 1.4rem;
    .navImgContent{
      width: 60px;
      height: 60px;
      margin: 0 auto;
      margin-bottom:30px;
      img{
        width:100%;
        height:100%;
      }
    }
  }
}
.messageHead{
  text-align: left;
  padding: 20px;
  border-bottom: 1px solid #e5e5e5;
  img{
    width: 27px;
    height: 23px;
    padding-right: 20px;
  }
}
.messageContent{
  text-align: left;
  // font-size: 1.2rem;
  padding: 0 20px;
  // max-height: 15rem;
  height: 300px;
  overflow: auto;
  p{
    display: flex;
    justify-content: space-between;
    margin:20px 20px;
  }
}
.doubleBox{
  height: 146px;
  display: flex;
  padding: 10px 20px;
  font-size: 28px;
  .leftBox{
    width: 339px;
    background: #effbff;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rightBox{
    width: 339px;
    background: #effbff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .inside{
    display: flex;
    img{
      padding-right: 24px;
      width: 42px;
      height: 42px;
    }
  }
}
</style>
<style>
.searchLine{
  font-size: 24px !important;
}
.searchLine form input, .searchLine form i{
    font-size: 24px !important;
}
.searchLine form .weui-search-bar__label span{
   font-size: 28px !important;
}
.searchLine form .weui-search-bar__label{
  line-height: 58px !important;
}
.weui-search-bar__box{
    padding-left: 0.6rem !important;
}
.weui-search-bar__cancel-btn{
  line-height: 0.6rem !important;
}
.weui-search-bar__box .weui-icon-search{
  top: .1rem !important;
}
.picWord{
  display: inline-block;
  height: 58px;
  font-size: 32px;
}
.picWord img{
  width: 40px;
  height: 50px;
  vertical-align: text-top;
}
.picWord span{
  display: inline-block;
  vertical-align: text-top;
  margin: 0 10px;
}
</style>
