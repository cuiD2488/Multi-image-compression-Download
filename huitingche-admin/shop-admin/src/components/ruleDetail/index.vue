<style lang="less" scoped>
.ruleDetail {
  font-size: 14px;
  line-height: 36px;
}
</style>

<template>
  <div class="ruleDetail">
    <p
      v-for="(item, index) in detailList"
      :key="item.id">
      第{{ index + 1 }}级奖励：
      <span class="color-red">
        ￥{{ item.awardAmount }}
      </span>
      ，延期天数：
      <span class="color-red">
        {{ item.delayDay === 0 ? '即时到账' : `${item.delayDay}天` }}
      </span>
      ，
      <span class="color-red">
        {{ item.couldWinBonus === 1 ? '能够' : '不能' }}
      </span>
      获得奖励，
      <span class="color-red">
        {{ item.couldTrigger === 1 ? '能够' : '不能' }}
      </span>
      触发奖励；
    </p>
  </div>
</template>

<script>
export default {
  props: {
    detailList: {
      type: Array
    }
  }
}
</script>
