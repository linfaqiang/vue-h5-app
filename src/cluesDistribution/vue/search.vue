/**
* @file 线索分配 搜索
* @author hj
* @date 2016-11-22
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
    <div class="mui-content">
      <div v-if="dataList.searchLi.length==0 && saveSea" class="list_is_null"></div>
      <div id="slider" class="mui-slider" style="top:45px">
        <div class="mui-slider-group">
          <div class="mui-slider-item mui-control-content mui-active">
            <!--下拉刷新容器-->
            <mui-scroll-refresh>
              <!--数据列表-->
              <ul class="mui-table-view mui-table-view-chevron">
                <li @tap="tapLink($index)" v-for="list in searchList.searchLi" data-group="{{list.indexedGroup}}"
                    class="mui-table-view-cell mui-table-view-cell-e">
                  <div class="mui-table">
                    <div class="mui-table-cell mui-col-xs-10">
                      <p class="mui-ellipsis customer-name">客户名：{{list.customerName}}</p>
                      <p class="list-o">联系方式：{{list.linkmanTelephone}}</p>
                      <p class="mui-h6 mui-ellipsis list-o">最后跟进：{{list.lastOperated0n}}</p>
                    </div>
                    <div class="mui-table-cell mui-col-xs-2 mui-text-right">
                      <span class="mui-h5 dept-show">{{isShowDistribute ? list.toDeptName : ""}}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </mui-scroll-refresh>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../contact/contact.css';
</style>
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
        saveSea: '',
        dataList: store.scroll.search,
        show: false,
        currentHeader: {
          title: '取消',
          name: '线索名称或简称',
          value: ''
        },
        listData: store.state,
        plh: '搜索',
        searchName: '',
        isShowDistribute: false,
        searchList: store.scroll.search,
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
          mui.alert('线索名不能为空！', '提示', function () {
          });
          return;
        }
        store.param.search.q = searchName;
        store.search();
        self.saveSea = searchName;
        self.styleObject.top = '68px';
        self.styleObject.height = (document.body.offsetHeight - 44 - 24) + 'px';
      },
      clear: function () {
        this.currentHeader.value = '';
        this.show = false;
      },
      tapLink: function (index) {
        var clueId = this.searchList.searchLi[index].id;
        this.isShowDistribute = true;
        if (store.param.search.type === 0) {
          this.isShowDistribute = false;
        }
        this.$router.go('/detailPage/' + clueId + '/' + this.isShowDistribute);
      }
    },
    route: {
      activate: function (transition) {
        store.param.search.q = '';
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
      document.getElementById('searchInputId').focus();
    }
  };
</script>
