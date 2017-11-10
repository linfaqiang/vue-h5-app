<template>
  <nav class="mui-bar mui-bar-tab">
    <a v-for="list in testList" class="mui-tab-item mui-active" @tap="tapLink($index)">
      <span class="mui-icon" id="icons" :class="list.icon"></span>
      <span class="mui-tab-label" v-text="list.text"></span>
    </a>
  </nav>
</template>
<style>
  .mui-bar-tab .mui-tab-item.mui-active {
    color: #999;
  }

  .mui-bar-tab {
    background: #fff;
  }

  .mui-tab-label {
    font-size: 11px;
    color: #717882;
  }

  .mui-icon-photograph:before,
  .mui-icon-voice:before,
  .mui-icon-cust:before,
  .mui-icon-name:before,
  .mui-icon-chance:before,
  .mui-icon-address-api:before {
    font-size: 16px;
    color: #717882;
  }

  .mui-icon-photograph,
  .mui-icon-voice,
  .mui-icon-cust,
  .mui-icon-name,
  .mui-icon-chance,
  .mui-icon-address-api {
    margin-top: 5px;
  }

  #icons {
    height: 18px !important;
  }
</style>
<script>
  import {APIS} from '../../js/config';
  var nativeApi = require('nativeApi');
  export default {
    data: function () {
      return {
        testList: []
      };
    },
    methods: {
      tapLink: function (index) {
        var funList = {
          goPhoto: function (self) {
            nativeApi.goPhoto({
              'apiJson': {
                'backType': '2',
                'wDivisor': '1024',
                'hDivisor': '780',
                'uploadUrl': APIS.upload_file
              },
              callback: function (result) {
                self.$dispatch('photoResult', result);
              }
            });
          },
          goRecord: function (self) {
            nativeApi.goRecord({
              'apiJson': {
                'uploadUrl': APIS.upload_file
              },
              callback: function (result) {
                self.$dispatch('recordResult', result);
              }
            });
          },
          getCust: function (self) {
            self.$dispatch('custResult', {'field': 'customer', 'title': '客户名称'});
          },
          getName: function (self) {
            self.$dispatch('nameResult', {'field': 'contact', 'title': '联系人'});
          },
          getChance: function (self) {
            self.$dispatch('chanceResult', {'field': 'chance', 'title': '商机'});
          },
          getAddress: function (self) {
            nativeApi.getQDLocationInfo({
              callback: function (result) {
                self.$dispatch('addressResult', result);
              }
            });
          }
        };
        funList[this.testList[index].fn](this);
      }
    },
    ready: function () {
      if (nativeApi.edition !== 1) {
        this.testList = [
          {icon: 'mui-icon-photograph', text: '拍照', fn: 'goPhoto'},
          {icon: 'mui-icon-voice', text: '语音', fn: 'goRecord'},
          {icon: 'mui-icon-cust', text: '客户', fn: 'getCust'},
          {icon: 'mui-icon-name', text: '联系人', fn: 'getName'},
          {icon: 'mui-icon-chance', text: '商机', fn: 'getChance'},
          {icon: 'mui-icon-address-api', text: '地址', fn: 'getAddress'}
        ];
      } else {
        this.testList = [
          {icon: 'mui-icon-photograph', text: '拍照', fn: 'goPhoto'},
          {icon: 'mui-icon-voice', text: '语音', fn: 'goRecord'},
          {icon: 'mui-icon-cust', text: '客户', fn: 'getCust'},
          {icon: 'mui-icon-name', text: '联系人', fn: 'getName'},
          {icon: 'mui-icon-address-api', text: '地址', fn: 'getAddress'}
        ];
      }
    }
  };
</script>
