/* *
 * 搜索 数据中转站
 */
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');

/* 翻页函数*/
var loadNext = {
  'chance': 'chance',
  'customer': 'customer',
  'clue': 'clue',
  'person': 'person'
};
// 定义store, store可以被多个组件引用
export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    functionList: [],
    searchList: [],
    seaList: [],
    otherList: [],
    otherSingleList: []
  },
  scroll: {
    'customer': {
      dataList: [],
      hasMore: true,
      scroll: {}
    },
    'chance': {
      dataList: [],
      hasMore: true,
      scroll: {}
    },
    'clue': {
      dataList: [],
      hasMore: true,
      scroll: {}
    },
    'person': {
      dataList: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    'customer': {
      'q': '',
      'isEncrypt': 0,
      'isSelf': 0,
      'pageNo': 1,
      'pageSize': 10
    },
    'chance': {
      'q': '',
      'isEncrypt': 0,
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
    },
    'clue': {
      'q': '',
      'isEncrypt': 0,
      'type': 0,
      'isSelf': 0,
      'userId': '',
      'staffId': '',
      'pageNo': 1,
      'pageSize': 10
    },
    'person': {
      'q': '',
      'pageNo': 1,
      'pageSize': 10
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
  init: function (type) {
    var self = this;
    var lists = [
      {
        'function': 'cluesManage',
        'name': '线索'
      },
      {
        'function': 'customer',
        'name': '客户'
      },
      {
        'function': 'chance',
        'name': '商机'
      }
    ];
    if (nativeApi.edition === 1) {
      lists = [
        {
          'function': 'customer',
          'name': '客户'
        }
      ];
    }
    var arrLists = [];
    var eleLists = [];
    for (var i = 0; i < lists.length; i++) {
      eleLists.push(lists[i]);
      var num = i + 1;
      if (num % 3 === 0 || num === lists.length) {
        arrLists.push(eleLists);
        eleLists = [];
      }
    }
    self.state.functionList = arrLists;
  },
  confirm: function (searchName) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.search_contact_staff,
      param: {
        'q': searchName || ''
      },
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          var contactList = lists.customerLinkman;
          var staffList = lists.staff;
          var arrLists = [];
          if (staffList.total > 0) {
            arrLists.push({
              'title': '通讯录',
              'fun': 'book',
              'list': staffList.list,
              'total': staffList.total
            });
          }
          if (contactList.total > 0) {
            arrLists.push({
              'title': '联系人',
              'fun': 'contact',
              'list': contactList.list,
              'total': contactList.total
            });
          }
          self.state.searchList = arrLists;
        }
      }
    });
  },
  single: function (index, searchName, cb) {
    var self = this;
    var jsonData = self.state.searchList[index];
    var url = '';
    if (jsonData.fun === 'contact') {
      url = APIS.contact_list;
    }
    nativeApi.initAjax({
      type: 'get',
      url: url,
      param: {
        'q': searchName || ''
      },
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          self.state.seaList = {
            'title': jsonData.title,
            'fun': jsonData.fun,
            'lists': lists
          };
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', function () {
          });
        }
      }
    });
  },
  other: function (searchName, cb) {
    var self = this;
    if (!searchName) {
      self.state.otherList = [];
      return;
    }
    nativeApi.initAjax({
      type: 'get',
      url: APIS.search_function_list,
      param: {
        'q': searchName || '',
        'isEncrypt': 0
      },
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          var dataListst = lists.customer;
          var chanceList = lists.chance;
          var clueList = lists.clue;
          var arrLists = [];
          if (clueList.total > 0) {
            arrLists.push({
              'title': '线索',
              'fun': 'cluesManage',
              'list': clueList.list,
              'total': clueList.total
            });
          }
          if (dataListst.total > 0) {
            arrLists.push({
              'title': '客户',
              'fun': 'customer',
              'list': dataListst.list,
              'total': dataListst.total
            });
          }
          if (chanceList.total > 0) {
            arrLists.push({
              'title': '商机',
              'fun': 'chance',
              'list': chanceList.list,
              'total': chanceList.total
            });
          }
          self.state.otherList = arrLists;
          if (typeof cb === 'function') {
            cb();
          }
        }
      }
    });
  },
  customer: function (loadType) {
    var self = this;
    var obj = 'customer';
    nativeApi.initAjax({
      url: APIS.customer,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            if (self.state.selectId === lists[i].id) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
          }
          if (loadType === 'refresh') {
            self.scroll[obj].hasMore = true;
            self.scroll[obj].dataList = lists;
          } else if (loadType === 'loadMore') {
            self.scroll[obj].dataList = self.scroll[obj].dataList.concat(lists);
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].dataList = lists;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.scroll[obj].dataList = lists;
              /* 当前显示数量*/
              self.state.seaTotal = lists.length;
              self.state.seaTotalAll = result.totalSize;
            }
          }
          if (self.param[obj].pageNo === 1) {
            self.scroll[obj].scroll.scrollTo(0, 0, 100);
          }
          /* 判断是否有下一页*/
          if (lists.length < 10 || self.scroll[obj].dataList.length === result.totalSize) {
            self.scroll[obj].scroll.enablePullupToRefresh();
            self.scroll[obj].hasMore = false;
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          }
          if (loadType === 'loadMore') {
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          } else if (loadType === 'refresh') {
            if (lists.length < 10 || lists.length === result.totalSize) {
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
  chance: function (loadType) {
    var self = this;
    var obj = 'chance';
    nativeApi.initAjax({
      url: APIS.chance_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            if (self.state.selectId === lists[i].id) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
          }
          if (loadType === 'refresh') {
            self.scroll[obj].hasMore = true;
            self.scroll[obj].dataList = lists;
          } else if (loadType === 'loadMore') {
            self.scroll[obj].dataList = self.scroll[obj].dataList.concat(lists);
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].dataList = lists;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.scroll[obj].dataList = lists;
              /* 当前显示数量*/
              self.state.seaTotal = lists.length;
              self.state.seaTotalAll = result.totalSize;
            }
          }
          if (self.param[obj].pageNo === 1) {
            self.scroll[obj].scroll.scrollTo(0, 0, 100);
          }
          /* 判断是否有下一页*/
          if (lists.length < 10 || self.scroll[obj].dataList.length === result.totalSize) {
            self.scroll[obj].scroll.enablePullupToRefresh();
            self.scroll[obj].hasMore = false;
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          }
          if (loadType === 'loadMore') {
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          } else if (loadType === 'refresh') {
            if (lists.length < 10 || lists.length === result.totalSize) {
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
  clue: function (loadType) {
    var self = this;
    var obj = 'clue';
    nativeApi.initAjax({
      'type': 'get',
      url: APIS.myClue,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            if (self.state.selectId === lists[i].id) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
          }
          if (loadType === 'refresh') {
            self.scroll[obj].hasMore = true;
            self.scroll[obj].dataList = lists;
          } else if (loadType === 'loadMore') {
            self.scroll[obj].dataList = self.scroll[obj].dataList.concat(lists);
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].dataList = lists;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.scroll[obj].dataList = lists;
              /* 当前显示数量*/
              self.state.seaTotal = lists.length;
              self.state.seaTotalAll = result.totalSize;
            }
          }
          if (self.param[obj].pageNo === 1) {
            self.scroll[obj].scroll.scrollTo(0, 0, 100);
          }
          /* 判断是否有下一页*/
          if (lists.length < 10 || self.scroll[obj].dataList.length === result.totalSize) {
            self.scroll[obj].scroll.enablePullupToRefresh();
            self.scroll[obj].hasMore = false;
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          }
          if (loadType === 'loadMore') {
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          } else if (loadType === 'refresh') {
            if (lists.length < 10 && lists.length === result.totalSize) {
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
  person: function (loadType) {
    var self = this;
    var obj = 'person';
    nativeApi.initAjax({
      'type': 'get',
      url: APIS.person_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            if (self.state.selectId === lists[i].id) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
          }
          if (loadType === 'refresh') {
            self.scroll[obj].hasMore = true;
            self.scroll[obj].dataList = lists;
          } else if (loadType === 'loadMore') {
            self.scroll[obj].dataList = self.scroll[obj].dataList.concat(lists);
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].dataList = lists;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.scroll[obj].dataList = lists;
              /* 当前显示数量*/
              self.state.seaTotal = lists.length;
              self.state.seaTotalAll = result.totalSize;
            }
          }
          if (self.param[obj].pageNo === 1) {
            self.scroll[obj].scroll.scrollTo(0, 0, 100);
          }
          /* 判断是否有下一页*/
          if (lists.length < 10 || self.scroll[obj].dataList.length === result.totalSize) {
            self.scroll[obj].scroll.enablePullupToRefresh();
            self.scroll[obj].hasMore = false;
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          }
          if (loadType === 'loadMore') {
            self.scroll[obj].scroll.endPullupToRefresh(!self.scroll[obj].hasMore);
          } else if (loadType === 'refresh') {
            if (lists.length < 10 || lists.length === result.totalSize) {
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
  }
};
