<template>
	<header class="mui-bar mui-bar-nav">
    <a class="mui-icon mui-action-menu mui-icon-bars mui-pull-left icon-lf" @tap="toggleSlideBar()"></a>
    <a class="mui-icon mui-action-menu mui-icon-chat mui-pull-right icon-rt" @tap="toLink('/message/index.html')">
      <i v-show="head.data > 0"> {{ head.data }} </i>
    </a>
    <div class="mui-title">
    	<div class="mui-input-row mui-search">
          <input type="search" class="mui-input-clear" placeholder="搜索">
      </div>
    </div>
  </header>
</template>
<script>
  import {APIS} from 'configPort';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {
      return {
        head: {},
        isBlur: true
      };
    },
    methods: {
      toggleSlideBar: function () {
        mui('.mui-off-canvas-wrap').offCanvas('show');
      },
      toLink: function (path) {
        window.location.href = path;
      }
    },
    created: function () {
      var _this = this;
      nativeApi.initAjax({
        type: 'GET',
        url: APIS.message_noread_count,
        callback: function (result) {
          if (result && result.code === 200) {
            _this.head = result;
          } else {
            mui.alert(result.msg || '数据获取失败！', '提示');
          }
        }
      });
    },
    ready: function () {
      mui.init();
    }
  };
</script>
