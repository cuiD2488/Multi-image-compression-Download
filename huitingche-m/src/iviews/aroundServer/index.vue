<template>
  <div class="aroundServer">
    <!-- 搜索栏 -->
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
      placeholder="搜索酒店、美食、电影票"
      @on-focus="onFocus"
      @on-cancel="onCancel"
      @on-submit="onSubmit"
      ref="search">
        <div slot="left">
          <div v-if="nowLocal" class="picWord"><img src="../../assets/navigation.png" alt=""><span>{{nowLocal}}</span></div>
          <div v-else class="picWord"><img src="../../assets/navigation.png" alt=""><span>获取中</span></div>
        </div>
      </search>
    </div>
    <!-- banner展示图 -->
    <div class="banner">
      <img src="../../assets/aroundBanner.png" alt="">
    </div>
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
</template>
<script>
import AMap from 'AMap'
import {Search, Loading} from 'vux'
export default {
  components: {
    Search,
    Loading
  },
  data () {
    return {
      muenList: [
        {
          icon: require('../../assets/around_item_1.png'),
          text: '附近美食',
          routeName: null
        },
        {
          icon: require('../../assets/around_item_2.png'),
          text: '酒店',
          routeName: null,
          url: null
        },
        {
          icon: require('../../assets/around_item_3.png'),
          text: '外卖点餐',
          routeName: null
        },
        {
          icon: require('../../assets/around_item_4.png'),
          text: '休闲娱乐',
          routeName: null,
          url: null
        },
        {
          icon: require('../../assets/around_item_5.png'),
          text: '景点门票',
          routeName: null,
          url: null
        },
        {
          icon: require('../../assets/around_item_6.png'),
          text: '打车服务',
          routeName: 'aroundServer',
          url: null
        }
      ],
      // 展示地理位置
      nowLocal: null
    }
  },
  methods: {
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
  }
}
</script>
<style lang="less" scoped>
.banner{
  width: 100%;
  img{
    width: 100%;
  }
}
.navContent{
  display:flex;
  justify-content: flex-start;
  flex-wrap:wrap;
  // margin-bottom: 1rem;
  >div{
    width:29%;
    // height: 5rem;
    margin: 0 2%;
    padding: 40px 0;
    // font-size: 1.4rem;
    .navImgContent{
      width: 90px;
      height: 90px;
      margin: 0 auto;
      margin-bottom:30px;
      img{
        width:100%;
        height:100%;
      }
    }
  }
}
</style>
