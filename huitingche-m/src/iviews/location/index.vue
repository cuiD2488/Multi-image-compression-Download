<template>
  <div class="amap-page-container">
    <div class="searchLine">
      <search
      class="searchClass"
      @result-click="resultClick"
      @on-focus="getResult"
      @on-change="getResult"
      :results="results"
      v-model="values"
      position="absolute"
      auto-scroll-to-top
      ref="search"></search>
    </div>
    <div id="container" class="map"></div>
    <div v-transfer-dom>
      <popup v-model="show15" is-transparent :show-mask="false" class="popupClass">
        <div class="popupNav" style="">
          <span style="position: absolute;right: 8px;top:5px" @click="show15 = false">
            X
          </span>
          <span style="position: absolute;right: 8px;top:30px;color: #5dbeb0;" @click="$router.push({name: 'parkingRules', query: {...$route.query, ...{'parkingLotNumber': targetParkingLotNumber}}})">
            查看收费规则
          </span>
          <div class="popupNav_title">
            <img src="../../assets/stop.png" alt="" class="imgIcon">
            <span>路边停车</span>
          </div>
          <div class="popupNav_distance"><span>{{detailedAddress}}</span><span>距离：{{targetDistancd}}公里</span></div>
          <div class="popupNav_parkingLot">
            <div>
              <span>空车位：<span style="color: red;">{{targetEmptyPositionCount}}</span></span>
              <span>总车位：<span>{{targetTotalPositionCount}}</span></span>
            </div>
            <div>
              <span>五分钟空出车位：{{targetAvailablePositionCount}}</span>
              <span></span>
            </div>
          </div>
          <div class="popoupNav_operation">
            <div @click="planRouteNav">
              <img src="../../assets/luxian.png" alt="" class="imgIcon">
              <span>路线</span>
            </div>
             <div>
              <img src="../../assets/daohang.png" alt="" class="imgIcon">
              <span>导航</span>
            </div>
             <div @click="strengthenRange">
              <img src="../../assets/round.png" alt="" class="imgIcon">
              <span>扩大搜索</span>
            </div>
          </div>
        </div>
      </popup>
    </div>
    <div id="panel"></div>
  </div>
