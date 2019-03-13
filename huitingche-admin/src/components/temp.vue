<template>
    <div class="temp">
            <!-- <div class="layout-logo">heheh</div>
            <Input search placeholder="Enter something..."  class="layout-input"/>  -->
            <div class="top-header">
                <div class="layout-logo"><span>云尚智能停车系统</span></div>
                <div class="right">
                    <Badge :count="3">
                        <!-- <Icon type="ios-notifications-outline" size="26" class="badge-1"></Icon> -->
                        <Icon type="ios-briefcase-outline" size="30" class="badge-1"/>
                    </Badge>
                    <Badge :count="3">
                        <Icon type="ios-notifications-outline" size="30" class="badge-2"></Icon>
                    </Badge>
                    |
                    <Dropdown>
                        <a href="javascript:void(0)">
                            admin
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem>admin</DropdownItem>
                            <DropdownItem>admin</DropdownItem>
                            <DropdownItem>admin</DropdownItem>
                            <DropdownItem>admin</DropdownItem>
                            <DropdownItem>admin</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>    
                </div>
                <div class="search">
                    <Input search enter-button placeholder="输入关键字进行搜索..." />
                </div>
            </div>
            <div class="sidebar">
                    <Menu :theme="theme3" active-key="1">
                        <!-- <Menu-group title="内容管理"> -->
                            <Menu-item key="1">
                                <Icon type="document-text"></Icon>
                                     路边停车管理
                            </Menu-item>
                            <Menu-item key="2">
                                <Icon type="chatbubbles"></Icon>
                                    车位管理列表
                            </Menu-item>
                        <!-- </Menu-group> -->
                        <!-- <Menu-group title="统计分析"> -->
                            <Menu-item key="3">
                                <Icon type="heart"></Icon>
                                    设备管理
                            </Menu-item>
                            <Menu-item key="4">
                                <Icon type="heart-broken"></Icon>
                                    待支付停车信息
                            </Menu-item>
                            <Menu-item key="5">
                                <Icon type="heart-broken"></Icon>
                                    停车收费记录
                            </Menu-item>
                            <Menu-item key="6">
                                <Icon type="heart-broken"></Icon>
                                    车位收费统计报表
                            </Menu-item>
                            <Menu-item key="7">
                                <Icon type="heart-broken"></Icon>
                                    车流量统计报表
                            </Menu-item>
                            <Menu-item key="8">
                                <Icon type="heart-broken"></Icon>
                                    停车场收费规则
                            </Menu-item>
                            <Menu-item key="9">
                                <Icon type="heart-broken"></Icon>
                                    违章记录
                            </Menu-item>
                            <Menu-item key="10">
                                <Icon type="heart-broken"></Icon>
                                    用户信息
                            </Menu-item>
                            <Menu-item key="11">
                                <Icon type="heart-broken"></Icon>
                                    角色管理
                            </Menu-item>
                            <Menu-item key="12">
                                <Icon type="heart-broken"></Icon>
                                    菜单授权
                            </Menu-item>
                            <Menu-item key="13">
                                <Icon type="heart-broken"></Icon>
                                    子商户管理
                            </Menu-item>
                        <!-- </Menu-group> -->
                    </Menu>
            </div>
            <div class="secondbar">
                <div class="secondbar-title">
                    <!-- 这里显示的title内容用router中的mate修改 -->
                    <!-- 这里暂时写死 -->
                    <span>路边停车管理</span>
                </div>
                <div class="secondbar-data">
                    <span>2019年02月12日 农历：正月初八</span>
                    <!-- 后面加日期逻辑 -->
                    <!-- 这里暂时写死 -->
                </div>
            </div>
            <div class="main-content">
                main
            </div>
    </div>
</template>


<script>
export default {
  name: 'temp',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
<style scoped>
    .temp{
        border: 1px solid #d7dde4;
        /* height: 80px; */
        
    }
    .top-header{
        margin: 0 auto;
        /* width: 1183px; */
        height: 80px;
        background: #265b93;
        position: relative;
    }
    .layout-logo{
        width: 240px;
        height: 30px;
        /* background:red; */
        border-radius: 3px;
        float: left;
        position: relative;
        top: 28px;
        left: 26px;
    }
    .layout-logo span{
        font-size:28px; 
        height: 30px;
        line-height: 30px;
        color: aliceblue;
    }
    .right{
        float: right;
        /* background: red; */
        width: 240px;
        height: 30px;
        position: relative;
        top: 28px;
        left: 26px;
    }
    /* .right Badge{

    }  */
    .search{
        width: 340px;
        height: 38px;
        margin: 0 200px 0 630px;
        position:absolute;
        top: 21px;
        /* box-sizing: border-box;
        padding-left: 70px; */
        /* text-index:20px; */
        /* padding-left:30px;  */
        /* letter-spacing:40px; */
    }
    .sidebar{
        width: 200px;
        height: 100%;
        /* background: red; */
        float: left;
    }
    .secondbar{
        height: 50px;
        background:#b2b2b2;
        margin-left:250px; 
        position: relative;
    }
    .secondbar-title span{
        font-size:16px;
        height: 50px;
        line-height: 50px; 
        position: absolute;
        left: 10px;
    }
    .secondbar-data span{
        font-size:16px;
        height: 50px;
        line-height: 50px; 
        position: absolute;
        left: 900px;
    }  
    .main-content{
        height: 100%;
        background: red;
        margin-top: 15px;
        margin-left: 250px;
    }
</style>