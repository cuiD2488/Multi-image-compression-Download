<template>
  <div id="foot">
    <tabbar @on-index-change="changeTab" @tabbar-text-active-color="'red'">
      <tabbar-item selected :link="{name: 'home'}" @tabbar-text-active-color="'red'">
         <img slot="icon" :src="tabVal === 0 ? require('../assets/homeRight.png') : require('../assets/home.png')">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item :link="{name: 'location'}">
         <img slot="icon" :src="tabVal === 1 ? require('../assets/locationRight.png') : require('../assets/navigation.png')">
        <span slot="label">附近</span>
      </tabbar-item>
      <tabbar-item :link="{name: 'mine'}">
        <img slot="icon" :src="tabVal === 2 ? require('../assets/userRight.png') : require('../assets/user.png')">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script>
import { Tabbar, TabbarItem, Group, Cell } from 'vux'
export default {
  components: {
    Tabbar,
    TabbarItem,
    Group,
    Cell
  },
  data () {
    return {
      originHeight: null, // 页面原始高度
      fullHeight: document.documentElement.clientHeight, // 实时屏幕视窗大小
      tabVal: 0
    }
  },
  methods: {
    changeTab (v) {
      this.tabVal = v
    }
  },
  mounted () {
    // alert('start')
    // 安卓手机键盘吊起挡住输入框
    const that = this
    window.onresize = () => {
      // alert('enter')
      return (() => {
        // let fullHeight = sessionStorage.getItem('windowHeight')
        window.fullHeight = document.documentElement.clientHeight
        // alert(window.fullHeight)
        that.fullHeight = window.fullHeight
        // alert(that.fullHeight)
        this.$vux.toast.text(that.fullHeight)
        this.$vux.toast.text(this.originHeight)
        if (that.fullHeight < this.originHeight - 50) {
          // alert(that.fullHeight < this.originHeight - 50)
          this.$vux.toast.text('1')
          document.getElementById('foot').style.display = 'none'
        } else {
          // alert(that.fullHeight < this.originHeight - 50)
          this.$vux.toast.text('2')
          document.getElementById('foot').style.display = 'block'
          // document.getElementsByClassName('showPage').scrollIntoView(false)
        }
        // alert('end')
      })()
    }
  }
}
</script>
<style>
  .weui-tabbar{
    height: 120px;
  }
  .weui-tabbar__icon{
    padding-top: 20px;
  }
  .weui-tabbar__icon img{
    width: 30px!important;
    height: 34px!important;
  }
</style>
