/**
 * @file  备注
 * @author hj
 */
import Vue from 'vue';
import resource from 'vue-resource';
var nativeApi = require('nativeApi');
import {APIS} from '../../js/config';

Vue.use(resource);

export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    'textNotes': '',
    'entityId': '',
    'entityType': ''
  },
  APIS: APIS,
  scroll: {
    'list': {
      dataList: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    list: {
      'pageNo': 1,
      'pageSize': 10
    }
  },
  cleanNotes: function (val) {
    this.state.textNotes = val ? nativeApi.replaceAllCh(val, 1) : '';
  },
  /* 翻页相关 */
  setScroll: function (obj, scroll) {
    this.scroll[obj].scroll = scroll;
  },
  listRefresh: function (obj) {
    /* 刷新 */
    this.param[obj].pageNo = 1;
    this['notesList']('refresh');
  },
  listLoadMore: function (obj) {
    /* 加载更多 */
    this.param[obj].pageNo++;
    this['notesList']('loadMore');
  },
  // 在store里定义数据状态操作方法，在Vue组件中通过这些方法来更新状态数据
  notesList: function (loadType) {
    var self = this;
    var obj = 'list';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.notes_list.replace('{type}', self.state.entityType).replace('{id}', self.state.entityId),
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          if (loadType === 'refresh') {
            self.scroll[obj].hasMore = true;
            self.scroll[obj].dataList = lists;
          } else if (loadType === 'loadMore') {
            self.scroll[obj].dataList = self.scroll[obj].dataList.concat(lists);
            /* 判断是否有下一页 */
            if (self.scroll[obj].dataList === result.totalSize) {
              self.scroll[obj].hasMore = false;
            }
          } else {
            if (lists.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].dataList = lists;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据 */
              self.scroll[obj].dataList = lists;
            }
          }
          if (self.param[obj].pageNo === 1) {
            self.scroll[obj].scroll.scrollTo(0, 0, 100);
          }
          /* 判断是否有下一页 */
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
  addNotes: function (param, cb) {
    var self = this;
    nativeApi.initAjax({
      'type': 'post',
      'url': APIS.notes_add,
      'param': param,
      callback: function (result) {
        if (result && result.code === 200) {
          self.listRefresh('list');
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  editNotes: function (param, cb) {
    var self = this;
    nativeApi.initAjax({
      'type': 'put',
      'url': APIS.notes_add + '/' + param.id,
      'param': {
        'content': param.content
      },
      callback: function (result) {
        if (result && result.code === 200) {
          self.listRefresh('list');
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  getDateTime: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    return year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day) + ' ' + (hour < 10 ? ('0' + hour) : hour) + ':' + (minutes < 10 ? ('0' + minutes) : minutes);
  }
};
