<template>
  <div>
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
      ref="search"></search>
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
        <div v-for="(item, index) in muenList" :key="index" @click="toLocation(item.routeName)">
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
      <div class="doubleBox">
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
      </div>
    </div>
    <div>
      <!-- 信息中心 -->
      <div class="messageHead">
        <img src="../../assets/gonggao.png" alt=""><span>信息中心</span>
      </div>
      <div class="messageContent">
        <p v-for="(item, index) in noticeList" :key="index">
          <span v-text="item.noticeText"></span>
          <span v-text="item.money"></span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import {Search} from 'vux'
export default {
  components: {
    Search
  },
  data () {
    return {
      results: [],
      searchValu: '',
      muenList: [
        {
          icon: require('../../assets/stop.png'),
          text: '我要停车',
          routeName: 'Intelligence'
        },
        {
          icon: require('../../assets/wash.png'),
          text: '洗车',
          routeName: 2
        },
        {
          icon: require('../../assets/violation.png'),
          text: '违章查询',
          routeName: 3
        },
        {
          icon: require('../../assets/fiyting.png'),
          text: '优惠加油',
          routeName: 4
        },
        {
          icon: require('../../assets/booking.png'),
          text: '订票助手',
          routeName: 5
        },
        {
          icon: require('../../assets/route.png'),
          text: '路线优化',
          routeName: 6
        },
        {
          icon: require('../../assets/warning.png'),
          text: '一键报警',
          routeName: 7
        },
        {
          icon: require('../../assets/shoppingMall.png'),
          text: '云尚甄品',
          routeName: 8
        }
      ],
      noticeList: [
        {
          noticeText: '您于2019-02-15在深圳宝安西乡停车4小时',
          money: '扣费20元'
        },
        {
          noticeText: '您于2019-02-15在深圳宝安西乡停车4小时',
          money: '扣费20元'
        },
        {
          noticeText: '您于2019-02-15在深圳宝安西乡停车4小时',
          money: '扣费20元'
        },
        {
          noticeText: '您于2019-02-15在深圳宝安西乡停车4小时',
          money: '扣费20元'
        },
        {
          noticeText: '您于2019-02-15在深圳宝安西乡停车4小时',
          money: '扣费20元'
        },
        {
          noticeText: '您于2019-02-15在深圳宝安西乡停车4小时',
          money: '扣费20元'
        },
        {
          noticeText: '您于2019-02-15在深圳宝安西乡停车4小时',
          money: '扣费20元'
        },
        {
          noticeText: '您于2019-02-15在深圳宝安西乡停车4小时',
          money: '扣费20元'
        }
      ]
    }
  },
  methods: {
    // 导航跳转
    toLocation (routeName) {
      if (!Number(routeName)) {
        this.$router.push({name: routeName})
      } else {
        this.$store.commit('GETUSERINFO', 'test')
        console.log(routeName)
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
    }
  }
}
</script>
<style lang="less" scoped>
.searchLine{
  height: 58px;
  // padding: 20px 0;
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
  height: 124px;
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
