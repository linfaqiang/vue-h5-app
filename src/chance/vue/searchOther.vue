/**
* @file 商机搜索列表
* @author hj
* @date 2016-11-15
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
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content">
      <div v-if="searchTotal.seaTotalAll==0 && saveSea" class="list_is_null"></div>
      <div class="show_total" v-if="searchTotal.seaTotalAll>0">{{searchTotal.seaTotal}}/{{searchTotal.seaTotalAll}}
      </div>
      <div v-show="searchTotal.seaTotalAll>0">
        <mui-scroll-refresh bottom="0" top="68px">
          <div class="list_chance sideline_up sideline_down" v-for="list in searchList.searchLi"
               @tap="toDetail(list.id)">
            <div class="content mui-icon mui-push-right">
              <p class="title">{{list.chanceName}}</p>
              <p>{{list.customerName}}</p>
              <p class="bu"><span class="stage">{{list.stageName}}</span><span>¥{{list.forecastAmount||0}}</span></p>
            </div>
            <div class="label sideline_up">
              <span class="mui-icon mui-icon-start">{{substring(list.createdOn)}}</span>
              <span class="mui-icon mui-icon-emp">{{list.createdName}}</span>
              <span class="mui-icon mui-icon-stage"><span>{{list.statusText}}</span></span>
            </div>
          </div>
        </mui-scroll-refresh>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../chance-store';
  var nativeApi = require('nativeApi');
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  export default{
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        plh: '商机或客户名称',
        searchName: '',
        saveSea: '',
        searchList: store.scroll.search,
        searchTotal: store.state,
        seaNaCss: {
          color: '#a80e16'
        },
        isBlur: true
      };
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('search', scroll);
      },
      pulldown: function () {
        store.listRefresh('search');
      },
      pullup: function () {
        store.listLoadMore('search');
      }
    },
    methods: {
      back: function (index) {
        history.go(-1);
        var self = this;
        self.seaNaCss.color = '#a80e16';
        self.saveSea = '';
        self.searchName = '';
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
      substring: function (date) {
        return date.substring(0, 10);
      },
      confirm: function () {
        var searchName = this.searchName;
        var self = this;
        if (!searchName) {
          mui.alert('机会名称不能为空！', '提示', function () {
          });
          return;
        }
        self.saveSea = searchName;
        store.param.search.q = searchName;
        store.search();
      },
      toDetail: function (id) {
        var self = this;
        store.getDetail(id, function () {
          self.$router.go('/detailPage');
        });
      }
    },
    created: function () {
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      setTimeout(function () {
        document.getElementById('searchInputId').focus();
      }, 50);
    }
  };
</script>
