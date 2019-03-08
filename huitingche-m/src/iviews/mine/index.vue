<template>
  <div class="page">
    <!-- 个人中心 -->
    <div class="headerContent">
      <!-- 头部 -->
      <!-- <img src="" alt=""> -->
      <div class="headImg">
        <img :src="userInform.headImgUrl" alt="">
      </div>
      <div class="headPhone">
        <span>{{userInform.nickName}}</span>
      </div>
    </div>
    <div class="navContent">
      <!-- 导航 -->
      <div v-for="(item, index) in navList" :key="index" class="navItem" @click="toLink(item.routeName)">
        <div class="navImg">
          <img :src="item.navImg" alt="">
        </div>
        <div>
          <span v-text="item.navText"></span>
        </div>
      </div>
    </div>
    <div>
      <!-- columnList -->
      <div class="columnItem">
        <p>常见问题</p>
        <p>消息中心</p>
        <p>联系我们</p>
        <p @click="$router.push({name: 'bindTel'})">绑定手机</p>
        <p @click="$router.push({name: 'safety'})">账号与安全</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  compents: {
  },
  data () {
    return {
      navList: [
        {
          navImg: require('../../assets/wallet.png'),
          navText: '我的钱包',
          routeName: 'myWallet'
        },
        {
          navImg: require('../../assets/carMessage.png'),
          navText: '车辆信息',
          routeName: 'carMessage'
        },
        {
          navImg: require('../../assets/parking.png'),
          navText: '停车记录',
          routeName: 'parkingRecord'
        }
      ],
      userInform: JSON.parse(sessionStorage.getItem('userInform'))
    }
  },
  methods: {
    toLink (routeName) {
      this.$router.push({name: routeName})
    }
  }
}
</script>
<style lang="less" scoped>
.page{
  background: #f8f8f8;
  padding-bottom: 120px;
}
.headerContent{
  background: linear-gradient(#6abedb, #b3ecff);
  position: relative;
  // height: 4px;
  height: 300px;
  margin-bottom: 10px;
  .headImg{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    overflow: hidden;
    background: #ddd;
    img{
      width: 100%;
    }
  }
  .headPhone{
    width: 100%;
    position: absolute;
    bottom: 20px;
    text-align: center;
  }
}
.navContent{
    display:flex;
    justify-content: space-between;
    padding: 43px 0;
    background: #fff;
    // margin: 5px 0;
    .navItem{
      .navImg{
        width : 50px;
        height: 50px;
        margin: 0 auto;
        margin-bottom: 1px;
        img{
          width:100%;
          height:100%;
        }
      }
      width:30%;
      margin:0 1.5%;
      text-align:center;
    }
  }
.columnItem {
  display: flex;
  flex-direction: column;
  p{
    width: 100%;
    padding: 30px 42px;
    font-size: 28px;
    text-align: left;
    margin: 5px 0;
    box-sizing: border-box;
    background: #fff;
  }
}
</style>
