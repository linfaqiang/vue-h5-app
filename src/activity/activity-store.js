/* *
 * 活动 数据中转站
 * 2016-11-14
 * hj
 */
import {APIS} from '../public/js/config';
var nativeApi = require('nativeApi');

var selectListArr = [
  {
    'id': '3',
    'name': '近三天'
  },
  {
    'id': '7',
    'name': '近一周'
  },
  {
    'id': '30',
    'name': '近一个月'
  }
];
var selectUrl = {
  'type': APIS.data_wordbook + 'DictTrackType',
  'feeType': './json/feeType.json'
};

/* 翻页函数*/
var loadNext = {
  'chance': 'chance',
  'customer': 'customer',
  'list': 'init'
};

// 定义store, store可以被多个组件引用
export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  APIS: APIS,
  state: {
    actList: [],
    selectList: [],
    typeList: [],
    actData: {},
    addData: {
      'title': '',
      'recordId': '',
      'record': '',
      'recordSize': '',
      'content': '',
      'type': '',
      'typeId': '',
      'start': '',
      'end': '',
      'feeType': '',
      'feeTypeId': '',
      'money': '',
      'customer': '',
      'customerId': '',
      'chance': '',
      'chanceId': '',
      'contact': '',
      'contactId': '',
      'address': {
        'address': '',
        'country': '',
        'province': '',
        'city': '',
        'adname': '',
        'adcode': '',
        'longitude': '',
        'latitude': ''
      },
      'formOther': 0,
      'appendixs': []
    },
    editData: {},
    contactList: [],
    arrIndexed: [],
    searchData: {
      'switch': false,
      'start': '',
      'end': '',
      'customerId': '',
      'customer': '',
      'chanceId': '',
      'chance': '',
      'employee': '',
      'employeeId': ''
    },
    selectId: '',
    selectLi: [],
    selectTitle: '',
    isLeader: {
      isAjax: false,
      flag: false
    }
  },
  scroll: {
    'list': {
      originalLi: [],
      dataList: [],
      hasMore: true,
      scroll: {}
    },
    'chance': {
      dataList: [],
      hasMore: true,
      scroll: {}
    },
    'customer': {
      dataList: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    'list': {
      'days': '3',
      'activityType': '0',
      'fromDate': '',
      'toDate': '',
      'customerId': '',
      'chanceId': '',
      'staffIdList': [],
      'isSelf': 0,
      'pageNo': 1,
      'pageSize': 10
    },
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
    }
  },
  /* 翻页相关 */
  setScroll: function (obj, scroll) {
    this.scroll[obj].scroll = scroll;
  },
  listRefresh: function (obj) {
    /* 刷新 */
    this.param[obj].pageNo = 1;
    this[loadNext[obj]]('refresh');
  },
  listLoadMore: function (obj) {
    /* 加载更多 */
    this.param[obj].pageNo++;
    this[loadNext[obj]]('loadMore');
  },
  // 在store里定义数据状态操作方法，在Vue组件中通过这些方法来更新状态数据
  init: function (loadType) {
    var self = this;
    var obj = 'list';
    nativeApi.initAjax({
      url: APIS.activity_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
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
            /* 第一页的时候返回最上 */
            self.scroll[obj].scroll.scrollTo(0, 0, 100);
          }
          /* 判断是否有下一页 */
          if (lists.length < 10 || self.scroll[obj].originalLi.length === result.totalSize) {
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
  getDateList: function (selected, cb) {
    var self = this;
    var selectList = selectListArr;
    for (var i = 0; i < selectList.length; i++) {
      if (selectList[i].id === selected) {
        selectList[i].selected = true;
      } else {
        selectList[i].selected = false;
      }
    }
    self.state.selectList = selectList;
    cb();
  },
  getActivityTypeList: function (selected, cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: selectUrl['type'],
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          var arr = [{
            'id': '',
            'name': '所有类型'
          }];
          if (selected === '' || selected === undefined) {
            arr[0].selected = true;
          } else {
            arr[0].selected = false;
          }
          for (var i = 0; i < lists.length; i++) {
            var obj = lists[i];
            if (selected === obj.id) {
              obj.selected = true;
            } else {
              obj.selected = false;
            }
            arr.push(obj);
          }
          self.state.selectList = arr;
          cb();
        }
      }
    });
  },
  detail: function (id, cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.activity_detail + id,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var detailData = result.data;
          var imgs = detailData.picfileObj || {};
          var sounds = detailData.audioFileObj || {};
          var appendixs = [];
          for (var key in imgs) {
            appendixs.push({
              'fId': key,
              'type': 'image',
              'path': imgs[key]
            });
          }
          for (var key1 in sounds) {
            appendixs.push({
              'fId': key1,
              'type': 'sound',
              'path': sounds[key1]
            });
          }
          detailData.appendixs = appendixs;
          detailData.content = nativeApi.replaceAllCh(detailData.content, 1);
          detailData.startTime = detailData.startTime.substring(0, 16);
          detailData.endTime = detailData.endTime.substring(0, 16);
          self.state.actData = detailData;
          if (typeof cb === 'function') {
            cb();
          }
        }
      }
    });
  },
  cleanAdd: function () {
    var data = this.state.addData;
    var param = window.initParam || {};
    for (var key in data) {
      data[key] = '';
    }
    data.start = this.getToday('1', 0);
    data.end = this.getToday('1', 60 * 60 * 1000);
    data.chanceId = param.chanceId || '';
    data.chance = param.chanceName || '';
    data.customerId = param.customerId || '';
    data.customer = param.customerName || '';
    if (param.customerId) {
      if (param.chanceId) {
        data.formOther = 2;
      } else {
        data.formOther = 1;
      }
    }
    this.state.addData = data;
  },
  selectFn: function (obj, selectId, title, cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: selectUrl[obj],
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            var id = lists[i].id || lists[i].itemCode;
            if (id === selectId) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
          }
          self.state.selectLi = lists;
          self.state.selectTitle = '选择' + title;
          if (typeof cb === 'function') {
            cb();
          }
        }
      }
    });
  },
  setAddChance: function (data) {
    if (this.state.addData.chanceId !== data.id) {
      this.state.addData.contactId = 0;
      this.state.addData.contact = '';
    }
    this.state.addData.chanceId = data.id;
    this.state.addData.chance = data.chanceName;
    this.state.addData.customerId = data.customerId;
    this.state.addData.customer = data.customerName;
  },
  setAddCustomer: function (data) {
    if (this.state.addData.customerId !== data.id) {
      this.state.addData.chanceId = 0;
      this.state.addData.chance = '';
      this.state.addData.contactId = 0;
      this.state.addData.contact = '';
    }
    this.state.addData.customerId = data.id;
    this.state.addData.customer = data.name;
  },
  setEditChance: function (data) {
    if (this.state.editData.chanceId !== data.id) {
      this.state.editData.contactId = 0;
      this.state.editData.contact = '';
    }
    this.state.editData.chanceId = data.id;
    this.state.editData.chance = data.chanceName;
    this.state.editData.customerId = data.customerId;
    this.state.editData.customer = data.customerName;
  },
  setEditCustomer: function (data) {
    if (this.state.editData.customerId !== data.id) {
      this.state.editData.chanceId = 0;
      this.state.editData.chance = '';
      this.state.editData.contactId = 0;
      this.state.editData.contact = '';
    }
    this.state.editData.customerId = data.id;
    this.state.editData.customer = data.name;
  },
  updateField: function (field, value, type) {
    var self = this;
    if (type === 'add') {
      self.state.addData[field] = value;
    } else if (type === 'edit') {
      self.state.editData[field] = value;
    } else if (type === 'search') {
      self.state.searchData[field] = value;
    }
  },
  /* 新建活动 */
  saveAdd: function (cb) {
    var self = this;
    var addData = self.state.addData;
    var appendix = addData.appendixs;
    var picFileIds = '';
    var audioFileId = '';
    /* 暂时的验证 */
    if (!(addData.recordId || addData.title)) {
      mui.alert('请输入活动主题！', '提示', function () {
      });
      return;
    }
    if (!addData.typeId) {
      mui.alert('请选择活动类型！', '提示', function () {
      });
      return;
    }
    if (!addData.start) {
      mui.alert('请选择开始时间！', '提示', function () {
      });
      return;
    }
    if (!addData.end) {
      mui.alert('请选择结束时间！', '提示', function () {
      });
      return;
    }
    for (var i = 0; i < appendix.length; i++) {
      if (appendix[i].type === 'image') {
        picFileIds += appendix[i].fId + ',';
      } else if (appendix[i].type === 'sound') {
        audioFileId += appendix[i].fId + ',';
      }
    }
    if (picFileIds.length > 0) {
      picFileIds = picFileIds.substring(0, picFileIds.length - 1);
    }
    if (audioFileId.length > 0) {
      audioFileId = audioFileId.substring(0, audioFileId.length - 1);
    }
    nativeApi.initAjax({
      type: 'post',
      url: APIS.activity_add,
      param: {
        'address': addData.address || {},
        'customerId': addData.customerId || 0,
        'customerLinkmanId': addData.contactId || 0,
        'startTime': addData.start,
        'endTime': addData.end,
        'subject': addData.title,
        'content': nativeApi.replaceAllCh(addData.content),
        'trackTypeId': addData.typeId,
        'costTypeId': '',
        'costs': '',
        'chanceId': addData.chanceId || 0,
        'picFileIds': picFileIds,
        'audioFileIds': audioFileId,
        'audioSubjectFileId': addData.recordId,
        'audioSubjectFileLength': addData.recordSize
      },
      callback: function (result) {
        if (result && result.code === 200) {
          if (!window.initPage) {
            self.listRefresh('list');
          }
          cb();
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  addSchedule: function (id) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.schedule_detail + id,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var detailData = result.data;
          var imgs = detailData.picFileUrlList || [];
          var sounds = detailData.audioFileUrlList || [];
          var appendixs = [];
          if (imgs.length) {
            for (var i = 0; i < imgs.length; i++) {
              for (var key in imgs[i]) {
                appendixs.push({
                  'fId': key,
                  'type': 'image',
                  'path': imgs[i][key]
                });
              }
            }
          }
          if (sounds.length) {
            for (var j = 0; j < imgs.length; j++) {
              for (var keys in sounds[j]) {
                appendixs.push({
                  'fId': keys,
                  'type': 'sound',
                  'path': sounds[j][keys]
                });
              }
            }
          }

          var startTime = detailData.startTime;
          var endTime = detailData.endTime;
          if (startTime) {
            startTime = startTime.substring(0, 16);
          }
          if (endTime) {
            endTime = endTime.substring(0, 16);
          }
          detailData.appendixs = appendixs;
          self.state.addData = {
            'title': detailData.subject,
            'recordId': detailData.audioSubjectFileId,
            'record': detailData.audioSubjectFileUrl,
            'recordSize': detailData.audioSubjectFileLength,
            'content': detailData.myScheduleDesc,
            'type': '',
            'typeId': '',
            'start': startTime,
            'end': endTime,
            'feeType': '',
            'feeTypeId': '',
            'money': '',
            'customer': detailData.customerName,
            'customerId': detailData.customerId,
            'chance': detailData.chanceName,
            'chanceId': detailData.chanceId,
            'contact': detailData.linkman,
            'contactId': detailData.customerLinkmanId,
            'address': detailData.address || {},
            'appendixs': detailData.appendixs
          };
        } else {
          mui.alert(result.msg || '没有获取到数据！', '提示');
        }
      }
    });
  },
  editDetail: function (id) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.activity_detail + id,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var detailData = result.data;
          var imgs = detailData.picfileObj || {};
          var sounds = detailData.audioFileObj || {};
          var appendixs = [];
          for (var key in imgs) {
            appendixs.push({
              'id': key,
              'type': 'image',
              'path': imgs[key]
            });
          }
          for (var key1 in sounds) {
            appendixs.push({
              'id': key1,
              'type': 'sound',
              'path': sounds[key1]
            });
          }
          detailData.appendixs = appendixs;
          self.state.editData = {
            'title': detailData.subject,
            'recordId': detailData.audioSubjectFileId,
            'record': detailData.audioSubjectFileUrl,
            'recordSize': detailData.audioSubjectFileLength,
            'content': nativeApi.replaceAllCh(detailData.content, 1),
            'type': detailData.typeText,
            'typeId': detailData.activityType,
            'start': detailData.startTime,
            'end': detailData.endTime,
            'feeType': '',
            'feeTypeId': '',
            'money': '',
            'customer': detailData.customerName,
            'customerId': detailData.customerId,
            'chance': detailData.chanceName,
            'chanceId': detailData.chanceId,
            'contact': detailData.linkman,
            'contactId': detailData.customerLinkmanId,
            'address': detailData.address || {},
            'appendixs': detailData.appendixs
          };
        }
      }
    });
  },
  toEdit: function (cb) {
    var self = this;
    var detailData = self.state.actData;
    self.state.editData = {
      'title': detailData.subject,
      'recordId': detailData.audioSubjectFileId,
      'record': detailData.audioSubjectFileUrl,
      'recordSize': detailData.audioSubjectFileLength,
      'content': detailData.content,
      'type': detailData.typeText,
      'typeId': detailData.activityType,
      'start': detailData.startTime,
      'end': detailData.endTime,
      'feeType': '',
      'feeTypeId': '',
      'money': '',
      'customer': detailData.customerName,
      'customerId': detailData.customerId,
      'chance': detailData.chanceName,
      'chanceId': detailData.chanceId,
      'contact': detailData.linkman,
      'contactId': detailData.customerLinkmanId,
      'address': detailData.address || {},
      'appendixs': detailData.appendixs,
      'formOther': 0
    };
    if (window.initPage === 'toDetail') {
      if (window.initParam.type === 'chance') {
        self.state.editData.formOther = 2;
      }
      if (window.initParam.type === 'customer') {
        self.state.editData.formOther = 1;
      }
    }
    cb();
  },
  /* 编辑活动 */
  saveEdit: function (cb) {
    var self = this;
    var editData = self.state.editData;
    var appendix = editData.appendixs;
    var picFileIds = '';
    var audioFileId = '';
    /* 暂时的验证 */
    if (!(editData.recordId || editData.title)) {
      mui.alert('请输入活动题！', '提示', function () {
      });
      return;
    }
    if (!editData.typeId) {
      mui.alert('请选择活动类型！', '提示', function () {
      });
      return;
    }
    if (!editData.start) {
      mui.alert('请选择开始时间！', '提示', function () {
      });
      return;
    }
    if (!editData.end) {
      mui.alert('请选择结束时间！', '提示', function () {
      });
      return;
    }
    for (var i = 0; i < appendix.length; i++) {
      if (appendix[i].type === 'image') {
        picFileIds += appendix[i].fId + ',';
      } else if (appendix[i].type === 'sound') {
        audioFileId += appendix[i].fId + ',';
      }
    }
    if (picFileIds.length > 0) {
      picFileIds = picFileIds.substring(0, picFileIds.length - 1);
    }
    if (audioFileId.length > 0) {
      audioFileId = audioFileId.substring(0, audioFileId.length - 1);
    }
    nativeApi.initAjax({
      type: 'put',
      url: APIS.activity_add + '/' + (self.state.actData.id || window.initParam.id),
      param: {
        'address': editData.address || {},
        'customerId': editData.customerId || 0,
        'customerLinkmanId': editData.contactId || 0,
        'startTime': editData.start,
        'endTime': editData.end,
        'subject': editData.title,
        'content': nativeApi.replaceAllCh(editData.content),
        'trackTypeId': editData.typeId,
        'costTypeId': '',
        'costs': '',
        'chanceId': editData.chanceId || 0,
        'picFileIds': picFileIds,
        'audioFileIds': audioFileId,
        'audioSubjectFileId': editData.recordId,
        'audioSubjectFileLength': editData.recordSize
      },
      callback: function (result) {
        if (result && result.code === 200) {
          if (!window.initPage || window.initPage === 'toDetail') {
            self.detail(self.state.actData.id, function () {
              if (!window.initPage) {
                /* 刷新列表 */
                self.listRefresh('list');
              }
              cb();
            });
          }
          if (window.initPage === 'toEdit') {
            cb();
          }
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
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
              /* 列表数据 */
              self.scroll[obj].dataList = lists;
              /* 当前显示数量 */
              self.state.seaTotal = lists.length;
              self.state.seaTotalAll = result.totalSize;
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
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
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
              /* 列表数据 */
              self.scroll[obj].dataList = lists;
              /* 当前显示数量 */
              self.state.seaTotal = lists.length;
              self.state.seaTotalAll = result.totalSize;
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
  contact: function (searchName, type) {
    var self = this;
    var saveData = self.state.addData;
    if (type === 'edit') {
      saveData = self.state.editData;
    }
    var chanceId = saveData.chanceId || '';
    var customerId = saveData.customerId || '';
    var url = '';
    if (customerId) {
      if (chanceId) {
        url = APIS.chance_contact.replace('{id}', chanceId);
      } else {
        url = APIS.customer_contact.replace('{id}', customerId);
      }
    }
    nativeApi.initAjax({
      type: 'get',
      url: url,
      param: {
        'q': searchName || ''
      },
      callback: function (result) {
        if (result && result.code === 200) {
          self.disposeDataCon(result.data || []);
        } else {
          mui.alert(result.msg || '添加联系人失败！', '提示', function () {
          });
        }
      }
    });
  },
  disposeDataCon: function (result) {
    var lists = result;
    var conLists = [];
    var self = this;
    for (var i = 0; i < lists.length; i++) {
      lists[i].indexed = lists[i].pinyin.substring(0, 1);
    }
    for (var m = 0; m < lists.length; m++) {
      var conId = lists[m].id || lists[m].linkmanId;
      if (self.state.selectId === conId) {
        lists[m].selected = true;
      } else {
        lists[m].selected = false;
      }
      conLists.push(lists[m]);
    }
    self.state.contactList = conLists;
    self.state.arrIndexed = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
  },
  getIfLeader: function (cb) {
    var self = this;
    if (!self.state.isLeader.isAjax) {
      nativeApi.initAjax({
        'type': 'get',
        'url': APIS.is_leader,
        callback: function (result) {
          if (result && result.code === 200) {
            self.state.isLeader.isAjax = true;
            self.state.isLeader.flag = result.data.isLeader;
            if (typeof cb === 'function') {
              cb();
            }
          } else {
            mui.alert(result.msg || '数据获取失败！', '提示', function () {
            });
          }
        }
      });
    } else {
      if (typeof cb === 'function') {
        cb();
      }
    }
  },
  disposeData: function (listData) {
    var ele = [];
    var yearMonth = '';
    var list = [];
    var bl = false;
    var self = this;
    for (var i = 0; i < listData.length; i++) {
      var dataEle = listData[i];
      var str = dataEle.startTime.split(' ');
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
  getToday: function (ty, num) {
    var now = new Date(new Date().getTime() + num || 0);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if (ty) {
      var hour = now.getHours();
      var minutes = now.getMinutes();
      return year + '-' + ((month < 10) ? ('0' + month) : month) + '-' + ((day < 10) ? ('0' + day) : day) + ' ' + ((hour < 10) ? ('0' + hour) : hour) + ':' + ((minutes < 10) ? ('0' + minutes) : minutes);
    } else {
      return year + '-' + ((month < 10) ? ('0' + month) : month) + '-' + ((day < 10) ? ('0' + day) : day);
    }
  }
};
