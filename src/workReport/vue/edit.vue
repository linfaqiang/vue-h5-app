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
      <a class="mui-btn mui-btn-link mui-pull-right" href="#saveEditSelect">保存</a>
    </header>
    <!--mui-content 必须放在 mui-footer 同级节点下面,否则会出现滚动区域无法完全显示的问题-->
    <div class="mui-content" style="padding-top: 44px;">
      <div class="mui-scroll-wrapper" style="background: #f1f1f1;top: 44px;">
        <div class="mui-scroll">
          <div style="height: 10px;"></div>
          <div id="theEdit" class="add_form">
            <ul>
              <li class="mui-icon mui-icon-workReport-type mui-not-must">
                <span>{{edit.editData.reportType=='0'?'日报':(edit.editData.reportType=='1'?'周报':'月报')}}</span>
              </li>
            </ul>
            <ul>
              <li class="mui-icon mui-icon-start mui-not-must" style="padding: 14px 15px 14px 0">
                <span>{{edit.editData.timeShow}}</span>
              </li>
            </ul>
            <ul>
              <li class="summary">
                <p class="mui-icon mui-icon-workReport-summary">
                  本{{edit.editData.reportType=='0'?'日':(edit.editData.reportType=='1'?'周':'月')}}工作总结</p>
                <textarea @input="equalScrollHeight()" v-model="edit.editData.summary"
                          @focus="inputFocus('summary')"></textarea>
              </li>
            </ul>
            <ul v-if="edit.editData.reportType!='0'">
              <li class="summary">
                <p class="mui-icon mui-icon-workReport-plan">下{{edit.editData.reportType=='1'?'周':'月'}}工作计划</p>
                <textarea @input="equalScrollHeight()" v-model="edit.editData.plan"
                          @focus="inputFocus('plan')"></textarea>
              </li>
            </ul>
          </div>
          <div class="add_employee_title">汇报对象</div>
          <div class="add_employee">
            <div class="list mui-scroll-wrapper mui-segmented-control" style="height: 58px;"
                 :style="{width: edit.editData.emp.length*48>offsetWidth?(offsetWidth+'px'):(edit.editData.emp.length*48 + 'px')}">
              <div class="mui-scroll" style="height: 58px;">
                <ul>
                  <li v-for="list in edit.editData.emp">
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
              <div class="mui-icon mui-icon-plusempty" @tap="editEmp()"></div>
            </div>
          </div>
          <div style="height: 10px;"></div>
        </div>
      </div>
    </div>
    <div id="saveEditSelect" class="mui-popover mui-popover-action mui-popover-bottom">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell">
          <a href="#saveEditSelect" @tap="saveEdit('0')">保存</a>
        </li>
        <li class="mui-table-view-cell">
          <a href="#saveEditSelect" @tap="saveEdit('1')">保存并提交</a>
        </li>
      </ul>
      <ul class="mui-table-view">
        <li class="mui-table-view-cell mui-cancel">
          <a href="#saveEditSelect"><b>取消</b></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import store from '../work-store';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {
      return {
        currentHeader: {
          title: '编辑工作报告'
        },
        edit: store.state,
        offsetWidth: document.body.offsetWidth - 80
      };
    },
    methods: {
      back: function (index) {
        if (window.initPage) {
          nativeApi.goNative();
        }
      },
      inputFocus: function (field) {
        var setVal = this.edit.editData;
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
      editEmp: function () {
        this.$router.go('/personPage/editEmp');
      },
      equalScrollHeight: function () {
        setTimeout(function () {
          var ele = document.getElementById('theEdit').getElementsByTagName('textarea');
          for (var i = 0; i < ele.length; i++) {
            if (ele[i]) {
              ele[i].setAttribute('style', 'height: ' + ele[i].scrollHeight + 'px;');
            }
          }
        }, 10);
      },
      saveEdit: function (status) {
        setTimeout(function () {
          store.saveEdit(status, function () {
            nativeApi.loading.hide();
            mui.alert('工作报告编辑成功', '提示', function () {
              history.go(-1);
              setTimeout(function () {
                var ele = document.getElementsByTagName('textarea');
                for (var i = 0; i < ele.length; i++) {
                  if (ele[i]) {
                    ele[i].style.height = 'auto';
                    ele[i].style.height = (ele[i].scrollHeight + 2) + 'px';
                  }
                }
              }, 10);
              setTimeout(function () {
                store.listRefresh('list');
              }, 50);
            });
          });
        }, 50);
      },
      deleteEmp: function (index) {
        this.edit.editData.emp.splice(index, 1);
        store.setWidth('editData', this.edit.editData.acceptors);
      }
    },
    ready: function () {
      mui('.mui-scroll-wrapper').scroll();
    }
  };
</script>
