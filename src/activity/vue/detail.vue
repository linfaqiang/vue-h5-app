<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed;">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon-compose mui-icon mui-pull-right" @tap="edit(detailData.actData.id)"></a>
    </header>
    <div class="mui-content">
      <this-detail-components :detail="detailData.actData" :edition="edition"></this-detail-components>
    </div>
  </div>
</template>
<style>
  @import '../../public/css/mui.image.css';
</style>
<script>
  import {APIS} from 'configPort';
  import activityDetail from '../../public/components/crm-activity/detail.vue';
  import store from '../activity-store';
  require('mui.previewimage');
  require('mui.zoom');
  var nativeApi = require('nativeApi');
  export default{
    components: {
      'this-detail-components': activityDetail
    },
    data: function () {
      return {
        currentHeader: {
          title: '销售活动详情'
        },
        detailData: store.state,
        edition: nativeApi.edition
      };
    },
    methods: {
      back: function (index) {
        if (APIS.is_weixin) {
          history.go(-1);
        }
        if (window.initPage) {
          if (window.isEdit) {
            nativeApi.goNative({
              'apiJson': {
                'fn': 'activity',
                'callFun': 'refreshFollow',
                'param': ''
              }
            });
          } else {
            nativeApi.goNative({
              'apiJson': {
                'fn': 'activity'
              }
            });
          }
        } else {
          history.go(-1);
        }
      },
      edit: function (id) {
        var self = this;
        store.toEdit(function () {
          self.$router.go('/editPage/' + id);
        });
      }
    },
    created: function () {
      var localKey = this.$route.params.localKey;
      console.log('localKey=' + localKey);
      if (localKey) {
        window.initPage = 'toDetail';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.removeItem(localKey);
      }
      var nativeId = this.$route.params.nativeId;
      if (nativeId) {
        /* 原生调用 */
        window.initPage = 'toDetail';
        window.initParam = {
          'id': nativeId
        };
      }
      if (window.initPage) {
        store.detail(window.initParam.id);
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      mui.previewImage();
    }
  };
</script>
