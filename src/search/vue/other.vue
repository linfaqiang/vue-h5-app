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
        <input id="otherInputId" type="text" placeholder="{{plh}}" @input="inputBlock()" v-model="searchName"
               @focus="inputFocus()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" :style="seaNaCss" @tap="confirm()">确定</a>
      </div>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;"
           :class="{'search_is_not_list': other.otherList.length==0}">
        <div class="mui-scroll">
          <div class="result_li">
            <div class="list" v-for="list in other.otherList" v-if="edition==0 || (list.fun==='customer' && edition==1)">
              <p class="title">{{list.title}}</p>
              <div class="other" v-for="item in list.list" @tap="toDetail(list.fun, item.id)">
                <p class="title">{{item.name}}</p>
                <p v-text="item.description||item.address"></p>
              </div>
              <div @tap="singleMore($index)" v-if="list.total > 3" class="more"><span
                class="mui-icon mui-icon-{{list.fun}}"></span>查询更多的{{list.title}}<span
                class="mui-icon mui-push-right"></span></div>
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
        plh: '关键字',
        searchName: '',
        saveSea: '',
        other: store.state,
        seaNaCss: {
          color: '#a80e16'
        },
        styleObject: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 44) + 'px'
        },
        edition: nativeApi.edition,
        isBlur: true
      };
    },
    methods: {
      back: function (index) {
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
        }
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
        store.other(searchName);
      },
      singleMore: function (index) {
        var self = this;
        var searchName = this.searchName;
        var checkData = self.other.otherList[index];
        var fun = checkData.fun;
        self.saveSea = searchName;
        if (fun === 'cluesManage') {
          fun = 'clue';
        }
        store.param[fun].q = searchName;
        store.param[fun].pageNo = 1;
        this.$router.go('/' + fun + 'Page/' + searchName);
      },
      toDetail: function (func, id) {
        localStorage.setItem('search_' + func + '_detail', JSON.stringify({
          'id': id
        }));
        nativeApi.goView({
          'apiJson': {
            'urlPort': func + '/index.html#!/detailPage/search_' + func + '_detail',
            'function': func
          }
        });
      }
    },
    created: function () {
      var a = this.$route.params;
      this.searchName = a.sea;
      this.saveSea = a.sea;
      this.isBlur = true;
      if (a.sea) {
        this.seaNaCss.color = '#fff';
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      setTimeout(function () {
        document.getElementById('otherInputId').focus();
      }, 50);
    }
  };
</script>
