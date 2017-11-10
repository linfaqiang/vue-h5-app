/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right icon-text" @tap="confirm()">确定</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="edit_page">
            <ul>
              <li>
                <a @tap="getDateTime('start')" class="mui-icon arrows">
                  <label>创建日期起</label>
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
                <a class="mui-icon arrows" @click="goTo('customer','客户')">
                  <label>客户</label>
                  <div>{{search.searchData.customer}}</div>
                </a>
              </li>
              <li>
                <a class="mui-icon arrows" @click="goTo('chance','商机')">
                  <label>商机</label>
                  <div>{{search.searchData.chance}}</div>
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
  import store from '../price-store';
  import {FastClick} from 'fastclick';
  require('mui.picker.min');
  export default {
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
        var picker = new mui.DtPicker({'type': 'date'});
        var self = this;
        picker.show(function (rs) {
          self.search.searchData[field] = rs.text;
          /* 验证 开始时间早于结束时间*/
          var start = self.search.searchData['start'];
          var end = self.search.searchData['end'];
          store.param.list.startCreatedOn = start;
          store.param.list.endCreatedOn = end;
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
        var self = this;
        self.search.searchData = {
          'switch': true,
          'start': '',
          'end': '',
          'customerId': '',
          'customer': '',
          'chanceId': '',
          'chance': '',
          'status': ''
        };
        store.param.list.customerId = '';
        store.param.list.chanceId = '';
        store.param.list.startCreatedOn = '';
        store.param.list.endCreatedOn = '';
      },
      goTo: function (fn, title) {
        var self = this;
        var selectId = self.search.searchData[fn + 'Id'];
        /* 客户、联系人、机会选择*/
        if (typeof store[fn] === 'function') {
          store.state.selectId = selectId;
          self.$router.go('/' + fn + 'Page/' + fn + '_search');
          return;
        }
        store.selectFn(fn, selectId, title, 2);
        this.$router.go('/selectPage/' + fn + '_search' + '/1');
      },
      confirm: function () {
        /* 刷新列表*/
        store.param.list.customerId = this.search.searchData.customerId;
        store.param.list.chanceId = this.search.searchData.chanceId;
        history.go(-1);
        setTimeout(function () {
          store.init();
        }, 50);
      }
    },
    ready: function () {
      FastClick.attach(document.body);
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
