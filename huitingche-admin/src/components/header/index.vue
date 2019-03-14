<template>
  <div class="header">
    <div class="header-logo"><span>云尚智能停车系统</span></div>
    <div class="header-right">
      <Dropdown>
        <a href="javascript:void(0)" class="whiteColor" @click="$router.push({name: 'login'})">
          注销
        </a>
      </Dropdown>
    </div>
    <!-- <div class="search">
      <Input search enter-button placeholder="输入关键字进行搜索..." />
    </div> -->
  </div>
</template>
<script>
export default {
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
