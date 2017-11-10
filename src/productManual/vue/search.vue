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
        <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()" :style="seaNaCss">确定</a>
      </div>
    </header>
    <div class="mui-content">
      <!--下拉刷新容器-->
      <div v-if="listData.searchList.length==0 && saveSea" class="list_is_null"></div>
      <div :class="{'displayNone' : listData.searchList.length==0}">
        <div id="pullrefresh" class="mui-content mui-scroll-wrapper" :style="styleObject">
          <div class="mui-scroll">
            <!--数据列表-->
            <ul class="mui-table-view mui-table-view-chevron">
              <li class="mui-table-view-cell mui-media" v-for="list in listData.searchList" @tap="tapLink($index)">
                <a class="mui-navigate-right">
                  <img class="mui-media-object mui-pull-left" :src="list.picUrl"
                       onerror="this.src='../public/images/default_product.png'">
                  <div class="mui-media-body">
                    <p v-text="list.productName"></p>
                    <span class='mui-ellipsis'>类别:{{list.productTypeText}}</span>
                    <span class="price mui-icon mui-icon-amount">{{list.productPrice}}元</span>
                  </div>
                </a>
              </li>
            </ul>
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
  import store from '../product-store';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {
      return {
        show: false,
        saveSea: '',
        searchList: store.scroll.search,
        currentHeader: {
          title: '取消',
          name: '文件名称',
          value: ''
        },
        listData: store.state,
        dataList: store.scroll.search,
        plh: '搜索',
        searchName: '',
        styleObject: {
          background: '#f1f1f1',
          top: '44px',
          bottom: '0px'
        },
        seaNaCss: {
          color: '#a80e16'
        },
        isBlur: true,
        type: ''
      };
    },
    methods: {
      tapLink: function (index) {
        var productId = this.listData.searchList[index].id;
        var self = this;
        store.getDedail(productId, function () {
          self.$router.go('/detailPage/' + productId);
        });
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
          mui.alert('名称不能为空！', '提示', function () {
          });
          return;
        }
        store.param.search.q = searchName;
        self.saveSea = searchName;
        store.search(searchName);
        self.styleObject.top = '44px';
        self.styleObject.height = (document.body.offsetHeight - 44 - 24) + 'px';
      },
      search: function () {
        var searchName = this.searchName || '';
        store.search(searchName);
      },
      clear: function () {
        this.currentHeader.value = '';
        this.show = false;
      },
      back: function () {
        history.go(-1);
        var self = this;
        self.seaNaCss.color = '#a80e16';
        self.saveSea = '';
        self.searchName = '';
      }

    },
    route: {
      activate: function (transition) {
        this.searchName = '';
        transition.next();
      }
    },
    ready: function () {
    }
  };
</script>
