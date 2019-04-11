<template>
  <div style="padding:10px;">
    <Card class="cardItem">
      <label v-text="'商家名称：'"></label>
      <span v-text="userInfo.name"></span>
    </Card>
    <Card class="cardItem">
      <label v-text="'邮箱：'"></label>
      <span v-text="userInfo.account"></span>
    </Card>
    <Card class="cardItem">
      <label v-text="'商家地址：'"></label>
      <span v-text="userInfo.address"></span>
    </Card>
    <Card class="cardItem">
      <label v-text="'身份证正面：'"></label>
      <img :src="userInfo.identityCardFront"/>
    </Card>
    <Card class="cardItem">
      <label v-text="'身份证反面：'"></label>
      <img :src="userInfo.identityCardVerso"/>
    </Card>
    <Card class="cardItem">
      <label v-text="'营业执照：'"></label>
      <img :src="userInfo.businessLicense"/>
    </Card>
    <Card class="cardItem">
      <label v-text="'联系方式：'"></label>
      <span v-text="userInfo.phone"></span>
    </Card>
    <Card class="cardItem">
      <label v-text="'审核状态：'"></label>
      <span v-text="userInfo.status === 1 ? '待审核' : userInfo.status === 2 ? '驳回申请' : '已通过'"></span>
    </Card>
    <Card class="cardItem" v-if="userInfo.rejectCause">
      <label v-text="'驳回原因：'"></label>
      <span v-text="userInfo.rejectCause"></span>
    </Card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userInfo: this.$cookies.get('userInfo')
    }
  }
}
</script>
<style lang="less">
.cardItem{
  width:30%;
  display:inline-block;
  margin-bottom:10px;
  min-height:150px;
  margin-right:15px;
}
</style>
