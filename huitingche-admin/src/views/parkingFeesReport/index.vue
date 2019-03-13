<template>
    <div class="parkingfeesreport">
        <i-table border :columns="columns1" :data="data1"></i-table>
    </div>
</template>

<script>
export default {
    data () {
    return {
        columns1: [
            {
                title: 'parkingfeesreport',
                key: 'name'
            },
            {
                title: '车检器编号',
                key: 'age'
            },
            {
                title: '停车场',
                key: 'address'
            },
            {
                title: '管理员',
                key: 'name'
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
.parkingfeesreport{
  // width: 200px;
  // height: 200px;
  // float: left;
  // background: red;
  position: absolute;
  top: 150px;
  left: 260px;
  height: 250px;
  width: 1100px;
}
</style>
