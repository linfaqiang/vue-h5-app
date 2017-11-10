/**
* @file
* @author hj
* @date 2016-11-23
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
    <div class="mui-content">
      <div v-if="dataList.searchLi.length==0 && saveSea" class="list_is_null"></div>
      <div>
        <mui-scroll-refresh bottom="0" top="44px">
          <ul class="mui-table-view con_list">
            <li v-for="list in searchList.searchLi" class="mui-table-view-cell mui-indexed-list-item">
              <a @tap="tapLink(list.id)">
                <div><p class="name">{{list.competitorName}}</p>
                  <p>{{list.address.address || ''}}</p></div>
              </a>
            </li>
          </ul>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../contact/contact.css';
</style>
<script>
  import store from '../competitor-store';
  var nativeApi = require('nativeApi');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        searchList: store.scroll.search,
        plh: '搜索',
        show: false,
        saveSea: '',
        currentHeader: {
          title: '取消',
          name: '活动名称',
          value: ''
        },
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
      search: function () {
        var searchName = this.searchName || '';
        store.search(searchName);
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
      tapLink: function (id) {
        store.state.inLists = {
          show: false
        };
        var self = this;
        store.renderDetail(id, function () {
          self.$router.go('/competitorDetail');
        });
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
