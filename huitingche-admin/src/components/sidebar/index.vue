
<style lang="less" scoped>
@import './index.less';
</style>
<template>
  <div class="sidebar">
    <div class="sidebar-left">
        <Menu :theme="theme3" active-key="1" :active-name="$route.name" @on-select="handleMenuItemSelect">
            <Menu-item name="roadsideparkMGT" key="1">
                <Icon type="document-text"></Icon>
                     路边停车管理
            </Menu-item>
            <Menu-item name="pakingMGTlist" key="2">
                <Icon type="chatbubbles"></Icon>
                    车位管理列表
            </Menu-item>
            <Menu-item name="deviceMGT" key="3">
                <Icon type="heart"></Icon>
                    设备管理
            </Menu-item>
            <Menu-item name="unpaid" key="4">
                <Icon type="heart-broken"></Icon>
                    待支付停车信息
            </Menu-item>
            <Menu-item name="parkingChargeRecord" key="5">
                <Icon type="heart-broken"></Icon>
                    停车收费记录
            </Menu-item>
            <Menu-item name="parkingFeesReport" key="6">
                <Icon type="heart-broken"></Icon>
                    车位收费统计报表
            </Menu-item>
            <Menu-item name="carflow" key="7">
                <Icon type="heart-broken"></Icon>
                    车流量统计报表
            </Menu-item>
            <Menu-item name="chargerules" key="8">
                <Icon type="heart-broken"></Icon>
                    停车场收费规则
            </Menu-item>
            <Menu-item name="violationrecord" key="9">
                <Icon type="heart-broken"></Icon>
                    违章记录
            </Menu-item>
            <Menu-item name="userInfo" key="10">
                <Icon type="heart-broken"></Icon>
                    用户信息
            </Menu-item>
            <Menu-item name="role" key="11">
                <Icon type="heart-broken"></Icon>
                    角色管理
            </Menu-item>
            <Menu-item name="menuAuthorization" key="12">
                <Icon type="heart-broken"></Icon>
                    菜单授权
            </Menu-item>
            <Menu-item name="merchant" key="13">
                <Icon type="heart-broken"></Icon>
                    子商户管理
            </Menu-item>
        </Menu>
    </div>
    <div class="secondbar">
        <div class="secondbar-title">
            <Breadcrumb-item >{{this.$route.meta.title}}</Breadcrumb-item>
        </div>
        <div class="secondbar-data">
            <span>{{nowTime}}</span>
        </div>
  </div>
  </div>
</template> 
<script>
export default {
    data(){
        return {
           nowTime:''
        }
    },
    computed:{
        changeBreadcrumbTitle(){
            BreadcrumbTitle = this.$route.meta.title
        }
    },
    methods:{
        handleMenuItemSelect (name) {
            this.$router.push({name})   // 选择不同menu-item跳转对应路由
            // console.log(this.$route.meta.title)
        },
        // 获取当前时间函数
        timeFormate(timeStamp) {
            let year = new Date(timeStamp).getFullYear();
            let month = new Date(timeStamp).getMonth() + 1 < 10? "0" + (new Date(timeStamp).getMonth() + 1): new Date(timeStamp).getMonth() + 1;
            let date = new Date(timeStamp).getDate() < 10? "0" + new Date(timeStamp).getDate(): new Date(timeStamp).getDate();
            this.nowTime = year + "年" + month + "月" + date + "日";
            // console.log(this.nowTime);
        },
        // 定时器函数
        nowTimes(){
              this.timeFormate(new Date());
              setInterval(this.nowTimes,30*1000);
        }
    },
    mounted(){
        this.nowTimes();
    }
}
</script>
