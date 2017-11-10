/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @click="back"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @click="confirm()">确认</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="edit_page">
            <ul>
              <li>
                <a @click="getDateTime('fromDate')" class="mui-icon arrows">
                  <label>开始时间</label>
                  <div>{{selectDate.fromDate}}</div>
                </a>
              </li>
              <li>
                <a @click="getDateTime('toDate')" class="mui-icon arrows">
                  <label>结束时间</label>
                  <div>{{selectDate.toDate}}</div>
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
<script>
  import store from '../plan-store';
  import {FastClick} from 'fastclick';
  export default {
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '筛选'
        },
        selectDate: store.param.list
      };
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      restFn: function () {
        this.selectDate.fromDate = '';
        this.selectDate.toDate = '';
      },
      getDateTime: function (field) {
        var picker = new mui.DtPicker({'type': 'month'});
        picker.show(function (rs) {
          store.param.list[field] = rs.text;
          /* 验证 开始时间早于结束时间*/
          var start = store.param.list['fromDate'];
          var end = store.param.list['toDate'];
          start = start.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          end = end.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          if (parseInt(start) > parseInt(end)) {
            mui.alert('开始月份不能晚于结束月份', '提示', function () {
              store.param.list[field] = '';
            });
            return;
          }
          picker.dispose();
        });
      },
      confirm: function () {
        store.listRefresh('list');
        history.go(-1);
      }
    },
    ready: function () {
      FastClick.attach(document.body);
    }
  };
</script>
