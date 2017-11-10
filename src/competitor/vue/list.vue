/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @click="backNative" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">竞争对手</h1>
      <a class="mui-icon-plusempty mui-icon mui-pull-right" @click="newCometitor"></a>
      <a @click="mySearch" class="mui-icon-search mui-icon mui-pull-right second_a"></a>
    </header>
    <div class="competitor-list">
      <!--<div class="competitor-pager"><span>10/30</span></div>-->
      <div class="mui-content">
        <div v-if="conList.conList.length==0" :class="{'list_is_null': conList.conList.length==0}"></div>
        <mui-scroll-refresh top="55px" v-show="conList.conList.length>0">
          <div class="list">
            <div class="ppLi" v-for="list in conList.conList" @tap="goDetail(list.id)">
              <h5 class="p_l15">{{list.competitorName}}</h5>
              <div class="competitor-address p_l15">
                <span class="f_12 adrLeft">{{list.address.address}}</span>
                <span class="mui-icon right_arrow"></span>
              </div>
              <div class="competitor-msg p_l15 f_12">
                <span class="mag-1">联系人&nbsp<span class="competitor-blue">{{list.linkManCount}}</span></span>
                <span class="mag-1 t-c">机会&nbsp<span class="competitor-blue">{{list.chanceCount}}</span></span>
                <span class="mag-2 t-c">总额&nbsp¥<span class="competitor-redcolor">{{list.totalAmount}}</span></span>
              </div>
            </div>
          </div>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../competitor-store';
  var nativeApi = require('nativeApi');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  import {FastClick} from 'fastclick';
  export default {
    data: function () {    // 组件的数据格式
      return {
        conList: store.scroll.list
      };
    },
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    methods: {
      backNative: function () {
        nativeApi.goNative({
          'apiJson': {
            'fn': 'competitor'
          }
        });
      },
      mySearch: function () {
        store.cleanSearch();
        this.$router.go('/competitor-search');
      },
      goDetail: function (id) {
        store.state.inLists = {
          show: false
        };
        var self = this;
        store.renderDetail(id, function () {
          self.$router.go('/competitorDetail');
        });
      },
      newCometitor: function () {
        store.clean();
        this.$router.go('/competitor-new');
      }
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
    created: function () {
      store.init();
    },
    ready: function () {
      FastClick.attach(document.body);
    }
  };
</script>
