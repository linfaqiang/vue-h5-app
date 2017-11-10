/**
 * @file  工作报告数据中转站
 * @author  hj
 */
// 引入数据请求API
import {APIS} from 'configPort';
var nativeApi = require('nativeApi');

var selectListArr = [
  {
    'itemCode': '0',
    'itemName': '我发起的'
  },
  {
    'itemCode': '1',
    'itemName': '我收到的'
  }
];
var typeListArr = [
  {
    'itemCode': '-1',
    'itemName': '所有'
  },
  {
    'itemCode': '0',
    'itemName': '日报'
  },
  {
    'itemCode': '1',
    'itemName': '周报'
  },
  {
    'itemCode': '2',
    'itemName': '月报'
  }
];

/* 翻页函数*/
var loadNext = {
  'list': 'init',
  'person': 'person'
};

// 定义store, store可以被多个组件引用
export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    workDetail: [],
    selectList: [],
    actData: {},
    addData: {
      'summary': '',
      'plan': '',
      'reportTypeId': '0',
      'reportType': '日报',
      'timeShow': '',
      'startTime': '',
      'endTime': '',
      'status': 0,
      'acceptorIds': '',
      'empCss': {
        width: '0'
      },
      'acceptors': []
    },
    editData: {},
    searchData: {
      'switch': true,
      'start': '',
      'end': '',
      'employeeId': [],
      'employee': '',
      'typeId': '',
      'type': ''
    },
    selectLi: [],
    selectTitle: '',
    formPage: '',
    isLeader: {
      isAjax: false,
      flag: false
    }
  },
  scroll: {
    'list': {
      workList: [],
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
    'list': {
      'reportType': '-1',
      'startStartTime': '',
      'endEndTime': '',
      'isViewMe': 0,
      'staffIdList': [],
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
  init: function (loadType) {
    var self = this;
    var obj = 'list';
    nativeApi.initAjax({
      type: 'post',
      url: APIS.work_report_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data || [];
          if (loadType === 'refresh') {
            self.scroll[obj].workList = lists;
          } else if (loadType === 'loadMore') {
            self.scroll[obj].workList = self.scroll[obj].workList.concat(lists);
          } else {
            if (result.data.length === 0) {
              self.scroll[obj].scroll.disablePullupToRefresh();
              self.scroll[obj].workList = lists;
            } else {
              self.scroll[obj].scroll.enablePullupToRefresh();
              self.scroll[obj].scroll.refresh(true);
              self.scroll[obj].scroll.scrollTo(0, 0, 100);
              /* 列表数据*/
              self.scroll[obj].workList = lists;
            }
          }
          if (self.param[obj].pageNo === 1) {
            self.scroll[obj].scroll.scrollTo(0, 0, 100);
          }
          /* 判断是否有下一页*/
          if (lists.length < 10 || self.scroll[obj].workList.length === result.totalSize) {
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
  search: function (cb) {
    this.param.list.startStartTime = this.state.searchData.start;
    this.param.list.endEndTime = this.state.searchData.end;
    this.param.list.staffIdList = this.state.searchData.employeeId;
    var self = this;
    setTimeout(function () {
      self.listRefresh('list');
    }, 50);
    cb();
  },
  getData: function (selected, cb) {
    var self = this;
    var selectList = selectListArr;
    for (var i = 0; i < selectList.length; i++) {
      if (selectList[i].itemCode === selected) {
        selectList[i].selected = true;
      } else {
        selectList[i].selected = false;
      }
    }
    self.state.selectList = selectList;
    cb();
  },
  getTypeData: function (selected, cb) {
    var self = this;
    var selectList = typeListArr;
    for (var i = 0; i < selectList.length; i++) {
      if (selectList[i].itemCode === selected) {
        selectList[i].selected = true;
      } else {
        selectList[i].selected = false;
      }
    }
    self.state.selectList = selectList;
    cb();
  },
  selectFn: function (obj, selectId, title, type) {
    var self = this;
    var lists = typeListArr;
    var arrLists = [];
    for (var i = 0; i < lists.length; i++) {
      if (!(type === 'add' && lists[i].itemCode === '-1')) {
        var id = lists[i].id || lists[i].itemCode;
        if (id === selectId) {
          lists[i].selected = true;
        } else {
          lists[i].selected = false;
        }
        arrLists.push(lists[i]);
      }
    }
    self.state.selectLi = arrLists;
    self.state.selectTitle = '选择' + title;
  },
  updateField: function (field, value, type) {
    var self = this;
    if (type === 'add') {
      self.state.addData[field] = value;
      if (field === 'reportTypeId') {
        self.state.addData.summary = '';
        value = parseInt(value || 0);
        if (value === 0) {
          self.state.addData.timeShow = this.getDate();
          self.state.addData.startTime = this.getDate();
          self.state.addData.endTime = this.getDate();
          self.getSummaryTxt(this.getDate(), this.getDate(), '0');
        } else if (value === 1) {
          var now = this.getWeekday(0);
          self.state.addData.timeShow = now.start + '~' + now.end + '(第' + self.getWeekNum(now.start, 1) + '周)';
          self.state.addData.startTime = now.start;
          self.state.addData.endTime = now.end;
          self.getSummaryTxt(now.start, now.end, '1');
        } else if (value === 2) {
          var month = this.getDate(1);
          var arr = month.split('-');
          self.state.addData.timeShow = month;
          self.state.addData.startTime = month;
          self.state.addData.endTime = month;
          var lastDate = new Date(parseInt(arr[0]), parseInt(arr[1]), 0).getDate();
          self.getSummaryTxt(month + '-01', month + '-' + lastDate, '2');
        }
      }
    } else if (type === 'edit') {
      self.state.actData[field] = value;
    } else if (type === 'search') {
      self.state.searchData[field] = value;
    }
  },
  getLead: function (cb) {
    var self = this;
    nativeApi.initAjax({
      'type': 'get',
      'url': APIS.get_lead,
      'param': '',
      callback: function (result) {
        if (result && result.code === 200) {
          /* 获取领导*/
          self.state.addData.acceptors = result.data;
          self.setWidth('addData', result.data);
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '数据获取失败', '提示');
        }
      }
    });
  },
  getSummaryTxt: function (start, end, reportType, cb) {
    var self = this;
    setTimeout(function () {
      nativeApi.initAjax({
        type: 'get',
        url: APIS.work_report_detail + start + '/' + end + '/' + reportType,
        callback: function (result) {
          if (result && result.code === 200) {
            self.state.addData.summary = '';
            if (reportType === 2) {
              return;
            }
            var lists = result.data || [];
            var txt = '';
            for (var i = 0; i < lists.length; i++) {
              txt += (i + 1) + '.' + lists[i].subject + ((lists[i].content && lists[i].subject) ? '，' : '') + nativeApi.replaceAllCh(lists[i].content, '1') + '；';
              if (i < (lists.length - 1)) {
                txt += '\n';
              }
            }
            self.state.addData.summary = txt;
            setTimeout(function () {
              var ele = document.getElementById('theAdd').getElementsByTagName('textarea');
              for (var m = 0; m < ele.length; m++) {
                if (ele[m]) {
                  ele[m].setAttribute('style', 'height: ' + ele[i].scrollHeight + 'px;');
                }
              }
            }, 10);
            if (typeof cb === 'function') {
              cb();
            }
          } else {
            var code = result.code || '' + '';
            if (code === '500.2') {
              mui.alert('当前日期已经有报告！', '提示');
            } else {
              mui.alert(result.msg || '数据获取失败！', '提示');
            }
          }
        }
      });
    }, 50);
  },
  detail: function (id, cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.work_report_detail + id,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var dataR = result.data || {};
          var acceptorList = dataR.acceptorList || [];
          dataR.reportType = parseInt(dataR.reportType || 0);
          if (dataR.reportType === 0) {
            dataR.title = dataR.startTime.substring(0, 10) + '日报';
          } else if (dataR.reportType === 1) {
            dataR.title = self.getWeekNum(dataR.startTime) + '周报';
          } else if (dataR.reportType === 2) {
            dataR.title = (new Date(dataR.startTime).getFullYear()) + '-' + (new Date(dataR.startTime).getMonth() + 1) + '月报';
          }
          dataR.acceptors = '';
          for (var i = 0; i < acceptorList.length; i++) {
            dataR.acceptors += acceptorList[i].acceptor;
            if (i < (acceptorList.length - 1)) {
              dataR.acceptors += ';';
            }
          }
          self.state.workDetail = dataR;
          self.state.workDetail.summary = nativeApi.replaceAllCh(self.state.workDetail.summary, 1);
          self.state.workDetail.plan = nativeApi.replaceAllCh(self.state.workDetail.plan, 1);
          self.state.workDetail.commentList = self.disposeData(self.state.workDetail.commentList);
          if (typeof cb === 'function') {
            cb();
          }
          setTimeout(function () {
            var ele = document.getElementsByTagName('textarea');
            for (var m = 0; m < ele.length; m++) {
              if (ele[m]) {
                ele[m].style.height = 'auto';
                ele[m].style.height = (ele[m].scrollHeight + 2) + 'px';
              }
            }
          }, 10);
        }
      }
    });
  },
  cleanAdd: function () {
    var data = this.state.addData;
    for (var key in data) {
      data[key] = '';
    }
    data.reportTypeId = '0';
    data.reportType = '日报';
    data.timeShow = this.getDate();
    data.startTime = this.getDate();
    data.endTime = this.getDate();
    var self = this;
    self.getSummaryTxt(data.startTime, data.endTime, '0', function () {
      self.getLead();
    });
    var arr = data.acceptors;
    var width = document.body.offsetWidth - 80;
    if (arr.length * 48 > width) {
      data.empCss = {
        'width': width + 'px'
      };
    } else {
      data.empCss = {
        'width': arr.length * 48 + 'px'
      };
    }
    this.state.addData = data;
    this.state.formPage = 'add';
  },
  saveAdd: function (status, cb) {
    var self = this;
    var param = self.state.addData;
    var acceptorList = self.state.addData.acceptors || [];
    var acceptorIds = '';
    if (!param.summary) {
      mui.alert('请输入总结！', '提示');
      return;
    }
    if (acceptorList.length === 0) {
      mui.alert('请选择汇报对象！', '提示');
      return;
    }
    for (var i = 0; i < acceptorList.length; i++) {
      acceptorIds += acceptorList[i].id + ',';
    }
    if (acceptorIds.length > 0) {
      acceptorIds = acceptorIds.substring(0, acceptorIds.length - 1);
    }
    var summary = nativeApi.replaceAllCh(param.summary);
    var plan = nativeApi.replaceAllCh(param.plan);
    nativeApi.initAjax({
      type: 'post',
      url: APIS.work_report_add,
      param: {
        'summary': summary,
        'plan': plan,
        'reportType': param.reportTypeId,
        'startTime': param.startTime,
        'endTime': param.endTime,
        'status': status,
        'acceptorIds': acceptorIds
      },
      callback: function (result) {
        if (result && result.code === 200) {
          setTimeout(function () {
            self.listRefresh('list');
          }, 50);
          cb();
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  addEmp: function (lists) {
    var self = this;
    var acceptors = self.state.addData.acceptors || [];
    var arrId = [];
    for (var m = 0; m < acceptors.length; m++) {
      arrId.push(acceptors[m].id);
    }
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].selected && arrId.indexOf(lists[i].id) === -1) {
        acceptors.push(lists[i]);
      }
    }
    self.state.addData.acceptors = acceptors;
    self.setWidth('addData', acceptors);
  },
  editEmp: function (lists) {
    var self = this;
    var acceptors = self.state.editData.emp || [];
    var arrId = [];
    for (var i = 0; i < acceptors.length; i++) {
      arrId.push(acceptors[i].id);
    }
    for (var m = 0; m < lists.length; m++) {
      lists[m].id = parseInt(lists[m].id);
      if (lists[m].selected && arrId.indexOf(lists[m].id) === -1) {
        acceptors.push(lists[m]);
      }
    }
    self.state.editData.emp = acceptors;
    self.setWidth('editData', acceptors);
  },
  setWidth: function (field, acceptors) {
    var self = this;
    var width = document.body.offsetWidth - 70;
    if (acceptors.length * 48 > width) {
      self.state[field].empCss = {
        'width': width + 'px'
      };
    } else {
      var widthH = acceptors.length * 48 ? (acceptors.length * 48 + 10) : 0;
      self.state[field].empCss = {
        'width': widthH + 'px'
      };
    }
  },
  toEdit: function () {
    var self = this;
    var editData = this.state.workDetail;
    var reportType = parseInt(editData.reportType || 0);
    if (reportType === 0) {
      editData.timeShow = editData.startTime.substring(0, 10);
    } else if (reportType === 1) {
      editData.timeShow = editData.startTime + '至' + editData.endTime + '（第' + self.getWeekNum(editData.startTime, 1) + '周）';
    } else {
      var date = new Date(editData.startTime);
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      month = month < 10 ? ('0' + month) : month;
      editData.timeShow = year + '-' + month;
    }
    editData.empCss = {};
    var acceptorList = editData.acceptorList || [];
    var emp = [];
    for (var i = 0; i < acceptorList.length; i++) {
      emp.push({
        'id': parseInt(acceptorList[i].acceptorId),
        'name': acceptorList[i].acceptor,
        'headPhotoUrl': acceptorList[i].acceptorURL
      });
    }
    self.state.editData = {
      'id': editData.id,
      'reportType': editData.reportType,
      'summary': editData.summary,
      'plan': editData.plan,
      'startTime': editData.startTime,
      'endTime': editData.endTime,
      'emp': emp,
      'timeShow': editData.timeShow
    };
    self.state.formPage = 'edit';
    self.setWidth('editData', emp);
    setTimeout(function () {
      var ele = document.getElementById('theEdit').getElementsByTagName('textarea');
      for (var m = 0; m < ele.length; m++) {
        if (ele[m]) {
          ele[m].setAttribute('style', 'height: ' + ele[m].scrollHeight + 'px;');
        }
      }
    }, 10);
  },
  saveEdit: function (status, cb) {
    var self = this;
    var param = self.state.editData;
    var acceptorList = param.emp;
    var acceptorIds = '';
    if (!param.summary) {
      mui.alert('请输入总结！', '提示');
      return;
    }
    for (var i = 0; i < acceptorList.length; i++) {
      acceptorIds += acceptorList[i].id + ',';
    }
    if (acceptorIds.length > 0) {
      acceptorIds = acceptorIds.substring(0, acceptorIds.length - 1);
    }
    var summary = nativeApi.replaceAllCh(param.summary);
    var plan = nativeApi.replaceAllCh(param.plan);
    nativeApi.initAjax({
      type: 'put',
      url: APIS.work_report_add + '/' + param.id,
      param: {
        'summary': summary,
        'plan': plan,
        'reportType': param.reportTypeId,
        'startTime': param.startTime,
        'endTime': param.endTime,
        'status': status,
        'acceptorIds': acceptorIds
      },
      callback: function (result) {
        if (result && result.code === 200) {
          self.detail(param.id, function () {
            cb();
          });
        } else {
          mui.alert(result.msg || '保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  getDate: function (type) {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    day = day < 10 ? ('0' + day) : day;
    month = month < 10 ? ('0' + month) : month;
    if (!type) {
      return year + '-' + month + '-' + day;
    } else {
      return year + '-' + month;
    }
  },
  getWeekday: function (num, date, type) {
    /* 获取上下周的开始日期与结束日期 num(上下几周) type(start|end) 默认从星期一*/
    date = new Date();
    var dayMSec = 24 * 3600 * 1000;
    var today;
    var start;
    var end;
    var self = this;
    today = date.getDay();
    start = date.getTime() - today * dayMSec + dayMSec;
    end = date.getTime() + (7 - today) * dayMSec + dayMSec;

    start += num * 7 * dayMSec;
    end += num * 7 * dayMSec - dayMSec;

    return {
      'start': self.getFormatTime(date, start),
      'end': self.getFormatTime(date, end)
    };
  },
  getFormatTime: function (date, time) {
    date.setTime(time);
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  },
  getWeekList: function () {
    var lists = [];
    var upThree = this.getWeekday(-3);
    var upTwo = this.getWeekday(-2);
    var upOne = this.getWeekday(-1);
    var now = this.getWeekday(0);
    var nextOne = this.getWeekday(1);
    var self = this;
    lists.push({
      value: upThree.start + '~' + upThree.end,
      text: upThree.start + '~' + upThree.end + '(第' + self.getWeekNum(upThree.start, 1) + '周)'
    });
    lists.push({
      value: upTwo.start + '~' + upTwo.end,
      text: upTwo.start + '~' + upTwo.end + '(第' + self.getWeekNum(upTwo.start, 1) + '周)'
    });
    lists.push({
      value: upOne.start + '~' + upOne.end,
      text: upOne.start + '~' + upOne.end + '(第' + self.getWeekNum(upOne.start, 1) + '周)'
    });
    lists.push({
      value: now.start + '~' + now.end,
      text: now.start + '~' + now.end + '(第' + self.getWeekNum(now.start, 1) + '周)'
    });
    lists.push({
      value: nextOne.start + '~' + nextOne.end,
      text: nextOne.start + '~' + nextOne.end + '(第' + self.getWeekNum(nextOne.start, 1) + '周)'
    });
    return lists;
  },
  person: function (loadType) {
    var self = this;
    var obj = 'person';
    var selectList = self.state.addData.acceptors;
    var arrId = [];
    if (self.state.formPage === 'edit') {
      selectList = self.state.editData.emp;
    }
    for (var m = 0; m < selectList.length; m++) {
      arrId.push(parseInt(selectList[m].id));
    }
    nativeApi.initAjax({
      'type': 'get',
      url: APIS.person_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            if (arrId.indexOf(lists[i].id) > -1) {
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
  commentFn: function (content, cb) {
    var self = this;
    nativeApi.initAjax({
      'type': 'post',
      'url': APIS.work_report_comment.replace('{id}', self.state.workDetail.id),
      'param': {
        'content': content
      },
      callback: function (result) {
        if (result && result.code === 200) {
          cb();
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
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
    listData = listData || [];
    var ele = [];
    var yearMonth = '';
    var list = [];
    var bl = false;
    var self = this;
    for (var i = 0; i < listData.length; i++) {
      var dataEle = listData[i];
      var str = dataEle.commentDate.split(' ');
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
  },
  getWeekNum: function (date, type) {
    /* 查询日期为第几周*/
    var totalDays = 0;
    var now = new Date(date) || new Date();
    var years = now.getFullYear();
    if (years < 1000) {
      years += 1900;
    }
    var days = new Array(12);
    days[0] = 31;
    days[2] = 31;
    days[3] = 30;
    days[4] = 31;
    days[5] = 30;
    days[6] = 31;
    days[7] = 31;
    days[8] = 30;
    days[9] = 31;
    days[10] = 30;
    days[11] = 31;

    // 判断是否为闰年，针对2月的天数进行计算
    if (Math.round(now.getFullYear() / 4) === now.getFullYear() / 4) {
      days[1] = 29;
    } else {
      days[1] = 28;
    }

    if (now.getMonth() === 0) {
      totalDays = totalDays + now.getDate();
    } else {
      var curMonth = now.getMonth();
      for (var count = 1; count <= curMonth; count++) {
        totalDays = totalDays + days[count - 1];
      }
      totalDays = totalDays + now.getDate();
    }
    // 得到第几周
    var week = Math.round(totalDays / 7);
    if (!type) {
      return years + '年第' + week + '周';
    } else {
      return week;
    }
  }
};
