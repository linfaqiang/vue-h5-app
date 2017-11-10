<template>
  <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
    <div class="mui-scroll">
      <div class="multiple_li">
        <ul>
          <li v-for="list in multiple" class="mui-icon"
              :class="{selected: list.selected, 'crm-circle': !list.selected, 'crm-solid-check': list.selected}"
              @tap="multipleBack($index)">
            {{list.name||list.itemName}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import '../../css/module.css';
</style>
<script>
  export default{
    props: {
      'multiple': {}
    },
    data: function () {
    },
    methods: {
      multipleBack: function (index) {
        var self = this;
        if (self.multiple[index].selected) {
          self.multiple[index].selected = false;
        } else {
          self.multiple[index].selected = true;
        }
      }
    },
    ready: function () {
      var deceleration = mui.os.ios ? 0.003 : 0.0009;
      mui('.mui-scroll-wrapper').scroll({
        bounce: false,
        indicators: true, // 是否显示滚动条
        deceleration: deceleration
      });
    }
  };
</script>
