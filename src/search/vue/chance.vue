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
        <input id="chanceInputId" type="text" placeholder="{{plh}}" v-model="searchName" @input="inputBlock()"
               @focus="inputFocus()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" :style="seaNaCss" @tap="confirm()">确定</a>
      </div>
    </header>
    <div class="mui-content">
      <div v-if="chance.dataList.length==0" :class="{'search_is_not_list': chance.dataList.length==0 && saveSea}"></div>
      <div v-show="chance.dataList.length>0">
        <mui-scroll-refresh bottom="0" top="44px">
          <div class="rival_li">
            <ul>
              <li v-for="list in chance.dataList" class="mui-icon"
                  :class="{selected: list.selected, 'crm-check': list.selected}" @tap="linkDetail(list.id)">
                <p class="name">{{list.chanceName}}</p>
                <p>{{list.customerName}}</p>
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
        plh: '商机名称',
        chance: store.scroll.chance,
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
        store.setScroll('chance', scroll);
      },
      pulldown: function () {
        store.listRefresh('chance');
      },
      pullup: function () {
        store.listLoadMore('chance');
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
      confirm: function () {
        if (!this.searchName) {
          return;
        }
        this.saveSea = this.searchName;
        store.param.chance.q = this.searchName;
        store.param.chance.pageNo = 0;
        store.chance();
      },
      linkDetail: function (id) {
        localStorage.setItem('search_chance_detail', JSON.stringify({
          'id': id
        }));
        nativeApi.goView({
          'apiJson': {
            'urlPort': 'chance/index.html#!/detailPage/search_chance_detail',
            'function': 'chance'
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
          self.chance.dataList = [];
        }
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
          store.listRefresh('chance');
        }
        setTimeout(function () {
          document.getElementById('chanceInputId').focus();
        }, 50);
      }
    },
    ready: function () {
      mui.init();
    }
  };
</script>
