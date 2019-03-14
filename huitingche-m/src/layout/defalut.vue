<template>
  <div class="layout-default">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <m-tabbar></m-tabbar>
  </div>
</template>

<script>
import mTabbar from '@/components/footerBar'

export default {
  components: {
    mTabbar
  },
  computed: {
    routerName () {
      return this.$route.name
    }
  }
  // ,
  // mounted () {
  //   // 安卓手机键盘吊起挡住输入框
  //   const that = this
  //   window.onresize = () => {
  //     return (() => {
  //       // let fullHeight = sessionStorage.getItem('windowHeight')
  //       window.fullHeight = document.documentElement.clientHeight
  //       that.fullHeight = window.fullHeight
  //       if (that.fullHeight < this.originHeight - 50) {
  //         document.getElementById('foot').style.display = 'none'
  //       } else {
  //         document.getElementById('foot').style.display = 'block'
  //         // document.getElementsByClassName('showPage').scrollIntoView(false)
  //       }
  //     })()
  //   }
  // }
}
</script>

<style lang="less">
.layout-default{
  height: 100%;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0
}
</style>
