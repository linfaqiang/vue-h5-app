/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed;">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="confirm()">确定</a>
    </header>
    <div class="mui-content" style="padding-top: 44px;">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="edit_page">
            <ul>
              <li>
                <a @tap="getDateTime('start')" class="mui-icon arrows">
                  <label>日期起</label>
                  <div>{{search.searchData.start}}</div>
                </a>
              </li>
              <li>
                <a @tap="getDateTime('end')" class="mui-icon arrows">
                  <label>止</label>
                  <div>{{search.searchData.end}}</div>
                </a>
              </li>
            </ul>
            <ul v-if="param.list.isViewMe!=0 && search.isLeader.flag">
              <li>
                <a class="mui-icon arrows" @tap="selectEmp()">
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
  import store from '../work-store';
  require('mui.picker.min');
  export default {
    data: function () {
      return {
        currentHeader: {
          title: '更多筛选'
        },
        search: store.state,
        param: store.param
      };
    },
    methods: {
      back: function (index) {
        history.go(-1);
      },
      switchFn: function () {
        var self = this;
        if (self.search.searchData.switch) {
          self.search.searchData.switch = false;
        } else {
          self.search.searchData.switch = true;
        }
      },
      getDateTime: function (field) {
        var self = this;
        var picker = new mui.DtPicker({'type': 'date', 'value': self.search.searchData[field]});
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
        this.search.searchData = {
          'switch': true,
          'start': '',
          'end': '',
          'employeeId': [],
          'employee': '',
          'typeId': '',
          'type': ''
        };
      },
      selectEmp: function () {
        var self = this;
        window['workSearchEmp'] = function (lists) {
          self.workSearchEmp(lists);
        };
        this.$router.go('/employee-select/workSearchEmp');
      },
      workSearchEmp: function (lists) {
        lists = lists || [];
        var html = '';
        var employeeId = [];
        for (var i = 0; i < lists.length; i++) {
          html += lists[i].name;
          employeeId.push(lists[i].id);
          if (i !== (lists.length - 1)) {
            html += ';';
          }
        }
        store.updateField('employee', html, 'search');
        store.updateField('employeeId', employeeId, 'search');
      },
      confirm: function () {
        /* 刷新列表*/
        store.search(function () {
          history.go(-1);
        });
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
