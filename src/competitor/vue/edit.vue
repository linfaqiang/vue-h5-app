/**
* @file
* @author hj
* @date 2016-11-23
*/
<template>
  <div>
    <!--竞争对手详情-->
    <header id="header" class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @tap="back"></a>
      <h1 class="mui-title">{{title}}</h1>
      <a class="mui-btn mui-btn-link mui-pull-right" @tap="saveCompetitor()">保存</a>
    </header>
    <div class="mui-content">
      <div class="mui-scroll-wrapper" style="top: 44px;background: #f1f1f1;">
        <div class="mui-scroll">
          <div class="the_add">
            <ul class="mui-table-view">
              <crm-list-single :list="list" v-for=" list in testList.fieldThree"></crm-list-single>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../competitor-store';
  var nativeApi = require('nativeApi');
  import crmListSingle from '../../public/components/listsingle/crm-listsingle.vue';
  export default {
    components: {
      'crm-list-single': crmListSingle
    },
    data: function () { // 组件的数据格式
      return {
        title: '编辑竞争对手',
        testList: {
          fieldThree: store.state.fieldThree
        },
        switch: false,
        adrMsg: store.state
      };
    },
    methods: {
      back: function () {
        history.go(-1);
      },
      switchFn: function () {
        if (this.switch) {
          this.switch = false;
        } else {
          this.switch = true;
        }
      },
      saveCompetitor: function () {
        var self = this;
        var id = this.$route.params.id;
        nativeApi.initAjax({
          type: 'put',
          url: store.APIS.competitors_detail + id,
          param: {
            'competitorName': self.testList.fieldThree[0].value,
            'competitorPhone': self.testList.fieldThree[2].value,
            'address': self.adrMsg.editAdrMsg
          },
          callback: function (result) {
            if (result && result.code === 200) {
              mui.alert('修改成功!', '提示', function () {
                history.go(-1);
                setTimeout(function () {
                  store.renderDetail(id);
                }, 50);
              });
            } else {
              mui.alert('修改失败!', '提示');
            }
          }
        });
      }
    },
    events: {
      'getAdrMsg': function () {
        var self = this;
        var adrMsg = self.adrMsg.editAdrMsg;
        nativeApi.correctLocation({
          'apiJson': {
            'showMap': false,
            'address': adrMsg.address,
            'province': adrMsg.province,
            'city': adrMsg.city,
            'district': adrMsg.district,
            'adcode': adrMsg.adcode,
            'cityCode': adrMsg.cityCode,
            'longitude': adrMsg.longitude,
            'latitude': adrMsg.latitude
          },
          callback: function (result) {
            /* 位置纠偏*/
            result.id = adrMsg.id;
            store.state.editAdrMsg = result;
            self.testList.fieldThree[1].value = result.address;
          }
        });
      }
    },
    ready: function () {
    }
  };
</script>
