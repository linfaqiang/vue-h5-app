/**
* @file
* @author hj
* @date 2016-11-24
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav newCustomer">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @tap="back()"></a>
      <h1 class="mui-title" v-text="currentHeader.title"></h1>
      <a class=" mui-icon crm-scan crm-icon " @tap="scanCard"></a>
      <!--<a class="mui-btn mui-btn-blue mui-btn-link mui-pull-right icon-text" v-text="currentHeader.name" @tap="saveAdd"> </a>-->
      <a class="mui-btn mui-btn-blue mui-btn-link mui-pull-right icon-text" v-text="currentHeader.name"
         href="#newNotes"> </a>
    </header>
    <style>
      .crm-listIcon a {
        margin: -11px -25px !important;
      }

      .crm-listIcon span {
        margin-left: 6px;
      }
    </style>
    <div id="af_action_mask"></div>
    <div id="afui"></div>
    <div class="mui-content addClue">
      <ul style="padding:0px; background:#fff;">
        <li class="mui-table-view-cell crm-listIcon">
          <a>
            <span class="mui-icon mui-icon-cName redColor"> </span>
            <input type="text" placeholder="报价名称（必填)" v-model="add.addData.quotationName">
          </a>
        </li>
        <li class="mui-table-view-cell crm-listIcon">
          <a>
            <span class="mui-icon mui-icon-nd garyColor"> </span>
            <input type="text" placeholder="状态" value="拟定" readonly>
          </a>
        </li>
        <li class="mui-table-view-cell crm-listIcon">
          <a :class="{'mui-navigate-right': !add.addData.formOther}" @tap="goTo('chance', 0)">
            <span class="mui-icon mui-icon-salechance redColor"> </span>
            <div :class="{'not':!add.addData.chance}">{{add.addData.chance || "商机"}}</div>
          </a>
        </li>
        <li class="mui-table-view-cell crm-listIcon">
          <a>
            <span class="mui-icon redColor"> </span>
            <input type="text" placeholder="客户名称(选择完销售机会，自动带出)" readonly value="{{add.addData.customer}}">
          </a>
        </li>
        <li class="mui-table-view-cell crm-listIcon salePrice-last-li">
          <a class="mui-navigate-right" @tap="getDateTime('start')">
            <span class="mui-icon mui-icon-start garyColor" :class="{'not':!add.addData.overdueDate}"> </span>
            <div>{{add.addData.overdueDate||'过期日'}}</div>
          </a>
        </li>
      </ul>
      <ul style="padding:0px; background:#fff;border-bottom: 1px solid #cbcbcb">
        <li class="mui-table-view-cell crm-listIcon salePrice-first-li">
          <a class="" @tap="goToAddProdcut()">
            <span class="mui-icon mui-icon-addbjh redColor"> </span>
            <div class="addpriceline">添加产品行报价</div>
          </a>
        </li>
      </ul>
      <div style="position: relative;height: 400px;margin-top: -17px">
        <div id="scroll1" class="mui-scroll-wrapper">
          <div class="mui-scroll" style="padding-bottom: 170px">
            <product-list-components :lists.sync="priceDetail.selectProducts"></product-list-components>
          </div>
        </div>
      </div>
      <div id="newNotes" class="mui-popover mui-popover-action mui-popover-bottom">
        <ul class="mui-table-view">
          <li class="mui-table-view-cell">
            <a href="#newNotes" @tap="saveAdd(0)">保存</a>
          </li>
          <li class="mui-table-view-cell">
            <a href="#newNotes" @tap="saveAdd(1)">保存并提交</a>
          </li>
        </ul>
        <ul class="mui-table-view">
          <li class="mui-table-view-cell mui-cancel">
            <a href="#newNotes"><b>取消</b></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../price-store';
  import productList from '../../public/components/product/list.vue';
  var nativeApi = require('nativeApi');
  export default {
    components: {
      'product-list-components': productList
    },
    data: function () {
      return {
        add: store.state,
        searchData: store.state.searchData,
        show: false,
        currentHeader: {
          title: '新建报价',
          name: '保存',
          title2: '商机'
        },
        testList: [{
          isB: true,
          icon: 'mui-icon-contact',
          name: '需求描述(必填)',
          value: ''
        }, {
          isB: true,
          name: '备注(非必填)',
          value: ''
        }],
        testList1: [
          {
            isB: true,
            icon: 'mui-icon-cName',
            name: '客户名称',
            value: ''
          }, {
            isB: true,
            icon: 'mui-icon-name',
            name: '联系人',
            value: ''
          }, {
            isB: true,
            icon: 'crm-phone',
            name: '联系电话',
            value: ''
          }, {
            isB: true,
            icon: 'crm-addr',
            href: ' ',
            name: '地址',
            value: ''
          }],
        testList2: [{
          isB: true,
          icon: 'mui-icon-cluesource',
          name: '线索来源',
          value: '',
          href: ' '
        }],
        priceDetail: store.state
      };
    },
    methods: {
      back: function () {
        if (window.initPage) {
          nativeApi.goNative({
            'apiJson': {
              'fn': 'salesPrice'
            }
          });
        }
      },
      saveAdd: function (flag) {
        var self = this;
        if (!self.add.addData.quotationName) {
          mui.alert('请输入报价名称');
          return;
        }
        if (!self.add.addData.chanceId) {
          mui.alert('请选择商机');
          return;
        }
        if (self.add.addData.productList.length === 0) {
          mui.alert('请选择报价行');
          return;
        }
        if (flag === 1) {
          // 保存并提交
          store.state.addData.status = 1;
        } else {
          store.state.addData.status = 0;
        }
        store.saveAdd(function (msg) {
          mui.alert(msg || '新建报价成功', '提示', function () {
            if (window.initPage) {
              nativeApi.goNative({
                'apiJson': {
                  'fn': 'salesPrice',
                  'callFun': 'refreshSalesPrice'
                }
              });
            } else {
              store.listRefresh('list');
              history.go(-1);
            }
          });
        });
      },
      add: function () {
        var oUl = document.getElementById('addMore');
        this.show = !this.show;
        if (this.show === true) {
          oUl.style.height = this.testList.length * 42 + 'px';
        }
      },
      scanCard: function () {
        // 扫描名片
        var self = this;
        nativeApi.bcardScan({
          'apiJson': {
            'bcardType': 'capture' // fromLibrary－相册选择
          },
          callback: function (result) {
            self.dataList.textareaVal = '名片扫描：' + JSON.stringify(result);
          }
        });
      },
      goTo: function (fn, type) { // fn chance , type 0
        var self = this;
        if (type === 1) {
          /* 拍照、录音*/
          nativeApi[fn]({
            'apiJson': {
              'backType': '2',
              'wDivisor': '1024',
              'hDivisor': '780'
            },
            callback: function (result) {
              self.editData.actData.appendixs.push({
                'type': result.imgPath ? 'image' : 'sound',
                'path': result.imgPath || result.recordPath
              });
            }
          });
        } else if (type === 0) {
          /* 客户、机会选择*/
          var selectId = self.add.addData[fn + 'Id'];
          if (fn === 'chance' && self.add.addData.formOther) {
            return;
          }
          if (typeof store[fn] === 'function') {
            store.state.selectId = selectId;
            self.$router.go('/' + fn + 'Page/' + fn + '_add');
            return;
          }
          store.selectFn(fn, selectId, self.currentHeader.title2, 1);
          self.$router.go('/selectPage/' + fn + '_add');
        } else {
          /* 当前位置*/
          nativeApi[fn]({
            callback: function (result) {
              self.add.addData.address = result.result;
            }
          });
        }
      },
      goToAddProdcut: function () {
        var addArr = store.state.selectProducts;
        if (addArr.length > 0) {
          for (var i = 0; i < addArr.length; i++) {
            store.state.selectProductId.push(addArr[i].id);
          }
        } else {
          store.state.selectProductId = [];
        }
        this.$router.go('/addProduct/product_add');
      },
      getDateTime: function (field) {
        var myDate = new Date();
        var picker = new mui.DtPicker({'type': 'date', 'value': this.add.addData.overdueDate});
        var self = this;
        picker.show(function (rs) {
          /* 验证 过期日期不能小于当前日期*/
          self.add.addData.overdueDate = rs.text;
          var start = new Date(self.add.addData.overdueDate).getTime();
          var end = new Date(myDate.getTime()).getTime(); // 当前时间
          if (start < end) {
            mui.alert('过期日期需要晚于当前日期', '提示', function () {
              store.state.addData.overdueDate = store.getAfterDate(30);
            });
            return;
          }
          picker.dispose();
        });
      }
    },
    events: {
      deleteSaveProduct: function (id) {
        // 删除产品  不做数据库物理删除
        var self = this;
        var proList = self.priceDetail.selectProducts;
        var selectIds = store.state.selectProductId;
        var index = selectIds.indexOf(id);
        selectIds.splice(index, 1);
        store.state.selectProductId = selectIds;
        for (var i = 0; i < proList.length; i++) {
          if (proList[i].id === id) {
            proList.splice(i, 1);
          }
        }
        self.priceDetail.selectProducts = proList;
      }
    },
    created: function () {
      var localKey = this.$route.params.localKey;
      if (localKey) {
        window.initPage = 'toAdd';
        window.initParam = JSON.parse(localStorage.getItem(localKey) || '{}');
        localStorage.removeItem(localKey);
      }
      store.product();
      if (window.initPage === 'toAdd') {
        store.state.addData.customerId = window.initParam.customerId;
        store.state.addData.chanceId = window.initParam.chanceId;
        store.state.addData.customer = window.initParam.customerName;
        store.state.addData.chance = window.initParam.chanceName;
        if (window.initParam.chanceId) {
          store.state.addData.formOther = true;
        }
        store.state.addData.overdueDate = store.getAfterDate(30);
      }
    },
    ready: function () {
      store.state.selectProductId = [];
      mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005
      });
    }
  };
</script>
