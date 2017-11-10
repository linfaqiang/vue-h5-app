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
        <input id="clueInputId" type="text" placeholder="{{plh}}" v-model="searchName" @input="inputBlock()"
               @focus="inputFocus()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" :style="seaNaCss" @tap="confirm()">确定</a>
      </div>
    </header>
    <div class="mui-content">
      <div v-if="clue.dataList.length==0" :class="{'search_is_not_list': clue.dataList.length==0 && saveSea}"></div>
      <div v-show="clue.dataList.length>0">
        <mui-scroll-refresh bottom="0" top="44px">
          <div class="rival_li">
            <ul>
              <li v-for="list in clue.dataList" class="mui-icon"
                  :class="{selected: list.selected, 'crm-check': list.selected}" @tap="linkDetail(list.id)">
                <p class="name">{{list.customerName}}</p>
                <p>联系方式：{{list.linkmanTelephone}}</p>
                <p>跟进时间：{{list.lastOperated0n}}</p>
              </li>
            </ul>
          </div>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../search-store';
  var nativeApi = require('nativeApi');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        plh: '线索名称',
        clue: store.scroll.clue,
        searchName: '',
        saveSea: '',
        seaNaCss: {
          color: '#a80e16'
        },
        isBlur: true
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('clue', scroll);
      },
      pulldown: function () {
        store.listRefresh('clue');
      },
      pullup: function () {
        store.listLoadMore('clue');
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
          self.saveSea = '';
          self.clue.dataList = [];
        }
      },
      confirm: function () {
        if (!this.searchName) {
          return;
        }
        this.saveSea = this.searchName;
        store.param.clue.q = this.searchName;
        store.param.clue.pageNo = 0;
        store.clue();
      },
      linkDetail: function (id) {
        localStorage.setItem('search_cluesManage_detail', JSON.stringify({
          'id': id
        }));
        nativeApi.goView({
          'apiJson': {
            'urlPort': 'cluesManage/index.html#!/detailPage/search_cluesManage_detail',
            'function': 'cluesManage'
          }
        });
      }
    },
    created: function () {
    },
    route: {
      data: function () {
        var param = this.$route.params.sea;
        if (param && param !== '280') {
          this.searchName = param;
          this.saveSea = param;
          this.seaNaCss.color = '#fff';
          store.clue();
        }
        setTimeout(function () {
          document.getElementById('clueInputId').focus();
        }, 50);
      }
    },
    ready: function () {
      mui.init();
    }
  };
</script>
