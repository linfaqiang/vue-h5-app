/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <a class="mui-icon-search mui-icon mui-pull-right" @tap="tapLinks($index)"></a>
    </header>
    <div class="mui-content">
      <div v-if="testList.conList.length==0" :class="{'list_is_null': testList.conList.length==0}"></div>
      <!--下拉刷新容器-->
      <div v-show="testList.conList.length>0">
          <mui-scroll-refresh bottom="0" top="44px">
            <!--数据列表-->
            <ul class="mui-table-view mui-table-view-chevron" id="noPadding">
              <li v-for="list in testList.conList" @tap="tapLink($index)" data-group="{{list.indexedGroup}}"
                  class="mui-table-view-cell">
                <div class="mui-table">
                  <div class="mui-table-cell mui-col-xs-10">
                    <h4 class="mui-ellipsis" v-text="list.subject"></h4>
                    <h5 class="holding">举办单位：{{list.organizer}}</h5>
                    <p class="mui-h6 mui-ellipsis">开始时间：{{list.startTime}}</p>
                  </div>
                  <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                    <span class="mui-h5" :class="{'ing':list.status==1,'no-start':list.status==3}"
                          v-text="list.statusText"></span>
                  </div>
                </div>
              </li>
            </ul>
          </mui-scroll-refresh>
        </div>
    </div>
  </div>
</template>
<script>
  import store from '../market-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '市场活动',
          name: '编辑头像',
          href: ' ',
          btns: '保存'
        },
        testList: store.scroll.list
      };
    },
    methods: {
      backNative: function () {
        nativeApi.goNative();
      },
      back: function () {
        mui.back();
      },
      tapLink: function (index) {
        var marketId = this.testList.conList[index].id;
        var self = this;
        store.choose(marketId, function () {
          self.$router.go('/choose/' + marketId);
        });
      },
      tapLinks: function (index) {
        store.scroll.search.searchLi = [];
        this.$router.go('/search');
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.init();
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

    }
  };
</script>
