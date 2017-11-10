/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav myCustomersHeader">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <h1 class="mui-title">{{currentHeader.title}}</h1>
      <a class=" mui-icon crm-search mui-pull-right" @tap="mySearch"></a>
    </header>
    <div class="mui-content">
      <div v-if="conList.conList.length==0" :class="{'list_is_null': conList.conList.length==0}"
           style="top:44px"></div>
      <div v-show="conList.conList.length>0">
        <!--下拉刷新容器-->
        <mui-scroll-refresh top="44px" bottom="0px">
          <!--数据列表-->
          <ul class="mui-table-view mui-table-view-chevron">
            <li @tap="tapLink($index)" v-for="list in conList.conList" data-group="{{list.indexedGroup}}"
                class="mui-table-view-cell mui-table-view-cell-e">
              <div class="mui-table">
                <div class="mui-table-cell mui-col-xs-10">
                  <p class="mui-ellipsis customer-name">客户名：{{list.customerName}}</p>
                  <p class="list-o">联系方式：{{list.linkmanMobile}}</p>
                  <p class="mui-h6 mui-ellipsis list-o">最后跟进：{{list.lastOperatedOn}}</p>
                </div>
                <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                  <span class="mui-h5 dept-show">{{isShowDistribute ? list.toDeptName : ""}}</span>
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
  import store from '../pool-store';
  var nativeApi = require('nativeApi');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '线索池',
          name: '下属线索',
          href: ' ',
          btns: '保存'
        },
        isB: true,
        isShowDistribute: false,
        conList: store.scroll.list,
        listObject: {
          height: (document.body.offsetHeight - 44) + 'px'
        }
      };
    },
    methods: {
      back: function () {
        mui.back();
      },
      tapLink: function (index) {
        var clueId = this.conList.conList[index].id;
        this.$router.go('/detailPage/' + clueId);
      },
      mySearch: function () {
        store.scroll.search.searchLi = [];
        this.$router.go('/my-search');
      },
      tabDistribute: function (type) {
        if (type === 1) {
          this.isShowDistribute = false;
        } else {
          this.isShowDistribute = true;
        }
        store.tabSearch(type);
      },
      backNative: function () {
        nativeApi.goNative({
          'apiJson': {
            'fn': 'cluesPool'
          }
        });
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
      mui.init();
    }
  };
</script>
