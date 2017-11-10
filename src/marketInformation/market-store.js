/**
 * @file  数据中转站
 * @author  zmf
 */
// 引入数据请求API
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');
var loadNext = {
  'list': 'init',
  'search': 'search'
};
// 定义store, store可以被多个组件引用
export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    detail: {
      data: {}
    },
    details: {
      data: {}
    },
    imgData: []    // 有图片的文章前四篇
  },
  scroll: {
    'list': {
      conList: [],
      hasMore: true,
      scroll: {}
    },
    'search': {
      searchLi: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
      'pageNo': '1',
      'pageSize': '10'
    }
  },
  /* 翻页相关*/
  setScroll: function (obj, scroll) {
    this.scroll[obj].scroll = scroll;
  },
  listRefresh: function (obj) {
    /* 刷新*/
    this.param[obj].pageNo = 1;
    this[loadNext[obj]]('refresh');
  },
  listLoadMore: function (obj) {
    /* 加载更多*/
    this.param[obj].pageNo++;
    this[loadNext[obj]]('loadMore');
  },
  // 在store里定义数据状态操作方法，在Vue组件中通过这些方法来更新状态数据
  init: function (loadType) {
    var self = this;
    var obj = 'list';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.manage_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var flag = false;
          for (var i = 0; i < result.data.length; i++) {
            if (!flag) {
              if (result.data[i].picUrl) {
                result.data[i].show = true;
                flag = true;
              }
            }
          }
          var lists = result.data;
          // 取当前列表所有有图片的前四篇文章
          var newArr = [];
          for (var m = 0; m < lists.length; m++) {
            if (newArr.length < 5) {
              if (lists[m].picUrl) {
                newArr.push(lists[m].picUrl);
              }
            }
          }
          self.state.imgData = newArr;
          if (result.totalSize === 0) {
            self.state.nowTotal = 0;
            self.state.totalSize = 0;
            self.scroll[obj].conList = lists;
            self.scroll[obj].scroll.endPulldownToRefresh();
            self.scroll[obj].scroll.endPullupToRefresh(true);
            return;
          }
          if (loadType === 'refresh') {
            self.state.nowTotal = lists.length;
            self.state.totalSize = result.totalSize;
            self.scroll[obj].hasMore = true;
            self.scroll[obj].conList = lists;
            /* 判断是否有下一页*/
            if (lists.length < 10) {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              self.scroll[obj].hasMore = false;
              self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
            }
          } else if (loadType === 'loadMore') {
            self.scroll[obj].conList = self.scroll[obj].conList.concat(lists);
            self.state.nowTotal += lists.length;
            self.state.totalSize = result.totalSize;
            /* 判断是否有下一页*/
            if (self.scroll[obj].conList.length === result.totalSize || lists.length < 10) {
              self.scroll[obj].hasMore = false;
            }
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].conList = lists;
              self.state.nowTotal = 0;
              self.state.totalSize = 0;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.state.nowTotal = lists.length;
              self.state.totalSize = result.totalSize;
              self.scroll[obj].conList = lists;
              /* 判断是否有下一页*/
              if (lists.length < 10) {
                self.scroll[obj].hasMore = false;
                self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
              }
            }
          }
          if (loadType === 'loadMore') {
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          } else if (loadType === 'refresh') {
            if (lists.length < 10) {
              self.scroll[obj].hasMore = false;
              self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
            } else {
              self.scroll[obj].scroll.endPulldownToRefresh();
              self.scroll[obj].scroll.refresh(true);
            }
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  details: function (manageId) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.manage_list + '/' + manageId,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var context = result.data.content;
          result.data.content = context.replace(/\\/g, '');
          self.state.details.data = result.data;
        }
      }
    });
  }
};
