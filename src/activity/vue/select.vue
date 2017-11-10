<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed;">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="select.selectTitle"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()" v-if="multiple"></a>
    </header>
    <div class="mui-content">
      <this-select-components :select="select.selectLi"></this-select-components>
    </div>
  </div>
</template>
<style>
  @import '../../public/css/mui.image.css';
</style>
<script>
  import store from '../activity-store';
  import selectLi from '../../public/components/select/select';
  require('mui.previewimage');
  require('mui.zoom');
  export default{
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
      }
    },
    events: {
      'selectBack': function (index) {
        var self = this;
        var param = self.$route.params.param;
        var data = self.select.selectLi[index];
        var arrPram = param.split('_');
        store.updateField(arrPram[0], data.name || data.itemName, arrPram[1]);
        store.updateField(arrPram[0] + 'Id', data.id || data.itemCode, arrPram[1]);
        history.go(-1);
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
