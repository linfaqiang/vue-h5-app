<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">选择人员</h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveConfirm()">确定</a>
    </header>
    <div>
      <div class="list_search not_type">
        <span class="mui-icon mui-icon-glass"></span>
        <input id="personInputId" type="text" v-model="searchName" placeholder="姓名" @focus="inputFocus()">
        <span class="search" @tap="confirm()">搜索</span>
      </div>
      <div v-if="person.dataList.length==0 && saveSea" :class="{'list_is_null': person.dataList.length==0 && saveSea}"
           style="margin-top: 44px;"></div>
      <div v-show="person.dataList.length>0">
        <mui-scroll-refresh bottom="0px" top="84px">
          <div class="person_li">
            <ul>
              <li v-for="list in person.dataList" class="sideline_up"
                  :class="{'sideline_down': $index==(person.dataList.length-1)}" @tap="linkSelect($index)">
                <img :src="list.headPhotoUrl||'../public/images/default_contact.png'"
                     onerror="this.src='../public/images/default_contact.png'">
                <p class="name user">{{list.name}}</p>
                <span v-if="list.selected" class="right mui-icon mui-icon crm-check"></span>
              </li>
            </ul>
          </div>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<script>
  import scrollRefresh from '../../components/mui-scroll-refresh/mui-scroll-refresh.vue';
  import store from './team-store';
  var nativeApi = require('nativeApi');
  export default{
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
        store.listRefresh('person');
      },
      linkSelect: function (index) {
        if (this.person.dataList[index].selected) {
          this.person.dataList[index].selected = false
        } else {
          this.person.dataList[index].selected = true;
        }
      },
      saveConfirm: function () {
        store.teamAdd(function () {
          history.go(-1);
        });
      }
    },
    created: function () {
    },
    route: {
      data: function () {
        this.searchName = '';
        this.saveSea = '';
        store.param.person.q = '';
        store.scroll.person.dataList = [];
        setTimeout(function () {
          document.getElementById('personInputId').focus();
        }, 50);
      }
    },
    ready: function () {
    }
  }
</script>
