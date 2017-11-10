/**
* @file 竞争对手优劣势力
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveTo()">确定</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1">
        <div class="mui-scroll">
          <textarea class="good_bad" placeholder="{{gooBad.goodBadData.placeholder}}" v-model="gooBad.goodBadData.value"
                    @focus="inputFocus('value')"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../chance-store';
  var nativeApi = require('nativeApi');
  export default{
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '竞争对手'
        },
        gooBad: store.state
      };
    },
    methods: {
      saveTo: function () {
        var param = this.$route.params.param;
        store.saveGoodBad(param, function () {
          history.go(-1);
        });
      },
      inputFocus: function (field) {
        var setVal = this.gooBad.goodBadData;
        nativeApi.showKeyboard({
          callback: function (result) {
            setVal[field] = result.result;
          }
        });
      }
    },
    created: function () {
      var param = this.$route.params.param;
      store.editGoodBad(param);
    },
    ready: function () {
      mui.init();
    }
  };
</script>
