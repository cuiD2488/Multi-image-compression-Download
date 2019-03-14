<template>
  <div class="parkingRecord">
    <!-- <i-table border :columns="columns1" :data="data1"></i-table> -->
    <tabledata
    ref="table"
    page-position="center"
    :columns="tableColumns"
    :queryUrl="queryUrl"
    :queryData="queryData"
    :current="page"
    :pageSize="num"
    ></tabledata>
  </div>
</template>

<script>
import tabledata from '@/components/tabledata'
export default {
  components: {
    tabledata
  },
  data () {
    return {
      columns1: [
        {
          title: '序号',
          key: 'name'
        },
        {
          title: '角色名',
          key: 'age'
        },
        {
          title: '备注',
          key: 'address'
        },
        {
          title: '权限',
          key: 'age'
        },
        {
          title: '操作',
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
.devicemgt{
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
