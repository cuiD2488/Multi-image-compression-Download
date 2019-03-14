<template>
  <div class="layout-default">
    <div class="top-content">
      <s-header></s-header>
    </div>
    <div class="left-content">
      <sidebar></sidebar>
      <div class="main-content">
        <secondbar></secondbar>
        <transition mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import sHeader from '@/components/header'
import sidebar from '@/components/sidebar'
// import secondbar from '@/components/secondbar'

export default {
  components: {
    sHeader,
    sidebar
    // secondbar
  },
  data () {
    return {
      columns1: [
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '年龄',
          key: 'age'
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '年龄',
          key: 'age'
        },
        {
          title: '地址',
          key: 'address'
        }
      ],
      data1: [
        {
          name: '王小明',
          age: 18,
          address: '北京市朝阳区芍药居'
        },
        {
          name: '张小刚',
          age: 25,
          address: '北京市海淀区西二旗'
        },
        {
          name: '李小红',
          age: 30,
          address: '上海市浦东新区世纪大道'
        },
        {
          name: '周小伟',
          age: 26,
          address: '深圳市南山区深南大道'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
 @import './default.less';
</style>
