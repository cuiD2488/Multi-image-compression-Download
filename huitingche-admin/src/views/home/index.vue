<style lang="less" scoped>
</style>
<template>
  <div class="home">
    homed homed homed homed homed homed homed homed home
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    console.log(this.userInfo)
  }
}
</script>
