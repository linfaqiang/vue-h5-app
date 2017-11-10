/**
 * @file
 * @author
 */
// 定义store, store可以被多个组件引用
var nativeApi = require('nativeApi');
import {APIS} from 'configPort';
var loadNext = {
  'list': 'init',
  'search': 'search'
};
export default {
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    lists: [],
    conSeaList: [],
    userMsg: {},
    fenpeiShows: false,
    fenpeiList: [],
    addData: {
      'startDate': '',
      'endDate': '',
      'targetAmount': '',
      'unAssignAmount': '',
      'assignAmount': '',
      'planAmount': '',
      'remark': '',
      'showBu': false,
      'lists': []
    },
    editData: {},
    detailData: {},
    detailUpDetail: {},
    isLeader: {
      isAjax: false,
      flag: false
    }
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
      scroll: {},
      searchName: ''
    }
  },
  param: {
    list: {
      'pageNo': 1,
      'pageSize': 10,
      'fromDate': '',
      'toDate': ''
    },
    search: {
      'q': '',
      'pageNo': 1,
      'pageSize': 10
    }
  },
  haveRender: false,
  // 在store里定义数据状态操作方法，在Vue组件中通过这些方法来更新状态数据

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
  init: function (loadType) {
    var self = this;
    var obj = 'list';
    var params = self.param[obj];
    nativeApi.initAjax({
      url: APIS.sale_plans,
      type: 'get',
      param: params,
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = {
            data: [],
            totalSize: result.totalSize
          };
          if (result.data.length) {
            // 冲突图标处理(只给冲突的第一条数据一个标识chongtuFlag)
            for (var i = 0; i < result.data.length; i++) {
              if (result.data[i].isAttack) {
                if (result.data[i].chongtuFlag) {
                  result.data[i].chongtuFlag = true;
                  if (result.data[i + 1]) {
                    result.data[i + 1].chongtuFlag = false;
                  }
                }
              } else {
                result.data[i].chongtuFlag = false;
              }
              lists.data.push(result.data[i]);
            }
          }
          self.pullList(lists, loadType, 'conList', obj);
          if (!self.state.userMsg.name) {
            self.renderUserMsg();
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  mergePlan: function (attackFlag) {
    var self = this;
    nativeApi.initAjax({
      url: APIS.sale_plans_merge + attackFlag,
      type: 'delete',
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          self.renderDetail(result.data.id, function () {
            self.listRefresh('list');
          });
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  renderUserMsg: function () {
    var self = this;
    nativeApi.getLoginInfo({
      callback: function (result) {
        self.state.userMsg = result.data;
        self.state.fenpeiShows = false;
        if (result.data.mainManageOrgId || result.data.mainManageDeptId) {
          self.state.fenpeiShows = true;
        }
      }
    });
  },
  search: function (loadType) {
    var self = this;
    var obj = 'search';
    var params = self.param[obj];
    nativeApi.initAjax({
      url: APIS.sale_plans,
      type: 'get',
      param: params,
      callback: function (result) {
        if (result && result.code === 200) {
          self.pullList(result, loadType, 'searchLi', obj);
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  clean: function () {
    var addData = this.state.addData;
    for (var key in addData) {
      if (typeof addData[key] === 'object') {
        addData[key] = [];
      } else {
        addData[key] = '';
      }
    }
    this.state.addData = addData;
  },
  renderDepth: function (dayaType, cb) {
    var self = this;
    if (self.state[dayaType].lists && self.state[dayaType].lists.length > 0) {
      if (typeof cb === 'function') {
        cb();
      }
      return;
    }
    nativeApi.initAjax({
      url: APIS.sales_plan_dept,
      type: 'get',
      param: {
        'pageNo': 1,
        'pageSize': 100000
      },
      callback: function (response) {
        if (response && response.code === 200) {
          if (response.data && response.data.length > 0) {
            var staffDept = response.data;
            self.state.addData.lists = [];
            for (var i = 0; i < staffDept.length; i++) {
              var staffDeptData = staffDept[i];
              self.state[dayaType].lists.push({
                'ownerStaffId': staffDeptData.staffId,
                'ownerStaffName': staffDeptData.name,
                'ownerDeptName': staffDeptData.name,
                'ownerDeptId': staffDeptData.staffId > 0 ? 0 : staffDeptData.deptId,
                'departmentId': staffDeptData.staffId > 0 ? staffDeptData.deptId : 0,
                'targetAmount': 0,
                'ownerOrgId': staffDeptData.ownerOrgId || 0
              });
            }
            if (typeof cb === 'function') {
              cb();
            }
          } else {
            mui.alert('暂无数据，不能分配', '提示');
          }
        }
      }
    });
  },
  renderDetail: function (id, cb) {
    var self = this;
    id = id || self.state.detailData.id;
    if (typeof cb !== 'function') {
      self.state.detailUpDetail = self.state.detailData;
    }
    nativeApi.initAjax({
      url: APIS.sale_plans_port + '/' + id,
      type: 'get',
      param: '',
      callback: function (response) {
        if (response && response.code === 200) {
          self.state.detailData = response.data;
          self.state.detailData.undistributed = response.data.targetAmount - response.data.assignAmount;
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(response.msg || '数据请求失败', '提示');
        }
      }
    });
  },
  saveAdd: function (cb) {
    var self = this;
    var addData = self.state.addData;
    var param = {
      'startDate': addData.startDate,
      'endDate': addData.endDate,
      'targetAmount': addData.targetAmount || 0,
      'planAmount': addData.planAmount || 0,
      'remark': addData.remark || '',
      'lists': addData.lists
    };
    nativeApi.initAjax({
      url: APIS.sale_plans_port,
      type: 'post',
      param: param,
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '计划保存失败！', '提示', function () {
          });
        }
      }
    });
  },
  setEdit: function (cb) {
    var self = this;
    var detailData = self.state.detailData;
    var lists = detailData.list || [];
    var assignAmount = 0;
    self.state.editData = {
      'startDate': detailData.startDate,
      'endDate': detailData.endDate,
      'targetAmount': detailData.targetAmount,
      'unAssignedAmount': 0,
      'planAmount': detailData.planAmount,
      'assignAmount': 0,
      'remark': detailData.remark,
      'showBu': false,
      'lists': []
    };
    for (var i = 0; i < lists.length; i++) {
      self.state.editData.lists.push({
        'id': lists[i].id,
        'ownerStaffName': lists[i].ownerStaffName,
        'ownerDeptName': lists[i].ownerDeptName,
        'targetAmount': lists[i].targetAmount,
        'departmentId': lists[i].departmentId || 0,
        'ownerStaffId': lists[i].ownerStaffId || 0,
        'ownerDeptId': lists[i].ownerDeptId || 0,
        'ownerOrgId': lists[i].ownerOrgId || 0
      });
      assignAmount += parseInt(lists[i].targetAmount || '0');
    }
    self.state.editData.unAssignedAmount = parseInt(detailData.targetAmount) - assignAmount;
    self.state.editData.assignAmount = assignAmount;
    cb();
  },
  saveEdit: function (cb) {
    var self = this;
    var editData = self.state.editData;
    var param = {
      'startDate': editData.startDate,
      'endDate': editData.endDate,
      'targetAmount': editData.targetAmount || 0,
      'planAmount': editData.planAmount || 0,
      'remark': editData.remark || '',
      'lists': editData.lists
    };
    nativeApi.initAjax({
      url: APIS.sale_plans_port + '/' + self.state.detailData.id,
      type: 'put',
      param: param,
      callback: function (result) {
        if (result && result.code === 200) {
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '计划保存失败！', '提示');
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
  pullList: function (result, loadType, field, obj) {
    var lists = result.data;
    var self = this;
    if (loadType === 'refresh') {
      self.scroll[obj].hasMore = true;
      self.scroll[obj][field] = lists;
      if (obj === 'list') {
        self.state.nowTotal = lists.length;
      } else if (obj === 'search') {
        self.state.seaTotal = lists.length;
      }
    } else if (loadType === 'loadMore') {
      if (obj !== 'follow') {
        /* 跟进记录 特殊处理*/
        self.scroll[obj][field] = self.scroll[obj][field].concat(lists);
      }
      if (obj === 'list') {
        self.state.nowTotal += lists.length;
      } else if (obj === 'search') {
        self.state.seaTotal += lists.length;
      }
    } else {
      if (lists.length === 0) {
        self.scroll[obj].scroll.disablePullupToRefresh();
        self.scroll[obj][field] = lists;
        self.state.nowTotal = 0;
      } else {
        self.scroll[obj].scroll.enablePullupToRefresh();
        self.scroll[obj].scroll.refresh(true);
        self.scroll[obj].scroll.scrollTo(0, 0, 100);
        /* 列表数据*/
        self.scroll[obj][field] = lists;
        /* 当前显示数量*/
        if (obj === 'list') {
          self.state.nowTotal = lists.length;
        } else if (obj === 'search') {
          self.state.seaTotal = lists.length;
        }
      }
    }
    /* 判断是否有下一页*/
    var arrList = self.scroll[obj][field];
    if (obj === 'follow') {
      /* 跟进记录 特殊处理*/
      arrList = self.scroll[obj].originalLi;
    }
    if (self.param[obj].pageNo === 1) {
      self.scroll[obj].scroll.scrollTo(0, 0, 100);
    }
    if (lists.length < 10 || arrList.length === result.totalSize) {
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
  }
};
