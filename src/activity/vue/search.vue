<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed;">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()">确定</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="edit_page">
            <ul>
              <li>
                <a @tap="getDateTime('start')" class="mui-icon arrows">
                  <label>跟进时间起</label>
                  <div>{{search.searchData.start}}</div>
                </a>
              </li>
              <li>
                <a @tap="getDateTime('end')" class="mui-icon arrows">
                  <label>止</label>
                  <div>{{search.searchData.end}}</div>
                </a>
              </li>
              <li>
                <a class="mui-icon arrows" @click="goTo('customer', '客户')">
                  <label>客户</label>
                  <div>{{search.searchData.customer}}</div>
                </a>
              </li>
              <li>
                <a class="mui-icon arrows" @click="goTo('chance', '商机')">
                  <label>商机</label>
                  <div>{{search.searchData.chance}}</div>
                </a>
              </li>
            </ul>
            <ul v-if="search.isLeader.flag">
              <li class="switch">
                <a>
                  <label>仅看我的</label>
                  <div>
                    <div @tap="switchFn()"
                         :class="{'mui-switch':true, 'mui-switch-mini': true, 'mui-active': search.searchData.switch}">
                      <div class="mui-switch-handle"></div>
                    </div>
                  </div>
                </a>
              <li v-if="!search.searchData.switch">
                <a class="mui-icon arrows" @tap="goTo('employee', '人员')">
                  <label>人员</label>
                  <div>{{search.searchData.employee}}</div>
                </a>
              </li>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <footer @tap="restFn()" class="rest_bn"><span class="mui-icon crm-loading"></span>重置条件</footer>
    </div>
  </div>
</template>
<style>
  @import "../../public/css/mui.picker.min.css";
</style>
<script>
  import store from '../activity-store';
  require('mui.picker.min');
  export default{
    data: function () {
      return {
        currentHeader: {
          title: '更多筛选'
        },
        search: store.state
      };
    },
    methods: {
      back: function (index) {
        if (window.initPage) {
          history.go(-1);
        }
      },
      switchFn: function () {
        if (this.search.searchData.switch) {
          this.search.searchData.switch = false;
        } else {
          this.search.searchData.switch = true;
        }
      },
      getDateTime: function (field) {
        var self = this;
        var picker = new mui.DtPicker({'type': 'date', 'value': self.search.searchData[field]});
        picker.show(function (rs) {
          self.search.searchData[field] = rs.text;
          /* 验证 开始时间早于结束时间 */
          var start = self.search.searchData['start'];
          var end = self.search.searchData['end'];
          start = start.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          end = end.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          if (parseInt(start) > parseInt(end)) {
            mui.alert('开始日期不能晚于结束日期', '提示', function () {
              self.search.searchData[field] = '';
            });
            return;
          }
          picker.dispose();
        });
      },
      restFn: function () {
        store.state.searchData = {
          'switch': false,
          'start': '',
          'end': '',
          'customerId': '',
          'customer': '',
          'chanceId': '',
          'chance': '',
          'employee': '',
          'employeeId': ''
        };
      },
      goTo: function (fn, show) {
        if (fn === 'employee') {
          window['activitySearchEmp'] = function (lists) {
            lists = lists || [];
            var html = '';
            var staffIdList = [];
            for (var i = 0; i < lists.length; i++) {
              html += lists[i].name;
              if (i !== (lists.length - 1)) {
                html += ';';
              }
              staffIdList.push(lists[i].id);
            }
            store.updateField('employee', html, 'search');
            store.updateField('employeeId', staffIdList, 'search');
          };
          this.$router.go('/employee-select/activitySearchEmp');
          return;
        }
        var self = this;
        var selectId = self.search.searchData[fn + 'Id'];
        if (typeof store[fn] === 'function') {
          store.state.selectId = selectId;
          if (fn === 'contact') {
            if (!self.addData.customerId && !self.addData.chanceId) {
              mui.alert('请先选择客户或者商机', '提示', function () {
              });
              return;
            }
          }
          this.$router.go('/' + fn + 'Page/' + fn + '_search');
          return;
        }
        store.selectFn(fn, selectId, show);
        this.$router.go('/selectPage/' + fn + '_search');
      },
      confirm: function () {
        history.go(-1);
        /* 刷新列表 */
        var self = this;
        setTimeout(function () {
          store.param.list.pageNo = 0;
          store.param.list.fromDate = self.search.searchData.start;
          store.param.list.toDate = self.search.searchData.end;
          store.param.list.customerId = self.search.searchData.customerId;
          store.param.list.chanceId = self.search.searchData.chanceId;
          store.param.list.staffIdList = self.search.searchData.switch ? [] : (self.search.searchData.employeeId || []);
          store.param.list.isSelf = self.search.searchData.switch ? '1' : '';
          store.init();
        }, 50);
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
