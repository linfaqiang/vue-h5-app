/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>

    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d" :class="{'search_d_h': isBlur}">
        <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
        <input id="searchInputId" type="text" placeholder="{{plh}}" v-model="searchName" @input="inputBlock()"
               @focus="inputFocus()">
        <span></span>
        <a class="mui-btn mui-btn-link mui-pull-right icon-text" @tap="confirm()" :style="seaNaCss">确定</a>
      </div>
    </header>
    <div class="mui-content">
      <div v-if="dataList.searchLi.length==0 && saveSea" class="list_is_null"></div>
      <mui-scroll-refresh bottom="0" top="44px">
        <ul class="analysis-list">
          <li class="list-model" v-for="list in listData.searchLi" @tap="openAppendix($index)">
            <span class="mui-icon crm-icon-{{list.fileSuffix}}"></span>
            <span class="crm-title" v-text="list.fileName"></span>
            <ul class="innerList">
              <li class="noPadding" v-text="list.fileSuffix"></li>
              <li v-text="list.createdOn"></li>
              <li>{{list.fileSize}}kb</li>
              <li class="noBorder"><span class="mui-icon crm-read"></span>{{list.readcount}}次</li>
            </ul>
          </li>
        </ul>
      </mui-scroll-refresh>
    </div>
  </div>
</template>
<script>
  import store from '../market-store';
  import scrollRefresh from '../../public/components/mui-scroll-refresh/mui-scroll-refresh.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'mui-scroll-refresh': scrollRefresh
    },
    data: function () {
      return {
        show: false,
        saveSea: '',
        searchList: store.scroll.search,
        currentHeader: {
          title: '取消',
          name: '文件名称',
          value: ''
        },
        listData: store.scroll.search,
        plh: '搜索',
        searchName: '',
        dataList: store.scroll.search,
        styleObject: {
          background: '#f1f1f1'
        },
        seaNaCss: {
          color: '#a80e16'
        },
        isBlur: true,
        type: ''
      };
    },
    methods: {
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
      confirm: function () {
        var searchName = this.searchName;
        var self = this;
        if (!searchName) {
          mui.alert('文件名不能为空！', '提示', function () {
          });
          return;
        }
        store.param.search.q = searchName;
        store.search();
        self.styleObject.top = '68px';
        self.styleObject.height = (document.body.offsetHeight - 44 - 24) + 'px';
        self.saveSea = searchName;
      },
      search: function () {
        var searchName = this.searchName;
        store.search(searchName);
      },
      clear: function () {
        this.currentHeader.value = '';
        this.show = false;
      },
      back: function () {
        history.go(-1);
        var self = this;
        self.seaNaCss.color = '#a80e16';
        self.saveSea = '';
        self.searchName = '';
      },
      openAppendix: function (index) {
        var id = this.testList.conList[index].id;
        var fileObj = this.testList.conList[index];
        var path = fileObj.fileUrl;
        var size = fileObj.fileSize;
        var self = this;
        var type = fileObj.fileSuffix;
        var str = path.split('/');
        var len = str.length - 1;
        var names = str[len];
        nativeApi.goDownload({
          'apiJson': {
            'endBack': '3',
            'file': {
              'name': names,
              'sha': 'sha',
              'size': size,
              'status': '1',
              'type': type,
              'url': path
            },
            'type': 'OFFICE'
          }
        });
        store.addNum(id, function () {
          var readcount = parseInt(self.listData.searchLi[index].readcount || 0);
          readcount++;
          self.listData.searchLi[index].readcount = readcount;
        });
      }
    },
    route: {
      activate: function (transition) {
        this.searchName = '';
        transition.next();
      }
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
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
