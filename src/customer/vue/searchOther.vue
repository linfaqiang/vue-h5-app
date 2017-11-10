<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d" :class="{'search_d_h': isBlur}">
        <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
        <input id="searchInputId" type="text" placeholder="{{plh}}" v-model="searchName" @input="inputBlock()"
               @focus="inputFocus()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()" :style="seaNaCss">确定</a>
      </div>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div v-if="searchTotal.seaTotalAll==0 && saveSea" class="list_is_null"></div>
      <div class="show_total" v-if="searchTotal.seaTotalAll>0">{{searchTotal.seaTotal}}/{{searchTotal.seaTotalAll}}
      </div>
      <div v-show="searchTotal.seaTotalAll>0">
        <mui-scroll-refresh bottom="0" top="68px">
          <div class="list_customer sideline_up sideline_down" v-for="list in searchList.dataList"
               @tap="toDetail(list.id)">
            <div class="content mui-icon mui-push-right">
              <p class="title" v-text="list.name"></p>
              <p><span class="mui-icon mui-icon-location"></span>{{list.address}}</p>
              <span v-text="toDate(list.lastOperatedOn)"></span>
            </div>
            <div class="label sideline_up">
              <span :class="{'edt': edition==1}">联系人&nbsp;{{list.linkmanCount}}<span></span></span>
              <span v-if="edition!=1">商机&nbsp;{{list.chanceCount}}<span></span></span>
              <span :class="{'edt': edition==1}">团队&nbsp;{{list.teamCount}}<span></span></span>
              <span :class="{'edt_last': edition==1}">责任人&nbsp;{{list.ownerStaffName}}</span>
            </div>
          </div>
          <div style="height: 10px;"></div>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet/less'>
  @import '../../contact/contact.css';
</style>
<script>
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  import store from '../customer-store';
  export default{
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        plh: '客户名称',
        searchName: '',
        saveSea: '',
        searchList: store.scroll.search,
        searchTotal: store.state,
        seaNaCss: {
          color: '#a80e16'
        },
        edition: nativeApi.edition,
        isBlur: true
      };
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
    methods: {
      back: function (index) {
        history.go(-1);
        var self = this;
        self.seaNaCss.color = '#a80e16';
        self.saveSea = '';
        self.searchName = '';
      },
      toDate: function (val) {
        return val ? val.substring(0, 10) : '';
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
      substring: function (date) {
        return date.substring(0, 10);
      },
      confirm: function () {
        var searchName = this.searchName;
        var self = this;
        if (!searchName) {
          mui.alert('客户名称不能为空！', '提示', function () {
          });
          return;
        }
        self.saveSea = searchName;
        store.param.search.q = searchName;
        store.search();
      },
      toDetail: function (id) {
        var self = this;
        store.getDetail(id, function () {
          self.$router.go('/detailPage');
        });
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      setTimeout(function () {
        document.getElementById('searchInputId').focus();
      }, 50);
    }
  };
</script>
