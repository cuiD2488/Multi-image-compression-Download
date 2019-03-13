<template>
    <div class="role">
        <i-table border :columns="columns1" :data="data1"></i-table>
    </div>
</template>

<script>
export default {
    data () {
    return {
        columns1: [
            {
                title: '头像',
                key: 'name'
            },
            {
                title: '用户微信号',
                key: 'age'
            },
            {
                title: '性别',
                key: 'address'
            },
            {
                title: '手机号',
                key: 'name'
            },
            {
                title: '车牌号',
                key: 'age'
            },
            {
                title: '银行卡信息',
                key: 'address'
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
            }  
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.role{
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
