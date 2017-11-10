/* *
* @file 更多筛选
* @author hj
* @date 2016-11-15
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()">确定</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" :style="liCss">
        <div class="mui-scroll">
          <div class="edit_page">
            <ul>
              <li>
                <a @tap="getDateTime('start')" class="mui-icon arrows">
                  <label>创建时间起</label>
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
              <!--<li>
                  <a class="mui-icon arrows" @tap="goTo('stage', '阶段')">
                      <label>阶段</label>
                      <div><div v-for="stage in search.searchData.stage">{{stage}}<br v-if="$index<(search.searchData.stage.length-1)"></div></div>
                  </a>
              </li>
              <li>
                  <a class="mui-icon arrows" @tap="goTo('status', '状态')">
                      <label>状态</label>
                      <div><div v-for="status in search.searchData.status">{{status}}<br v-if="$index<(search.searchData.status.length-1)"></div></div>
                  </a>
              </li>-->
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
              </li>
              <li v-if="!search.searchData.switch">
                <a class="mui-icon arrows" @tap="goTo('employee', '人员')">
                  <label>人员</label>
                  <div>{{search.searchData.employee}}</div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <footer @tap="restFn()" class="rest_bn"><span class="mui-icon crm-loading"></span>重置条件</footer>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/mui.picker.min.css';
</style>
<script>
  import store from '../chance-store';
  require('mui.picker.min');
  export default{
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '更多筛选'
        },
        search: store.state,
        liCss: {
          top: '44px',
          background: '#f1f1f1',
          height: (document.body.offsetHeight - 88) + 'px'
        }
      };
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      switchFn: function () {
        if (this.search.searchData.switch) {
          this.search.searchData.switch = false;
        } else {
          this.search.searchData.switch = true;
        }
      },
      getDateTime: function (field) {
        var picker = new mui.DtPicker({'type': 'date', 'value': this.search.searchData[field] || ''});
        var self = this;
        picker.show(function (rs) {
          self.search.searchData[field] = rs.text;
          /* 验证 开始时间早于结束时间*/
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
          'employee': '',
          'employeeId': ''
        };
      },
      goTo: function (fn, show) {
        var self = this;
        var selectId = '';
        if (fn === 'employee') {
          window['chanceSearchEmp'] = function (lists) {
            lists = lists || [];
            var html = '';
            var empId = [];
            for (var i = 0; i < lists.length; i++) {
              html += lists[i].name || lists[i].NAME;
              if (i !== (lists.length - 1)) {
                html += ';';
              }
              empId.push(lists[i].id || lists[i].ID);
            }
            store.updateField('employee', html, 'search');
            store.updateField('employeeId', empId, 'search');
          };
          if (!this.search.searchData.employeeId) {
            sessionStorage.removeItem('chanceSearchEmp');
          }
          self.$router.go('/employee-select/chanceSearchEmp');
          return;
        }
        if (fn === 'customer') {
          selectId = self.search.searchData[fn + 'Id'];
          store.state.selectId = selectId;
          store.customer();
          self.$router.go('/customer/' + fn + '_search');
          return;
        }
        /* 客户、阶段、状态选择*/
        selectId = self.search.searchData[fn + 'Id'];
        var selectType = fn === 'customer' ? 'selectPage' : 'multiplePage';
        store.selectFn(fn, selectId, show, function () {
          self.$router.go('/' + selectType + '/' + fn + '_search');
        });
      },
      confirm: function () {
        history.go(-1);
        var self = this;
        /* 刷新列表*/
        setTimeout(function () {
          store.param.list.customerId = self.search.searchData.customerId;
          store.param.list.startCreatedOn = self.search.searchData.start;
          store.param.list.endCreatedOn = self.search.searchData.end;
          store.param.list.isOwner = self.search.searchData.switch === false ? 0 : 1;
          store.param.list.staffList = self.search.searchData.switch === true ? [] : (self.search.searchData.employeeId || []);
          if (self.search.searchData.switch === true) {
            self.search.searchData.employeeId = '';
            self.search.searchData.employee = '';
          }
          store.listRefresh('list');
        }, 50);
      }
    },
    created: function () {
      this.search.searchData.start = '';
      this.search.searchData.end = '';
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
