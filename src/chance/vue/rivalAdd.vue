/**
* @file 添加竞争对手页面
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveTo()">确定</a>
    </header>
    <div class="mui-content">
      <div class="list_search not_type">
        <span class="mui-icon mui-icon-glass"></span>
        <input type="text" v-model="searchName" placeholder="对手名称" @focus="inputFocus()">
        <span class="search" @tap="search()">搜索</span>
      </div>
      <div v-if="rival.rivalAddList.length==0" :class="{'list_is_null': rival.rivalAddList.length==0}"></div>
      <div v-show="rival.rivalAddList.length>0">
        <mui-scroll-refresh bottom="0" top="84px">
          <div class="rival_li">
            <ul>
              <li v-for="list in rival.rivalAddList" class="mui-icon"
                  :class="{selected: list.selected, 'crm-check': list.selected}" @tap="multipleBack($index)">
                <p class="name">{{list.competitorName}}</p>
                <p><span class="mui-icon mui-icon-address"></span>{{list.address.address}}</p>
              </li>
            </ul>
          </div>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../chance-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default{
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        currentHeader: {
          title: '添加竞争对手'
        },
        rival: store.scroll.rival,
        rivals: store.state,
        searchName: ''
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('rival', scroll);
      },
      pulldown: function () {
        store.listRefresh('rival');
      },
      pullup: function () {
        store.listLoadMore('rival');
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
      saveTo: function () {
        var self = this;
        var from = self.rivals.rivalForm;
        var fun = 'rivalAdd';
        if (from) {
          fun = 'rivalProductAdd';
        }
        store[fun](function () {
          mui.alert('对手新增成功！', '提示', function () {
            self.back();
          });
        });
      },
      search: function () {
        store.param.rival.q = this.searchName;
        store.param.rival.pageNo = 0;
        store.rivalList();
      },
      multipleBack: function (index) {
        var self = this;
        if (self.rival.rivalAddList[index].selected) {
          self.rival.rivalAddList[index].selected = false;
        } else {
          self.rival.rivalAddList[index].selected = true;
        }
      }
    },
    created: function () {
    },
    route: {
      data: function () {
        store.listRefresh('rival');
      }
    },
    ready: function () {
      mui.init();
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
