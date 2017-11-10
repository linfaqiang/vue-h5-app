/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-icon-search mui-icon mui-pull-right" style="right: 5px;" @tap="search()"></a>
    </header>
    <div class="mui-content">
      <div class="select_tab">
        <a :class="{ 'tab-is-selected': isSelectedA }" @tap="getdata(1)">未审批<span class="right"></span></a>
        <a :class="{ 'tab-is-selected': isSelectedB }" @tap="getdata(0)">已审批</a>
      </div>
      <div class="show_total">{{dataList.nowTotal}}/{{dataList.totalSize}}</div>

      <div class="mui-scroll-wrapper" :style="listCss">
        <mui-scroll-refresh>
          <div class="list_chance sideline_up sideline_down" v-for="list in dataList2.conList" @tap="toDetail($index)">
            <div class="content mui-icon mui-push-right">
              <!--<p class="title">{{list.chanceName}}</p>-->
              <!--报价状态：0拟定，1审批中，2已同意，3已拒绝-->
              <p class="title bu">
                <span class="stage">{{list.quotationName}}</span>
                <span v-if="list.status==0 && list.isApproved==0" style="color: #009FE8">{{list.statusText}}</span>
                <span v-if="list.status==1 && list.isApproved==0" style="color: #009FE8">{{list.statusText}}</span>
                <span v-if="list.status==2 && list.isApproved==0" style="color: #49B768">{{list.statusText}}</span>
                <span v-if="list.status==3 && list.isApproved==0" style="color: #d61518">{{list.statusText}}</span>
              </p>
              <p>{{list.chanceName}}</p>
            </div>
            <div class="label">
              <span class="mui-icon mui-icon-start">{{ disposeDate(list.createdOn)}}</span>
              <span class="mui-icon mui-icon-emp">{{list.createdName}}</span>
              <span class="mui-icon mui-icon-amount"><span class="list-money">&#165{{list.amount}}</span></span>
            </div>
          </div>
          <div style="height: 10px;"></div>
        </mui-scroll-refresh>
      </div>
    </div>
    <div class="select_search" :style="selectCss" v-show="selectShow">
      <div class="mui-scroll-wrapper" v-show="aseFlag">
        <div class="mui-scroll">
          <a v-for="list in dataList.selectList" @tap="selectFn($index)"
             :class="{'selected': list.selected, 'crm-check': list.selected}" class="mui-icon">{{list.itemName}}</a>
        </div>
      </div>
      <div class="more_screen" v-show="!aseFlag">
        <div class="left_icon">
          <a v-for="list in dataList.screenList" :class="{selected: list.selected}" @tap="chooseTy($index)">{{list.itemName}}</a>
        </div>
        <div class="right_list mui-scroll-wrapper">
          <div class="mui-scroll">
            <a v-for="list in dataList.selectList" @tap="selectTypeFn($index)"
               :class="{'selected': list.selected, 'crm-check': list.selected}" class="mui-icon">{{list.itemName}}</a>
          </div>
        </div>
      </div>
      <div class="background_select" @tap="cleanSelect()"></div>
    </div>
  </div>
</template>
<script>
  import store from '../price-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '审批'
        },
        dataList: store.state,
        dataList2: store.scroll.list,
        listCss: {
          height: (document.body.offsetHeight - 108) + 'px',
          top: '106px',
          background: '#f1f1f1'
        },
        isSelectedA: true,
        isSelectedB: false
      };
    },
    methods: {
      backNative: function () {
        nativeApi.goNative();
      },
      search: function () {
        store.scroll.search.searchLi = [];
        this.$router.go('/searchOtherPage');
      },
      toDetail: function (index) {
        var priceId = this.dataList2.conList[index].id;
        var self = this;
        store.getPriceDedail(priceId, function () {
          self.$router.go('/detailPage');
        });
      },
      getdata: function (type) {
        this.type = type;
        // 0 未审批  1 已审批
        if (type === 1) {
          this.isSelectedA = true;
          this.isSelectedB = false;

          store.param.list.isApproved = 0;
          store.param.search.isApproved = 0;
        } else {
          this.isSelectedB = true;
          this.isSelectedA = false;

          store.param.list.isApproved = 1;
          store.param.search.isApproved = 1;
        }
        store.param.list.pageNo = 1;
        store.init();
      },
      disposeDate: function (date) {
        return date.substring(0, 10);
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.init(1, '');
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
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
