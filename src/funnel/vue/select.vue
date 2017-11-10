/**
  * @file
  * @author hj
  * @date 2016-11-23
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
<script>
    import store from '../funnel-store';
    import selectLi from '../../public/components/select/select.vue';
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
        back: function () {
          history.go(-1);
        }
      },
      events: {
        'selectBack': function (index) {
          var self = this;
          var data = self.select.selectLi[index];
          store.updateField('chanceTypeId', data.id);
          store.updateField('chanceType', data.name);
          self.back();
          store.init(data.id);
        }
      },
      created: function () {},
      ready: function () {
        mui('.mui-scroll-wrapper').scroll();
      }
    };
</script>
