/**
* @file 单选
* @author hj
* @date 2016-11-17
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="select.selectTitle"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()" v-if="multiple"></a>
    </header>
    <div class="mui-content">
      <this-select-components :select="select.selectLi"></this-select-components>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/mui.image.css';
</style>
<script>
  import store from '../contact-store';
  import selectLi from '../../public/components/select/select.vue';
  require('mui.previewimage');
  require('mui.zoom');
  export default {
    components: {
      'this-select-components': selectLi
    },
    data: function () {
      return {
        select: store.state
      };
    },
    methods: {
      back: function (index) {
        history.go(-1);
      }
    },
    events: {
      'selectBack': function (index) {
        var self = this;
        var param = self.$route.params.param;
        var data = self.select.selectLi[index];
        var arrPram = param.split('_');
        store.updateField(arrPram[0], data, arrPram[1]);
        self.back();
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      mui.previewImage();
    }
  };
</script>
