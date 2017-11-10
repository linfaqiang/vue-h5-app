<template>
  <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
    <div class="mui-scroll">
      <div class="select_li">
        <ul>
          <li v-for="list in select" class="mui-icon" :class="{selected: list.selected, 'crm-check': list.selected}"
              @click="selectBack($index)">
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
  var {FastClick} = require('fastclick');
  export default{
    props: {
      'select': {}
    },
    data: function () {
      return {};
    },
    methods: {
      selectBack: function (index) {
        this.$dispatch('selectBack', index);
      }
    },
    ready: function () {
      var deceleration = mui.os.ios ? 0.003 : 0.0009;
      mui('.mui-scroll-wrapper').scroll({
        bounce: false,
        indicators: true, // 是否显示滚动条
        deceleration: deceleration
      });
      FastClick.attach(document.body);
    }
  };
</script>
