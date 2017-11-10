/**
* @file 人员搜索
* @author hj
* @date 2016-11-17
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d" :class="{'search_d_h': isBlur}">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <input id="personInputId" type="text" placeholder="{{plh}}" v-model="searchName" @input="inputBlock()"
               @focus="inputFocus()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right" :style="seaNaCss" @tap="confirm()">确定</a>
      </div>
    </header>
    <div class="mui-content">
      <div v-if="person.dataList.length==0" :class="{'search_is_not_list': person.dataList.length==0 && saveSea}"></div>
      <div v-show="person.dataList.length>0" style="">
        <mui-scroll-refresh bottom="0" top="44px">
          <div class="person_li">
            <ul>
              <li v-for="list in person.dataList" class="sideline_up"
                  :class="{'sideline_down': $index==(person.dataList.length-1)}" @tap="linkDetail(list.id)">
                <img :src="list.headPhotoUrl||'../public/images/default_contact.png'">
                <p class="name user">{{list.name}}</p>
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
        plh: '姓名',
        person: store.scroll.person,
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
        store.setScroll('person', scroll);
      },
      pulldown: function () {
        store.listRefresh('person');
      },
      pullup: function () {
        store.listLoadMore('person');
      }
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      inputBlock: function () {
        var self = this;
        if (self.searchName) {
          self.seaNaCss.color = '#fff';
        } else {
          self.seaNaCss.color = '#a80e16';
          self.saveSea = '';
          self.person.dataList = [];
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
      confirm: function () {
        if (!this.searchName) {
          return;
        }
        this.saveSea = this.searchName;
        store.param.person.q = this.searchName;
        store.param.person.pageNo = 0;
        store.person();
      },
      linkDetail: function (id) {
        nativeApi.checkBook({
          'userId': id
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
          store.person();
        }
        setTimeout(function () {
          document.getElementById('personInputId').focus();
        }, 50);
      }
    },
    ready: function () {
      mui.init();
    }
  };
</script>
