/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
    </header>
    <div class="mui-content">
      <div class="list_search not_type">
        <span class="mui-icon mui-icon-glass"></span>
        <input type="text" v-model="searchName" placeholder="商机或客户名称" @focus="inputFocus()">
        <span class="search" @tap="search()">搜索</span>
      </div>
      <div v-if="chance.dataList.length==0" :class="{'list_is_null': chance.dataList.length==0}"></div>
      <div v-show="chance.dataList.length>0">
        <mui-scroll-refresh bottom="0" top="84px">
          <div class="rival_li">
            <ul>
              <li v-for="list in chance.dataList" class="mui-icon"
                  :class="{selected: list.selected, 'crm-check': list.selected}" @tap="chanceSelect($index)">
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
  import store from '../task-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        currentHeader: {
          title: '选择商机'
        },
        chance: store.scroll.chance,
        searchName: ''

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
        var setVal = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            setVal.searchName = result.result;
          }
        });
      },
      search: function () {
        store.param.chance.q = this.searchName;
        store.param.chance.pageNo = 0;
        store.chance();
      },
      chanceSelect: function (index) {
        var self = this;
        var param = self.$route.params.param;
        var arrPram = param.split('_');
        var backData = self.chance.dataList[index];
        store.updateField('chance', backData.chanceName, arrPram[1]);
        store.updateField('chanceId', backData.id, arrPram[1]);
        store.updateField('customerId', backData.customerId, arrPram[1]);
        store.updateField('customer', backData.customerName, arrPram[1]);
        history.go(-1);
      }
    },
    created: function () {
    },
    route: {
      activate: function (transition) {
        this.searchName = '';
        transition.next();
      },
      data: function () {
        store.param.chance = {
          'q': '',
          'orderType': 0,
          'isOwner': 0,
          'stageList': [],
          'statusList': [],
          'startCreatedOn': '',
          'endCreatedOn': '',
          'customerId': '',
          'staffList': [],
          'pageNo': 1,
          'pageSize': 10
        };
        var param = this.$route.params.param;
        var type = 'add';
        if (param.indexOf('_edit') > -1) {
          type = 'edit';
        }
        store.state.chanceSourceType = type;
        store.chance();
      }
    },
    ready: function () {
      mui.init();
    }
  };
</script>
