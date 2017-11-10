/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d" :class="{'search_d_h': isBlur}">
        <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
        <input id="searchInputId" type="text" placeholder="{{plh}}" v-model="searchName" @input="inputBlock()"
               @focus="inputFocus()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right icon-text" @tap="confirm()" :style="seaNaCss">确定</a>
      </div>

    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->

    <div class="mui-content">
      <div v-if="dataList.searchLi.length==0 && saveSea" class="list_is_null"></div>
      <mui-scroll-refresh bottom="0" top="44px">
        <div class="list_chance" v-for="list in searchList.searchLi" @tap="toDetail($index)">
          <div class="content mui-icon mui-push-right">
            <p class="title bu">
              <span class="stage">{{list.quotationName}}</span>
              <span v-if="list.status==0" style="color: #ef8607">{{list.statusText}}</span>
              <span v-if="list.status==1" style="color: #009FE8">{{list.statusText}}</span>
              <span v-if="list.status==2" style="color: #49B768">{{list.statusText}}</span>
              <span v-if="list.status==3" style="color: #d61518">{{list.statusText}}</span>
            </p>
            <p>{{list.chanceName}}</p>
          </div>
          <div class="label">
            <span class="mui-icon mui-icon-start">{{disposeDate(list.createdOn)}}</span>
            <span class="mui-icon mui-icon-emp">{{list.createdName}}</span>
            <span class="mui-icon mui-icon-amount"><span class="list-money">&#165{{list.amount}}</span></span>
          </div>
        </div>
      </mui-scroll-refresh>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../contact/contact.css';
</style>
<script>
  import store from '../price-store';
  var nativeApi = require('nativeApi');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        saveSea: '',
        plh: '搜索',
        searchName: '',
        searchList: store.scroll.search,
        dataList: store.scroll.search,
        styleObject: {
          background: '#f1f1f1'
        },
        seaNaCss: {
          color: '#a80e16'
        },
        isBlur: true,
        type: ''
      };
    },
    methods: {
      back: function () {
        var self = this;
        self.seaNaCss.color = '#a80e16';
        self.saveSea = '';
        self.searchName = '';
        history.go(-1);
      },
      inputBlock: function () {
        var self = this;
        if (self.searchName) {
          self.seaNaCss.color = '#fff';
        } else {
          self.seaNaCss.color = '#a80e16';
          self.saveSea = '';
          self.searchList.searchLi = [];
        }
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
      noInputBlock: function () {
        var self = this;
        self.searchName = self.saveSea || '';
        if (!self.searchName) {
          self.isBlur = false;
          self.plh = '搜索';
        }
      },
      confirm: function () {
        var searchName = this.searchName;
        var self = this;
        if (!searchName) {
          mui.alert('报价名不能为空！', '提示', function () {
          });
          return;
        }
        store.param.search.q = searchName;
        self.saveSea = searchName;
        store.search();
        self.styleObject.top = '68px';
        self.styleObject.height = (document.body.offsetHeight - 44 - 24) + 'px';
      },
      toDetail: function (index) {
        var priceId = this.searchList.searchLi[index].id;
        var self = this;
        store.getCustomerDedail(priceId, function () {
          self.$router.go('/detailPage');
        });
      },
      voiceTo: function () {
        var self = this;
        nativeApi.cloundVol({
          callback: function (result) {
            var searchName = result.result;
            self.searchName = searchName;
            store.search(searchName);
          }
        });
      },
      disposeDate: function (date) {
        return date.substring(0, 10);
      }
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('search', scroll);
      },
      pulldown: function () {
        store.listRefresh('search');
      },
      pullup: function () {
        store.listLoadMore('search');
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      document.getElementById('searchInputId').focus();
    }
  };
</script>
