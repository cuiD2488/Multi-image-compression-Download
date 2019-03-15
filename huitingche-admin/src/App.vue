<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
}
html {
  overflow: auto;
}
#app {
  min-width: 1024px;
  max-width: 1920px;
  /* width: 1024px; */
  position: relative;
  margin: 0 auto;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
