<template>
  <div style="background:#f6f6f6">
    <!-- 我的钱包 -->
    <div class="headerContent">
      <!-- 头部 -->
      <div>
        <span>余额(元)</span>
      </div>
      <div>
        <strong>1.00</strong>
      </div>
      <!-- <img src="" alt=""> -->
    </div>
    <div class="navContent">
      <router-link to="recharge">
        <div class="navContentItem">
          <div class="imgDiv">
            <img src="@/assets/saveMoney.png" alt="">
          </div>
          <div class="wordDiv">
            充值
          </div>
        </div>
      </router-link>
      <div class="navContentItem">
        <div class="imgDiv">
          <img src="@/assets/drawMoney.png" alt="">
        </div>
        <div class="wordDiv">
          提现
        </div>
      </div>
      <div class="navContentItem">
        <div class="imgDiv">
          <img src="@/assets/drawMoney.png" alt="">
        </div>
        <div class="wordDiv">
          账单明细
        </div>
      </div>
      <!-- <p><router-link to="recharge"><img src="@/assets/saveMoney.png">充值</router-link></p>
      <p><img src="@/assets/drawMoney.png">提现</p>
      <p><img src="@/assets/countList.png">账单明细</p> -->
    </div>
  </div>
</template>
<style lang="less" scoped>
a{
  color: #000;
}
.headerContent{
  background: linear-gradient(#6abedb, #b3ecff);
  position: relative;
  height: 243px;
  text-align: center;
  color:#fff;
  font-size: 40px;
  padding-top: 70px;
  box-sizing: border-box;
  margin-bottom: 15px;
}
.navContent{
  // background: #fff;
  display: flex;
  flex-direction: column;
  // p{
  //   width: 100%;
  //   padding: 27px 24px;
  //   font-size: 28px;
  //   text-align: left;
  //   margin: 0;
  //   box-sizing: border-box;
  //   margin-bottom: 15px;
  //   background: #fff;
  // }
  .navContentItem{
    width: 100%;
    padding: 27px 24px;
    font-size: 28px;
    text-align: left;
    display: flex;
    background: #fff;
    margin-bottom: 15px;
    .imgDiv{
      margin-right: 15px;
      img{
        width: 35px;
        height: 35px;
      }
    }
  }
}
</style>
