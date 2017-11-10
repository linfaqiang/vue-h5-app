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
    teamList: [],
    mainOwner: {},
    teamAddList: [],
    formJson: {},
    editJson: {
      showOperation: false,
      operaCss: {
        bottom: '-196px',
        opacity: 1,
        display: 'block'
      },
      backCss: {
        '-webkit-transition': 'all .4s ease',
        'transition': 'all .4s ease',
        'opacity': 0
      },
      slidEle: '',
      index: '',
      hideDe: false
    },
    isEdit: true
  },
  scroll: {
    person: {
      dataList: [],
      hasMore: true,
      scroll: {}
    }
  },
  param: {
    person: {
      'q': '',
      'chanceId': '',
      'customerId': '',
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
    this.person('refresh');
  },
  listLoadMore: function (obj) {
    /* 加载更多 */
    this.param[obj].pageNo++;
    this.person('loadMore');
  },
  setEdit: function (flag) {
    this.state.isEdit = flag;
  },
  team: function (id, type) {
    var self = this;
    self.state.formJson = {
      'id': id,
      'flag': type
    };
    nativeApi.initAjax({
      type: 'get',
      url: (type ? APIS.customer_team : APIS.chance_team).replace('{id}', id),
      param: {
        'pageNo': 1,
        'pageSize': 10000
      },
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          self.state.teamList = lists;
          for (var i = 0; i < lists.length; i++) {
            if (lists[i].isOwner === 1) {
              self.state.mainOwner = lists[i];
            }
          }
          setTimeout(function () {
            mui('#OA_task_2').on('slideleft', '.mui-table-view-cell', function (event) {
              self.state.editJson.slidEle = this;
              self.state.editJson.index = self.state.editJson.slidEle.getAttribute('index');
              setTimeout(function () {
                self.state.editJson.showOperation = true;
                self.state.editJson.operaCss = {
                  bottom: '0',
                  opacity: 1,
                  display: 'block'
                };
                self.state.editJson.backCss.opacity = 1;
                setTimeout(function () {
                  mui.swipeoutClose(self.state.editJson.slidEle);
                }, 300)
              }, 10);
            });
          }, 100);
        } else {
          mui.alert('数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  setMain: function () {
    var self = this;
    var teamData = self.state.teamList[self.state.editJson.index];
    if (self.state.formJson.flag) {
      /* 客户 */
      nativeApi.initAjax({
        'type': 'put',
        'url': APIS.customer_team_main.replace('{id}', teamData.id) + '?customerId=' + self.state.formJson.id,
        'param': '',
        callback: function (result) {
          if (result && result.code === 200) {
            self.state.editJson.hideDe = true;
            if (result.data[0].hasRepeat === 'outOfMaxCount') {
              mui.alert('因客户数已满，设置失败！请联系管理员！', '提示', function () {
                self.state.editJson.hideDe = false;
              })
            } else {
              mui.alert('主责任人更新成功！', '提示', function () {
                self.state.editJson.hideDe = false;
                self.team(self.state.formJson.id, self.state.formJson.flag);
              });
            }
          } else {
            mui.alert(result.msg || '主责任人更新失败！', '提示', function () {
            });
          }
        }
      });
    } else {
      /* 商机 */
      nativeApi.initAjax({
        'type': 'put',
        'url': APIS.chance_team_main.replace('{id}', teamData.id) + '?chanceId=' + self.state.formJson.id + '&staffId=' + teamData.staffId,
        'param': '',
        callback: function (result) {
          if (result && result.code === 200) {
            self.state.editJson.hideDe = true;
            mui.alert('主责任人更新成功！', '提示', function () {
              self.state.editJson.hideDe = false;
              self.team(self.state.formJson.id, self.state.formJson.flag);
            });
          } else {
            mui.alert(result.msg || '主责任人更新失败！', '提示', function () {
            });
          }
        }
      });
    }
  },
  deleteTeam: function () {
    var self = this;
    var teamData = self.state.teamList[self.state.editJson.index];
    if (self.state.formJson.flag) {
      /* 客户 */
      nativeApi.initAjax({
        'type': 'delete',
        'url': APIS.customer_team_delete.replace('{id}', teamData.id),
        'param': '',
        callback: function (result) {
          if (result && result.code === 200) {
            self.state.editJson.hideDe = true;
            mui.alert('成员删除成功！', '提示', function () {
              self.state.editJson.hideDe = false;
              self.team(self.state.formJson.id, self.state.formJson.flag);
            });
          } else {
            mui.alert(result.msg || '成员删除失败！', '提示', function () {
            });
          }
        }
      });
    } else {
      /* 商机 */
      nativeApi.initAjax({
        'type': 'delete',
        'url': APIS.chance_team_delete.replace('{id}', teamData.id),
        'param': '',
        callback: function (result) {
          if (result && result.code === 200) {
            self.state.editJson.hideDe = true;
            mui.alert('成员删除成功！', '提示', function () {
              self.state.editJson.hideDe = false;
              self.team(self.state.formJson.id, self.state.formJson.flag);
            });
          } else {
            mui.alert(result.msg || '成员删除失败！', '提示', function () {
            });
          }
        }
      });
    }
  },
  teamList: function () {
    var self = this;
    nativeApi.initAjax({
      type: 'get',
      url: APIS.chance_team_add,
      param: '',
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          self.state.teamAddList = lists;
        } else {
          mui.alert('数据获取失败！', '提示', function () {
          });
        }
      }
    });
  },
  teamAdd: function (cb) {
    var self = this;
    var saleStaffIdList = [];
    var lists = self.state.teamList;
    var personList = self.scroll.person.dataList;
    var arrId = [];

    for (var i = 0; i < lists.length; i++) {
      arrId.push(parseInt(lists[i].staffId));
    }

    for (var m = 0; m < personList.length; m++) {
      if (personList[m].selected && arrId.indexOf(personList[m].id) === -1) {
        saleStaffIdList.push(personList[m].id);
      }
    }
    if (saleStaffIdList.length === 0) {
      return;
    }
    if (self.state.formJson.flag) {
      /* 客户 */
      nativeApi.initAjax({
        'type': 'post',
        'url': APIS.customer_team_add,
        'param': {
          'customerId': self.state.formJson.id,
          'saleStaffIdList': saleStaffIdList
        },
        callback: function (result) {
          if (result && result.code === 200) {
            if (typeof cb === 'function') {
              cb();
            }
            mui.alert('成员添加成功！', '提示', function () {
            });
          } else {
            mui.alert(result.msg || '成员添加失败！', '提示', function () {
            });
          }
        }
      });
    } else {
      /* 商机 */
      nativeApi.initAjax({
        'type': 'post',
        'url': APIS.chance_team_add_save,
        'param': {
          'chanceId': self.state.formJson.id,
          'saleStaffIdList': saleStaffIdList
        },
        callback: function (result) {
          if (result && result.code === 200) {
            if (typeof cb === 'function') {
              cb();
            }
            mui.alert('成员添加成功！', '提示', function () {
            });
          } else {
            mui.alert(result.msg || '成员添加失败！', '提示', function () {
            });
          }
        }
      });
    }
  },
  person: function (loadType) {
    var self = this;
    var obj = 'person';
    var selectList = self.state.teamList;
    var arrId = [];
    for (var i = 0; i < selectList.length; i++) {
      arrId.push(parseInt(selectList[i].staffId));
    }
    if (self.state.formJson.flag === '1') {
      self.param[obj].customerId = self.state.formJson.id;
    } else {
      self.param[obj].chanceId = self.state.formJson.id;
    }
    nativeApi.initAjax({
      type: 'get',
      url: APIS.person_list,
      param: self.param[obj],
      callback: function (result) {
        if (result && result.code === 200) {
          var lists = result.data;
          for (var m = 0; m < lists.length; m++) {
            if (arrId.indexOf(lists[m].id) > -1) {
              lists[m].selected = true;
            } else {
              lists[m].selected = false;
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
  }
};
