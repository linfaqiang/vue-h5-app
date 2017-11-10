/**
* @file 客户选择界面
* @author hj
* @date 2016-11-17
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
    </header>
    <div class="mui-content">
      <div class="list_search not_type">
        <span class="mui-icon mui-icon-glass"></span>
        <input type="text" v-model="searchName" placeholder="客户名称" @focus="inputFocus()">
        <span class="search" @tap="search()">搜索</span>
      </div>
      <div v-if="customer.customerLi.length==0" :class="{'list_is_null': customer.customerLi.length==0}"></div>
      <div v-show="customer.customerLi.length>0">
        <mui-scroll-refresh bottom="0px" top="84px">
          <div class="rival_li">
            <ul>
              <li v-for="list in customer.customerLi" class="mui-icon"
                  :class="{selected: list.selected, 'crm-check': list.selected}" @tap="customerSelect($index)">
                <p class="name">{{list.name}}</p>
                <p><span class="mui-icon mui-icon-address"></span>{{list.address}}</p>
              </li>
            </ul>
          </div>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../contact-store';
  var nativeApi = require('nativeApi');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        currentHeader: {
          title: '选择客户'
        },
        customer: store.scroll.customer,
        searchName: ''
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('customer', scroll);
      },
      pulldown: function () {
        store.listRefresh('customer');
      },
      pullup: function () {
        store.listLoadMore('customer');
      }
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      search: function () {
        store.param.customer.q = this.searchName;
        store.listRefresh('customer');
      },
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.searchName = result.result;
          }
        });
      },
      customerSelect: function (index) {
        var self = this;
        var param = self.$route.params.param;
        var arrPram = param.split('_');
        var backData = this.customer.customerLi[index];
        store.updateField('customer', backData, arrPram[1]);
        history.go(-1);
      }
    },
    created: function () {
    },
    route: {
      data: function () {
        store.listRefresh('customer');
      }
    },
    ready: function () {
      mui.init();
    }
  };
</script>
