/**
* @file
* @author hj
* @date 2016-11-22
*/
<template>
  <div>
    <header id="header" class="mui-bar mui-bar-nav">
      <h1 class="mui-title">{{currentHeader.title}}</h1>
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <button class="mui-btn mui-btn-blue mui-btn-link mui-pull-right" @tap="saveEdit()">{{currentHeader.name}}</button>
    </header>
    <style>

    </style>
    <div class="mui-content clueDetailEdit">
      <div class="mui-input-group">
        <div class="">
          <!--<label style="white-space: nowrap">中国石油化工有限公司</label>-->
          <input type="text" class="mui-input-clear cust-need" v-model="editData.editData.needs" placeholder="需求描述"
                 @focus="inputBlock" @blur="noInputBlock">
          <span class="crm-close mui-icon" @click="clear" v-if="show && editData.editData.needs"> </span>
        </div>
      </div>
      <div class="mui-input-group">
        <div class="mui-input-row" style="margin-top: 9px;">
          <label>客户名称<sup class="tipsx">*</sup></label>
          <input @tap="goTo('customer', 0)" type="text" class="mui-input-clear" readonly placeholder="客户名称" v-model="editData.editData.customerName">
          <span class="mui-icon mui-icon-right"></span>
        </div>
        <div class="mui-input-row">
          <label>地址</label>
          <input @tap="showMap" type="text" readonly class="mui-input-clear" v-model="editData.editData.address.address">
          <span class="mui-icon mui-icon-right"></span>
        </div>
        <div class="mui-input-row">
          <label>联系人<sup class="tipsx">*</sup></label>
          <input type="text" class="mui-input-clear" v-model="editData.editData.linkman.name" @focus="inputBlock" @blur="noInputBlock">
          <span class="crm-close mui-icon" @click="clear3" v-if="show3 && editData.editData.linkman.name"> </span>
        </div>
        <div class="mui-input-row">
          <label>手机<sup class="tipsx"></sup></label>
          <input type="text" class="mui-input-clear" v-model="editData.editData.linkman.mobile" @focus="inputBlock" @blur="noInputBlock">
          <span class="crm-close mui-icon" @click="clear4" v-if="show4 && editData.editData.linkman.mobile"> </span>
        </div>
        <div class="mui-input-row">
          <label>座机<sup class="tipsx"></sup></label>
          <input type="text" class="mui-input-clear" v-model="editData.editData.linkman.telephone" @focus="inputBlock" @blur="noInputBlock">
          <span class="crm-close mui-icon" @click="clear5" v-if="show5 && editData.editData.linkman.telephone"> </span>
        </div>
      </div>
      <div class="mui-input-group">
        <div class="mui-input-row" style="margin-top: 10px;">
          <label>线索来源<sup class="tipsx">*</sup></label>
          <input @tap="goTo('source', 0)" type="text" class="mui-input-clear" readonly placeholder="线索来源" v-model="editData.editData.source">
          <span class="mui-icon mui-icon-right"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../clue-store';
  var nativeApi = require('nativeApi');
  export default {
    components: {},
    data: function () {
      return {
        show: false,
        show2: false,
        show3: false,
        show4: false,
        show5: false,
        currentHeader: {
          title: '编辑线索',
          name: '保存'
        },
        editData: store.state,
        onlyAdrMsg: {}
      };
    },
    methods: {
      saveEdit: function () {
        var self = this;
        var param = self.editData.editData;
        if (!param.needs) {
          mui.alert('请输入需求描述！', '提示');
          return;
        }
        if (!param.customerName) {
          mui.alert('请输入客户名称！', '提示');
          return;
        }
        if (!param.linkman.name) {
          mui.alert('请输入联系人！', '提示');
          return;
        }
        if (!(param.linkman.name || param.linkman.mobile)) {
          mui.alert('请输入联系人或电话！', '提示');
          return;
        }
        if (!param.source) {
          mui.alert('请选择线索来源！', '提示');
          return;
        }
        store.saveEdit(function () {
          mui.alert('线索编辑成功', '提示', function () {
            history.go(-1);
          });
        });
      },
      add: function () {
        var oUl = document.getElementById('addMore');
        this.show = !this.show;
        if (this.show === true) {
          oUl.style.height = this.editData.editData.length * 42 + 'px';
        }
      },
      showMap: function () {
        var self = this;
        var longitude = self.onlyAdrMsg.longitude;
        if (self.editData.editData.address.longitude) {
          longitude = self.editData.editData.address.longitude;
        }
        var latitude = self.onlyAdrMsg.latitude;
        if (self.editData.editData.address.latitude) {
          latitude = self.editData.editData.address.latitude;
        }
        nativeApi.correctLocation({
          'apiJson': {
            'longitude': longitude,
            'latitude': latitude,
            'title': '',
            'address': self.editData.editData.address.address || self.onlyAdrMsg.address,
            'showMap': false
          },
          callback: function (result) {
            /* 位置纠偏*/
            self.onlyAdrMsg = result;
            self.editData.editData.address.address = result.address;
            self.editData.editData.address.country = result.country;
            self.editData.editData.address.province = result.province;
            self.editData.editData.address.city = result.city;
            self.editData.editData.address.cityCode = result.cityCode;
            self.editData.editData.address.adname = result.adname;
            self.editData.editData.address.adcode = result.adcode;
            self.editData.editData.address.longitude = result.longitude;
            self.editData.editData.address.latitude = result.latitude;
          }
        });
      },
      goTo: function (fn, type) {
        // 选择线索来源
        var self = this;
        var selectId = self.editData.editData[fn + 'Id'];
        if (fn === 'customer') {
          store.state.selectId = selectId;
          self.$router.go('/customerPage/' + fn + '_edit');
          return;
        }
        store.selectFn(fn, selectId, '线索来源');
        self.$router.go('/selectPage/' + fn + '_edit');
      },
      clear: function () {
        this.editData.editData.needs = '';
        this.show = false;
      },
      clear2: function () {
        this.editData.editData.customerName = '';
        this.show2 = false;
      },
      clear3: function () {
        this.editData.editData.linkman.name = '';
        this.show3 = false;
      },
      clear4: function () {
        this.editData.editData.linkman.mobile = '';
        this.show4 = false;
      },
      clear5: function () {
        this.editData.editData.linkman.telephone = '';
        this.show5 = false;
      },
      inputBlock: function (index) {
        var judgment = index.srcElement.placeholder;
        if (judgment === '需求描述') {
          this.show = true;
        } else if (judgment === '客户名称') {
          this.show2 = true;
        } else if (judgment === '联系人') {
          this.show3 = true;
        } else if (judgment === '联系电话') {
          this.show4 = true;
        }
      },
      noInputBlock: function () {
        this.show = false;
        this.show2 = false;
        this.show3 = false;
        this.show4 = false;
      },
      getFirstAdr: function () {
        var self = this;
        nativeApi.getQDLocationInfo({
          callback: function (result) {
            self.onlyAdrMsg = result;
          }
        });
      }
    },
    route: {
      activate: function (transition) {
        transition.next();
        this.getFirstAdr();
      }
    },
    created: function () {
      // 运行 数据中转站的函数
    },
    ready: function () {
    }
  };
</script>
