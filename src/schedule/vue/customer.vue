/**
* @file
* @author hj
* @date 2016-11-24
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
      <div v-if="customer.dataList.length==0" :class="{'list_is_null': customer.dataList.length==0}"></div>
      <div v-show="customer.dataList.length>0">
        <mui-scroll-refresh bottom="0" top="84px">
          <div class="rival_li">
            <ul>
              <li v-for="list in customer.dataList" class="mui-icon"
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
  import store from '../schedule-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
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
      inputFocus: function () {
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            self.searchName = result.result;
          }
        });
      },
      search: function () {
        store.param.customer.q = this.searchName;
        store.param.customer.pageNo = 1;
        store.customer();
      },
      customerSelect: function (index) {
        var self = this;
        var param = self.$route.params.param;
        var arrPram = param.split('_');
        var backData = this.customer.dataList[index];
        if (arrPram[1] === 'add') {
          store.setAddCustomer(backData);
        } else if (arrPram[1] === 'edit') {
          store.setEditCustomer(backData);
        }
        history.go(-1);
      }
    },
    created: function () {
    },
    route: {
      data: function () {
        store.param.customer = {
          'q': '',
          'isSelf ': 0,
          'pageNo': 1,
          'pageSize': 10
        };
        store.customer();
      }
    },
    ready: function () {
      mui.init();
    }
  };
</script>
