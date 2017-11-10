/* *
 * @file  数据中转站
 * @author  阿紫
 */
//   引入数据请求API
var nativeApi = require('nativeApi');
import {APIS} from 'configPort';
var loadNext = {
  'list': 'init',
  'search': 'search',
  'chance': 'chance',
  'customer': 'customer',
  'person': 'person'
};
var selectListArr = [
  {
    'itemCode': '0',
    'itemName': '我收到的'
  },
  {
    'itemCode': '1',
    'itemName': '我发起的'
  }
];
var criticalArr = [
  {
    'itemCode': '0',
    'itemName': '一般'
  },
  {
    'itemCode': '1',
    'itemName': '较急！'
  }, {
    'itemCode': '2',
    'itemName': '紧急！!'
  }, {
    'itemCode': '3',
    'itemName': '非常紧急！！！'
  }
];

//   定义store, store可以被多个组件引用
export default {
  APIS: APIS,
  //   每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    isB: false,
    btnType: '',
    nowTotal: 0,
    totalSize: 0,
    actList: [],
    selectList: [],
    typeList: [],
    actData: {},
    selectId: '',
    actDatas: {
      data: {}
    },
    detData: {},
    typeNum: '0',
    getClueDetail: {
      data: {
        testList: [{
          name: '任务名称',
          key: 'subject',
          vocSubject: '',
          vocLength: '',
          ok: true,
          value: ''
        }, {
          name: '开始时间',
          key: 'startTime',
          value: ''
        }, {
          name: '结束时间',
          key: 'endTime',
          value: ''
        }, {
          icon: '',
          name: '客户名称',
          key: 'customerName',
          activeColor: '',
          href: '',
          value: ''
        }, {
          icon: '',
          name: '联系人',
          key: 'linkmanName',
          ok: true,
          isB: true,
          value: ''
        }, {
          name: '商机',
          key: 'chanceName',
          isB: true,
          value: ''
        }, {
          name: '优先级',
          key: 'priorityLevelText',
          isB: true,
          value: ''
        }, {
          name: '执行人',
          key: 'executors',
          isB: true,
          value: ''
        }, {
          name: '备注',
          key: 'description',
          isB: true,
          value: ''
        }]
      }
    },
    chooseArr: [
      {
        'text': '无',
        'select': '',
        'border': '',
        'priorityLevel': '0'
      },
      {
        'text': '!',
        'select': '',
        'border': '',
        'priorityLevel': '1'
      },
      {
        'text': '!!',
        'select': '',
        'border': '',
        'priorityLevel': '2'
      },
      {
        'text': '!!!',
        'select': '',
        'border': 'noBorder',
        'priorityLevel': '3'
      }
    ],
    addData: {
      'text': '',
      'textareaVal': '',
      'recordId': '',
      'recordTime': '',
      'recordPath': '',
      'title': '',
      'content': '',
      'type': '',
      'typeId': '',
      'start': '',
      'end': '',
      'priorityLevel': '',
      'feeType': '',
      'feeTypeId': '',
      'money': '',
      'customer': '',
      'customerId': '',
      'chance': '',
      'chanceId': '',
      'contact': '',
      'contactId': '',
      'address': '',
      'appendixs': [],
      'acceptors': [],
      'saleTeam': [],
      'cssSheet': '',
      'addressVO': {
        'address': '',
        'country': '中国',
        'province': '',
        'city': '',
        'adname': '',
        'adcode': '',
        'longitude': '',
        'latitude': ''
      },
      'formOther': 0,
      'sourceId': '',
      'source': '',
      'fromEntityType': ''
    },
    editData: {},
    searchData: {
      'switch': true,
      'start': '',
      'end': '',
      'customerId': '',
      'customer': '',
      'chanceId': '',
      'chance': ''
    },
    mission: {
      'id': '',
      'userName': '',
      'statuText': '',
      'resultDesc': '',
      'status': ''
    },
    contactList: [],
    ClueTransfer: {
      data: {}
    },
    selectLi: [],
    selectTitle: '',
    executeList: {
      data: []
    },
    detailData: {},
    formPage: '',
    chanceSourceType: ''
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
    'chance': {
      dataList: [],
      hasMore: true,
      scroll: {}
    },
    'customer': {
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
    'list': {
      'pageNo': '1',
      'pageSize': '10',
      'type': '0',
      'status': '-1',
      'priorityLevel': '-1'
    },
    'result': {
      'saleTaskId': '',
      'status': ''
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
  //   在store里定义数据状态操作方法，在Vue组件中通过这些方法来更新状态数据
  init: function (loadType) {
    var self = this;
    var obj = 'list';
    nativeApi.initAjax({
      type: 'get',
      url: APIS.task_list,
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
  postAddData: function (fn) {
    var self = this;
    var appendix = self.state.addData.appendixs;
    var picFileIds = '';
    var audioFileId = '';
    if (!(self.state.addData.text || self.state.addData.recordId)) {
      mui.alert('请输入任务主题！', '提示', function () {
      });
      return;
    }
    if (!(self.state.addData.end)) {
      mui.alert('请输入结束时间！', '提示', function () {
      });
      return;
    }
    if (self.state.addData.acceptors.length === 0) {
      mui.alert('请选择执行人！', '提示', function () {
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
    self.state.addData.saleTeam = [];
    for (var m = 0; m < self.state.addData.acceptors.length; m++) {
      self.state.addData.saleTeam.push({
        'staffId': self.state.addData.acceptors[m].id,
        'isOwner': 0
      });
    }
    self.state.addData.textareaVal = nativeApi.replaceAllCh(self.state.addData.textareaVal);
    nativeApi.initAjax({
      type: 'post',
      url: APIS.task_list,
      param: {
        'addressVO': self.state.addData.addressVO || {},
        'subject': self.state.addData.text,
        'description': self.state.addData.textareaVal,
        'startTime': self.state.addData.start,
        'endTime': self.state.addData.end,
        'priorityLevel': self.state.addData.priorityLevel || 0,
        'picFileIds': picFileIds, //  图片ID
        'audioFileIds': audioFileId, //  音频ID
        'audioSubjectFileId': self.state.addData.recordId || 0,
        'audioSubjectFileLength': self.state.addData.recordTime || 0,
        'customerLinkmanId': self.state.addData.contactId, //  联系人ID
        'chanceId': self.state.addData.chanceId, //  商机ID
        'customerId': self.state.addData.customerId, //  客户ID
        'saleTeam': self.state.addData.saleTeam || [],
        'sourceId': self.state.addData.sourceId,
        'fromEntityType': self.state.addData.fromEntityType
      },
      callback: function (result) {
        if (result && result.code === 200) {
          mui.alert('保存成功', '提示', function () {
            fn();
          });
        } else {
          mui.alert('保存失败', '提示');
        }
      }
    });
  },
  getDateList: function (selected, cb) {
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
  getActivityTypeList: function (selected, cb) {
    var lists = [
      {
        'itemCode': 0,
        'itemName': '未开始'
      },
      {
        'itemCode': 1,
        'itemName': '进行中'
      },
      {
        'itemCode': 2,
        'itemName': '已完成'
      }
    ];
    var ar = [{
      'itemCode': -1,
      'itemName': '所有'
    }];
    if (selected === '' || selected === undefined) {
      ar[0].selected = true;
    } else {
      ar[0].selected = false;
    }
    for (var i = 0; i < lists.length; i++) {
      var obj = lists[i];
      if (selected === obj.itemCode) {
        obj.selected = true;
      } else {
        obj.selected = false;
      }
      ar.push(obj);
    }
    this.state.selectList = ar;
    cb();
  },
  getCritica: function (selected, cb) {
    var self = this;
    var selectList = criticalArr;
    var arr = [{
      'itemCode': '-1',
      'itemName': '所有'
    }];
    if (selected === '' || selected === undefined) {
      arr[0].selected = true;
    } else {
      arr[0].selected = false;
    }
    for (var i = 0; i < selectList.length; i++) {
      var obj = selectList[i];
      if (selected === obj.itemCode) {
        obj.selected = true;
      } else {
        obj.selected = false;
      }
      arr.push(obj);
    }
    self.state.selectList = arr;
    cb();
  },
  taskResultIng: function (id) {
    this.param.result.saleTaskId = id;
    this.param.result.status = '1';
    var self = this;
    nativeApi.initAjax({
      type: 'post',
      url: APIS.task_result,
      param: self.param.result,
      callback: function (result) {

      }
    });
  },
  taskResultEnd: function (id) {
    this.param.result.saleTaskId = id;
    this.param.result.status = '2';
    var self = this;
    nativeApi.initAjax({
      type: 'post',
      url: APIS.task_result,
      param: self.param.result,
      callback: function (result) {

      }
    });
  },
  person: function (loadType) {
    var self = this;
    var obj = 'person';
    var selectList = self.state.addData.acceptors;
    var arrId = [];
    if (self.state.formPage === 'editData') {
      selectList = self.state.editData.acceptors;
    }
    for (var m = 0; m < selectList.length; m++) {
      arrId.push(selectList[m].id);
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
    var acceptors = self.state.editData.acceptors || [];
    var arrId = [];
    for (var m = 0; m < acceptors.length; m++) {
      arrId.push(acceptors[m].id);
    }
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].selected && arrId.indexOf(lists[i].id) === -1) {
        acceptors.push(lists[i]);
      }
    }
    console.log(acceptors);
    self.state.editData.acceptors = acceptors;
    self.setWidth('editData', acceptors);
  },
  setWidth: function (field, acceptors) {
    var self = this;
    var width = document.body.offsetWidth - 70;
    if (acceptors.length * 48 > width) {
      self.state[field].cssSheet = {
        'width': width + 'px'
      };
    } else {
      var widthH = acceptors.length * 48 ? (acceptors.length * 48 + 10) : 0;
      self.state[field].cssSheet = {
        'width': widthH + 'px'
      };
    }
    console.log(self.state[field].cssSheet);
  },
  transferClue: function (formData, lists) {
    var self = this;
    var width = document.body.offsetWidth - 80;
    if (formData === 'addData') {
      self.state[formData].acceptors = [];
      self.state[formData].acceptors.push({
        'name': window.loginInfo.userName,
        'headPhotoUrl': window.loginInfo.imageAddress,
        'id': window.loginInfo.staffId
      });
      self.state[formData].saleTeam.push({
        'staffId': window.loginInfo.staffId,
        'isOwner': 1
      });
      for (var i = 1; i < self.state[formData].acceptors.length; i++) {
        if (self.state[formData].acceptors[i].id !== self.state[formData].acceptors[0].id) {
          self.state[formData].saleTeam.push({
            'staffId': self.state[formData].acceptors[i].id,
            'isOwner': 0
          });
        }
      }
    } else if (formData === 'editData') {
      self.state[formData].acceptors = self.state[formData].acceptors.concat(lists);
      for (var m = 1; m < self.state[formData].acceptors.length; m++) {
        self.state[formData].saleTeam.push({
          'staffId': self.state[formData].acceptors[m].id,
          'isOwner': 0
        });
      }
    }
    if (self.state[formData].acceptors.length * 48 > width) {
      self.state[formData].cssSheet = {
        'width': width + 'px'
      };
    } else {
      self.state[formData].cssSheet = {
        'width': self.state[formData].acceptors.length * 48 + 'px'
      };
    }
  },
  cleanAdd: function () {
    var data = this.state.addData;
    var self = this;
    for (var key in data) {
      data[key] = '';
    }
    self.state.addData.start = self.getToday('1', 0);
    self.state.addData.end = self.getToday('1', 60 * 60 * 1000);
    self.state.addData.appendixs = [];
    self.state.addData.saleTeam = [];
    self.state.addData.addressVO = {};
    self.state.addData.acceptors = [];
    if (window.initParam) {
      self.state.addData.customer = window.initParam.customerName;
      self.state.addData.customerId = window.initParam.customerId;
      self.state.addData.chance = window.initParam.chanceName;
      self.state.addData.chanceId = window.initParam.chanceId;
      if (window.initParam.customerId) {
        if (window.initParam.chanceId) {
          self.state.addData.formOther = 2;
        } else {
          self.state.addData.formOther = 1;
        }
      }
    }

    self.state.addData.acceptors = [];
    self.state.addData.cssSheet = {
      'width': '0'
    };
    self.state.formPage = 'addData';
  },
  toDelete: function (id, fn) {
    var btnArray = ['取消', '确定'];
    var self = this;
    console.log('=======' + self.state.detData.id);
    mui.confirm('是否删除任务！', '提示', btnArray, function (e) {
      if (e.index === 1) {
        id = id || self.state.detData.id;
        nativeApi.initAjax({
          type: 'delete',
          url: APIS.task_list + '/' + id,
          param: '',
          callback: function (result) {
            if (result && result.code === 200) {
              fn();
            } else {
              mui.alert('刪除失敗！', '提示');
            }
          }
        });
      } else {
        return;
      }
    });
  },
  mattersDetail: function (id) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.task_result + '/' + id,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.detailData = result.data;
        }
      }
    });
  },
  missionSava: function () {
    var self = this;
    self.state.mission.resultDesc = nativeApi.replaceAllCh(self.state.mission.resultDesc);
    nativeApi.initAjax({
      type: 'post',
      url: APIS.task_result,
      param: {
        'saleTaskId': self.state.detData.id,
        'status': self.state.mission.status,
        'resultDesc': self.state.mission.resultDesc
      },
      callback: function (result) {
        if (result && result.code === 200) {
          mui.alert('保存成功', '提示', function () {
            self.getCustomerDedail();
            history.go(-1);
          });
        } else {
          mui.alert('保存失败', '提示');
        }
      }
    });
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
  getCustomerDedail: function (id, cb) {
    var This = this;
    id = id || This.state.detData.id;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.task_list + '/' + id,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          This.state.detData = result.data;
          result.data.executeList.resultDesc = nativeApi.replaceAllCh(result.data.executeList.resultDesc, 1);
          This.state.executeList.data = result.data.executeList;
          This.state.btnType = result.data.btnType;
          This.state.getClueDetail.data.testList[0].vocSubject = result.data.audioSubjectFileUrl;
          This.state.getClueDetail.data.testList[0].vocLength = result.data.audioSubjectFileLength;
          result.data.description = nativeApi.replaceAllCh(result.data.description, 1);

          var executorList = result.data.executorList || [];
          var executors = '';
          for (var m = 0; m < executorList.length; m++) {
            executors += executorList[m].name + '；';
          }
          result.data.executors = executors;
          var chanceNum = 0;
          for (var i = 0; i < This.state.getClueDetail.data.testList.length; i++) {
            This.state.getClueDetail.data.testList[i].value = result.data[This.state.getClueDetail.data.testList[i].key];
            if (This.state.getClueDetail.data.testList[i].key === 'chanceName') {
              chanceNum = i;
            }
          }
          if (nativeApi.edition === 1) {
            This.state.getClueDetail.data.testList[chanceNum].showHide = true;
          } else {
            This.state.getClueDetail.data.testList[chanceNum].showHide = false;
          }
          var detailData = result.data;
          var imgs = detailData.picFileUrlList || [];
          var sounds = detailData.audioFileUrlList || [];
          var soundsId = detailData.audioFileIds || '';
          var soundsIds = soundsId.split(',');
          var imgsId = detailData.picFileIds || '';
          var imgsIds = imgsId.split(',');
          var appendixs = [];
          if (imgs.length > 0) {
            for (var key = 0; key < imgs.length; key++) {
              appendixs.push({
                'fId': imgsIds[key],
                'type': 'image',
                'path': imgs[key]
              });
            }
          }
          if (sounds.length > 0) {
            for (var key1 = 0; key1 < sounds.length; key1++) {
              appendixs.push({
                'fId': soundsIds[key1],
                'type': 'sound',
                'path': sounds[key1]
              });
            }
          }
          detailData.appendixs = appendixs;
          detailData.startTime = detailData.startTime.substring(0, 16);
          detailData.endTime = detailData.endTime.substring(0, 16);
          This.state.actDatas.data = detailData;
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          result.code = result.code + '';
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
            if (result.code === '500.8') {
              nativeApi.goNative({
                'apiJson': {
                  'fn': 'taskManage'
                }
              });
            }
          });
        }
      }
    });
  },
  editDetail: function (id) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.task_list + '/' + id,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var detailData = result.data;
          var imgs = detailData.picFileUrlList || {};
          var sounds = detailData.audioFileUrlList || {};
          var soundsId = detailData.audioFileIds || '';
          var soundsIds = soundsId.split(',');
          var imgsId = detailData.picFileIds || '';
          var imgsIds = imgsId.split(',');
          var appendixs = [];
          for (var key1 in imgs) {
            appendixs.push({
              'id': imgsIds[key1],
              'type': 'image',
              'path': imgs[key1]
            });
          }
          for (var key in sounds) {
            appendixs.push({
              'id': soundsIds[key],
              'type': 'sound',
              'path': sounds[key]
            });
          }
          detailData.appendixs = appendixs;
          self.state.editData = {
            'text': detailData.subject,
            'textareaVal': detailData.description,
            'recordTime': detailData.audioSubjectFileLength,
            'recordPath': detailData.audioSubjectFileUrl,
            'start': detailData.startTime,
            'end': detailData.endTime,
            'priorityLevel': detailData.priorityLevel,
            'customer': detailData.customerName,
            'customerId': detailData.customerId,
            'chance': detailData.chanceName,
            'chanceId': detailData.chanceId,
            'contact': detailData.linkmanName,
            'contactId': detailData.customerLinkmanId,
            'address': detailData.addressVO.address,
            'appendixs': detailData.appendixs,
            'acceptors': detailData.executorList,
            'saleTeam': [],
            'addressVO': detailData.addressVO,
            'cssSheet': {
              'width': detailData.executorList.length * 48 + 'px'
            }
          };
        }
      }
    });
  },
  toEdit: function (cb) {
    var self = this;
    var detailData = self.state.actDatas.data;
    for (var i = 0; i < self.state.chooseArr.length; i++) {
      self.state.chooseArr[i].select = '';
    }
    detailData.priorityLevel = detailData.priorityLevel + '';
    if (detailData.priorityLevel === '0') {
      self.state.chooseArr[0].select = 'active';
      self.state.editData.priorityLevel = '0';
    }
    if (detailData.priorityLevel === '1') {
      self.state.chooseArr[1].select = 'active';
      self.state.editData.priorityLevel = '1';
    }
    if (detailData.priorityLevel === '2') {
      self.state.chooseArr[2].select = 'active';
      self.state.editData.priorityLevel = '2';
    }
    if (detailData.priorityLevel === '3') {
      self.state.chooseArr[3].select = 'active';
      self.state.editData.priorityLevel = '3';
    }
    self.state.editData = {
      'text': detailData.subject,
      'textareaVal': detailData.description,
      'recordTime': detailData.audioSubjectFileLength,
      'recordPath': detailData.audioSubjectFileUrl,
      'audioSubjectFileId': detailData.audioSubjectFileId,
      'start': detailData.startTime,
      'end': detailData.endTime,
      'priorityLevel': detailData.priorityLevel,
      'customer': detailData.customerName,
      'customerId': detailData.customerId,
      'chance': detailData.chanceName,
      'chanceId': detailData.chanceId,
      'contact': detailData.linkmanName,
      'contactId': detailData.customerLinkmanId,
      'address': detailData.address,
      'appendixs': detailData.appendixs,
      'acceptors': detailData.executorList,
      'addressVO': detailData.addressVO,
      'sourceId': detailData.sourceId,
      'cssSheet': {
        'width': detailData.executorList.length * 48 + 'px'
      },
      'saleTeam': [],
      'formOther': 0
    };
    if (window.initParam === 'toDetail') {
      if (window.initParam.type === 'chance') {
        self.state.editData.formOther = 2;
      }
      if (window.initParam.type === 'customer') {
        self.state.editData.formOther = 1;
      }
    }
    self.state.formPage = 'editData';
    cb();
  },
  saveEdit: function () {
    var self = this;
    var appendix = self.state.editData.appendixs;
    var picFileIds = '';
    var audioFileId = '';
    if (!(self.state.editData.text || self.state.editData.audioSubjectFileId)) {
      mui.alert('请输入任务主题！', '提示', function () {
      });
      return;
    }
    if (!(self.state.editData.end)) {
      mui.alert('请输入结束时间！', '提示', function () {
      });
      return;
    }
    if (self.state.editData.acceptors.length === 0) {
      mui.alert('请选择执行人！', '提示', function () {
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
    self.state.editData.saleTeam = [];
    for (var m = 0; m < self.state.editData.acceptors.length; m++) {
      self.state.editData.saleTeam.push({
        'staffId': self.state.editData.acceptors[m].id,
        'isOwner': 0
      });
    }
    self.state.editData.textareaVal = nativeApi.replaceAllCh(self.state.editData.textareaVal);
    nativeApi.initAjax({
      type: 'PUT',
      url: APIS.task_list + '/' + (self.state.actDatas.data.id || window.initParam.id),
      param: {
        'addressVO': self.state.editData.addressVO || {},
        'subject': self.state.editData.text,
        'description': self.state.editData.textareaVal,
        'startTime': self.state.editData.start,
        'endTime': self.state.editData.end,
        'priorityLevel': self.state.editData.priorityLevel || 0,
        'picFileIds': picFileIds, //  图片ID
        'audioFileIds': audioFileId, //  音频ID
        'audioSubjectFileId': self.state.editData.recordId || 0,
        'customerLinkmanId': self.state.editData.contactId, //  联系人ID
        'audioSubjectFileLength': self.state.editData.recordTime || 0,
        'chanceId': self.state.editData.chanceId, //  商机ID
        'customerId': self.state.editData.customerId, //  客户ID
        'sourceId': self.state.editData.sourceId,
        'saleTeam': self.state.editData.saleTeam || []
      },
      callback: function (result) {
        if (result && result.code === 200) {
          mui.alert('保存成功', '提示', function () {
            if (window.initPage) {
              nativeApi.goNative();
            } else {
              history.go(-1);
            }
          });
        } else {
          mui.alert('保存失败', '提示');
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
    self.param[obj].customerId = self.state.addData.customerId || '';
    if (self.state.chanceSourceType === 'edit') {
      self.param[obj].customerId = self.state.editData.customerId || '';
    }
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
            'text': detailData.subject,
            'textareaVal': detailData.myScheduleDesc,
            'type': '',
            'typeId': '',
            'start': startTime,
            'end': endTime,
            'feeType': '',
            'feeTypeId': '',
            'money': '',
            'customer': detailData.customerName,
            'customerId': detailData.customerId,
            'contact': detailData.linkman,
            'contactId': detailData.customerLinkmanId,
            'address': detailData.address ? detailData.address.address : '',
            'addressVO': {
              'address': detailData.address ? detailData.address.address : '',
              'country': detailData.address ? detailData.address.country : '',
              'province': detailData.address ? detailData.address.province : '',
              'city': detailData.address ? detailData.address.city : '',
              'adname': detailData.address ? detailData.address.adname : '',
              'adcode': detailData.address ? detailData.address.adcode : '',
              'longitude': detailData.address ? detailData.address.longitude : '',
              'latitude': detailData.address ? detailData.address.latitude : ''
            },
            'saleTeam': [],
            'appendixs': detailData.appendixs,
            'acceptors': [],
            'cssSheet': {
              width: '0'
            }
          };
          self.state.formPage = 'addData';
        } else {
          if (window.loginInfo.isEn === true) {
            mui.alert(result.msg || 'Failed to read data!', 'Tip');
          } else {
            mui.alert(result.msg || '没有获取到数据！', '提示');
          }
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
      if (i === 0 || (lists[i].indexed !== lists[i - 1].indexed)) {
        conLists.push({
          'isGroup': true,
          'indexedGroup': lists[i].indexed.toUpperCase()
        });
      }
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
