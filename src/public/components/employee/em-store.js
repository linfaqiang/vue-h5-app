/**
 * @file  人员选择
 * @author hj
 */
import Vue from 'vue';
import resource from 'vue-resource';
var nativeApi = require('nativeApi');
import {APIS} from '../../js/config';

Vue.use(resource);

export default {
  state: {
    deptList: [],
    selectDept: '',
    personList: [],
    personSelectList: [],
    searchList: [],
    hWidth: {
      'width': 10
    }
  },
  initDeptEmp: function () {
    var self = this;
    nativeApi.initAjax({
      'type': 'get',
      'url': APIS.leader_dept_emp,
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          /* 创建员工、部门表 */
          nativeApi.executeQuery({
            'apiJson': {
              'sql': "create table if not exists deptEmp (" +
              "'id' INTEGER primary key," +
              "'dbId' VARCHAR(20)," + /* 数据库ID */
              "'name' VARCHAR(20)," + /* 部门、人员名字 */
              "'type' VARCHAR(20)," + /* 部门或者人员 */
              "'title' VARCHAR(20)," + /* 人员职位 */
              "'headPhotoUrl' VARCHAR(100)" + /* 人员头像 */
              ")",
              'param': ''
            },
            callback: function (result) {
              nativeApi.executeQuery({
                'apiJson': {
                  'sql': 'delete from deptEmp',
                  'param': ''
                },
                callback: function () {
                  /* 数据插入 */
                  var sql = 'insert into deptEmp(dbId, name, type, headPhotoUrl) values';
                  if (mui.os.android) {
                    var sqlArr = [];
                    for (var i = 0; i < lists.length; i++) {
                      sqlArr.push(sql + "('" + (lists[i].id || "") + "','" + (lists[i].name || "") + "','" + (lists[i].type || "") + "','" + (lists[i].headPhotoUrl || "") + "')");
                    }
                    nativeApi.executeSqls({
                      'apiJson': {
                        'sql': sqlArr,
                        'param': ''
                      },
                      callback: function () {
                        self.dept();
                      }
                    });
                  } else {
                    self.sqLiteInsert(sql, lists, 0, function () {
                      self.dept();
                    });
                  }
                }
              });
            }
          });
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  search: function (searchName) {
    var self = this;
    nativeApi.executeQuery({
      'apiJson': {
        'sql': "select dbId as id,name,type,headPhotoUrl from deptEmp where name like '%" + searchName + "%'",
        'param': ''
      },
      callback: function (result) {
        var lists = self.state.personSelectList;
        for (var i = 0; i < result.length; i++) {
          var flag = false;
          for (var j = 0; j < lists.length; j++) {
            var sId = lists[j].id;
            if (result[i].id === sId) {
              flag = true;
            }
          }
          if (flag) {
            result[i].selected = true;
          } else {
            result[i].selected = false;
          }
        }
        self.state.searchList = result;
      }
    });
  },
  sqLiteInsert: function (sql, arr, num, cb) {
    num = !num ? 0 : num;
    var pageS = 500,
      liSQL = sql,
      self = this,
      maxNum = (num + 1) * pageS,
      flag = false;
    if (maxNum > arr.length) {
      maxNum = arr.length;
      flag = true;
    }

    for (var i = 0; i < arr.length; i++) {
      if (i >= (num * pageS) && i < maxNum) {
        liSQL += "('" + (arr[i].id || "") + "','" + (arr[i].name || "") + "','" + (arr[i].type || "") + "','" + (arr[i].headPhotoUrl || "") + "')";
        if (i === (maxNum - 1)) {
          liSQL += ';';
        } else {
          liSQL += ',';
        }
      }
    }
    nativeApi.executeSqls({
      'apiJson': {
        'sql': liSQL,
        'param': ''
      },
      callback: function () {
        if (!flag) {
          num++;
          self.sqLiteInsert(sql, arr, num, cb);
        } else {
          if ('function' === typeof cb) {
            cb();
          }
        }
      }
    });
  },
  dept: function () {
    var self = this;
    nativeApi.initAjax({
      'type': 'get',
      'url': APIS.dept_list,
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var i = 0; i < lists.length; i++) {
            var name = lists[i].deptName,
              lastIndex = name.lastIndexOf('-'),
              name1 = name.substring(0, lastIndex + 1),
              name2 = name.substring(lastIndex + 1, name.length);
            lists[i].selected = false;
            lists[i].upDept = name1;
            lists[i].deptName = name2;
          }
          self.state.deptList = lists;
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  deptEmp: function (deptId, cb) {
    var self = this;
    nativeApi.initAjax({
      'type': 'get',
      'url': APIS.dept_emp_list.replace('{id}', deptId),
      callback: function (result) {
        if (result && result.code === 200) {
          self.state.selectDept = deptId;
          var lists = result.data;
          if (lists.length === 0) {
            mui.alert('该部门没有员工！', '提示');
            return;
          }
          for (var i = 0; i < lists.length; i++) {
            lists[i].deptId = deptId;
            if (self.repetition(self.state.personSelectList, lists[i].id)) {
              lists[i].selected = true;
            } else {
              lists[i].selected = false;
            }
          }
          self.state.personList = lists;
          var width = document.body.offsetWidth - 100,
            nowWid = self.state.personSelectList.length * 50;
          if (width < nowWid) {
            self.state.hWidth.width = width;
          } else {
            if (nowWid < 10) {
              nowWid = 10;
            }
            self.state.hWidth.width = nowWid;
          }
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  addDeptEmp: function (deptId, cb) {
    var self = this;
    nativeApi.initAjax({
      'type': 'get',
      'url': APIS.dept_emp_list.replace('{id}', deptId),
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data,
            selectLists = [];
          for (var i = 0; i < lists.length; i++) {
            lists[i].selected = true;
            lists[i].deptId = deptId;
            if (!self.repetition(self.state.personSelectList, lists[i].id)) {
              self.state.personSelectList.push(lists[i]);
            }
          }
          var width = document.body.offsetWidth - 100,
            nowWid = self.state.personSelectList.length * 50;
          if (width < nowWid) {
            self.state.hWidth.width = width;
          } else {
            if (nowWid < 10) {
              nowWid = 10;
            }
            self.state.hWidth.width = nowWid;
          }
          if (typeof cb === 'function') {
            cb();
          }
        } else {
          mui.alert(result.msg || '数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  addEmp: function (data) {
    var self = this,
      lists = self.state.personList,
      selectList = self.state.personSelectList,
      flag = false;
    for (var i = 0; i < lists.length; i++) {
      var id = lists[i].id || lists[i].ID;
      if (id === data.id) {
        lists[i].selected = true;
      }
    }
    for (var i = 0; i < selectList.length; i++) {
      if (selectList[i].id === data.id) {
        flag = true;
      }
    }
    if (!flag) {
      self.state.personSelectList.push(data);
      var width = document.body.offsetWidth - 100;
      var nowWid = self.state.personSelectList.length * 50;
      if (width < nowWid) {
        self.state.hWidth.width = width;
      } else {
        if (nowWid < 10) {
          nowWid = 10;
        }
        self.state.hWidth.width = nowWid;
      }
    }
  },
  deleteEmp: function (id) {
    var self = this;
    var lists = self.state.personSelectList;
    var arr = [];
    for (var i = 0; i < lists.length; i++) {
      var sId = lists[i].ID || lists[i].id;
      if (sId != id) {
        arr.push(lists[i]);
      }
    }
    self.state.personSelectList = arr;
    var width = document.body.offsetWidth - 100;
    var nowWid = self.state.personSelectList.length * 50;
    if (width < nowWid) {
      self.state.hWidth.width = width;
    } else {
      if (nowWid < 10) {
        nowWid = 10;
      }
      self.state.hWidth.width = nowWid;
    }
    setTimeout(function () {
      self.updateSelectDept();
    }, 100);
  },
  updateSelectDept: function () {
    /* 如果部门内所有成员没有全部选中，则该部门不选中，反之则选中 */
    var self = this;
    var empList = self.state.personList;
    var flag = false;
    var deptList = self.state.deptList;
    for (var i = 0; i < empList.length; i++) {
      if (!empList[i].selected) {
        flag = true;
      }
    }
    if (flag) {
      /* 没有全部选中 */
      for (var i = 0; i < deptList.length; i++) {
        if (deptList[i].deptId === self.state.selectDept) {
          deptList[i].selected = false;
        }
      }
    } else {
      /* 全部选中 */
      for (var i = 0; i < deptList.length; i++) {
        if (deptList[i].deptId === self.state.selectDept) {
          deptList[i].selected = true;
        }
      }
    }
  },
  setDeptSelect: function (deptId) {
    var lists = this.state.deptList;
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].id === deptId) {
        lists[i].selected = true;
      }
    }
  },
  repetition: function (lists, id) {
    lists = lists || [];
    var flag = false;
    for (var i = 0; i < lists.length; i++) {
      var sId = lists[i].ID || lists[i].id;
      if (sId === id) {
        flag = true;
      }
    }
    return flag;
  },
  deleteDeptEmp: function (deptId, cb) {
    var self = this;
    var lists = self.state.personSelectList;
    var arr = [];
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].deptId != deptId) {
        arr.push(lists[i]);
      }
    }
    self.state.personSelectList = arr;
    var width = document.body.offsetWidth - 100;
    var nowWid = self.state.personSelectList.length * 50;
    if (width < nowWid) {
      self.state.hWidth.width = width;
    } else {
      if (nowWid < 10) {
        nowWid = 10;
      }
      self.state.hWidth.width = nowWid;
    }
    if (typeof cb === 'function') {
      cb();
    }
  },
  initSetDeptEmp: function (initResult) {
    var self = this;
    self.state.personSelectList = initResult.emp || [];
    var width = document.body.offsetWidth - 100;
    var nowWid = self.state.personSelectList.length * 50;
    if (width < nowWid) {
      self.state.hWidth.width = width;
    } else {
      if (nowWid < 10) {
        nowWid = 10;
      }
      self.state.hWidth.width = nowWid;
    }
    var deptList = this.state.deptList || [];
    var deptSelectList = initResult.dept || [];
    for (var i = 0; i < deptList.length; i++) {
      var flag = false;
      for (var j = 0; j < deptSelectList.length; j++) {
        if (deptList[i].deptId === deptSelectList[j].deptId) {
          flag = true;
        }
      }
      deptList[i].selected = flag;
    }
  }
};
