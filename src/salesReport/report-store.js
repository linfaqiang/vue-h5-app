/**
 * @file
 * @author
 */
import {APIS} from 'configPort';
import nativeApi from 'nativeApi';
import {tools} from '../public/js/tools.js';

var selectUrl = {
  'chance': APIS.chanceType
};

export default {
  APIS: APIS,
  // 每个store第一个属性必须为state，state可以保存多个数据状态，state可以被多个组件绑定来同步状态
  state: {
    counts: {
      chanceCount: 0,
      clueCount: 0,
      customerCount: 0,
      customerLinkmanCount: 0
    },
    detail: {},
    user: {
      userName: '',
      section: '',
      time: tools.formatDate(new Date(), 'yyyy-mm')
    },
    conSeaList: [],
    notStaff: true,
    selectDate: {
      selectType: '部门',
      renyuan: '',
      bumen: '',
      selectDay: tools.formatDate(new Date(), 'yyyy-mm'),
      endSelect: false,
      dayTitle: '日期',
      start: tools.formatDate(new Date(), 'yyyy-mm'),
      end: '',
      weidu: '月',
      weiduValue: 'monthly',
      employee: '',
      employeeId: 0,
      depth: '',
      weiduShow: true,
      chanceType: '',
      chanceTypeId: 0,
      chanceShow: false,
      depthId: 0
    },
    weiduSelect: {
      value: ''
    },
    selectLi: [],
    selectTitle: '',
    personDeptArr: []
  },
  haveRender: false,
  initSelect: function (type) {
    for (var attr in this.state.selectDate) {
      this.state.selectDate[attr] = '';
    }
    this.state.selectDate.employeeId = 0;
    this.state.selectDate.depthId = 0;
    this.state.selectDate.chanceTypeId = 0;

    this.state.selectDate.weiduShow = true;
    this.state.selectDate.selectType = '部门';
    this.state.selectDate.selectDay = tools.formatDate(new Date(), 'yyyy-mm');
    this.state.selectDate.start = tools.formatDate(new Date(), 'yyyy-mm');
    this.state.selectDate.weidu = '月';
    this.state.selectDate.weiduValue = 'monthly';
    if (type) {
      var thisYear = tools.formatDate(new Date(), 'yyyy');
      this.state.selectDate.start = thisYear + '-01-01';
      this.state.selectDate.end = tools.formatDate(new Date(), 'yyyy-mm-dd');
      this.state.selectDate.dayTitle = '起始日期';
      this.state.selectDate.endSelect = true;
      this.state.selectDate.weiduShow = false;
      this.state.selectDate.chanceShow = true;
    } else {
      this.state.selectDate.dayTitle = '日期';
      this.state.selectDate.endSelect = false;
      this.state.selectDate.chanceShow = false;
    }
  },
  getUserMsg: function () {
    var self = this;
    nativeApi.getLoginInfo({
      callback: function (result) {
        self.state.user.userName = result.data.name || '';
        self.state.user.section = result.data.mainBelongDeptName || '';
        self.state.notStaff = false;
        if (result.data.mainManageOrgId || result.data.mainManageDeptId) {
          self.state.notStaff = true;
        }
      }
    });
  },
  init: function (cb) {
    var self = this;
    nativeApi.initAjax({
      url: APIS.sales_report + 'count',
      type: 'get',
      param: '',
      callback: function (response) {
        if (response && response.code === 200) {
          for (var i = 0; i < response.data.length; i++) {
            var attr = response.data[i].type;
            self.state.counts[attr] = response.data[i].newCount;
          }
        }
        if (typeof cb === 'function') {
          cb.call(self);
        }
      }
    });
  },
  renderDetail: function (type, param, renderMap) {
    var self = this;
    if (!(param.staffId || param.deptId)) {
      self.getUserMsg();
    } else {
      var depth = self.state.selectDate.depth || '';
      var arrDepth = depth.split('-') || [];
      if (arrDepth.length > 0) {
        depth = arrDepth[arrDepth.length - 1];
      } else {
        depth = '';
      }
      self.state.user.section = depth || '';
      self.state.user.userName = self.state.selectDate.employee;
    }
    nativeApi.initAjax({
      url: APIS.sales_report + type,
      type: 'get',
      param: param,
      callback: function (response) {
        if (response.code === 200) {
          renderMap(response.data);
        } else {
          mui.alert(response.msg || '请求失败！', '提示');
        }
      }
    });
  },
  selectFn: function (obj, selectId, title) {
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
        }
      }
    });
  },
  showDept: function (selectId, cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.dept_list,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data || [];
          var personDeptArr = [];
          for (var i = 0; i < lists.length; i++) {
            if (lists[i].deptId === selectId) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
            personDeptArr.push(lists[i]);
          }
          self.state.personDeptArr = personDeptArr;
          if (typeof cb === 'function') {
            cb();
          }
        }
      }
    });
  },
  showStaff: function (selectId, cb) {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.staff_sub_list,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data || [];
          var personDeptArr = [];
          for (var i = 0; i < lists.length; i++) {
            if (lists[i].id === selectId) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
            personDeptArr.push(lists[i]);
          }
          self.state.personDeptArr = personDeptArr;
          if (typeof cb === 'function') {
            cb();
          }
        }
      }
    });
  },
  updateField: function (field, valData) {
    this.state.selectDate[field] = valData;
  }
};
