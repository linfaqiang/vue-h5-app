/**
 * @file 客户数据中转站
 * @author mahuanhuan
 */

import {APIS} from 'configPort';
var nativeApi = require('nativeApi');
var loadNext = {
  'list': 'init',
  'search': 'search',
  'lists': 'lists',
  'follows': 'follows'
};
export default {
  state: {
    // 选择客户等级和行业类别
    getChooce: {
      data: [],
      grade: '',
      sectors: '',
      gradeId: '',
      sectorsId: ''
    },
    images: [],
    searchList: [],
    testList: {},
    data: {
      conList: {}
    },
    listData: {},
    getContacts: {
      data: {}
    },
    isFollow: {
      data: ''
    },
    classifyTitle: '',
    show: false
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
    },
    'lists': {
      conList: [],
      hasMore: true,
      scroll: {}
    },
    'follows': {
      conList: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
      'pageNo': '1',
      'pageSize': '10'
    },
    lists: {
      'pageNo': '1',
      'pageSize': '10',
      'productTypeId': ''
    },
    follows: {
      'pageNo': '1',
      'pageSize': '10'
    },
    search: {
      'pageNo': '1',
      'pageSize': '10',
      'q': ''
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
      url: APIS.product_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
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
  follows: function (loadType) {
    var self = this;
    var obj = 'follows';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.product_follows,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          if (result && result.code === 200) {
            var lists = result.data;
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
      }
    });
  },
  toFollow: function (cb) {
    var productId = this.state.testList.id;
    nativeApi.initAjax({
      type: 'post',
      url: APIS.product_follows,
      param: {'productId': productId},
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '关注失败！', '提示', function () {
          });
        }
      }
    });
  },
  deleteFollow: function (cb) {
    var productId = this.state.testList.id;
    nativeApi.initAjax({
      type: 'DELETE',
      url: APIS.product_follows + '?productId=' + productId,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '取消关注失败！', '提示', function () {
          });
        }
      }
    });
  },
  classify: function () {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.data_wordbook + 'DictProductType',
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.listData = result.data;
        }
      }
    });
  },
  search: function (searchName) {
    if (!searchName) {
      mui.alert('请输入标题', '提示');
      return;
    }
    this.param.search.q = searchName;
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.product_list,
      param: self.param.search,
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          var conLists = [];
          for (var i = 0; i < lists.length; i++) {
            if (lists[i].productName.indexOf(searchName) > -1) {
              conLists.push(lists[i]);
            }
          }
          self.state.searchList = conLists;
        }
      }
    });
  },
  lists: function (loadType) {
    var self = this;
    var obj = 'lists';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.product_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          if (result && result.code === 200) {
            var lists = result.data;
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
      }
    });
  },
  // 详情
  getDedail: function (productId, cb) {
    var This = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.product_list + '/' + productId,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          This.state.testList = result.data;
          This.state.images = result.data.picUrls;
          for (var i = 0; i < This.state.images.length; i++) {
            This.state.images[i] = This.state.images[i].replace('_t', '');
          }
          This.state.isFollow.data = result.data.isFollow === '1' ? 'crm-icon-collects' : 'crm-icon-collect';
          if (typeof cb === 'function') {
            cb();
          }
        }
      }
    });
  },
  updateClassifyTitle: function (title) {
    this.state.classifyTitle = title;
  }
};
