<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="select.selectTitle"></h1>
    </header>
    <div class="mui-content">
      <this-select-components :select="select.selectLi"></this-select-components>
    </div>
  </div>
</template>
<script>
  import selectLi from '../../public/components/select/select';
  import store from '../customer-store';
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
    }
  };
</script>
