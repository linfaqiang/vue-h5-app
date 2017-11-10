/**
* @file
* @author hj
* @date 2016-11-22
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
                <p v-if="list.id"><span class="mui-icon mui-icon-address"></span>{{list.address}}</p>
                <p v-if="!list.id">暂未搜索到已有客户，将录入搜索框中客户名！</p>
              </li>
            </ul>
          </div>
        </mui-scroll-refresh>
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
        var arrParam = param.split('_');
        var backData = this.customer.dataList[index];
        if (arrParam[1] === 'addc') {
          store.updateField('customerId', backData.id, 'add');
          store.updateField('customerName', backData.name, 'add');
        } else if (arrParam[1] === 'edit') {
          store.updateField('customerId', backData.id, 'edit');
          store.updateField('customerName', backData.name, 'edit');
        } else if (arrParam[1] === 'add') {
          /* 转商机 */
          store.updateField('customer', backData, 'chance');
        }
        history.go(-1);
      }
    },
    created: function () {
    },
    route: {
      data: function () {
        this.searchName = '';
        store.param.customer = {
          'q': '',
          'isSelf': 0,
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
