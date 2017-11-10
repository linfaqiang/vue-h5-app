/* *
 * @file
 * @author
 */
// 定义store, store可以被多个组件引用
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');

var selectUrl = {
  'reminds': [
    {
      'id': 0,
      'name': '无提醒',
      'value': 0
    },
    {
      'id': 1,
      'name': '正点提醒',
      'value': 0
    },
    {
      'id': 2,
      'name': '提前5分钟',
      'value': 5
    },
    {
      'id': 3,
      'name': '提前10分钟',
      'value': 10
    },
    {
      'id': 4,
      'name': '提前20分钟',
      'value': 20
    },
    {
      'id': 5,
      'name': '提前30分钟',
      'value': 30
    },
    {
      'id': 6,
      'name': '提前一小时',
      'value': 60
    },
    {
      'id': 7,
      'name': '提前一天',
      'value': 3600
    }
  ],
  'remindsBir': [
    {
      'id': 0,
      'name': '无提醒',
      'value': 0
    },
    {
      'id': 1,
      'name': '正点提醒(08:00)',
      'value': 0
    },
    {
      'id': 2,
      'name': '提前5分钟',
      'value': 5
    },
    {
      'id': 3,
      'name': '提前10分钟',
      'value': 10
    },
    {
      'id': 4,
      'name': '提前20分钟',
      'value': 20
    },
    {
      'id': 5,
      'name': '提前30分钟',
      'value': 30
    },
    {
      'id': 6,
      'name': '提前一小时',
      'value': 60
    },
    {
      'id': 7,
      'name': '提前一天',
      'value': 3600
    }
  ],
  'type': APIS.data_wordbook + 'DictTrackType'
};

/* 翻页函数*/
var loadNext = {
  'chance': 'chance',
  'customer': 'customer'
};

