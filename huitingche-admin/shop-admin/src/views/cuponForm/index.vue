<template>
  <div>
    <!-- <p>当前正在进行第 {{ current + 1 }} 步</p> -->
    <div class="stepsView">
      <Steps :current="current">
        <Step title="基础规则">
        </Step>
        <Step title="其他规则">
        </Step>
        <Step title="确认创建"></Step>
      </Steps>
    </div>
    <div>
      <router-view @next="next" :current="current"></router-view>
    </div>
    <!-- <Button type="primary" @click="next">下一步</Button> -->
  </div>
</template>
<style>
.stepsView{
  padding:10px;
}
</style>

<script>
export default {
  data () {
    return {
      current: sessionStorage.getItem('current') ? +sessionStorage.getItem('current') : 0
    }
  },
  methods: {
    next (current) {
    }
  },
  watch: {
    '$route'(to, from) {
      if (this.$router.history.current.name === 'cuponFormStep1') {
        this.current = 0
      } else if (this.$router.history.current.name === 'cuponFormStep2') {
        this.current = 1
      } else if (this.$router.history.current.name === 'cuponFormStep3') {
        this.current = 2
      }
      sessionStorage.setItem('current', this.current)
    }
  },
  created () {
  }
}
</script>

