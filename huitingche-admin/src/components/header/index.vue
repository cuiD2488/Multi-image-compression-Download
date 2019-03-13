<style lang="less" scoped>
@import './index.less';
</style>

<template>
  <div class="header">
      <div class="header-logo"><span>云尚智能停车系统</span></div>
      <div class="header-right">
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
</template>

<script>
export default {

}
</script>
