/**
* @file 线索分配列表
* @author hj
* @date 2016-11-22
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav myCustomersHeader">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <h1 class="mui-title">{{currentHeader.title}}</h1>
      <a class=" mui-icon crm-search mui-pull-right" @tap="mySearch"></a>
    </header>
    <div id="sliderSegmentedControl"
         class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted nav-top">
      <a class="mui-control-item mui-control-item-e mui-active" @tap="tabDistribute(0)">
        未分配线索
      </a>
      <a class="mui-control-item mui-control-item-e" @tap="tabDistribute(1)">
        已分配线索
      </a>
    </div>
    <div class="mui-content mui-content-disList">
      <div class="list_is_null" v-if="conList.conList.length == 0"></div>
      <div class="list-count" v-if="conList.conList.length > 0">{{data.nowTotal}}/{{data.totalSize}}</div>
      <div v-show="conList.conList.length > 0">
        <mui-scroll-refresh top="108px" bottom="0px">
          <!--数据列表-->
          <ul class="mui-table-view mui-table-view-chevron">
            <li @tap="tapLink($index)" v-for="list in conList.conList" data-group="{{list.indexedGroup}}"
                class="mui-table-view-cell mui-table-view-cell-e">
              <div class="mui-table">
                <div class="mui-table-cell mui-col-xs-10">
                  <p class="mui-ellipsis customer-name">客户名：{{list.customerName}}</p>
                  <p class="list-o">联系方式：{{list.linkmanTelephone}}</p>
                  <p class="mui-h6 mui-ellipsis list-o">最后跟进：{{list.lastOperated0n}}</p>
                </div>
                <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                  <!--<span class="mui-h5 dept-show" >{{isShowDistribute ? list.toDeptName : ""}}</span>-->
                </div>
              </div>
            </li>
          </ul>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
  import store from '../clue-store';
  var nativeApi = require('nativeApi');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {     // 组件的数据格式
      return {
        currentHeader: {
          title: '线索',
          name: '下属线索',
          href: ' ',
          btns: '保存'
        },
        isB: true,
        isShowDistribute: true,
        conList: store.scroll.list,
        data: store.state,
        listObject: {
          height: (document.body.offsetHeight - 44) + 'px'
        }
      };
    },
    methods: {
      tapLink: function (index) {
        var clueId = this.conList.conList[index].id;
        this.$router.go('/detailPage/' + clueId + '/' + this.isShowDistribute);
      },
      mySearch: function () {
        store.scroll.search.searchLi = [];
        this.$router.go('/searchPage');
      },
      tabDistribute: function (type) {
        // 1 已分配  0未分配
        if (type === 0) {
          this.isShowDistribute = true;
          store.param.list.type = 0;
          store.param.search.type = 0;
        } else {
          this.isShowDistribute = false;
          store.param.list.type = 1;
          store.param.search.type = 1;
        }
        store.param.list.pageNo = 1;
        store.listRefresh('list');
      },
      backNative: function () {
        nativeApi.goNative({
          'apiJson': {
            'fn': 'customerDistribution'
          }
        });
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.listLoadMore('list');
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
      mui.init();
    }
  };
</script>
