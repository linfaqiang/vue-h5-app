/**
* @file 多选页面
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id='header' class='mui-bar mui-bar-nav'>
      <a class='mui-action-back mui-icon mui-icon-left-nav mui-pull-left'></a>
      <h1 class='mui-title' v-text='multiple.selectTitle'></h1>
      <a class='mui-btn mui-btn-link mui-pull-right' @tap='confirm()'>确定</a>
    </header>
    <div class='mui-content'>
      <this-multiple-components :multiple.sync='multiple.selectLi'></this-multiple-components>
    </div>
  </div>
</template>
<script>
  import store from '../chance-store';
  import multipleLi from '../../public/components/multiple/multiple.vue';
  export default{
    components: {
      'this-multiple-components': multipleLi
    },
    data: function () {
      return {
        multiple: store.state
      };
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      confirm: function () {
        var self = this;
        var param = self.$route.params.param || '';
        var arrParam = param.split('_');
        var multipleData = this.multiple.selectLi;
        var multipled = [];
        var multipledId = [];
        for (var i = 0; i < multipleData.length; i++) {
          if (multipleData[i].selected) {
            multipled.push(multipleData[i].itemName);
            multipledId.push(multipleData[i].itemCode);
          }
        }
        store.updateField(arrParam[0], multipled, arrParam[1]);
        store.updateField(arrParam[0] + 'Id', multipledId, arrParam[1]);
        self.back();
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