export default {
  APIS: APIS,
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    selectList: [],
    addData: {
      'title': '',
      'content': '',
      'type': '',
      'typeId': '',
      'allDay': '',
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
        'address': ''
      },
      'record': '',
      'isAlert': 0,
      'recordId': '',
      'recordSize': '',
      'appendixs': [],
      'remindId': 0,
      'alertMinutes': 0,
      'remindName': ''
    },
    detail: {},
    contactList: [],
    selectId: '',
    addBirData: {
      'title': '',
      'beizhu': '',
      'time': ''
    },
    editData: {
      'address': {
        'address': ''
      }
    },
    editDetail: {
      'isAllDay': 0,
      'isAlert': 0,
      'address': {
        'address': ''
      }

    },
    selectLi: [],
    selectTitle: ''
  },
  scroll: {
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
  haveRender: false,
  cleanAdd: function () {
    for (var attr in this.state.addData) {
      this.state.addData[attr] = '';
    }
    this.state.addData.address = {address: ''};
    this.state.addData.alertMinutes = 0;
    this.state.addData.appendixs = [];
    this.state.addData.isAlert = 0;
    this.state.addData.remindId = 0;
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
  init: function (date) {
    var self = this;
    nativeApi.initAjax({
      url: './json/schedule-' + date + '.json',
      method: 'get',
      param: '',
      callback: function (response) {
        self.state.detail.testList = response.testList;
      }
    });
  },
  scheduleEdit: function (id, type, cb) {
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
            for (var j = 0; j < sounds.length; j++) {
              for (var keys in sounds[j]) {
                appendixs.push({
                  'fId': keys,
                  'type': 'sound',
                  'path': sounds[j][keys]
                });
              }
            }
          }
          detailData.startTime = detailData.startTime.substring(0, 16);
          detailData.endTime = detailData.endTime.substring(0, 16);
          detailData.appendixs = appendixs;
          if (type) {
            self.state.editDetail = {
              'id': id,
              'title': detailData.subject,
              'recordId': detailData.audioSubjectFileId,
              'record': detailData.audioSubjectFileUrl,
              'recordSize': detailData.audioSubjectFileLength,
              'myScheduleDesc': detailData.myScheduleDesc,
              'type': detailData.scheduleType,
              'isAlert': detailData.isAlert,
              'remindName': self.remainText(detailData.alertMinutes),
              'startTime': detailData.startTime,
              'endTime': detailData.endTime,
              'allDay': '',
              'isAllDay': detailData.isAllDay,
              'alertMinutes': detailData.alertMinutes,
              'customer': detailData.customerName,
              'customerId': detailData.customerId,
              'chance': detailData.chanceName,
              'chanceId': detailData.chanceId,
              'contact': detailData.linkman,
              'contactId': detailData.customerLinkmanId,
              'address': detailData.address || {},
              'appendixs': detailData.appendixs
            };
            if (detailData.isAllDay) {
              self.state.editDetail.allDay = detailData.startTime.substring(0, 10);
            }
          } else {
            self.state.editData = detailData;
            self.state.editData.remindName = self.remainText(detailData.alertMinutes);
          }
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert('无数据', '提示');
        }
      }
    });
  },
  remainText: function (val) {
    val = parseInt(val);
    if (val === 60) {
      return '提前一小时';
    } else if (val === 3600) {
      return '提前一天';
    } else {
      return '提前' + val + '分钟';
    }
  },
  selectFn: function (obj, selectId, title, cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: selectUrl[obj],
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.lists;
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
  updateField: function (field, value, type) {
    var self = this;
    if (type === 'add') {
      self.state.addData[field] = value;
    } else if (type === 'edit') {
      self.state.editDetail[field] = value;
    } else if (type === 'search') {
      self.state.searchData[field] = value;
    }
  },
  selectRemind: function (obj, selectId, title) {
    var lists = selectUrl[obj];
    for (var i = 0; i < lists.length; i++) {
      var id = lists[i].id;
      if (id === selectId) {
        lists[i].selected = true;
      } else {
        lists[i].selected = false;
      }
    }
    this.state.selectLi = lists;
    this.state.selectTitle = '选择' + title;
  },
  updateRemind: function (obj, type) {
    var self = this;
    var upType = 'editDetail';
    if (type === 'add') {
      upType = 'addData';
    }
    if (obj.remindName === '无提醒') {
      self.state[upType].isAlert = 0;
    } else {
      self.state[upType].isAlert = 1;
    }

    for (var attr in obj) {
      self.state[upType][attr] = obj[attr];
    }
  },
  saveData: function (opt, success, fail, id) {
    var types;
    var url;
    if (id) {
      types = 'put';
      url = APIS.schedule + '/' + id;
    } else {
      types = 'post';
      url = APIS.schedule;
    }
    nativeApi.initAjax({
      url: url,
      type: types,
      param: opt,
      callback: function (response) {
        if (response.code === 200) {
          success();
        } else {
          fail();
        }

        if (mui.os.android) {
          var postDatas = {
            'subject': opt['subject'],
            'startTime': opt['startTime'],
            'isAllDay': opt['isAllDay'],
            'isAlert': opt['isAlert'],
            'alertMinutes': opt['alertMinutes'],
            'scheduleType': opt['scheduleType']
          };
          kndfunc.remind(JSON.stringify(postDatas));
        }
      }
    });
  },
  setAddChance: function (data) {
    if (this.state.addData.chanceId !== data.id) {
      this.state.addData.contactId = '';
      this.state.addData.contact = '';
    }
    this.state.addData.chanceId = data.id;
    this.state.addData.chance = data.chanceName;
    this.state.addData.customerId = data.customerId;
    this.state.addData.customer = data.customerName;
  },
  setAddCustomer: function (data) {
    if (this.state.addData.customerId !== data.id) {
      this.state.addData.chanceId = '';
      this.state.addData.chance = '';
      this.state.addData.contactId = '';
      this.state.addData.contact = '';
    }
    this.state.addData.customerId = data.id;
    this.state.addData.customer = data.name;
  },
  setEditChance: function (data) {
    if (this.state.editDetail.chanceId !== data.id) {
      this.state.editDetail.contactId = '';
      this.state.editDetail.contact = '';
    }
    this.state.editDetail.chanceId = data.id;
    this.state.editDetail.chance = data.chanceName;
    this.state.editDetail.customerId = data.customerId;
    this.state.editDetail.customer = data.customerName;
  },
  setEditCustomer: function (data) {
    if (this.state.editDetail.customerId !== data.id) {
      this.state.editDetail.chanceId = '';
      this.state.editDetail.chance = '';
      this.state.editDetail.contactId = '';
      this.state.editDetail.contact = '';
    }
    this.state.editDetail.customerId = data.id;
    this.state.editDetail.customer = data.name;
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
          /* 判断是否有下一页*/
          if (lists.length < 10 || self.scroll[obj].dataList === result.totalSize) {
            self.scroll[obj].scroll.enablePullupToRefresh();
            if (self.param[obj].pageNo === 0) {
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
            }
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
          if (lists.length < 10) {
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
    self.param[obj].customerId = self.param[obj].customerId || '';
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
          /* 判断是否有下一页*/
          if (lists.length < 10 || self.scroll[obj].dataList === result.totalSize) {
            self.scroll[obj].scroll.enablePullupToRefresh();
            if (self.param[obj].pageNo === 0) {
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
            }
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
          if (lists.length < 10) {
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
  contact: function (searchName, type) {
    var self = this;
    var saveData = self.state.addData;
    if (type === 'edit') {
      saveData = self.state.editDetail;
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
    for (var m = 0; m < lists.length; m++) {
      lists[m].indexed = lists[m].pinyin.substring(0, 1);
    }
    for (var i = 0; i < lists.length; i++) {
      var conId = lists[i].id || lists[i].linkmanId;
      if (self.state.selectId === conId) {
        lists[i].selected = true;
      } else {
        lists[i].selected = false;
      }
      conLists.push(lists[i]);
    }
    self.state.contactList = conLists;
    self.state.arrIndexed = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
  }
};
