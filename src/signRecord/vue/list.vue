/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav myCustomersHeader">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <h1 class="mui-title" @tap="pop">
        {{currentHeader.title}}
        <span class="mui-icon" :class="[isB ? 'crm-solid-lower-triangle' : 'crm-solid-up-triangle']"></span></h1>
    </header>
    <ul class="myCustomersHide mui-card" v-if="!isB">
      <li class="mui-icon crm-icon-main" @tap="myRecord">我的记录</li>
      <li class="mui-icon crm-icon-staff" @tap="staffRecord">查看下属</li>
    </ul>
    <div v-if="!isB" class="cover-background" @tap="closePop"></div>
    <div class="mui-content customer-detail">
      <div :class="{'list_is_null': data.conList.length==0}">
        <mui-scroll-refresh bottom="0" top="44px">
          <div class="activity_list">
            <ul v-for="list in data.conList">
              <li class="group"><span class="title">{{list.date}}</span><span class="line"></span></li>
              <li v-for="item in list.list" class="content">
                <p>{{item.time}}&nbsp;&nbsp;&nbsp;{{item.signName}}</p>
                <p>{{item.customerText}}({{item.address}})</p>
                <a v-if="item.picUrl" class="images">
                  <img v-if="item.picUrl" :src="item.picUrl" data-preview-src="" data-preview-group="2">
                </a>
                <span class="point"></span>
                <div v-if="$index < (list.list.length-1)" class="line_left"></div>
              </li>
            </ul>
          </div>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/mui.image.css';
</style>
<script>
  import store from '../sign-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  require('mui.previewimage');
  require('mui.zoom');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      // 组件的数据格式
      return {
        currentHeader: store.state.currentHeader,
        isB: true,
        isShowDistribute: false,
        data: store.scroll.list
      };
    },
    methods: {
      pop: function () {
        this.isB = !this.isB;
      },
      backNative: function () {
        nativeApi.goNative();
      },
      myRecord: function () {
        this.isB = !this.isB;
        this.currentHeader.title = '我的记录';
        store.param.list.staffIds = '';
        store.getRecrds();
      },
      staffRecord: function () {
        var self = this;
        self.isB = !self.isB;
        /* 查询下属签到记录*/
        window['clueUnEmp'] = function (lists) {
          store.state.currentHeader.title = '下属记录';
          lists = lists || [];
          var strIds = '';
          for (var i = 0; i < lists.length; i++) {
            strIds += lists[i].id + ',';
          }
          strIds = strIds.substring(0, strIds.length - 1);
          store.param.list.staffIds = strIds;
          // 获取下属签到记录
          setTimeout(function () {
            store.getRecrds();
          }, 50);
        };
        this.$router.go('/employee-select/clueUnEmp');
      },
      closePop: function () {
        this.isB = !this.isB;
      }
    },
    created: function () {
      store.param.list.staffIds = '';
      store.getRecrds();
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('list', scroll);
      },
      pulldown: function () {
        store.listRefresh('list');
      },
      pullup: function () {
        store.listLoadMore('list');
      }
    },
    ready: function () {
      mui.previewImage();
    }
  };
</script>
