<template>
  <div class="amap-page-container">
    <div class="searchLine2">
      <div style="height: 30px;">
        <search
        class="searchClass"
        @result-click="resultClick"
        @on-change="getResult"
        :results="results"
        v-model="values"
        position="absolute"
        auto-scroll-to-top
        top="46px"
        ref="search"></search>
      </div>
    </div>
    <div id="container" class="map"></div>
    <div id="panel"></div>
    <h4 id='status'></h4><hr>
    <p id='result'></p><hr>
  </div>
</template>
<script>
import AMap from 'AMap'
import {ApifindPkLotListByLngLat, ApifindParkingLotByCondition} from '@/api'
import {Search} from 'vux'
var map
export default {
  components: {
    Search
  },
  data () {
    const self = this
    return {
      center: [121.59996, 31.197646],
      lng: 0,
      lat: 0,
      loaded: false,
      plugin: [{
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 100, // 超过10秒后停止定位，默认：无穷大
        maximumAge: 0, // 定位结果缓存0毫秒，默认：0
        convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, // 显示定位按钮，默认：true
        buttonPosition: 'RB', // 定位按钮停靠位置，默认：'LB'，左下角
        showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
        extensions: 'all',
        pName: 'Geolocation',
        events: {
          init (o) {
            console.log(o)
            o.getCurrentPosition((status, result) => {
              console.log(status, result)
              if (result && result.position) {
                self.lng = result.position.lng
                self.lat = result.position.lat
                self.center = [self.lng, self.lat]
                self.loaded = true
                self.$nextTick()
              }
            })
          }
        }
      }],
      distance: 1, // 查询范围
      results: [],
      values: ''
    }
  },
  methods: {
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
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          buttonPosition: 'RB', // 定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
        })
        // 在图面添加定位控件
        map.addControl(geolocation)
        // 获取用户当前的精确位置信息，当回调函数中的status为complete的时候表示定位成功，result为GeolocationResult对象;
        // 当回调函数中的status为error的时候表示定位失败，result为GeolocationError对象；
        geolocation.getCurrentPosition(function (status, result) {
          if (status === 'complete') {
            _this.onComplete(result)
            _this.center = result.position
            console.log(_this.center)
            console.log(55555555)
            // _this.center = result.position
          } else {
            alert('定位失败')
          }
        })
      })
    },
    // 获取精准坐标
    onComplete (data) {
      this.markerS(data.position)
      document.getElementById('status').innerHTML = '定位成功'
      var str = []
      str.push('定位结果：' + data.position)
      str.push('定位类别：' + data.location_type)
      if (data.accuracy) {
        str.push('精度：' + data.accuracy + ' 米')
      } // 如为IP精确定位结果则没有精度信息
      str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'))
      document.getElementById('result').innerHTML = str.join('<br>')
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
          positionList.push([res[i].longitude, res[i].latitude])
        }
        // this.getDistance(121.59996, 114.89029, 31.197646, 21.58729)
        for (let i in positionList) {
          var marker = new AMap.Marker({
            icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
            position: positionList[i],
            offset: new AMap.Pixel(0, 0),
            anchor: 'center',
            clickable: true
          })
          console.log()
          marker.on('click', (res) => {
            _this.planningRoute(position, [res.lnglat.lng, res.lnglat.lat])
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
        console.log(positionStart)
        console.log(positionEnd)
        console.log(366666666666666)
        driving.search(new AMap.LngLat(positionStart.lng, positionStart.lat), new AMap.LngLat(positionEnd[0], positionEnd[1]), (status, result) => {
          // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
          if (status === 'complete') {
            alert('绘制驾车路线完成')
          } else {
            alert('获取驾车数据失败：' + result)
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
      console.log(55555555555555555555555)
      console.log(s)
      return s
    }
  },
  mounted () {
    this.initMap()
  }
}
</script>

<style lang="less" scoped>
#container{
  height: 80vh;
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
<style>
.searchLine2{
  font-size: 24px !important;
}
.searchLine2 .weui-cell_access{
  font-size: 24px !important;
  text-align: left !important;
}
.searchLine2 .weui-cells{
  height: 80vh !important;
  overflow: auto !important;
}
.searchLine2 .searchClass {
  top: 0 !important;
}
.searchLine2 form input, .searchLine2 form i{
    font-size: 24px !important;
}
.searchLine2 form .weui-search-bar__label span{
   font-size: 24px !important;
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
</style>
