/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back"></a>
      <h1 class="mui-title">{{currentHeader.title}}</h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveAdd()">保存</a>
    </header>
    <div class="mui-content">
      <div class="add_form" v-show="!add.addData.showBu">
        <ul>
          <li class="mui-icon mui-icon-start mui-must datetime">
            <a @tap="getDateTime('startDate')"
               :class="{not: !add.addData.startDate}">{{add.addData.startDate||'开始月份'}}</a>
            <a @tap="getDateTime('endDate')" :class="{not: !add.addData.endDate}"
               class="mui-icon mui-icon-end mui-must">{{add.addData.endDate||'结束月份'}}</a>
          </li>
          <li class="mui-icon mui-icon-money mui-must">
            <input type="tel" placeholder="销售目标金额，单位：万元" v-model="add.addData.targetAmount" @focus="inputBlock('show1')"
                   @input="change('targetAmount', 'show1')" @blur="noInputBlock('show1')">
            <em class="crm-close mui-icon" @tap="clear('targetAmount', 'show1')"
                v-if="show1 && add.addData.targetAmount"></em>
          </li>
          <li class="mui-icon mui-icon-money mui-not-must">
            <input type="tel" placeholder="（非必填）销售计划金额，单位：万元" v-model="add.addData.planAmount"
                   @focus="inputBlock(show2)"
                   @input="change('planAmount', 'show2')" @blur="noInputBlock('show2')">
            <em class="crm-close mui-icon" @tap="clear('planAmount', 'show2')"
                v-if="show2 && add.addData.planAmount"></em>
          </li>
          <li>
            <textarea placeholder="销售计划备注" v-model="add.addData.remark"></textarea>
          </li>
        </ul>
      </div>
      <div class="tab_distribution" v-show="add.isLeader.flag">
        <a>未分配<span class="mo" v-text="add.addData.unAssignAmount+'万元'"></span><span class="right"></span></a>
        <a>已分配<span class="mo" v-text="add.addData.assignAmount+'万元'"></span></a>
      </div>
      <div class="mui-scroll-wrapper" :style="disCss"
           v-show="add.addData.lists && add.addData.lists.length>0 && add.isLeader.flag">
        <div class="mui-scroll">
          <div class="edit_page">
            <ul>
              <li v-for="item in add.addData.lists">
                <a>
                  <label v-text="item.ownerDeptName||item.ownerStaffName"></label>
                  <div>
                    <span v-show="!add.addData.showBu" v-text="item.targetAmount + '万元'"></span>
                    <input v-show="add.addData.showBu" type="tel" v-model="item.targetAmount"
                           @input="updateDistributionFn(item.targetAmount)">
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <footer v-show="add.isLeader.flag" @tap="distributionFn()" class="rest_bn"
              v-text="add.addData.showBu?'确认分配':'分配销售配额'"></footer>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/mui.picker.min.css';
</style>
<script>
  import store from '../plan-store';
  import {FastClick} from 'fastclick';
  require('mui.picker.min');
  export default {
    components: {},
    data: function () {
      return {
        currentHeader: {
          title: '新建销售计划'
        },
        add: store.state,
        disCss: {
          'background': '#f1f1f1',
          'top': (220 + 44 + 5 + 44 + 5) + 'px',
          'bottom': '44px'
        },
        show1: false,
        show2: false
      };
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      getDateTime: function (field) {
        var self = this;
        var picker = new mui.DtPicker({
          type: 'month',
          'value': self.add.addData[field] || ''
        });
        picker.show(function (rs) {
          store.state.addData[field] = rs.text;
          /* 验证 开始时间早于结束时间*/
          var start = self.add.addData['startDate'] || '';
          var end = self.add.addData['endDate'] || '';
          start = start.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          end = end.replace(/-/g, '').replace(/\s/g, '').replace(/:/g, '');
          if (parseInt(start) > parseInt(end)) {
            mui.alert('开始月份不能晚于结束月份', '提示', function () {
              self.add.addData[field] = '';
            });
            return;
          }
          picker.dispose();
        });
      },
      saveAdd: function () {
        var self = this;
        var start = self.add.addData.startDate;
        var end = self.add.addData.endDate;
        var pattern = '^[0-9]*$';
        var planAmount = self.add.addData.planAmount;
        if (!start) {
          mui.alert('请选择开始月份！', '提示');
          return;
        }
        if (!end) {
          mui.alert('请选择结束月份！', '提示');
          return;
        }
        if (!self.add.addData.targetAmount) {
          mui.alert('请填写销售目标金额！', '提示');
          return;
        }
        if (!new RegExp(pattern).test(self.add.addData.targetAmount)) {
          mui.alert('销售目标金额不合法，限制数字！', '提示');
          return;
        }
        if (planAmount && !new RegExp(pattern).test(planAmount)) {
          mui.alert('销售计划金额不合法，限制数字！', '提示');
          return;
        }
        if (parseInt(self.add.addData.targetAmount) < parseInt(self.add.addData.assignAmount)) {
          mui.alert('您的分配金额大于目标金额，请重新分配！', '提示');
          return;
        }
        store.saveAdd(function () {
          mui.alert('计划保存成功！', '提示', function () {
            history.go(-1);
            store.listRefresh('list');
          });
        });
      },
      distributionFn: function () {
        var self = this;
        var showBu = self.add.addData.showBu;
        var start = self.add.addData.startDate;
        var end = self.add.addData.endDate;
        if (showBu) {
          self.add.addData.showBu = false;
          self.disCss.top = (220 + 44 + 5 + 44 + 5) + 'px';
        } else {
          if (!start) {
            mui.alert('请选择开始月份！', '提示');
            return;
          }
          if (!end) {
            mui.alert('请选择结束月份！', '提示');
            return;
          }
          if (!self.add.addData.targetAmount) {
            mui.alert('请填写销售目标金额！', '提示');
            return;
          }
          store.renderDepth('addData', function () {
            self.add.addData.showBu = true;
            self.disCss.top = (44 + 5 + 44 + 5) + 'px';
          });
        }
      },
      updateDistributionFn: function (num) {
        var self = this;
        var assignAmount = 0;
        var lists = self.add.addData.lists;
        var pattern = '^[0-9]*$';
        if (!new RegExp(pattern).test(num)) {
          mui.alert('您输入的金额不合法，限制数字！', '提示');
          return;
        }
        for (var i = 0; i < lists.length; i++) {
          var targetAmount = parseInt(lists[i].targetAmount || '0');
          assignAmount += targetAmount;
        }
        self.add.addData.assignAmount = assignAmount;
        self.add.addData.unAssignAmount = parseInt(self.add.addData.targetAmount || '0') - parseInt(assignAmount || '0');
      },
      inputBlock: function (key) {
        this[key] = true;
      },
      noInputBlock: function (key) {
        var self = this;
        setTimeout(function () {
          self[key] = false;
        }, 10);
      },
      change: function (field, key) {
        var self = this;
        if (self.add.addData[field]) {
          self[key] = true;
        } else {
          self[key] = false;
        }
        if (field === 'targetAmount') {
          if (self.add.addData.targetAmount) {
            self.add.addData.unAssignAmount = parseInt(self.add.addData.targetAmount || '0') - parseInt(self.add.addData.assignAmount || '0');
          } else {
            self.add.addData.unAssignAmount = 0;
          }
        }
      },
      clear: function (field, key) {
        var self = this;
        self.add.addData[field] = '';
        self[key] = false;
      }
    },
    created: function () {
    },
    ready: function () {
      FastClick.attach(document.body);
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
