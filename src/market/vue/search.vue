/**
* @file
* @author hj
* @date 2016-11-23
*/
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
      <div v-if="dataList.searchLi.length==0 && saveSea" class="list_is_null"></div>
      <mui-scroll-refresh bottom="0" top="44px">
        <ul v-if="dataList.searchLi.length>0" class="mui-table-view mui-table-view-chevron" id="noPadding">
          <li @tap="tapLink($index)" v-for="list in dataList.searchLi" data-group="{{list.indexedGroup}}"
              class="mui-table-view-cell">
            <div class="mui-table">
              <div class="mui-table-cell mui-col-xs-10">
                <h4 class="mui-ellipsis" v-text="list.subject"></h4>
                <h5 class="holding">举办单位：{{list.organizer}}</h5>
                <p class="mui-h6 mui-ellipsis">开始时间：{{list.startTime}}</p>
              </div>
              <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                <span class="mui-h5" v-text="list.statusText"></span>
              </div>
            </div>
          </li>
        </ul>
      </mui-scroll-refresh>
    </div>
  </div>
</template>
<script>
  import store from '../market-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        show: false,
        saveSea: '',
        searchList: store.scroll.search,
        currentHeader: {
          title: '取消',
          name: '活动名称',
          value: ''
        },
        plh: '活动名称',
        searchName: '',
        dataList: store.scroll.search,
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44) + 'px'
        },
        type: '',
        seaNaCss: {
          color: '#a80e16'
        },
        isBlur: true
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
          mui.alert('活动名不能为空！', '提示', function () {
          });
          return;
        }
        store.param.search.q = searchName;
        store.search();
        self.saveSea = searchName;
        self.styleObject.top = '44px';
        self.styleObject.height = (document.body.offsetHeight - 44) + 'px';
      },
      clear: function () {
        this.currentHeader.value = '';
        this.show = false;
      },
      backNative: function () {
        nativeApi.goNative();
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
      tapLink: function (index) {
        var marketId = this.dataList.searchLi[index].id;
        this.$router.go('/choose/' + marketId);
      }
    },
    route: {
      activate: function (transition) {
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
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      document.getElementById('searchInputId').focus();
    }
  };
</script>
