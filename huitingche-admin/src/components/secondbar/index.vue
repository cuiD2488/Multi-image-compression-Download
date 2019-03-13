<style lang="less" scoped>
@import './index.less';

</style>

<template>
  <div class="secondbar">
      <div class="secondbar-title">
          <!-- 这里显示的title内容用router中的mate修改 -->
          <!-- 这里暂时写死 -->
          <!-- <span>路边停车管理</span> -->
          <Breadcrumb-item >路边停车管理</Breadcrumb-item>
          <!-- <Breadcrumb-item >{{this.$router.meta.title}}</Breadcrumb-item> -->
          <!-- <Breadcrumb-item v-for="(item,index) in $route.meta"> {{item}}</Breadcrumb-item> -->
      </div>
      <div class="secondbar-data">
          <span>2019年02月12日 农历：正月初八</span>
          <!-- 后面加日期逻辑 -->
          <!-- 这里暂时写死 -->
      </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
    data() {
        return {

        }
    },
    methods:{
        //  changeTitle(){
        //     this.$router.meta
        //  }
    }
}
</script>
