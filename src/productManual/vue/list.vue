/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>

    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d center">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
        <input placeholder="产品名称" v-model="searchName" readonly @tap="toSearch()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()" v-text="currentHeader.btns"></a>
      </div>
    </header>

    <div id="sliderSegmentedControl"
         class="mui-slider-indicator mui-segmented-control mui-segmented-control-inverted nav-top">
      <a class="mui-control-item mui-control-item-e mui-active" @tap="tabDistribute(1)">
        最新
      </a>
      <a class="mui-control-item mui-control-item-e" @tap="tabDistribute(2)">
        关注
      </a>
    </div>
    <div class="mui-content"
         :class="{'list_is_null': (lists.conList.length==0 && !distribute.show)||(follows.conList.length==0&&distribute.show)}"
         :style="{'margin-top': '88px'}">
      <!--下拉刷新容器-->
      <div v-show="!distribute.show && lists.conList.length>0">
        <mui-scroll-refresh bottom="0" top="86px" code="list">
          <!--数据列表-->
          <ul class="mui-table-view mui-table-view-chevron">
            <li class="mui-table-view-cell mui-media" v-for="list in lists.conList" @tap="tapLinkA($index)">
              <a class="mui-navigate-right">
                <img class="mui-media-object mui-pull-left" :src="list.picUrl"
                     onerror="this.src='../public/images/default_product.png'">
                <div class="mui-media-body">
                  <p v-text="list.productName"></p>
                  <span class='mui-ellipsis'>类别:{{list.productTypeText}}</span>
                  <span class="price mui-icon mui-icon-amount">￥{{list.productPrice}}元</span>
                </div>
              </a>
            </li>
          </ul>
        </mui-scroll-refresh>
      </div>
      <div v-show="distribute.show && follows.conList.length > 0">
        <mui-scroll-refresh bottom="0" top="86px" code="follows">
          <!--数据列表-->
          <ul class="mui-table-view mui-table-view-chevron">
            <li class="mui-table-view-cell mui-media" v-for="list in follows.conList" @tap="tapLinkB($index)">
              <a class="mui-navigate-right">
                <img class="mui-media-object mui-pull-left" :src="list.picUrl"
                     onerror="this.src='../public/images/default_product.png'">
                <div class="mui-media-body">
                  <p v-text="list.productName"></p>
                  <span class='mui-ellipsis'>类别:{{list.productTypeText}}</span>
                  <span class="price mui-icon mui-icon-amount">{{list.productPrice}}元</span>
                </div>
              </a>
            </li>
          </ul>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../product-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        searchName: '',
        currentHeader: {
          title: '',
          name: '',
          href: ' ',
          btns: '分类'
        },
        isB: true,
        distribute: store.state,
        type: '',
        lists: store.scroll.list,
        follows: store.scroll.follows,
        listObject: {
          height: (document.body.offsetHeight - 44) + 'px'
        },
        styleObject: {
          top: '84px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44) + 'px'
        }
      };
    },
    methods: {
      back: function () {
        mui.back();
      },
      tapLinkA: function (index) {
        var productId = this.lists.conList[index].id;
        var self = this;
        store.getDedail(productId, function () {
          self.$router.go('/detailPage/' + productId);
        });
      },
      tapLinkB: function (index) {
        var productId = this.follows.conList[index].id;
        var self = this;
        store.getDedail(productId, function () {
          self.$router.go('/detailPage/' + productId);
        });
      },
      confirm: function () {
        var that = this;
        if (this.searchName.length === 0) {
          that.$router.go('/classify');
        } else {
          /* 搜索操作*/
          var searchName = that.searchName;
          store.search(searchName);
        }
      },
      tabDistribute: function (type) {
        type = parseInt(type || 0);
        if (type === 1) {
          store.state.show = false;
          store.listRefresh('list');
        } else {
          store.state.show = true;
          store.listRefresh('follows');
        }
      },
      backNative: function () {
        nativeApi.goNative();
      },
      toSearch: function () {
        store.state.searchList = [];
        this.$router.go('/toSearch');
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.init();
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll(scroll.wrapper.getAttribute('code'), scroll);
      },
      pulldown: function (scroll) {
        store.listRefresh(scroll.wrapper.getAttribute('code'));
      },
      pullup: function (scroll) {
        store.listLoadMore(scroll.wrapper.getAttribute('code'));
      }
    },
    ready: function () {
      /* 初始化索引列表*/
      mui('.mui-scroll-wrapper').scroll();
      mui.init();
    }
  };
</script>
