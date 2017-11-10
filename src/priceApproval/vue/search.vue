/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d" :class="{'search_d_h': isBlur}">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
        <input id="searchInputId" type="text" placeholder="{{plh}}" v-model="searchName" @input="inputBlock()"
               @focus="inputFocus()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()" :style="seaNaCss">确定</a>
      </div>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->

    <div class="mui-content search-mui-content">
      <div v-if="dataList.searchLi.length==0 && saveSea" class="list_is_null"></div>
      <div class="mui-scroll-wrapper" :style="listCss" style="top: 44px;">
        <mui-scroll-refresh>
          <div class="list_chance sideline_up sideline_down" v-for="list in searchList2.searchLi"
               @tap="toDetail($index)">
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
              <span class="mui-icon mui-icon-emp">{{list.createdByName}}</span>
              <span class="mui-icon mui-icon-amount"><span class="list-money">&#165{{list.amount}}</span></span>
            </div>
          </div>
          <!--<div style="height: 10px;"></div>-->
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../contact/contact.css';
</style>
<script>
  import store from '../price-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        saveSea: '',
        dataList: store.scroll.search,
        plh: '搜索',
        searchName: '',
        listData: store.state,
        searchList: store.state,
        searchList2: store.scroll.search,
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
      back: function (index) {
        history.go(-1);
        var self = this;
        self.seaNaCss.color = '#a80e16';
        self.saveSea = '';
        self.searchName = '';
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
        store.search();
        self.styleObject.top = '68px';
        self.saveSea = searchName;
        self.styleObject.height = (document.body.offsetHeight - 44 - 24) + 'px';
      },
      toDetail: function (index) {
        var priceId = this.searchList2.searchLi[index].id;
        this.$router.go('/detailPage/' + priceId);
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
    route: {
      // 接受路由变化的参数
      activate: function (transition) {
        this.type = this.$route.params.type;
        this.searchName = '';
        transition.next();
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
