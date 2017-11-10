/**
* @file 搜索
* @author hj
* @date 2016-11-17
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d" :class="{'search_d_h': isBlur}">
        <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
        <input id="searchInputId" type="text" placeholder="{{plh}}" v-model="searchName" @input="inputBlock()"
               @focus="inputFocus()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" :style="seaNaCss" @tap="confirm()">确定</a>
      </div>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="add_fun" v-if="!saveSea">
            <table :style="leftStyle">
              <tr v-for="arrList in search.functionList">
                <td v-for="item in arrList" @tap="otherSingle(item)">
                  <img :src="'../public/images/' + item.function + '.png'"><span>{{item.name}}</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="result_li" v-if="saveSea">
            <div class="list" v-for="list in search.searchList">
              <p class="title">{{list.title}}</p>
              <div v-for="item in list.list" @tap="toDetail(list.fun, item.id)">
                <img :src="item.headPhotoUrl||'../public/images/default_contact.png'">
                <p class="title" v-if="item.name" :class="{con: list.fun=='contact', user: list.fun=='book'}">
                  {{item.name}}<span>{{item.title}}</span></p>
                <p v-if="item.customerName" v-text="item.customerName"></p>
              </div>
              <div @tap="singleMore($index)" v-if="list.total > 3" class="more"><span
                class="mui-icon crm-icon-main"></span>查询更多的{{list.title}}<span class="mui-icon mui-push-right"></span>
              </div>
            </div>
            <div class="bu" @tap="other()">
              <div class="img mui-icon crm-search"></div>
              <p class="title">搜一搜 <span>{{saveSea}}</span></p>
              <p>客户<font v-if="edition!=1">、线索、商机</font></p>
            </div>
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
  import store from '../search-store';
  var nativeApi = require('nativeApi');
  export default {
    components: {},
    data: function () {    // 组件的数据格式
      return {
        search: store.state,
        plh: '姓名/电话',
        searchName: '',
        saveSea: '',
        seaNaCss: {
          color: '#a80e16'
        },
        edition: nativeApi.edition,
        isBlur: true
      };
    },
    methods: {
      backNative: function () {
        nativeApi.goNative();
      },
      inputBlock: function () {
        var self = this;
        if (self.searchName) {
          self.seaNaCss.color = '#fff';
        } else {
          self.seaNaCss.color = '#a80e16';
          self.saveSea = '';
          self.search.searchList = [];
        }
      },
      confirm: function () {
        var self = this;
        var searchName = this.searchName;
        if (!searchName) {
          return;
        }
        self.saveSea = searchName;
        store.confirm(searchName);
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
      singleMore: function (index) {
        var self = this;
        var fun = self.search.searchList[index].fun;
        if (fun === 'book') {
          store.param.person.q = self.saveSea;
          store.param.person.pageNo = 1;
          self.$router.go('/personPage/' + self.saveSea);
          return;
        }
        store.single(index, self.saveSea, function () {
          self.$router.go('/singlePage/' + self.saveSea);
          setTimeout(function () {
            document.getElementById('singleInputId').focus();
          }, 50);
        });
      },
      other: function () {
        var self = this;
        store.other(self.saveSea, function () {
          self.$router.go('/otherPage/' + self.saveSea);
          setTimeout(function () {
            document.getElementById('otherInputId').focus();
          }, 50);
        });
      },
      otherSingle: function (jsonData) {
        var searchName = '280';
        var fun = jsonData.function;
        if (fun === 'cluesManage') {
          fun = 'clue';
        }
        store.param[fun].q = searchName;
        store.param[fun].pageNo = 1;
        this.$router.go('/' + fun + 'Page/' + searchName);
      },
      toDetail: function (func, id) {
        if (func === 'book') {
          nativeApi.checkBook({
            'apiJson': {
              'userId': id
            }
          });
        } else {
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
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.init();
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      setTimeout(function () {
        document.getElementById('searchInputId').focus();
      }, 50);
    }
  };
</script>