</template>
<script>
import AMap from 'AMap'
import {ApifindPkLotListByLngLat, ApifindParkingLotByCondition} from '@/api'
import {TransferDom, Search, Group, XSwitch, Popup} from 'vux'
// import ToggleText from './ToggleText'
var map
export default {
  directives: {
    TransferDom
  },
  components: {
    Search,
    Group,
    XSwitch,
    Popup
  },
  data () {
    return {
      show15: false,
      center: [121.59996, 31.197646],
      lng: 0,
      lat: 0,
      loaded: false,
      distance: 3, // 查询范围
      results: [],
      values: '',
      targetPllanData: null,
      targetAvailablePositionCount: 0, // 五分钟空出车位
      targetEmptyPositionCount: 0, // 空闲车位
      targetTotalPositionCount: 0, // 车位总数
      targetDistancd: 0, // 定位地址到目标点标记地址的直线距离
      detailedAddress: '',
      targetParkingLotNumber: '' // 选择挺车场编号
    }
  },
  methods: {
    // 增大搜索范围
    strengthenRange () {
      this.distance = 5
      this.initMap()
    },
    // 点击导航
    planRouteNav () {
      this.planningRoute(this.targetPllanData.startPosition, this.targetPllanData.endPostion)
    },
    // 初始化地图
    initMap () {
      map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 12 // 地图显示的缩放级别
      })
      this.geolocations()
    },
    // 渲染地图；加载定位插件；
    geolocations () {
      let _this = this
      // 加载定位插件
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
        // 在图面添加定位控件
        map.addControl(geolocation)
        // 获取用户当前的精确位置信息，当回调函数中的status为complete的时候表示定位成功，result为GeolocationResult对象;
        // 当回调函数中的status为error的时候表示定位失败，result为GeolocationError对象；
        geolocation.getCurrentPosition(function (status, result) {
          if (status === 'complete') {
            // 关闭loading
            _this.$vux.loading.hide()
            _this.onComplete(result)
            // console.log(result)
            _this.center = result.position
            // 查询周边
            AMap.service(['AMap.PlaceSearch'], function () {
              // 构造地点查询类 这里只是用到周边搜索的范围，所以实例属性里的type填写的是高德未录入的，不然会默认查出相关markr
              var placeSearch = new AMap.PlaceSearch({
                type: '停车位',
                map: map, // 展现结果的地图实例
                autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
              })
              placeSearch.searchNearBy('停车位', _this.center, (_this.distance * 1000), (status, result) => {
              })
            })
            // _this.center = result.position
          } else {
            _this.$vux.loading.hide()
            _this.$vux.toast.text('定位失败')
          }
        })
      })
    },
    // 获取精准坐标
    onComplete (data) {
      this.markerS(data.position)
    },
    // 查询默认3公里范围内的车位坐标数组
    async findPosition (position) {
      const data = {
        longitude: position.lng,
        latitude: position.lat,
        distance: this.distance
      }
      const res = await ApifindPkLotListByLngLat(data)
      return res.data
    },
    // 设置点标记
    markerS (position) {
      const _this = this
      let positionList = []
      this.findPosition(position).then((res) => {
        for (let i in res) {
          positionList.push([res[i].pkLotVo.longitude, res[i].pkLotVo.latitude])
        }
        for (let i in positionList) {
          var marker = new AMap.Marker({
            icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
            position: positionList[i],
            offset: new AMap.Pixel(0, 0),
            anchor: 'center',
            clickable: true
          })
          marker.on('click', (res2) => {
            _this.targetAvailablePositionCount = res[i].availablePositionCount // 五分钟空出车位
            _this.targetEmptyPositionCount = res[i].emptyPositionCount // 空闲车位
            _this.targetTotalPositionCount = res[i].totalPositionCount // 车位总数
            _this.detailedAddress = res[i].pkLotVo.detailedAddress
            this.targetParkingLotNumber = res[i].pkLotVo.parkingLotNumber
            // 获取距离
            _this.targetDistancd = _this.getDistance(position.lat, position.lng, res2.lnglat.lat, res2.lnglat.lng)
            this.show15 = true
            this.targetPllanData = {
              startPosition: position,
              endPostion: [res2.lnglat.lng, res2.lnglat.lat]
            }
            // _this.planningRoute(position, [res.lnglat.lng, res.lnglat.lat])
          })
          marker.setMap(map)
        }
      })
    },
    // 规划路线
    planningRoute (positionStart, positionEnd) {
      AMap.plugin(['AMap.Driving'], () => {
        var driving = new AMap.Driving({
          map: map,
          panel: 'panel'
        })
        // 根据起终点经纬度规划驾车导航路线
        driving.search(new AMap.LngLat(positionStart.lng, positionStart.lat), new AMap.LngLat(positionEnd[0], positionEnd[1]), (status, result) => {
          // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
          if (status === 'complete') {
            this.$vux.toast.text('绘制驾车路线完成')
          } else {
            this.$vux.toast.text('获取驾车数据失败：' + result)
          }
        })
      })
    },
    // 选择搜索框选项
    resultClick (val) {
      let positionEnd = [val.longitude, val.latitude]
      this.planningRoute(this.center, positionEnd)
    },
    // 搜索输入监听
    getResult (val) {
      this.findAddr(val)
    },
    // 查询搜索地址
    async findAddr (val) {
      const data = {
        'parkingLotName': val
      }
      const res = await ApifindParkingLotByCondition(data)
      let rs = []
      for (let i in res.data) {
        rs.push({
          title: res.data[i].parkingLotName,
          other: i,
          latitude: res.data[i].latitude,
          longitude: res.data[i].longitude
        })
      }
      this.results = rs
    },
    // 查询
    // 获取地球半径
    getRad (d) {
      var PI = Math.PI
      return d * PI / 180.0
    },
    // 计算两点间的直线距离
    /**
    * 获取两个经纬度之间的距离
    * @param lat1 第一点的纬度
    * @param lng1 第一点的经度
    * @param lat2 第二点的纬度
    * @param lng2 第二点的经度
    * @returns {Number}
    */
    getDistance (lat1, lng1, lat2, lng2) {
      var f = this.getRad((lat1 + lat2) / 2)
      var g = this.getRad((lat1 - lat2) / 2)
      var l = this.getRad((lng1 - lng2) / 2)
      var sg = Math.sin(g)
      var sl = Math.sin(l)
      var sf = Math.sin(f)
      var s, c, w, r, d, h1, h2
      var a = 6378137.0 // The Radius of eath in meter
      var fl = 1 / 298.257
      sg = sg * sg
      sl = sl * sl
      sf = sf * sf
      s = sg * (1 - sl) + (1 - sf) * sl
      c = (1 - sg) * (1 - sl) + sf * sl
      w = Math.atan(Math.sqrt(s / c))
      r = Math.sqrt(s * c) / w
      d = 2 * w * a
      h1 = (3 * r - 1) / 2 / c
      h2 = (3 * r + 1) / 2 / s
      s = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
      s = s / 1000
      s = s.toFixed(2)
      return s
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style lang="less" scoped>
.popupNav{
  width: 95%;
  background-color:#fff;
  height:410;
  margin:0 auto;
  border-radius:5px;
  padding: 20px;
  box-sizing: border-box;
  font-size: 24px;
  padding-bottom: 0;
  position: relative;
  .popupNav_title{
    width: 100%;
    height: 40px;
    color: #42afe2;
    line-height: 40px;
    display: flex;
    align-items: center;
    margin: 14px;
    img{
      height: 40px;
      width: 40px;
    }
    span{
      display: inline-block;
      margin-left: 10px;
      font-size: 28px;
    }
  }
  .popupNav_distance{
    height: 40px;
    display: flex;
    justify-content: space-around;
    margin: 14px;
    color: #000;
    span{
      width: 50%;
      display: inline-block;
    }
  }
  .popupNav_parkingLot{
    >div{
      margin: 14px;
      color: #adadad;
      display: flex;
      justify-content: space-around;
      height: 40px;
      text-align: left;
      >span{
        width: 50%;
        display: inline-block;
      }
    }
  }
  // 弹出层样式
  .popoupNav_operation{
    display: flex;
    justify-content: space-between;
    text-align: center;
    border-top: 1px solid #ddd;
    >div{
      width: 33.33%;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      >span{
        font-size:28px;
      }
      >img{
        height:45px;
      }
    }
    >div:nth-child(2){
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
    }
  }
}
// 地图
#container{
  height: 90vh;
  width: 100%;
  float: left;
  // margin-top: 46px;
}
#panel {
  position: absolute;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 200px;
}
</style>
