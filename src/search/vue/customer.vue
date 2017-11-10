/**
* @file
* @author hj
* @date 2016-11-
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d" :class="{'search_d_h': isBlur}">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <input id="customerInputId" type="text" placeholder="{{plh}}" v-model="searchName" @input="inputBlock()" @focus="inputFocus()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" :style="seaNaCss" @tap="confirm()">确定</a>
      </div>
    </header>
    <div class="mui-content">
      <div v-if="customer.dataList.length==0" :class="{'search_is_not_list': customer.dataList.length==0 && saveSea}"></div>
      <div v-show="customer.dataList.length>0">
        <mui-scroll-refresh bottom="0" top="44px">
          <div class="rival_li">
            <ul>
              <li v-for="list in customer.dataList" class="mui-icon" :class="{selected: list.selected, 'crm-check': list.selected}" @tap="linkDetail(list.id)">
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
  import store from '../search-store';
  var nativeApi = require('nativeApi');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        plh: '客户名称',
        customer: store.scroll.customer,
        searchName: '',
        saveSea: '',
        seaNaCss: {
          color: '#a80e16'
        },
        isBlur: true
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
            if (self.searchName) {
              self.seaNaCss.color = '#fff';
            }
          }
        });
      },
      inputBlock: function () {
        var self = this;
        if (self.searchName) {
          self.seaNaCss.color = '#fff';
        } else {
          self.seaNaCss.color = '#a80e16';
          self.saveSea = '';
          self.customer.dataList = [];
        }
      },
      confirm: function () {
        if (!this.searchName) {
          return;
        }
        this.saveSea = this.searchName;
        store.param.customer.q = this.searchName;
        store.param.customer.pageNo = 1;
        store.customer();
      },
      linkDetail: function (id) {
        localStorage.setItem('search_customer_detail', JSON.stringify({
          'id': id
        }));
        nativeApi.goView({
          'apiJson': {
            'urlPort': 'customer/index.html#!/detailPage/search_customer_detail',
            'function': 'customer'
          }
        });
      }
    },
    created: function () {
    },
    route: {
      data: function () {
        var param = this.$route.params.sea;
        if (param && param !== '280') {
          this.searchName = param;
          this.saveSea = param;
          this.seaNaCss.color = '#fff';
          store.customer();
        }
        setTimeout(function () {
          document.getElementById('customerInputId').focus();
        }, 50);
      }
    },
    ready: function () {
      mui.init();
    }
  };
</script>
