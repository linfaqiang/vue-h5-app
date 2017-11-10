/* *
 * @file  消息数据中转站
 * @author  hj
 */
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');

// 定义store, store可以被多个组件引用
export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    messageData: [],
    detailData: {},
    detailTitle: ''
  },
  scroll: {
    list: {
      originalLi: [],
      dataList: [],
      noRead: 0,
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
      'q': '',
      'type': '',
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
    this.init('refresh');
  },
  listLoadMore: function (obj) {
    /* 加载更多*/
    this.param[obj].pageNo++;
    this.init('loadMore');
  },
  // 在store里定义数据状态操作方法，在Vue组件中通过这些方法来更新状态数据
  init: function (loadType) {
    var self = this;
    var obj = 'list';
    if (!self.param.list.type) {
      self.param.list.type = '';
    }
    nativeApi.initAjax({
      'type': 'get',
      'url': APIS.message_list,
      'param': self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          if (loadType !== 'loadMore') {
            self.scroll[obj].noRead = result.noRead || 0;
          }
          if (loadType === 'refresh') {
            self.scroll[obj].hasMore = true;
            self.scroll[obj].originalLi = lists;
            self.scroll[obj].dataList = self.disposeData(lists);
          } else if (loadType === 'loadMore') {
            self.scroll[obj].originalLi = self.scroll[obj].originalLi.concat(lists);
            self.scroll[obj].dataList = self.disposeData(self.scroll[obj].originalLi);
          } else {
            self.scroll[obj].originalLi = lists;
            self.scroll[obj].dataList = self.disposeData(lists);
            if (lists.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
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
  detail: function (data, cb) {
    var self = this;
    self.state.detailData = data;
    if (data.entityType === 'Notice') {
      var id = data.id;
      nativeApi.initAjax({
        'type': 'get',
        'url': APIS.message_notice_detail,
        'param': {
          'id': id
        },
        callback: function (result) {
          if (result && result.code === 200) {
            self.state.detailData.content = result.data.content;
            self.state.detailTitle = '公告';
            cb();
          } else {
            mui.alert(result.msg || '设置为已读失败！', '提示', function () {
            });
          }
        }
      });
    } else {
      self.state.detailTitle = '消息';
      cb();
    }
  },
  setRead: function (data, cb) {
    var id = data.id;
    var self = this;
    nativeApi.initAjax({
      'type': 'put',
      'url': APIS.message_list + '/' + id,
      'param': '',
      callback: function (result) {
        if (result && result.code === 200) {
          data.isRead = 1;
          if (self.scroll.list.noRead > 0) {
            self.scroll.list.noRead--;
          }
          cb();
        } else {
          mui.alert(result.msg || '设置为已读失败！', '提示', function () {
          });
        }
      }
    });
  },
  disposeData: function (listData) {
    var ele = [];
    var yearMonth = '';
    var list = [];
    var bl = false;
    var self = this;
    for (var i = 0; i < listData.length; i++) {
      var dataEle = listData[i];
      var str = dataEle.createdOn.split(' ');
      var strData = str[0];
      dataEle.time = str[1];
      if (strData !== yearMonth) {
        if (bl) {
          var dateTi = yearMonth;
          if (yearMonth === self.getToday()) {
            dateTi = '今天';
          }
          ele.push({
            date: dateTi,
            list: list
          });
          bl = false;
        }
        list = [];
        yearMonth = strData;

        list.push(dataEle);
        bl = true;
      } else {
        list.push(listData[i]);
      }
      if (i === (listData.length - 1)) {
        ele.push({
          date: strData,
          list: list
        });
      }
    }
    return ele;
  },
  getToday: function () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    return year + '-' + ((month < 10) ? ('0' + month) : month) + '-' + ((day < 10) ? ('0' + day) : day);
  }
};
