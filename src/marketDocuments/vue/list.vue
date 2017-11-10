/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <div class="search_d">
        <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="backNative()"></a>
        <input placeholder="标题" v-model="searchName" readonly @tap="toSearch()">
        <span></span>
      </div>
    </header>
    <div class="mui-content">
      <div v-if="testList.conList.length==0" :class="{'list_is_null': testList.conList.length==0}"></div>
      <div v-show="testList.conList.length>0">
          <!--下拉刷新容器-->
          <mui-scroll-refresh bottom="0" top="44px">
            <ul class="analysis-list">
              <li class="list-model" v-for="list in testList.conList" @tap="openAppendix($index)">
                <span class="mui-icon crm-icon-{{list.fileSuffix}}"></span>
                <span class="crm-title" v-text="list.fileName"></span>
                <ul class="innerList">
                  <li class="noPadding" v-text="list.fileSuffix"></li>
                  <li v-text="list.createdOn"></li>
                  <li>{{list.fileSize}}</li>
                  <li class="noBorder"><span class="mui-icon crm-read"></span>{{list.readcount}}次</li>
                </ul>
              </li>
            </ul>
          </mui-scroll-refresh>
        </div>
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
    data: function () {    // 组件的数据格式
      return {
        currentHeader: {
          title: '文件名称',
          name: '编辑头像',
          href: ' ',
          btns: '保存'
        },
        testList: store.scroll.list
      };
    },
    methods: {
      backNative: function () {
        nativeApi.goNative();
      },
      back: function () {
        mui.back();
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
          var readcount = parseInt(self.testList.conList[index].readcount || 0);
          readcount++;
          self.testList.conList[index].readcount = readcount;
        });
      },
      toSearch: function (index) {
        store.scroll.search.searchLi = [];
        this.$router.go('/toSearch');
      }
    },
    //  created 钩子在实例创建后,在reday之前调用
    created: function () {
      // 运行 数据中转站的函数
      store.init();
      console.log(store.state.detail);
    },
    events: {
      pullRefreshReady: function (scroll) {
        store.setScroll('list', scroll);
      },
      pulldown: function (scroll) {
        store.listRefresh('list');
      },
      pullup: function (scroll) {
        store.listLoadMore('list');
      }
    },
    ready: function () {

    }
  };
</script>
