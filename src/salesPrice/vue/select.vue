/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="selectTitle"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()" v-if="multiple"></a>
    </header>
    <div class="mui-content">
      <this-select-components :select="selectLiPP.data"></this-select-components>
    </div>
  </div>
</template>
<script>
  import store from '../price-store';
  import selectLi from '../../public/components/select/select.vue';
  export default {
    components: {
      'this-select-components': selectLi
    },
    data: function () {
      return {
        selectLiPP: store.state.selectLi,
        selectTitle: store.state.selectTitle
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
        var data = self.selectLiPP.data[index];
        var arrPram = param.split('_');
        var id;
        var rous = this.$route.params;
        if (rous.id) {
          id = '2';
        } else {
          id = '1';
        }
        store.updateField(arrPram[0], data.name || data.itemName, arrPram[1], id);
        store.updateField(arrPram[0] + 'Id', data.id || data.itemCode, arrPram[1], id);
        self.back();
      }
    },
    route: {
      activate: function (transition) {
        var rous = this.$route.params;
        if (rous.id) {
          this.selectLiPP = store.state.selectLi2;
        }
        transition.next();
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
