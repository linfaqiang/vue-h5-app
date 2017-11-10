/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav" style="position: fixed;">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class="mui-btn mui-btn-link mui-pull-right" href="#saveAddSelect">保存</a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content" style="padding-top: 44px;">
      <div class="mui-scroll-wrapper" style="background: #f1f1f1;top: 44px;">
        <div class="mui-scroll">
          <div style="height: 10px;"></div>
          <div id="theAdd" class="add_form">
            <ul>
              <li class="mui-icon mui-icon-workReport-type mui-not-must arrows" @click="goTo('reportType', 0, '报告类型')">
                <span :class="{not: !add.addData.reportType}">{{add.addData.reportType||"报告类型"}}</span>
              </li>
            </ul>
            <ul>
              <li class="mui-icon mui-icon-start mui-not-must arrows" @tap="getDateTime('timeShow')">
                <span :class="{not: !add.addData.timeShow}">{{add.addData.timeShow||"报告区间"}}</span>
              </li>
            </ul>
            <ul>
              <li class="summary">
                <p class="mui-icon mui-icon-workReport-summary">
                  本{{add.addData.reportTypeId=='0'?'日':(add.addData.reportTypeId=='1'?'周':'月')}}工作总结</p>
                <textarea @input="equalScrollHeight()" v-model="add.addData.summary"
                          @focus="inputFocus('summary')"></textarea>
              </li>
            </ul>
            <ul v-if="add.addData.reportTypeId!='0'">
              <li class="summary">
                <p class="mui-icon mui-icon-workReport-plan">下{{add.addData.reportTypeId=='1'?'周':'月'}}工作计划</p>
                <textarea @input="equalScrollHeight()" v-model="add.addData.plan"
                          @focus="inputFocus('plan')"></textarea>
              </li>
            </ul>
          </div>
          <div class="add_employee_title">汇报对象</div>
          <div class="add_employee">
            <div class="list mui-scroll-wrapper mui-segmented-control" style="height: 58px;"
                 :style="add.addData.empCss">
              <div class="mui-scroll" style="height: 58px;">
                <ul>
                  <li v-for="list in add.addData.acceptors">
                    <img :src="list.headPhotoUrl||'../public/images/default_contact.png'"
                         onerror="this.src='../public/images/default_contact.png'" data-preview-src=""
                         data-preview-group="1">
                    <span v-text="list.name"></span>
                    <span class="delete mui-icon crm-close" @tap="deleteEmp($index)"></span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="add_emp_bu">
              <div class="mui-icon mui-icon-plusempty" @tap="addEmp()"></div>
            </div>
          </div>
          <div style="height: 10px;"></div>
        </div>
      </div>
    </div>
    <div id="saveAddSelect" class="mui-popover mui-popover-action mui-popover-bottom">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <a href="#saveAddSelect" @tap="saveAdd('0')">保存</a>
        </li>
        <li class="mui-table-view-cell">
          <a href="#saveAddSelect" @tap="saveAdd('1')">保存并提交</a>
        </li>
      </ul>
      <ul class="mui-table-view">
        <li class="mui-table-view-cell mui-cancel">
          <a href="#saveAddSelect"><b>取消</b></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang='less' rel='stylesheet.less'>
  @import '../../public/css/mui.image.css';
</style>
<script>
  import store from '../work-store';
  require('mui.poppicker');
  require('mui.previewimage');
  require('mui.zoom');
  var nativeApi = require('nativeApi');
  export default {
    data: function () {
      return {
        currentHeader: {
          title: '新建工作报告'
        },
        add: store.state
      };
    },
    methods: {
      back: function (index) {
        if (window.initPage) {
          nativeApi.goNative();
        }
      },
      inputFocus: function (field) {
        var setVal = this.add.addData;
        var self = this;
        nativeApi.showKeyboard({
          callback: function (result) {
            setVal[field] = result.result;
            if (field === 'plan' || field === 'summary') {
              self.equalScrollHeight();
            }
          }
        });
      },
      saveAdd: function (status) {
        setTimeout(function () {
          store.saveAdd(status, function () {
            nativeApi.loading.hide();
            mui.alert('工作报告新建成功', '提示', function () {
              if (window.initPage) {
                nativeApi.goNative();
              } else {
                history.go(-1);
              }
            });
          });
        }, 50);
      },
      equalScrollHeight: function () {
        setTimeout(function () {
          var ele = document.getElementById('theAdd').getElementsByTagName('textarea');
          for (var i = 0; i < ele.length; i++) {
            if (ele[i]) {
              ele[i].setAttribute('style', 'height: ' + ele[i].scrollHeight + 'px;');
            }
          }
        }, 10);
      },
      getDateTime: function (field) {
        var self = this;
        var param = {};
        var picker;
        var reportTypeId = parseInt(self.add.addData.reportTypeId || '0');
        if (reportTypeId === 1) {
          var userPicker = new mui.PopPicker();
          userPicker.setData(store.getWeekList());
          userPicker.show(function (items) {
            var arrItem = items[0].value.split('~');
            self.add.addData['startTime'] = arrItem[0];
            self.add.addData['timeShow'] = items[0].text;
            self.add.addData['endTime'] = arrItem[1];
            store.getSummaryTxt(arrItem[0], arrItem[1], '1');
          });
          return;
        }
        if (reportTypeId === 0) {
          param = {
            'type': 'date',
            'value': self.add.addData[field] || ''
          };
        } else if (reportTypeId === 2) {
          param = {
            'type': 'month',
            'value': self.add.addData[field] || ''
          };
        }
        picker = new mui.DtPicker(param);
        picker.show(function (rs) {
          self.add.addData['startTime'] = rs.text;
          self.add.addData['timeShow'] = rs.text;
          self.add.addData['endTime'] = rs.text;
          var start = rs.text;
          var end = rs.text;
          if (reportTypeId === 2) {
            var arr = start.split('-');
            start = rs.text + '-01';
            end = rs.text + '-' + new Date(parseInt(arr[0]), parseInt(arr[1]), 1).getDate();
          }
          store.getSummaryTxt(start, end, self.add.addData.reportTypeId);
          picker.dispose();
        });
      },
      goTo: function (fn, type, show) {
        var self = this;
        if (type === 0) {
          var selectId = self.add.addData[fn + 'Id'];
          store.selectFn(fn, selectId, show, 'add');
          self.$router.go('/selectPage/' + fn + '_add');
        }
      },
      addEmp: function () {
        this.$router.go('/personPage/addEmp');
      },
      getSelectEmp: function (lists) {
        store.addEmp(lists);
      },
      deleteEmp: function (index) {
        this.add.addData.acceptors.splice(index, 1);
        store.setWidth('addData', this.add.addData.acceptors);
      }
    },
    created: function () {
      var fromNative = this.$route.params.fromNative;
      if (fromNative) {
        window.initPage = 'toAdd';
      }
      if (window.initPage) {
        store.cleanAdd();
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
      mui.previewImage();
    }
  };
</script>
