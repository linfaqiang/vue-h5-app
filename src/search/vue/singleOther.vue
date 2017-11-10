/**
* @file
* @author hj
* @date 2016-11-17
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d" :class="{'search_d_h': isBlur}">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <input id="singleOtherInputId" type="text" placeholder="{{plh}}" @input="inputBlock()" v-model="searchName"
               @focus="inputFocus()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" :style="seaNaCss" @tap="confirm()">确定</a>
      </div>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;"
           :class="{'search_is_not_list': otherSingle.otherSingleList.lists.length==0&&saveSea}">
        <div class="mui-scroll">
          <div class="result_li">
            <div class="list" v-if="otherSingle.otherSingleList.lists.length > 0">
              <p class="title">{{otherSingle.otherSingleList.title}}</p>
              <div class="other" v-for="list in otherSingle.otherSingleList.lists"
                   @tap="toDetail(otherSingle.otherSingleList.fun, list.id)">
                <p class="title">{{list.name}}</p>
                <p>{{list.description}}</p>
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
    components: {},
    data: function () {
      return {
        plh: '搜索',
        searchName: '',
        saveSea: '',
        seaNaCss: {
          color: '#a80e16'
        },
        otherSingle: store.state,
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
        if (!searchName) {
          return;
        }
        self.saveSea = searchName;
        store.otherSingleConfirm(this.otherSingle.otherSingleList.fun, searchName);
      },
      toDetail: function (func, id) {
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
      var sea = this.$route.params.sea;
      if (sea === 0) {
        sea = '';
      }
      this.searchName = sea;
      this.saveSea = sea;
      this.isBlur = true;
      if (sea) {
        this.seaNaCss.color = '#fff';
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      setTimeout(function () {
        document.getElementById('singleOtherInputId').focus();
      }, 50);
    }
  };
</script>
