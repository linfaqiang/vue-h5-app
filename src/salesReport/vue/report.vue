/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a @tap="backNative" class="mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">{{title}}</h1>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="main_con">
            <div class="section_1 bg_w">
              <h5 class="f_16 color_black">{{user.userName}}</h5>
              <p class="f_12">{{user.section}}</p>
              <a class="mui-icon right_time">{{user.time}}</a>
            </div>
            <ul class="section_2">
              <li>
                <span class="mui-icon icon-kehushu color_yellow"></span>
                <p class="f_12">新增客户数</p>
                <p class="p-bottom"><span>{{counts.customerCount}}</span>个</p>
              </li>
              <li>
                <span class="mui-icon icon-lianxiren color_blue"></span>
                <p class="f_12">新增联系人</p>
                <p class="p-bottom"><span>{{counts.customerLinkmanCount}}</span>个</p>
              </li>
              <li>
                <span class="mui-icon icon-shangji color_green"></span>
                <p class="f_12">新增商机数</p>
                <p class="p-bottom"><span>{{counts.chanceCount}}</span>个</p>
              </li>
              <li>
                <span class="mui-icon icon-xiansuo color_red"></span>
                <p class="f_12">新增线索数</p>
                <p class="p-bottom"><span>{{counts.clueCount}}</span>个</p>
              </li>
            </ul>
            <ul class="section_3">
              <li v-for="list in testList">
                <a @tap="tapLink(list.href)">{{list.name}}</a>
                <span class="mui-icon right_arrow"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/mui.picker.min.css';
</style>
<script>
  import store from '../report-store';
  var nativeApi = require('nativeApi');
  require('mui.picker.min');
  export default {
    data: function () {
      return {
        title: '营销报表',
        user: store.state.user,
        counts: store.state.counts,
        testList: [
          {
            name: '销售业绩分析',
            href: '/sales-outstandAnalysis'
          },
          {
            name: '业绩排行榜',
            href: '/sales-ranking'
          },
          {
            name: '重点客户分析',
            href: '/sales-customerAnalysis'
          },
          {
            name: '销售转化率',
            href: '/sales-translation'
          },
          {
            name: '新机会',
            href: '/sales-chanceTrend'
          },
          {
            name: '销售预测',
            href: '/sales-forecast'
          }
        ]
      };
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      backNative: function () {
        nativeApi.goNative();
      },
      tapLink: function (val) {
        // 销售转化率有开始时间和结束时间,区别开来
        var self = this;
        if (val === '/sales-translation') {
          store.initSelect(1);
          self.getDefaultStage(function () {
            self.$router.go(val);
          });
        } else {
          store.initSelect();
          self.$router.go(val);
        }
      },
      getDefaultStage: function (cb) {
        var self = this;
        nativeApi.initAjax({
          url: store.APIS.chanceType,
          type: 'get',
          param: '',
          callback: function (response) {
            if (response && response.code === 200) {
              store.state.selectDate.chanceTypeId = response.data[0].id;
              store.state.selectDate.chanceType = response.data[0].name;
            }
            if (typeof cb === 'function') {
              cb.call(self);
            }
          }
        });
      }
    },
    created: function () {
    },
    route: {
      data: function () {
        store.getUserMsg();
      }
    },
    ready: function () {
      store.init();
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
