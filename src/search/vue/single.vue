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
        <input id="singleInputId" type="text" placeholder="{{plh}}" @input="inputBlock()" v-model="searchName"
               @focus="inputFocus()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" :style="seaNaCss" @tap="confirm()">确定</a>
      </div>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;" :class="{'search_is_not_list': sea.seaList.length==0}">
        <div class="mui-scroll">
          <div class="result_li" v-if="saveSea">
            <div class="list">
              <p class="title">{{sea.searchList.title}}</p>
              <div v-for="item in sea.seaList.lists" @tap="toDetail(sea.searchList.fun, item.id)">
                <img :src="item.headPhotoUrl||'../public/images/default_contact.png'" data-preview-src=""
                     data-preview-group="1">
                <p class="title" v-if="item.name" :class="{con: item.name}">{{item.name}}<span>{{item.title}}</span></p>
                <p v-if="item.customer" v-text="item.customerName"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../search-store';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {
      return {
        plh: '搜索',
        searchName: '',
        saveSea: '',
        seaNaCss: {
          color: '#a80e16'
        },
        sea: store.state,
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44) + 'px'
        },
        isBlur: true
      };
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      inputBlock: function () {
        var self = this;
        if (self.searchName) {
          self.seaNaCss.color = '#fff';
        } else {
          self.seaNaCss.color = '#a80e16';
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
        var self = this;
        var searchName = this.searchName;
        self.saveSea = searchName;
        store.singleConfirm(searchName);
      },
      toDetail: function (func, id) {
        func = func || 'contact';
        if (func === 'book') {
          nativeApi.checkBook({
            'userId': id
          });
        } else {
          localStorage.setItem('search_' + func + '_detail', JSON.stringify({
            'id': id
          }));
          nativeApi.goView({
            'apiJson': {
              'urlPort': func + '/index.html#!/detailPage/search_' + func + '_detail',
              'function': 'customer'
            }
          });
        }
      }
    },
    created: function () {
      var a = this.$route.params;
      this.searchName = a.sea;
      this.saveSea = a.sea;
      this.isBlur = true;
    },
    route: {
      data: function () {
        if (this.saveSea) {
          this.seaNaCss.color = '#fff';
        }
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      setTimeout(function () {
        document.getElementById('singleInputId').focus();
      }, 50);
    }
  };
</script>
