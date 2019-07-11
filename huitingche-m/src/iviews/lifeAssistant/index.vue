<template>
  <div class="lifeAssistant">
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
      placeholder="请输入搜索内容"
      @on-focus="onFocus"
      @on-cancel="onCancel"
      @on-submit="onSubmit"
      ref="search"></search>
    </div>
    <!-- 顶部四色栏 -->
    <div class="flexLine">
      <div v-for="(item, index) in flexArr" :style="{backgroundColor: item.bkcolor}" :key="index" class="flexItem">
        <div>
          <img :src="item.pic" alt="">
          <div class="title">{{item.title}}</div>
        </div>
      </div>
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
import {Search} from 'vux'
export default {
  components: {
    Search
  },
  data () {
    return {
      results: [],
      searchValu: '',
      flexArr: [
        {
          pic: require('../../assets/server.png'),
          title: '日常服务',
          bkcolor: '#fdac2f'
        },
        {
          pic: require('../../assets/home-white.png'),
          title: '房屋租赁',
          bkcolor: '#63bbee'
        },
        {
          pic: require('../../assets/travel.png'),
          title: '差旅服务',
          bkcolor: '#23cc9f'
        },
        {
          pic: require('../../assets/money.png'),
          title: '生活缴费',
          bkcolor: '#ff7474'
        }
      ],
      muenList: [
        {
          icon: require('../../assets/jzfw.png'),
          text: '家政服务',
          routeName: null,
          url: null
        },
        {
          icon: require('../../assets/fwwx.png'),
          text: '房屋维修',
          routeName: null,
          url: null
        },
        {
          icon: require('../../assets/jdwx.png'),
          text: '家电维修',
          routeName: null
        },
        {
          icon: require('../../assets/bjfw.png'),
          text: '搬家服务',
          routeName: null,
          url: null
        },
        {
          icon: require('../../assets/kdfw.png'),
          text: '快递公司',
          routeName: null,
          url: null
        },
        {
          icon: require('../../assets/fsbl.png'),
          text: '防水补漏',
          routeName: null,
          url: null
        },
        {
          icon: require('../../assets/smks.png'),
          text: '上门开锁',
          routeName: null,
          url: null
        },
        {
          icon: require('../../assets/gdst.png'),
          text: '管道疏通',
          routeName: null,
          url: null
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.flexLine{
  display: flex;
  align-items: center;
  justify-content: center;
  .flexItem{
    flex: 1;
    height: 138px;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      width: 30px;
      height: 30px;
    }
    .title {
      font-size: 16px;
      color: #fff;
      margin-top: 10px;
    }
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
</style>

<style>
.searchLine{
  background-color: #e9e9ee;
  padding: 10px 0;
  font-size: 24px !important;
  text-align: left;
}
.searchLine form input, .searchLine form i{
    font-size: 24px !important;
}
.searchLine form .weui-search-bar__label span{
   font-size: 28px !important;
}
.searchLine form .weui-search-bar__label{
  text-align: left !important;
  /* line-height: 58px !important;
  height: 58px !important; */
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
